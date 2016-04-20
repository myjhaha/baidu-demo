var MessageType = {
  MSG_BOARDCAS_TO_SPACESHIP: 1,
  MSG_SEND_TO_SPACESHIP: 2,
  MSG_RETRANSMIT_TO_SPACESHIP: 3,
  MSG_SPACESHIP_HEARTBEAT: 4,
  MSG_RETRANSMIT_TO_PLANET: 5
}
/** commander 消息例子
{
  sender: (id);
  receiver: (id));
  msgType: (msgType);
  dispatchTime: (time);
  extraInfo:{
    id: (飞船id),
    command: 'stop'|'work'|'destroy'
  }
}
**/

/** planet 消息例子
{
  sender: (id);
  receiver: (id));
  msgType: (msgType);
  dispatchTime: (time);
  extraInfo:{
    id: (飞船id),
    state: 'stop'|'work'|'destroy',
    curOil: xx
  }
}
**/