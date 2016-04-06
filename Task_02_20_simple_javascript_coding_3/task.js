
var queueData = [];

var inputTxt;
var insertLeftBtn;
var insertRightBtn;
var popLeftBtn;
var popRightBtn;
var queryTxt;
var queryBtn;

var listDiv;

// test String
/**
 * 
  中国中国中中国国中
 中国，美国,
 英国 俄国;德国.意大利/越南=菲律宾-蒙古+朝鲜）
 法國
太平天國
 韩国  
 加拿大 　日本，，，,,，苏联 
 中国中国中中国国中
 */

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
function initPageEvent(){
    inputTxt = inputTxt || document.getElementById("input-data");
    queryTxt = queryTxt || document.getElementById("query-text");
    insertLeftBtn = insertLeftBtn || document.getElementById("insert-left");
    insertRightBtn = insertRightBtn || document.getElementById("insert-right");
    popLeftBtn = popLeftBtn || document.getElementById("pop-left");
    popRightBtn = popRightBtn || document.getElementById("pop-right");
    queryBtn = queryBtn || document.getElementById("query-btn");
    listDiv = listDiv || document.getElementById("list-div");
    addEventHandler(insertLeftBtn, "click", insertLeft);
    addEventHandler(insertRightBtn, "click", insertRight);
    addEventHandler(popLeftBtn, "click", popLeft);
    addEventHandler(popRightBtn, "click", popRight);
    addEventHandler(queryBtn, "click", queryData);
    addEventHandler(listDiv,"click",delegateDeleteEvent);
}
function renderChart(){
  var str = "";
  var len = queueData.length;
  for (var i=0; i<len; i++) {
    str += ("<div class=\"list_item\">"+ queueData[i] + "</div>");
  }
  listDiv.innerHTML = str;
}
function renderArr(arr){
  var str = "";
  var len = arr.length;
  for (var i=0; i<len; i++) {
    if(arr[i].flag)
      str += ("<div class=\"list_item match\">"+ arr[i].contain + "</div>");
    else
      str += ("<div class=\"list_item\">"+ arr[i].contain + "</div>");
  }
  listDiv.innerHTML = str;
}

/**
 * 事件代理
 */
function delegateDeleteEvent(ev){
  var target = ev.target;
  if (target && target.tagName == "DIV" && target.className == "list_item"){
    delByIndex(target);
  }
}
/**
 * 事件回调
 */
function insertLeft(){
  var str = inputTxt.value.trim();
  var arr = parseArr(str);
  arr.map(function(e){queueData.unshift(e);});
  renderChart();
}
function insertRight(){
  var str = inputTxt.value.trim();
  var arr = parseArr(str);
  arr.map(function(e){queueData.push(e);});
  renderChart();
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
function queryData(){
  var arr = [];
  var qTxt = queryTxt.value.trim();
  queueData.map(function(e){
    var reg = new RegExp(qTxt,'g');
    var item = new Object();
    if ( reg.test(e) )
      item.flag = "match";
    var v2 = e.match(reg);
    var str = e.replace(reg, function(r){return "<strong>" + r + "</strong>"});
    item.contain = str;
    arr.push(item);
  });
  renderArr(arr);
}
/**
 * param: str
 * return: arr[]
 */
function parseArr( _str ){
  var arr = _str.split( /[^0-9a-zA-Z\u4e00-\u9fa5]+/ );
  arr.filter(function(d){return (d && d != "" && d != '' );});
  return arr;
}


function initData(){
  //queueData.push("AA");
  //queueData.push("ABCABCD");
  //queueData.push("ABCABCDDABCDDCBA");
  //queueData.push("中国人中华人民共和国中华苏维埃中央人民政府");
}
window.onload = function(){
  initPageEvent();
  //test
  initData();
  renderChart();
}