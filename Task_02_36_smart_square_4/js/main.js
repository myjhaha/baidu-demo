
var turnRBtn = $("#turn-right-btn");
var turnLBtn = $("#turn-left-btn");
var turnBBtn = $("#turn-back-btn");
var goBtn = $("#go-btn");

var leftBtn = $("#left-btn");
var rightBtn = $("#right-btn");
var upBtn = $("#up-btn");
var downBtn = $("#down-btn");
var buildBtn = $("#build-btn");
var brushBtn = $("#brush-btn");
var randomBrickBtn = $("#random-brick-btn");
var inputColorTxt = $("#color-input")
var inputBrickNumTxt = $("#build-brick-num");

var gridWidthSelect = $("#grid-width-select");
var rowNumList = $("#row-number-list");
var cmdInput = $("#cmd-panal");
var cleanCheckboardBtn = $("#clean-checkboard-btn");
var runCmdBtn = $("#run-cmd-btn");
var resetBtn = $("#reset-btn");
var checkerboard = $("#checkerboard");
var testBtn = $("#test-btn");

function onGridSizeChanged(){
  var s = parseInt(gridWidthSelect.value.trim());
  initCheckerboard(s,s);
  test();
  updateRownumbers();
}
function turnRightFun(){
  Controller.playerTurn("RIGHT");
}
function turnLeftFun(){
  Controller.playerTurn("LEFT");
}
function turnBackFun(){
  Controller.playerTurn("BACK");
}
function goFun(){
  Controller.playerGo();
}
function toLeftFun(){
  if(Controller.getPlayerDirection() == Direction.LEFT){
    Controller.playerGo();
  }else{
    Controller.setPlayerDirection("LEFT");
  }
}
function toRightFun(){
  if(Controller.getPlayerDirection() == Direction.RIGHT){
    Controller.playerGo();
  }else{
    Controller.setPlayerDirection(Direction.RIGHT);
  }
}
function toUpFun(){
  if(Controller.getPlayerDirection() == Direction.UP){
    Controller.playerGo();
  }else{
    Controller.setPlayerDirection(Direction.UP);
  }
}
function toDownFun(){
  if(Controller.getPlayerDirection() == Direction.DOWN){
    Controller.playerGo();
  }else{
    Controller.setPlayerDirection(Direction.DOWN);
  }
}
function toResetFun(){
  //Controller.reset();
  VM.getInstance().reset();
}
function toBuildFun(){
  Controller.playerBuild();
}
function toBrushFun(){
  var color = inputColorTxt.value.trim();
  Controller.playerBrush(color);
}
function toCleanCheckboardFun(){
  VM.getInstance().reset();
  Controller.reset();
}
function runCmdFun(){
  var cmd = cmdInput.value;
  VM.getInstance().setInputCmd(cmd);
  VM.getInstance().onRun(function(i){
    console.log("ins:" + i);
  });
}
function selectCellEventDelegate(ev){
  var target = ev.target;
  console.log(target.tagName + "|"+ target.className);
  console.log(ev);
}
function randomBuildFun(){
  var n = parseInt(inputBrickNumTxt.value.trim());
  while(n--){
    Controller.randomBuildBrick();
  }
}
function scrollEventCallback(ev){
  var target = ev.target;
  rowNumList.style.top = -target.scrollTop + "px";
}
function inputEventCallback(ev){
  var target = ev.target;
  var str = target.value;
  var arr = str.split(/\r?\n/);
  var html = "";
  rowNumList.innerHTML = "";
  for(var i=0;i<arr.length;i++){
    var n = document.createElement("div");
    var len = getChatLength(arr[i]);
    n.style.height = ((1+Math.floor(len / 50.0))  * 1.25) + "em";
    n.innerHTML = i+"";
    html += ("<div>" + i+ "</div>");
    rowNumList.appendChild(n);
  }
  //rowNumList.innerHTML = html;
}
function updateRownumbers(){
  var arr = cmdInput.value.split(/\r?\n/);
  var html = "";
  rowNumList.innerHTML = "";
  for(var i=0;i<arr.length;i++){
    var n = document.createElement("div");
    var len = getChatLength(arr[i]);
    n.style.height = ((1+Math.floor(len / 50.0))  * 1.25) + "em";
    n.innerHTML = i+"";
    html += ("<div>" + i+ "</div>");
    rowNumList.appendChild(n);
  }
}

function initPage(){
  addEventHandler(turnRBtn,"click",turnRightFun);
  addEventHandler(turnLBtn,"click",turnLeftFun);
  addEventHandler(turnBBtn,"click",turnBackFun);
  addEventHandler(goBtn,"click",goFun);
  // direction
  addEventHandler(leftBtn,"click",toLeftFun);
  addEventHandler(rightBtn,"click",toRightFun);
  addEventHandler(upBtn,"click",toUpFun);
  addEventHandler(downBtn,"click",toDownFun);
  
  addEventHandler(buildBtn,"click", toBuildFun);
  addEventHandler(brushBtn,"click", toBrushFun);
  addEventHandler(randomBrickBtn,"click",randomBuildFun);
  // cmd 
  // buildBtn
  // brushBtn
  addEventHandler(resetBtn,"click",toResetFun);
  addEventHandler(cleanCheckboardBtn,"click",toCleanCheckboardFun);
  addEventHandler(runCmdBtn,"click",runCmdFun);
  addEventHandler(cmdInput,"scroll",scrollEventCallback); // scroll row-number-list
  addEventHandler(cmdInput,"input", inputEventCallback);

  addEventHandler(checkerboard,"click",selectCellEventDelegate );
  addEventHandler(gridWidthSelect,"change", onGridSizeChanged);
  // test btn
  addEventHandler(testBtn,"click",onTest);
}

function initCheckerboard(width,height){
  Controller.init(width,height);
}

window.onload = function(){
  var s = parseInt(gridWidthSelect.value.trim());
  initCheckerboard(s,s);
  initPage();
  test();
  updateRownumbers();
}
function test(){

}

function onTest(){
  var s = cmdInput.value.trim();
  var inputBufferLines = s.split(/\r?\n/);
}