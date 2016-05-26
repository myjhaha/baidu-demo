//一些基本类
function Vector2D(x,y){
  this.x = x;
  this.y = y;
  this.zero = function(){
    this.x =0;
    this.y =0;
  };
  this.isZero = function(){
    return (this.x*this.x + this.y*this.y) < MinDouble;
  };
  this.getLength = function(){
    return Math.sqrt(this.x*this.x + this.y*this.y);
  };
  this.getLengthSq = function(){
    return this.x*this.x + this.y*this.y;
  };
  this.normalize = function(){
    var vector_length = this.getLength();
    if(vector_length > MinDouble){
      this.x /= vector_length;
      this.y /= vector_length;
    }
    return this;
  };
  this.dot = function(v2){ //点乘
    return this.x*v2.x + this.y*v2.y;
  };
  this.sign = function(v2){ // 方向 v2在本向量的正时钟方向则返回1，反时钟则返回-1
    if (this.y*v2.x > this.x*v2.y){ 
      return anticlockwise;
    }
    else {
      return clockwise;
    }
  };
  this.distance = function(v2){ //距离
    var ySeparation = v2.y - this.y;
    var xSeparation = v2.x - this.x;
    return Math.sqrt(ySeparation*ySeparation + xSeparation*xSeparation);
  };
  this.distanceSq = function(v2){ //距离的平方
    var ySeparation = v2.y - this.y;
    var xSeparation = v2.x - this.x;
    return ySeparation*ySeparation + xSeparation*xSeparation;
  };
  this.perp = function(){ //垂直，逆时钟方向那个
    return new Vector2D(-this.y, this.x);
  };
  this.GetReverse = function(){  //相反
    return new Vector2D(-this.x, -this.y);
  };
  this.truncate = function(max){
    if (this.getLengthSq() > max*max){
      this.normalize();
      this.x *= max;
      this.y *= max;
    } 
  };
  this.scalar = function(s){
    return new Vector2D(this.x*s, this.y*s);
  };
  this.scalarWithAssign = function(s){
    this.x *= s;
    this.y *= s;
    return this;
  };
  this.div = function(s){
    return new Vector2D(this.x/s, this.y/s);
  };
  this.divWithAssign = function(s){
    this.x /= s;
    this.y /= s;
    return this;
  };

  this.add = function(v2){
    return new Vector2D(this.x+v2.x, this.y*v2.y);
  };
  this.addWithAssign = function(v2){
    this.x += v2.x;
    this.y += v2.y;
    return this;
  };
  this.reflect = function(norV2){ //镜像
    var d = this.dot(norV2);
    //this.x += (2.0*d*(-v2.x));
    //this.y += (2.0*d*(-v2.y));
    return new Vector2D(this.x+(2.0*d*(-v2.x)), this.y+(2.0*d*(-v2.y)))
  };
  this.reflectWithAssign = function(norV2){ //镜像
    var d = this.dot(norV2);
    this.x += (2.0*d*(-v2.x));
    this.y += (2.0*d*(-v2.y));
    return this;
  };
  this.sub = function(v2){
     return new Vector2D(this.x-v2.x, this.y-v2.y);
  };
  this.subWithAssign = function(v2){
    this.x -= v2.x;
    this.y -= v2.y;
    return this;
  };
  this.toString =function(){
    return "Vector2D("+this.x.toFixed(2)+","+this.y.toFixed(2)+")";
  };
  this.clone = function(){
    return new Vector2D(this.x, this.y);
  }
}

// return new vector2D
function Vec2DNormalize(v){
  var c = v.clone();
  c.normalize();
  return c;
}
function Vec2DDistanceSq(v1,v2){
  var dx = v2.x-v1.x ,
      dy = v2.y-v1.y ;
  return dx*dx + dy*dy;
}
function Vec2DDistance(v1,v2){
  var dx = v2.x-v1.x ,
      dy = v2.y-v1.y ;
  return Math.sqrt(dx*dx + dy*dy);
}