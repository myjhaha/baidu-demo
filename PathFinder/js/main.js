var canvas = $("#canvas-world-view");
var context = canvas.getContext("2d");

var setStartRadio = $("#set-start-radio");
var setEndRadio = $("#set-end-radio");
var setBlockRadio = $("#set-block-radio");
var setEmptyRadio = $("#set-empty-radio");

var astarRadio = $("#astar-radio");
var dfsRadio = $("#dfs-radio");
var bfsRadio = $("#bfs-radio");
var dijkstraRadio = $("#dj-radio");
var dbfsRadio = $("#dbfs-radio");

var manhattanRadio =$("#manhattan-radio");
var euclideanRadio =$("#euclidean-radio");
var chebyshevRadio =$("#chebyshev-radio");

var goBtn = $("#go-btn");

function checkSupport(){
  try {
    document.createElement("canvas").getContext("2d");
    document.getElementById("support").innerHTML = "HTML5 Canvas is supported in your browser.";
  } 
  catch (e) {
    document.getElementById("support").innerHTML = "HTML5 Canvas is NOT supported in your browser.";
  } 
}

function initPage(){
  checkSupport();

  addEventHandler(goBtn,"click",goEvent);

  addEventHandler(canvas,"mousedown",onCanvasEvent);
  addEventHandler(canvas,"mouseup",onCanvasEvent);
  addEventHandler(canvas,"mousemove",onCanvasEvent);
  addEventHandler(canvas,"mouseout",onCanvasEvent);
  addEventHandler(canvas,"mouseover",onCanvasEvent);

  addEventHandler(setStartRadio,"click",setNodeEvent);
  addEventHandler(setEndRadio,"click",setNodeEvent);
  addEventHandler(setBlockRadio,"click",setNodeEvent);
  addEventHandler(setEmptyRadio,"click",setNodeEvent);

  addEventHandler(astarRadio,"click",setAlgorithm);
  addEventHandler(dfsRadio,"click",setAlgorithm);
  addEventHandler(bfsRadio,"click",setAlgorithm);
  addEventHandler(dijkstraRadio,"click",setAlgorithm);
  addEventHandler(dbfsRadio,"click",setAlgorithm);

  addEventHandler(manhattanRadio,"click",setHeuristic);
  addEventHandler(euclideanRadio,"click",setHeuristic);
  addEventHandler(chebyshevRadio,"click",setHeuristic);
}

function goEvent(e){
  alert("gogo");
  Game.runPathFinder();
}

function setNodeEvent(e){
  var target = e.target;
  switch(target.value){
    case "start":
      Game.setNodeSetting(0);
      break;
    case "end":
      Game.setNodeSetting(1);
      break;
    case "block":
      Game.setNodeSetting(2);
      break;
    case "empty":
      Game.setNodeSetting(3);
      break;
    default:
      break;
  }
}
function setAlgorithm(e){
  var target = e.target;
  switch(target.value){
    case "astar":
      Game.setAlgorithm(0);
      break;
    case "dfs":
      Game.setAlgorithm(1);
      break;
    case "bfs":
      Game.setAlgorithm(2);
      break;
    case "dijkstra":
      Game.setAlgorithm(3);
      break;
    case "dbfs":
      Game.setAlgorithm(4);
      break;
    default:
      break;
  }
}
function setHeuristic(e){
  var target = e.target;
  switch(target.value){
    case "manhattan":
      Game.setHeuristic(0);
      break;
    case "euclidean":
      Game.setHeuristic(1);
      break;
    case "chebyshev":
      Game.setHeuristic(2);
      break;
    default:
      break;
  }
}


function onCanvasEvent(e){
  // console.log(e);
  var eventType = e.type;
  var offsetX = e.offsetX;
  var offsetY = e.offsetY;
  //console.log("["+eventType+","+offsetX+","+offsetY+"]");
  Game.handleEvent(e);

}

function animate() {
  function _update(runningTime){
    Game.update(runningTime);
    requestAnimationFrame(_update);
  }
  var requestAnimationFrame =  window.requestAnimationFrame || 
              window.mozRequestAnimationFrame || 
              window.webkitRequestAnimationFrame || 
              window.msRequestAnimationFrame;
  requestAnimationFrame(_update);
}

//window.onload = function(e){
//  alert("onload...");

//}

// main function
// onload is fucked by mobilephone
(function (){
  initPage();
 // test_2();
  Game.init();
  animate();
})();



function test(arg){
  //var gridmap = new GridMap(gridMapData);
  var gnode = new GraphNode( 0,
                                { 
                                  pos: new Vector2D(5,5),
                                  index2D: [0,0],
                                  width: 11,
                                });
  console.log(typeof gnode);
  console.log(gnode instanceof GraphNode);
  var a = arg || 13;
  console.log(a);
}
function test_2(){
  function * Loop(n){
    this.n = n;
    while(this.n--){
      yield this.n;
    }
  }

  function LoopObj(n){
    this.n = n;
    this.run = function*(){
      while(this.n--){
        yield this.n;
      }
    };
  }

  var loop = new LoopObj(3)
  var res = loop.run();
  console.log(res.next());
  console.log(loop.n);
  console.log(res.next());
  console.log(loop.n);
  console.log(res.next());
  console.log(loop.n);
  console.log(res.next());
  console.log(loop.n);
  console.log(res.next());
  console.log(loop.n);
  console.log(res.next());
}