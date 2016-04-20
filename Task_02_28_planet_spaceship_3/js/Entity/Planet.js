/**
 * 行星实体 
 * 参数: 唯一id, 坐标, 半径 
 */
function Planet (id,x,y,r) {
  this.id = id;
  this.x = x,
  this.y = y,
  this.r = r
  this.m_messageReceiver = null;
  this.orbits = [];
  //this.m_messageSender = new NormalMsgSender();
  this.m_messageSender = new PlanetMsgSender(this);
  this.m_messageReceiver = new MessageReceiver(this);
  this.m_dataCenter = new DataCenter();
  this.m_adapter = new PlanetSingleAdapter();
  this.m_livingTime = 0;
  this.m_lastUpdateDataViewTime =0;
}

//方法：更新
Planet.prototype.update = function(deltaTime){
  this.m_livingTime += deltaTime;
  if(this.m_livingTime - this.m_lastUpdateDataViewTime > 100 ){
    this.m_dataCenter.updateStateTable();
    //console.log("this.m_dataCenter.updateStateTable()");
    this.m_lastUpdateDataViewTime = this.m_livingTime ;
  }
}
//方法：绘制行星（自己）
Planet.prototype.draw = function() {
  var x = this.x - this.r;
  var y = this.y - this.r;
  var w = this.r *2.0;
  var h = this.r *2.0;
  if(earthImg.complete){
    context.drawImage(earthImg,x,y,w,h); 
  }
}
Planet.prototype.getDataCenter = function(){
  return this.m_dataCenter;
}
Planet.prototype.setMessageSender = function(msgSender){
  this.m_messageSender = msgSender;
  this.m_messageSender.m_owner = this;
}
Planet.prototype.setDataCenter = function(dc){
  this.m_dataCenter = dc;
}
Planet.prototype.setMessageReceiver = function(msgR){
  this.m_messageReceiver = msgR;
  this.m_messageReceiver.m_owner = this;
}
Planet.prototype.sendCommand = function(from,to,_command){
  this.m_messageSender.sendCommand(from,to,_command);
}
Planet.prototype.handleMessage = function(telegram){
  if(this.id == telegram.receiver){
    if(telegram.msgType == MessageType.MSG_SPACESHIP_HEARTBEAT){
      this.m_messageReceiver.processMsg(telegram);
    }
  }
}
// Planet.prototype.lanuchSpaceship = function(name, powType, ergType, orbitId){
//   var t = SpaceshipFactory.createSpaceshipToWorld(name, powType, ergType, orbitId);
//   var o = {name:name, id:t.id, state:t.getCurrentStateName(),curOil:t.currentOil};
//   this.m_dataCenter.pushMessage(o);
//   return t;
// }