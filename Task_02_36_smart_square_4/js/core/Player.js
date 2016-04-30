function Player(x,y){
  this.x = x;
  this.y = y;
  this.direction = 0;
  this.setDirection = function(direction){
    this.direction = direction;
  }
  this.getDirection = function(){
    return this.direction ;
  }
  this.turnRight = function(){
    this.direction = ((this.direction +1)%4);
  }
  this.turnLeft = function(){
    this.direction = ((this.direction +3)%4);
  }
  this.turnBack = function(){
    this.direction = ((this.direction +2)%4);
  }
  this.setPos = function(x,y){
    this.x = x;
    this.y = y;
  }
}