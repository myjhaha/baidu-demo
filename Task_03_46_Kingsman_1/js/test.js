var canvas = $("#canvas");
var context = canvas.getContext("2d");


var newPlayerBtn = $("#create-player-btn");
var pauseBtn = $("#pause-btn");
var seekBtn = $("#seek-radio");
var arriveBtn = $("#arrive-radio");
var followBtn = $("#path-follow-radio");
var newPathBtn = $("#new-path-btn");
/******************************/
/***       使用类声名        **/
/******************************/



//int(vPos,r)
var baseGameEntity = new BaseGameEntity(new Vector2D(1,1),10);

//init function(vPos,r,vVelocity,maxSpeed,vheading,vScale,mass,maxTurnRate,maxForce){
var movingEntity = new MovingEntity(new Vector2D(2,2),
                                    20, 
                                    new Vector2D(10,10),
                                    100,
                                    new Vector2D(1,0),
                                    new Vector2D(1,1),
                                    1,
                                    5,
                                    10);

function test1(){
  console.log(movingEntity.toString());
  console.log(baseGameEntity.toString());
  var mat = new C2DMatrix();
  console.log(mat.toString());
  mat.identity();
  console.log(mat.toString());
  mat.rotate(Math.PI/2);
  mat.scale(2,3);
  mat.translate(3,6);
  console.log(mat.toString());
  var v = new Vector2D(2,2);
  mat.transformVector2D(v);
  console.log(v.toString());

  var i1 = 0x00001;
  var i2 = 0x00002;
  var i3 = 0x00010;
  console.log(i1 |= i2);
}
function canvasClickEventFun(e){


}
function createPlayerEventFun(e){
  player = new Vehicle( World,                //world
                            new Vector2D(50,50),  //vPos
                            Prm.BotBeginRotation,         //rotation
                            Prm.BotBeginVelocity,   //vVelocity
                            Prm.BotMass,          //mass
                            Prm.BotMaxSpeed,       //max_speed
                            Prm.BotMaxForce,      //max_force
                            Prm.BotMaxTurnRate,      //max_turn_rate
                            Prm.BotScale  );                //scale
  player.m_pPath = World.getPath();
  player.getSteering().arriveOn();
  World.setPlayer(player);
}
function toggleGameState(){
  if(Game.isPause()){
    Game.start();
  }else{
    Game.pause();
  }
}
function switchPlayerBehavior(){
  var r = ($("input[name=behaviors]:checked"));
  switch(parseInt(r.value)){
    case 1:
      var s =  World.getPlayer().getSteering();
      s.allOff();
      s.seekOn();
      s.setTarget(World.getCurrentTarget());
      break;
    case 2:
      var s =  World.getPlayer().getSteering();
      s.allOff();
      s.arriveOn();
      s.setTarget(World.getCurrentTarget());
      break;
    case 3:
      var s =  World.getPlayer().getSteering();
      s.allOff();
      s.followPathOn();
      s.setPath(World.getPath());
      break;
    default:
  }
}
function generateNewPath(){
  World.setPath(new Path(9,50,50,500,500,false));
  World.getPlayer().getSteering().setPath(World.getPath());
}
function initPage(){
  addEventHandler(canvas,"click",Game.onMouseEvent);
  addEventHandler(document,"keydown",KeyManager.onKeyDown);
  addEventHandler(document,"keyup",KeyManager.onKeyUp);
  addEventHandler(newPlayerBtn,"click",createPlayerEventFun);
  addEventHandler(pauseBtn,"click",toggleGameState);
  addEventHandler(seekBtn,"click",switchPlayerBehavior);
  addEventHandler(arriveBtn,"click",switchPlayerBehavior);
  addEventHandler(followBtn,"click",switchPlayerBehavior);
  addEventHandler(newPathBtn,"click",generateNewPath);
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

window.onload = function(e){
  initPage();
  animate();
  World.init();
  Game.start();
}