var canvas = $("canvas");
var context = canvas.getContext("2d");


var workBtn = $("work-btn");
var stopBtn = $("stop-btn");
var killBtn = $("kill-btn");
var createBtn = $("create-btn");
var spaceshipSetDiv = $("spaceship-set");
var orbitSetDiv = $("orbit-select-div");
var spaceshipNameTxt = $("spaceship-name");
// resource 
var earthImg = new Image();
earthImg.src = "./img/earth.png";
var planetImg = new Image();
planetImg.src = "./img/planet.png";

// commander
// world item object.
//var commander  = null;
//var planet = null;

function delegateSapceshipSelectedEvent(ev){
  var target = ev.target;
  if( target &&
      target.tagName =="DIV" &&
      target.classList.contains("spaceship-item") 
    ){
    var id = target.getAttribute("spaceship_id");
    var ship = EntityManager.getInstance().getEntityFromID(id);
    if(ship !== null){
      if(ship.getSelected()){
        ship.setSelected(false);
        target.classList.remove("selected");
      }else{
        ship.setSelected(true);
        target.classList.add("selected");
      }
    }else{
      console.log("Warning: spaceship[" +id+ "] is not exist.");
    }
  }
}
//dispatchMsg: function(delay, senderID, receiverID, msg, additionalInfo)
function runSpaceships(){
  var shipDomList = spaceshipSetDiv.querySelectorAll(".selected");
  for (var i = shipDomList.length - 1; i >= 0; i--) {
    var shipid = shipDomList[i].getAttribute("spaceship_id");
    if(shipid == null){
      console.log("Warning:shipDom.getAttribute(\"spaceship_id\") failure.");
    }else{
      // var msgObj = {id:shipid,command:'work'};
      // var mediator = World.getInstance().getMediator();
      // MessageDispatcher.getInstance().dispatchMsg(100.0,commander.id,mediator.id,3,msgObj);
      World.getInstance().getCommander().sendCommand(shipid,"work");
    }
  };
}
function stopSpaceships(){
  var shipDomList = spaceshipSetDiv.querySelectorAll(".selected");
  for (var i = shipDomList.length - 1; i >= 0; i--) {
    var shipid = shipDomList[i].getAttribute("spaceship_id");
    if(shipid == null){
      console.log("Warning:shipDom.getAttribute(\"spaceship_id\") failure.");
    }else{
      World.getInstance().getCommander().sendCommand(shipid,"stop");
    }
  };
}
function killSpaceships(){
  var shipDomList = spaceshipSetDiv.querySelectorAll(".selected");
  for (var i = shipDomList.length - 1; i >= 0; i--) {
    var shipid = shipDomList[i].getAttribute("spaceship_id");
    if(shipid == null){
      console.log("Warning:shipDom.getAttribute(\"spaceship_id\") failure.");
    }else{
      World.getInstance().getCommander().sendCommand(shipid,"destroy");
      //updateSpaceshipList();
      spaceshipSetDiv.removeChild(shipDomList[i]);
    }
  };
}
function updateSpaceshipList(){
  spaceshipSetDiv.innerHTML ="";
  var arr = World.getInstance().getAllSpaceshipsId();
  for (var i=0; i<arr.length; i++) {
    var id = arr[i];
    var ship = EntityManager.getInstance().getEntityFromID(id);
    //console.log(ship);
    var n = document.createElement("div");
    n.classList.add("spaceship-item");
    n.setAttribute("spaceship_id", id);
    n.innerHTML = (""+(ship.shipId));
    if(ship.getSelected() == true){
      n.classList.add("selected");
    }
    spaceshipSetDiv.appendChild(n);
  };
}
function updateOrbitsList(){
  var arr = World.getInstance().getAllOrbitsId();
  var str = "";
  orbitSetDiv.innerHTML = "";
  for (var i=0;i<arr.length;i++) {
    var id = arr[i];
    var o = EntityManager.getInstance().getEntityFromID(id);
    if(o == null)
      throw new Error("Error: cannot find orbit["+id+"]");
    str += "<input type=\"radio\"" +
                  " name=\"orbit-select\""+
                  " value=\""+id+"\""+
                  " id=\"orbit-" +id+"\""+
                  (i==arr.length-1 ? " checked=\"checked\">" : ">") +
                  "<label for=\"orbit-"+ id +"\">"+o.getName() + "</label> ";
  };
  orbitSetDiv.innerHTML = str;
}
function createSpaceship(ev){
  var powType = -1;
  var ergType = -1;
  var orbitId = -1;
  var name = spaceshipNameTxt.value.trim();
  var arr = World.getInstance().getSpaceshipsByName(name);
  if(arr.length > 0){
    alert("spaceship[" + name + "] is exist.");
    return ;
  }
  powType = parseInt(getRadioValue("power-system"));
  ergType = parseInt(getRadioValue("energy-system"));
  orbitId = parseInt(getRadioValue("orbit-select"));
  console.log("createShip:(p:"+powType + " e:"+ergType+" o:" +orbitId +")");
  var ship = World.getInstance().getCommander().launchSpaceship (name, powType, ergType, orbitId);
  //updateSpaceshipList();
  var n = document.createElement("div");
  n.classList.add("spaceship-item");
  n.setAttribute("spaceship_id", ship.id);
  n.innerHTML = (""+(ship.shipId));
  if(ship.getSelected() == true){
    n.classList.add("selected");
  }
  spaceshipSetDiv.appendChild(n);
}
function selectOrbit(ev){
  var target = ev.target;
  console.log(target.tagName);
}

function initPage(){
  addEventHandler(spaceshipSetDiv,"click",delegateSapceshipSelectedEvent);
  addEventHandler(workBtn,"click",runSpaceships);
  addEventHandler(stopBtn,"click",stopSpaceships);
  addEventHandler(killBtn,"click",killSpaceships);
  addEventHandler(createBtn,"click",createSpaceship);
  addEventHandler(orbitSetDiv,"click",selectOrbit);
  updateSpaceshipList();
  updateOrbitsList();
}
  

function initWorld(){
  var orbitSpace = 25;
  var planetX = 300;
  var planetY = 200;
  var planetR = 30;
  var orbits = [];
  var spaceships = [];
  //新建行星
  var planet = PlanetFactory.createPlanet(planetX,planetY,planetR);
  World.getInstance().pushPlanet(planet);
  //创建指挥官
  var commander = CommanderFactory.createCommander();
  commander.setPlanet(planet);
  World.getInstance().setCommander(commander);
  //新建轨道
  for (var i = 1; i <= 6; i++) {
    var obrit = OrbitFactory.createOrbit(planetX,planetY,planet.r+orbitSpace*i);
    obrit.setName("轨["+i+"]");
    orbits.push(obrit);
    World.getInstance().pushOrbit(obrit);
  };
  //创建飞船
  commander.launchSpaceship ("东方红1号", 1, 1, orbits[0].id);
  commander.launchSpaceship ("神舟1号", 2, 2, orbits[1].id);
  commander.launchSpaceship ("天宫1号", 3, 2, orbits[2].id);
  commander.launchSpaceship ("嫦娥1号", 3, 2, orbits[3].id);
  commander.launchSpaceship ("永恒之树号", 1, 3, orbits[5].id);
  

  console.log("Planet: " + World.getInstance().getAllPlanetsId());
  console.log("Orbits: " + World.getInstance().getAllOrbitsId());
  console.log("Spaceships: " + World.getInstance().getAllSpaceshipsId());
 
}
window.onload = function (){
 // test();
  initWorld();
  initPage();
  
  animate();
}
function animate() {
  var requestAnimationFrame =  window.requestAnimationFrame || 
              window.mozRequestAnimationFrame || 
              window.webkitRequestAnimationFrame || 
              window.msRequestAnimationFrame;
  var i = 0;
  var pretimestamp = 0;
  var curTime = 0;
  function update(curTimestamp){
    var deltaTime = curTimestamp - pretimestamp;
    pretimestamp = curTimestamp;
    //console.log(i++ + " [" +deltaTime + "]");
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "#fff";
    context.fillText("运行时间:"+(curTimestamp/1000.0).toFixed(2)+"秒", 10, 20);
    World.getInstance().update(deltaTime);
    World.getInstance().draw();
    MessageDispatcher.getInstance().dispatchDelayedMessages();
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function compareMaxHeap(a, b){
  return (a < b);
}
function compareMinHeap(a, b){
  return (a > b);
}


function test(){
  var i = 0;
 function fun1(){
  console.log(i++);
  setTimeout(fun1,0);
 }

}