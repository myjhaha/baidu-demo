

function PlanetMsgSender(planet){
  this.m_owner = planet;
  this.sendCommand = function(from,to,cmd){
    var cmdObj = {id:to,command:cmd};
    var strInfo = this.m_owner.m_adapter.modulate(cmdObj);
    console.log("消息发射器调制 json:{id:"+to+", command:"+cmd+"} -> 二进制:["+strInfo+"]");
    World.getInstance().getMediator().broadcastMsgToSpaceships(from,strInfo);
  }
}
function SpaceshipMsgSender(spaceship){
  this.m_owner = spaceship;
  this.sendHeartBeat = function(){
    // var cmdObj = {id:to,command:cmd};
    // var strInfo = this.m_owner.m_adapter.modulate(cmdObj);
    // console.log("消息发射器调制 json:{id:"+to+", command:"+cmd+"} -> 二进制:["+strInfo+"]");
    // this.m_mediator.broadcastMsgToSpaceships(from,strInfo);
    var m = World.getInstance().getMediator();
    var msgType = MessageType.MSG_SPACESHIP_HEARTBEAT;
    var heartbeatJson = {id:this.m_owner.id, state:this.m_owner.getCurrentStateName(),curOil:Math.round(this.m_owner.m_currentOil)};
    var extraInfo = this.m_owner.m_adapter.modulate(heartbeatJson);
    MessageDispatcher.getInstance().dispatchMsg(150,this.m_owner.id,m.id,msgType,extraInfo);
  }
}