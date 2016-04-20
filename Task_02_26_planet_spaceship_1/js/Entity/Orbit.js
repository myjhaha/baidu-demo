/**
 * 轨道实体
 * 参数: 唯一id, 坐标, 半径
 */
function Orbit(id, x, y, r){
  this.x = x;
  this.y = y;
  this.id = id;
  this.r = r;
  this.m_name = "";
}

Orbit.prototype.setName = function(str){
  this.m_name = str;
}
Orbit.prototype.getName = function(){
  return this.m_name;
}
//方法：绘制轨道（自己）
Orbit.prototype.draw = function() {
  context.beginPath();
  context.strokeStyle = greenColor;
  context.lineWidth=0.8;
  context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
  context.closePath();
  context.stroke();
  context.fillStyle = yellowColor;
  context.fillText("" + this.m_name, this.x-this.r*0.7071, this.y-this.r*0.7071);
}
Orbit.prototype.toString = function(){
  return ("Orbit [  id:" + this.id + ", "+ 
                    "R:" + this.r + ", " +
                    "X:" + this.x +", " +
                    "Y:" + this.y +"]" );
}
