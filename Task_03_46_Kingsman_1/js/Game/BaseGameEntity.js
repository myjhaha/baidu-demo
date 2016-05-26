var _nextGameEntityID = 0;

var getNextID = function(){
  console.log("Global:getNextID()");
  return _nextGameEntityID++;
}


// 声明一个类
var BaseGameEntity = jClass({
  getNextID: function(){
    console.log("BaseGameEntity:getNextID()");
    return _nextGameEntityID++;
  },
  init: function(vPos,r){ //自动执行的
    this.id = getNextID();
    this.m_vPosition = new Vector2D(vPos.x,vPos.y);
    this.m_dBoundingRadius = r;
  },
  getId: function(){
    return this.id;
  },
  setPos: function(x,y){
    this.m_vPosition.x = x;
    this.m_vPosition.y = y;
  },
  getPos: function(){
    return this.m_vPosition;
  },
  getPosArr: function(){
    return [this.m_vPosition.x, this.m_vPosition.y];
  },
  setBRadius: function(br){
    this.m_dBoundingRadius = br;
  },
  getBRadius: function(){
    return this.m_dBoundingRadius;
  },
  toString: function(){
    return "BaseGameEntity {id:"+ this.id +", pos:"+this.m_vPosition.toString()+ ", r:" + this.m_dBoundingRadius +"}";
  }
});

