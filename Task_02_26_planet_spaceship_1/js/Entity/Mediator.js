function NormalMediator(id){
  this.id = id;
  this.m_name = "Mediator";
  this.m_lossRate = 0.3;
  this.m_delay = 1000;
  function broadcastMsg(){
    
  }
  this.broadcastMsgToSpaceships = function(from,msgObj){
    console.log("媒介广播..............");
    var ships = World.getInstance().getAllSpaceshipsId();
    for (var i = ships.length - 1; i >= 0; i--) {
      var r = Math.random();
      var s = EntityManager.getInstance().getEntityFromID(ships[i]);
      if(r > this.m_lossRate){
        var sender = from;
        var receiver = ships[i];
        var msgType = 1;
        var extraInfo = msgObj;
        console.log("["+s.m_name+"] 消息发送成功" );
        MessageDispatcher.getInstance().dispatchMsg(this.m_delay,sender,receiver,msgType,extraInfo);
      }else{
        console.log("["+s.m_name+"] 消息发送超时" );
      }
    };
  }
}
function BUSMediator(id){
  this.id = id;
  this.m_name = "BUS";
  this.m_lossRate = 0.1;
  this.m_delay = 200;
  this.broadcastMsgToSpaceships = function(from,msgObj){
    console.log("媒介广播..............");
    var ships = World.getInstance().getAllSpaceshipsId();
    for (var i = ships.length - 1; i >= 0; i--) {
      var r = Math.random();
      var s = EntityManager.getInstance().getEntityFromID(ships[i]);
      if(r > this.m_lossRate){
        var delay = 1000;
        var sender = from;
        var receiver = ships[i];
        var msgType = 2;
        var extraInfo = msgObj;
        console.log("广播消息到["+s.m_name+"]成功." );
        MessageDispatcher.getInstance().dispatchMsg(this.m_delay,sender,receiver,msgType,extraInfo);
      }else{
        console.log("广播消息到["+s.m_name+"]超时." );
      }
    };
  }
}