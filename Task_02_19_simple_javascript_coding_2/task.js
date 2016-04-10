/**
 * 数据
 */
var queueData = [];
var inputTxt;
var insertLeftBtn;
var insertRightBtn;
var popLeftBtn;
var popRightBtn;
var sortBtn;
var chartDiv;
var chartDiv2;

/**
 * 事件插入浏览器兼容
 */
function addEventHandler(element, ev, handler){
  if(element.addEventListener){
    element.addEventListener(ev,handler,false);
  }else if(element.attachEvent){
    element.attachEvent("on" + ev, handler);
  }else{
    element["on" + ev] = handler;
  }
}
/**
 * 随机数生成
 */
function selectFrom(startNumber, endNumber) {
    var choice = endNumber - startNumber + 1;
    return Math.floor(Math.random() * choice + startNumber)
}
/**
 * 柱状图 - 颜色生成
 */
var colorPallette = [ "#060", "#070", "#090", "#0c0", "#3c0", "#6c0", "#9c0", "#cc0",
                      "#fc0", "#fc3", "#fc6", "#fc9", "#fcc", "#fcf",
                      "#f9f", "#f6f", "#f3f", "#f0f", "#f0c", "#f09", "#f06", 
                      "#f03", "#f00", "#c00", "#900", "#600", "#300", "#000"
                       ];
function getBarColor(num,from,to){
  if (num >= to)
    return "#000";
  if (num < from){
    return "#090";
  }
  //var i = Math.floor( Math.sqrt(((num-10)/290.0)) * colorPallette.length);
  //var i = Math.floor( Math.log((1+(num-from)/(to-from))) * colorPallette.length);
  //var i = Math.floor( Math.sqrt(((num-from)/(to-from))) * colorPallette.length );
  var i = Math.floor( (((num-from)/(to-from))) * colorPallette.length );
  return colorPallette[i];
}
/**
 * 获取输入
 */
function getInputValue(){
  var str = inputTxt.value.trim();
  if(/^[\d]+$/.test(str)){
    var v = parseInt(str);
    if( v >= 10 && v <= 300)
      return v;
  }
  return null;
}
/**
 * 在chartDiv chartDiv2上渲染图表
 */
function renderChart (_currentIndex){
  var _width = 18;
  var _minHeight = 10;
  var str = "";
  var str2 = "";
  var len = queueData.length;
  for (var i=0; i<len; i++) {
    str += ("<div class=\"queue_item\""+ 
            " style=\"left:" + _width*(i+1) + "px;" +
                  "width:" + _width + "px;" +
                  "height:" + (_minHeight+queueData[i]) + "px;color:#fff;" +
                  "background-color:" + getBarColor(queueData[i],10,300)+";" +
                        
            "\"></div>");
    str2 += ("<div class=\"queue_item\""+ 
              " style=\"left:" + _width*(i+1) + "px;" +
                  "background-color:" + getBarColor(queueData[i],10,300)+";" +
                "\"" + 
                "title=\"val=" + queueData[i] +" " +  getBarColor(queueData[i],10,300) +"\"" +
                ">" + queueData[i] + "</div>");
  }
  chartDiv.innerHTML = str;
  chartDiv2.innerHTML = str2;
}
function runSortData(compareFun){
  var i = queueData.length;
  var j = 0;
  var t = this;
  function stepOne(){
    if( i > 0) {
      if( j< i-1 ){
        if( compareFun(queueData[j], queueData[j+1]) > 0){
          var tmp = queueData[j+1];
          queueData[j+1] = queueData[j];
          queueData[j] = tmp; 
          renderChart(j);
        }
        j++;
        if(j == i-1){
          i--;
          j=0;
        }
      }
<<<<<<< HEAD
      setTimeout(stepOne,5);
=======
      setTimeout(stepOne,3);
>>>>>>> de2738c3fdb31bbd07ef4e7f2b71296460412712
    }
  }
  stepOne();
};

/**
 * 事件回调
 */
function insertLeft(){
  var val = getInputValue();
  if (val == null) {
    alert("输入10到300整数");
    return ;
  }
  queueData.unshift(val);
  renderChart();
}
function insertRight(){
  var val = getInputValue();
  if (val == null) {
    alert("输入10到300整数");
    return ;
  }
  queueData.push(val);
  renderChart();
}
function popLeft(){
  var v = queueData.shift();
  renderChart();
  alert("向左弹出:" + v);
}
function popRight(){
  var v = queueData.pop();
  renderChart();
  alert("向右弹出:" + v);
}
function delByIndex(target){
  var index = [].indexOf.call(target.parentNode.children, target);
  var v = queueData.splice(index,1);
  renderChart();
  alert("下标["+ index +"]被删除: " + v);
}
function runSort(){
  runSortData(function(a,b){return a - b;});
}

/**
 * 事件代理
 */
function delegateDeleteEvent(ev){
  var target = ev.target;
  if (target && target.tagName == "DIV" && target.className == "queue_item"){
    delByIndex(target);
  }
}


/**
 * 初始化事件
 */
function initPageEvent(){
    inputTxt = inputTxt || document.getElementById("input-data");
    insertLeftBtn = insertLeftBtn || document.getElementById("insert-left");
    insertRightBtn = insertRightBtn || document.getElementById("insert-right");
    popLeftBtn = popLeftBtn || document.getElementById("pop-left");
    popRightBtn = popRightBtn || document.getElementById("pop-right");
    sortBtn = sortBtn || document.getElementById("sort");
    chartDiv = chartDiv || document.getElementById("chart-div");
    chartDiv2 = chartDiv2 || document.getElementById("chart-div-2");
    addEventHandler(insertLeftBtn, "click", insertLeft);
    addEventHandler(insertRightBtn, "click", insertRight);
    addEventHandler(popLeftBtn, "click", popLeft);
    addEventHandler(popRightBtn, "click", popRight);
    addEventHandler(chartDiv, "click", delegateDeleteEvent);
    addEventHandler(chartDiv2, "click", delegateDeleteEvent);
    addEventHandler(sortBtn,"click",runSort);
}

function initData(len, from, to){
  for (var i = len - 1; i >= 0; i--) {
    queueData.push(selectFrom(from,to));
  }
}
window.onload = function(){
  initPageEvent();
  initData(50,10,300);
  renderChart();
};