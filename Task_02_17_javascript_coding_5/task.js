/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed, begin, days) {
  var returnData = {};
  var dat = new Date(begin);
  var datStr = ''
  for (var i = 1; i <= days; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}
// 数据
var _begin = "2014-06-01";
var _numberOfSample = 366;
var aqiSourceData = {
  "begin": _begin,
  "numberOfSample": _numberOfSample,
  "aqiData":{ "北京": randomBuildData(500, _begin ,_numberOfSample),
              "上海": randomBuildData(250, _begin ,_numberOfSample),
              "广州": randomBuildData(400, _begin ,_numberOfSample),
              "深圳": randomBuildData(200, _begin ,_numberOfSample),
              "成都": randomBuildData(300, _begin ,_numberOfSample),
              "西安": randomBuildData(500, _begin ,_numberOfSample),
              "福州": randomBuildData(100, _begin ,_numberOfSample),
              "厦门": randomBuildData(150, _begin ,_numberOfSample),
              "沈阳": randomBuildData(500, _begin ,_numberOfSample),
              "济南": randomBuildData(350, _begin ,_numberOfSample), },
  "citys": ["北京","上海","广州","深圳","成都","西安","福州","厦门","沈阳","济南"]
};
// 用于渲染图表的数据
var chartData = {};
var colorPallette = [ "#090", "#0c0", "#0f0", "#3c0", "#6c0", "#9c0", "#cc0",
                      "#fc0", "#fc3", "#ff3", "#fc6", "#fc9", "#fcc", "#fcf",
                      "#f9f", "#f6f", "#f3f", "#f0f", "#f0c", "#f09", "#f06", 
                      "#f03", "#f00", "#c00", "#900", "#600", "#300", "#000"
                       ];
// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
};
// 页面DOM
var graTimeField;
var radioSpanNodes;
var citySelector;
var chartDiv;
var chartTitle;
/**
 * 渲染图表
 */
function renderChart() {
  var city = pageState.nowSelectCity;
  var graTime = pageState.nowGraTime;
  chartDiv = chartDiv || document.getElementById("aqi-chart");
  chartTitle = chartTitle || document.getElementById("aqi-chart-title");
  var str = "";
  var data = chartData[graTime][city];
  console.log(graTime + " " + city);
  var flag = "";
  switch (graTime){
    case "day":
      flag = "日均";
      break;
    case "week":
      flag = "周平均";
      break;
    case "month":
      flag = "月平均";
      break;
  }
  //var len = data.length;
  var i = 0;
  var width = getWidth(graTime);
  var title = ( city + "市" + flag + "空气质量水平: " +
        chartData["begin"] + "-" + chartData["end"] );
  chartTitle.innerHTML = title;
  for(var k in data){
    i++;
    str += ("<div class=\"aqi-bar " + graTime + "\" " +
              "style=\"height:" + data[k]*0.7+ "px;" +
              " left:" + width*(i*1.6 -1.5) + "px;" + 
              " background-color:"+ getBarColor(data[k]) +";\"" +
              " title=\"" + k + " " + flag + "空气质量指数：" + data[k] + "\">" +
            "</div>" + 
            "<div class=\"aqi-hint\" " + 
              "style=\"left:" + (width*(i*1.6 - 1) - 60 ) + "px;" + 
              " bottom:" + (data[k]*0.7+5)+ "px;" + "\">" +
              (k + "<br/>" +"aqi：" + Math.floor(data[k]) ) +
            "</div>"
      );
  }
  //console.log(str);
  chartDiv.innerHTML = str;

}

/* 清理 span */
function cleanSpan(){
  radioSpanNodes = radioSpanNodes ||
                     document.querySelectorAll("#form-gra-time span");
  for (var i = radioSpanNodes.length - 1; i >= 0; i--) {
    radioSpanNodes[i].className = "";
  };
}

function addEventHandler(element, ev, handler){
  if(element.addEventListener){
    element.addEventListener(ev,handler,false);
  }else if(element.attachEvent){
    element.attachEvent("on" + ev, handler);
  }else{
    element["on" + ev] = handler;
  }
}

function delegateGraTimeEvent(ev){
  var target = ev.target;
  if( target && (target.tagName == "INPUT")){
    graTimeChange(target);
  }
}
function delegateCitySelectEvent(ev){
  var target = ev.target;
  if( target && (target.tagName == "SELECT")){
    graTimeChange(target);
  }
}
/** 
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(target) {
  // 确定是否选项发生了变化 
  if( pageState.nowGraTime != target.value ){
    // 设置对应数据
    pageState.nowGraTime = target.value;
    // span 状态改为 “选中”
    // 设置 对应页面数据
    cleanSpan();
    target.parentNode.firstChild.className="selected";
    // 调用图表渲染函数
    renderChart();
  }
  
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  if(pageState.nowSelectCity != citySelector.value){
    // 设置对应数据
    pageState.nowSelectCity =  citySelector.value;
    // 调用图表渲染函数
    renderChart();
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  graTimeField = graTimeField || document.getElementById("form-gra-time");
  radioSpanNodes = radioSpanNodes || document.querySelectorAll("#form-gra-time span");
  radioSpanNodes[0].className = "selected";
  addEventHandler(graTimeField, "click", delegateGraTimeEvent);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var str = "";
  for(var city in aqiSourceData["aqiData"]){
    str += "<option>" + city + "</option>";
  }
  citySelector = citySelector || document.getElementById("city-select");
  citySelector.innerHTML = str;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEventHandler(citySelector, "change", citySelectChange);
  // 
  pageState.nowSelectCity = aqiSourceData["citys"][0];
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var beginDate = new Date(aqiSourceData["begin"]); 
  var endDate = new Date(beginDate.getTime() + 60*60*1000*24*(aqiSourceData["numberOfSample"]-1) );
  console.log("[" + getDateYYMMDD(beginDate) +" - " + getDateYYMMDD(endDate) +"]" ); 
  chartData["day"] = {};
  chartData["week"] = {};
  chartData["month"] = {};
  chartData["begin"] = getDateYYMMDD(beginDate);
  chartData["end"] = getDateYYMMDD( endDate );
  for(var key in aqiSourceData["aqiData"]){
    // chartData[day]
    chartData["day"][key] = getDayData(aqiSourceData["aqiData"][key]);
    // chartData[week]
    chartData["week"][key] = getWeekData(aqiSourceData["aqiData"][key]);
    // chartData[month]
    chartData["month"][key] = getMonthData(aqiSourceData["aqiData"][key]);
  }
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
  renderChart();
}


window.onload = function(){
  init();
};

//根据日期生成需要的字符串
function getDateYYMM(dat){
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  return y + "年" + m + "月";
}
function getDateYYWW(dat){
  var y = dat.getFullYear();
  var date2 = new Date(y, 0, 1),
  d = Math.round((dat.valueOf() - date2.valueOf()) / 86400000);
  w = Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
  w = w <10 ? '0' + w: w;
  return y + "年" + w + "周";
}
function getDateYYMMDD(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    var d = dat.getDate();
    return y + "年" + m + "月" + d + "日";
}

/**
 * function: getDayData
 * arg:     {day:aqi, day:aqi, ... }
 * return : {day:aqi, day:aqi,, ... }
 */
function getDayData(arg){
  var res = {};
  for(var d in arg){
    var week_str = getDateYYMMDD(new Date(d));
    res[week_str] = (arg[d]);
  }
  return res;
}

/**
 * function: getWeekData
 * arg:     {day:aqi, day:aqi, ... }
 * return : {week:avg_aqi, week:avg_aqi, ... }
 */
function getWeekData(arg){
  // tmp_res = {week:[aqi,aqi,...], week:[aqi,aqi,...], ...}
  var tmp_res = {};
  var res = {};
  for(var d in arg){
    var week_str = getDateYYWW(new Date(d));
    if( week_str in tmp_res ){
      tmp_res[week_str].push(arg[d]);
    }else{
      tmp_res[week_str] = [];
      tmp_res[week_str].push(arg[d]);
    }
  }
  for(var w in tmp_res){
    var sum = 0;
    for (var i = tmp_res[w].length - 1; i >= 0; i--) {
      sum += tmp_res[w][i];
    }
    res[w] = sum / tmp_res[w].length;
  }
  //console.log(tmp_res);
  return res;
}

/**
 * function: getWeekData
 * arg:     {day:aqi, day:aqi, ... }
 * return : {month:avg_aqi, month:avg_aqi, ... }
 */
function getMonthData(arg){
  // tmp_res = {month:[aqi,aqi,...], month:[aqi,aqi,...], ...}
  var tmp_res = {};
  var res = {};
  for(var d in arg){
    var month_str = getDateYYMM(new Date(d));
    if( month_str in tmp_res ){
      tmp_res[month_str].push(arg[d]);
    }else{
      tmp_res[month_str] = [];
      tmp_res[month_str].push(arg[d]);
    }
  }
  for(var w in tmp_res){
    var sum = 0;
    for (var i = tmp_res[w].length - 1; i >= 0; i--) {
      sum += tmp_res[w][i];
    }
    res[w] = sum / tmp_res[w].length;
  }
  //console.log(tmp_res);
  return res;
}

/**
 *
 *
 */
function getWidth( graTime ){
  switch (graTime){
    case "day":
      return 6;
    case "week":
      return 30;
    case "month":
      return 60;
  }
  return 5;
}
function getBarColor(aqi){
  if (aqi >= 400)
    return "#000";
  if (aqi < 10){
    return "#0c0";
  }
  var i = Math.floor( Math.log(1+((aqi-10)/390.0)) * colorPallette.length);
  return colorPallette[i];
}

/// test, get all Property Name
function testAllProperty (obj) {
  var getAllPropertyNames = function (_obj) {
    var props = [];
    do {
      props = props.concat(Object.getOwnPropertyNames(_obj));
    } while (_obj = Object.getPrototypeOf(_obj));
    return props;
  }
  var propertys = getAllPropertyNames(obj);
  console.log(propertys.length);          //276
  console.log(propertys.join("\n"));      //toString等
}