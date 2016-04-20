function MessageReceiver(planet){
  this.m_owner = planet;
  // this.m_mediator = MediatorFactory.createMediator("Mediator");
  // this.broadcastMsgToSpaceship = function(recId, cmd){
  //   var msgObj = {id:recId,command:cmd};
  //   MessageDispatcher.getInstance().dispatchMsg(100.0,this.id,this.m_mediator.id,1,msgObj);
  // }
  this.processMsg = function(telegram){
    //console.log("行星收到心跳[" +telegram.extraInfo+"]")
    switch(telegram.msgType){
      case MessageType.MSG_SPACESHIP_HEARTBEAT:
        //解调心跳二进制串
        var o = this.m_owner.m_adapter.demodulate(telegram.extraInfo);
        this.m_owner.m_dataCenter.pushMessage(o);
        break;
      default:
        throw new Error("Error: msgType Error.");
        //console.warn("msgType Error.");
    }
  }
}
