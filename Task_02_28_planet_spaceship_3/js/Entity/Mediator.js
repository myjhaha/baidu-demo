
function BUSMediator(id){
  this.id = id;
  this.m_name = "BUS";
  this.m_lossRate = 0.1;
  this.m_delay = 200;
  this.sendToPlanet = function (from, extraInfo){
    //console.log("Mediator收到心跳:[" + telegram.extraInfo +"]");
    var p = World.getInstance().getPlanet();
    var msgType = MessageType.MSG_SPACESHIP_HEARTBEAT;
    var delay = this.m_delay;
    var sender = from;
    var receiver = p.id;
    var extraInfo = extraInfo;
    var r = Math.random();
    if(r > this.m_lossRate){
      //console.log("心跳转发成功.");
      MessageDispatcher.getInstance().dispatchMsg(delay,sender,receiver,msgType,extraInfo);
    }else{
      // LOOP
      console.assert(receiver !== undefined, "receiver 不能为空"); ////////////
      s = EntityManager.getInstance().getEntityFromID(receiver);
      //console.log("心跳转发失败 将再次重发");
      MessageDispatcher.getInstance().dispatchMsg(this.m_delay,from,this.id,msgType,extraInfo);
    }

    //MessageDispatcher.getInstance().dispatchMsg(delay,this.id,p.id,msgType,extraInfo);
  }
  this.sendToSpaceship = function (obj){
    var s = EntityManager.getInstance().getEntityFromID(obj.id);
    if(s === null){
      console.log("飞船["+obj.id+"] 已经销毁了，发送消息终止.");
      return ;
    }
    console.log("消息到 ["+s.m_name+"("+s.id+")] 超时");
    var r = Math.random();
    var delay = this.m_delay;
    var sender = this.id;
    var receiver = obj.id;
    var msgType = MessageType.MSG_SEND_TO_SPACESHIP;
    var extraInfo = obj.binStr;

    console.assert(sender !== undefined, "sender 不能为 undefined");
    console.assert(receiver !== undefined, "receiver 不能为 undefined");
    console.log("重发消息到 ["+s.m_name+"("+s.id+")].");
    if(r > this.m_lossRate){
      MessageDispatcher.getInstance().dispatchMsg(delay,sender,receiver,msgType,extraInfo);
    }else{
      // LOOP 根据概率 判断重发
      console.assert(receiver !== undefined, "receiver 不能为空"); ////////////
      s = EntityManager.getInstance().getEntityFromID(receiver);
      MessageDispatcher.getInstance().dispatchMsg(this.m_delay,this.id,this.id,msgType,{id:obj.id,binStr:obj.binStr});
    }
  }

  this.broadcastMsgToSpaceships = function(from,msgObj){
    console.log("广播命令........["+msgObj+"]");
    var ships = World.getInstance().getAllSpaceshipsId();
    for (var i = ships.length - 1; i >= 0; i--) {
      var r = Math.random();
      var s = EntityManager.getInstance().getEntityFromID(ships[i]);
      var delay = this.m_delay;
      var sender = from;
      var receiver = ships[i];
      var msgType = MessageType.MSG_SEND_TO_SPACESHIP;
      var extraInfo = msgObj; // binary
      if(r > this.m_lossRate){
        
        //console.log("广播消息到{"+s.m_name+"["+s.shipId+"](id:"+s.id+")}成功." );
        //MessageDispatcher.getInstance().dispatchMsg(this.m_delay+150*i,sender,receiver,msgType,extraInfo);
        MessageDispatcher.getInstance().dispatchMsg(this.m_delay+150*i,sender,receiver,msgType,extraInfo);
      }else{
        //console.log("广播消息到{"+s.m_name+"["+s.shipId+"](id:"+s.id+")}超时，将重发" );
        // MessageType: MSG_SEND_TO_SPACESHIP = 2
        MessageDispatcher.getInstance().dispatchMsg(this.m_delay,this.id,this.id,MessageType.MSG_SEND_TO_SPACESHIP,{id:s.id,binStr:extraInfo});
      }
    };
  }
    this.handleMessage = function(telegram){
    if(telegram.receiver == this.id){
      switch(telegram.msgType){
        case MessageType.MSG_BOARDCAS_TO_SPACESHIP:
          this.broadcastMsgToSpaceships(telegram.sender, telegram.extraInfo);
          break;
        case MessageType.MSG_SEND_TO_SPACESHIP:
          this.sendToSpaceship(telegram.extraInfo); // telegram.extraInfo 是一个 json
          break;
        case MessageType.MSG_SPACESHIP_HEARTBEAT:
          this.sendToPlanet(telegram.sender,telegram.extraInfo);
          //console.log("spaceship send to planet");
          break;
        default:
          console.warn("cannot deal with msgType[" + telegram.msgType +"]");
          return;
      }
    }
  }
}