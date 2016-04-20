function NormalMsgSender(){
  this.m_owner = null;
  this.m_mediator = MediatorFactory.createMediator("Mediator");
  this.m_adapter = new Adapter();
  this.sendCommand = function(from,to,cmd){
    var msgObj = {id:to,command:cmd};
    this.m_mediator.broadcastMsgToSpaceships(from,msgObj);
    //console.log(msgObj);
  }

}

function BinaryMsgSender(){
  this.m_owner = null;
  this.m_mediator = MediatorFactory.createMediator("BUS");
  this.m_adapter = new Adapter();
  this.sendCommand = function(from,to,cmd){
    var msgObj = {id:to,command:cmd};
    var strInfo = this.m_adapter.JsonToBinary(msgObj);
    console.log("消息发射器调制 json:{id:"+to+", command:"+cmd+"} -> 二进制:["+strInfo+"]");
    this.m_mediator.broadcastMsgToSpaceships(from,strInfo);
  }
}