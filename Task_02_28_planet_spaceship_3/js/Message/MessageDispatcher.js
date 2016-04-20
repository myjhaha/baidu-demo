//消息体
function Telegram(time, sender, receiver, msgType, extraInfo){
  this.dispatchTime = time;
  this.sender = sender;
  this.receiver = receiver;
  this.msgType = msgType;
  this.extraInfo = extraInfo;
}
//compare function
function compareTelegram(t1, t2){
  return t1.dispatchTime > t2.dispatchTime;
}


/**
 * MessageDispatcher singleton
 */
var MessageDispatcher = (function(){
  var instantiated;
  function init(){
    var MessageQ = new PriorityQueue(compareTelegram);
    return {
      ////////////////////////////////////
      //直接执行
      getMessageQLength:function(){
        return MessageQ.getLength();
      },
      discharge: function(receiver, telegram) {
        //var rec = World.getInstance().getSpanetById(receiver);
        if(receiver === null){
          console.log("Warning: receiver is null.");
          return;
        }
        receiver.handleMessage(telegram);
      },
  //打包消息
      dispatchMsg: function(delay, senderID, receiverID, msgType, additionalInfo){
        //var rec = World.getInstance().getSpaceshipById(receiverID);
        var rec = EntityManager.getInstance().getEntityFromID(receiverID);
        if(rec === null){
          console.warn("Warning: receiver not found with id[" + receiverID +"]");
          return;
        }
        var telegram = new Telegram(0.0,senderID,receiverID,msgType,additionalInfo);
        if(delay <= 0.0){
          console.log("Telegram dispatched at time:"+(World.getInstance().getCurTime()/1000.0).toFixed(2) +"s")
          this.discharge(rec, telegram);
        }else{
          var curTime = World.getInstance().getCurTime();
          telegram.dispatchTime = curTime + delay;
          MessageQ.push(telegram);
        }
      },
      dispatchDelayedMessages: function(){
        var curTime = World.getInstance().getCurTime();
        var f =  MessageQ.first();
        //send message
        while(!MessageQ.isEmpty() && 
          MessageQ.first().dispatchTime < curTime ){
          var tg = MessageQ.first();
          var receiver = EntityManager.getInstance().getEntityFromID(tg.receiver);
          if(receiver !== null){
            //立即发送消息
            this.discharge(receiver, tg);
          }else{
            console.log("Warning: receiver not found. message drop..");
          }
          MessageQ.pop();
        }
      }
      /////////////////////////////////////
    }
  }
  return {
    getInstance: function(){
      if(!instantiated){
        instantiated = init();
      }
      return instantiated;
    }
  };
})();
