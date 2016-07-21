//一些基本类
function Vector2D(x,y){
  this.x = x;
  this.y = y;
}

Vector2D.prototype.zero = function(){
  this.x =0;
  this.y =0;
};
Vector2D.prototype.isZero = function(){
  return (this.x*this.x + this.y*this.y) < MinDouble;
};
Vector2D.prototype.getLength = function(){
  return Math.sqrt(this.x*this.x + this.y*this.y);
};
Vector2D.prototype.getLengthSq = function(){
  return this.x*this.x + this.y*this.y;
};
Vector2D.prototype.normalize = function(){
  var vector_length = this.getLength();
  if(vector_length > MinDouble){
    this.x /= vector_length;
    this.y /= vector_length;
  }
  return this;
};
Vector2D.prototype.dot = function(v2){ //点乘
  return this.x*v2.x + this.y*v2.y;
};
Vector2D.prototype.sign = function(v2){ // 方向 v2在本向量的正时钟方向则返回1，反时钟则返回-1
  if (this.y*v2.x > this.x*v2.y){ 
    return anticlockwise;
  }
  else {
    return clockwise;
  }
};
Vector2D.prototype.distance = function(v2){ //距离
  var ySeparation = v2.y - this.y;
  var xSeparation = v2.x - this.x;
  return Math.sqrt(ySeparation*ySeparation + xSeparation*xSeparation);
};
Vector2D.prototype.distanceSq = function(v2){ //距离的平方
  var ySeparation = v2.y - this.y;
  var xSeparation = v2.x - this.x;
  return ySeparation*ySeparation + xSeparation*xSeparation;
};
Vector2D.prototype.perp = function(){ //垂直，逆时钟方向那个
  return new Vector2D(-this.y, this.x);
};
Vector2D.prototype.GetReverse = function(){  //相反
  return new Vector2D(-this.x, -this.y);
};
Vector2D.prototype.truncate = function(max){
  if (this.getLengthSq() > max*max){
    this.normalize();
    this.x *= max;
    this.y *= max;
  } 
};
Vector2D.prototype.scalar = function(s){
  return new Vector2D(this.x*s, this.y*s);
};
Vector2D.prototype.scalarWithAssign = function(s){
  this.x *= s;
  this.y *= s;
  return this;
};
Vector2D.prototype.div = function(s){
  return new Vector2D(this.x/s, this.y/s);
};
Vector2D.prototype.divWithAssign = function(s){
  this.x /= s;
  this.y /= s;
  return this;
};

Vector2D.prototype.add = function(v2){
  return new Vector2D(this.x+v2.x, this.y*v2.y);
};
Vector2D.prototype.addWithAssign = function(v2){
  this.x += v2.x;
  this.y += v2.y;
  return this;
};
Vector2D.prototype.reflect = function(norV2){ //镜像
  var d = this.dot(norV2);
  //this.x += (2.0*d*(-v2.x));
  //this.y += (2.0*d*(-v2.y));
  return new Vector2D(this.x+(2.0*d*(-v2.x)), this.y+(2.0*d*(-v2.y)))
};
Vector2D.prototype.reflectWithAssign = function(norV2){ //镜像
  var d = this.dot(norV2);
  this.x += (2.0*d*(-v2.x));
  this.y += (2.0*d*(-v2.y));
  return this;
};
Vector2D.prototype.sub = function(v2){
   return new Vector2D(this.x-v2.x, this.y-v2.y);
};
Vector2D.prototype.subWithAssign = function(v2){
  this.x -= v2.x;
  this.y -= v2.y;
  return this;
};
Vector2D.prototype.toString =function(){
  return "Vector2D("+this.x.toFixed(2)+","+this.y.toFixed(2)+")";
};
Vector2D.prototype.clone = function(){
  return new Vector2D(this.x, this.y);
}

