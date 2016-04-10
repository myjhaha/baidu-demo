/**
 * 数据
 */
var queueData = [1,2,3];
/**
 * 页面缓存
 */
var inputTxt;
var insertLeftBtn;
var insertRightBtn;
var popLeftBtn;
var popRightBtn;
var sortBtn;
var chartDiv;



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
 * 初始化事件
 */
function initBtnEvent(){
    inputTxt = inputTxt || document.getElementById("input-data");
    insertLeftBtn = insertLeftBtn || document.getElementById("insert-left");
    insertRightBtn = insertRightBtn || document.getElementById("insert-right");
    popLeftBtn = popLeftBtn || document.getElementById("pop-left");
    popRightBtn = popRightBtn || document.getElementById("pop-right");
    sortBtn = sortBtn || document.getElementById("sort");
    chartDiv = chartDiv || document.getElementById("chart-div");
    addEventHandler(insertLeftBtn, "click", insertLeft);
    addEventHandler(insertRightBtn, "click", insertRight);
    addEventHandler(popLeftBtn, "click", popLeft);
    addEventHandler(popRightBtn, "click", popRight);
    addEventHandler(chartDiv, "click", delegateDeleteEvent);
}

/**
 * 渲染
 */
function renderChart(){
    var str = "";
    var len = queueData.length;
    for (var i=0; i<len; i++) {
      str += ("<div class=\"queue_item\">" + queueData[i] + "</div>");
    }
    chartDiv.innerHTML = str;
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

function getInput(){
  var str = inputTxt.value.trim();
  if(/^[\d]+$/.test(str)){
    return parseInt(str);
  }else{
    return null;
  }
}

function insertLeft(){
  var val = getInput()
  if(val != null){
    queueData.unshift(val);
    renderChart();
  }else{
    alert("请输入一个整数");
  }
}
function insertRight(){
  var val = getInput()
  if(val != null){
    queueData.push(val);
    renderChart();
  }else{
    alert("请输入一个整数");
  }
}
function popLeft(){
  if(queueData.length > 0){
    var val = queueData.shift();
    renderChart();
    alert("向左弹出:" + val);
  }else{
    alert("队列已为空");
  }
}
function popRight(){
  if(queueData.length > 0){
    var val = queueData.pop();
    renderChart();
    alert("向右弹出:" + val);
  }else{
    alert("队列已为空");
  }
}
function delByIndex(target){
  var index = [].indexOf.call(target.parentNode.children, target);
  queueData.splice(index,1);
  renderChart();
}

/**
 * main function..
 */
window.onload = function(){
  initBtnEvent();
  renderChart();
};