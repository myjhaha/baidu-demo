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
  this.m_messageSender = new BinaryMsgSender();
  this.m_dataCenter = new DataCenter();

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
Planet.prototype.setMessageSender = function(msgSender){
  this.m_messageSender = msgSender;
}
Planet.prototype.setDataCenter = function(dc){
  this.m_dataCenter = dc;
}
Planet.prototype.setMessageReceiver = function(msgR){
  this.m_transmitter = trans;
}
Planet.prototype.sendCommand = function(from,to,_command){
  this.m_messageSender.sendCommand(from,to,_command);
}
Planet.prototype.handleMessage = function(telegram){
  console.log(telegram);
}