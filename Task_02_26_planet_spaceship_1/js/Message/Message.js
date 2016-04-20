var MessageType={
  Msg_json: 1,
  Msg_binary: 2,
  Msg_test: 3
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