
var MovingEntity = jClass(BaseGameEntity,{
  init:function(vPos,r,vVelocity,maxSpeed,vheading,vScale,mass,maxTurnRate,maxForce){
    this.base(vPos,r);
    this.m_vVelocity = new Vector2D(vVelocity.x,vVelocity.y);
    this.m_dMaxSpeed = maxSpeed;
    this.m_vHeading = new Vector2D(vheading.x, vheading.y);
    this.m_vSide = vheading.perp();
    this.m_vScale = new Vector2D(vScale.x, vScale.y);
    this.m_dMass = mass;
    this.m_dMaxTurnRate = maxTurnRate;
    this.m_dMaxForce = maxForce;
  },
  getMass: function(){return this.m_dMass},
  setMass: function(mass){ this.m_dMass = mass},
  setVelocity: function(velocity){
    this.m_vVelocity = velocity;
  },
  getVelocity: function(){
    return this.m_vVelocity;
  },
  getSpeed: function(){
    return this.m_vVelocity.getLength();
  },
  getSpeedSq: function(){
    return this.m_vVelocity.getLengthSq();
  },
  getMaxSpeed: function(){
    return this.m_dMaxSpeed;
  },
  setMaxSpeed: function(mSpeed){
    this.m_dMaxSpeed = mSpeed;
  },
  getScale: function(){
    return this.m_vScale;
  },
  setScale: function(scale){
    this.m_vScale = scale;
  },
  getMaxForce: function(){
    return this.m_dMaxForce;
  },
  setMaxForce: function(mForce){
    this.m_dMaxForce = mForce;
  },
  isSpeedMaxedOut:function(){
    return this.m_dMaxSpeed*this.m_dMaxSpeed >= this.m_vVelocity.getLengthSq();
  },
  getHeading: function(){
    return this.m_vHeading;
  },
  SetHeading: function(new_heading){
    this.m_vHeading.x = new_heading.x;
    this.m_vHeading.y = new_heading.y;
  },
  toString: function(){
    var str = "MovingEntity { id:" + this.id + ", " +
                 "pos:" + this.m_vPosition.toString() + ", " +
                 "r:" + this.m_dBoundingRadius + ", " +
                 "Heading:" + this.m_vHeading.toString() +", " +
                 "Velocity:" + this.m_vVelocity.toString() + ", " +
                 "Scale:" + this.m_vScale.toString() +", " +
                 "maxSpeed:" + this.m_dMaxSpeed +", " +
                 "maxForce:" + this.m_dMaxForce +", " +
                 "mass:" + this.m_dMass +", " +
                 "turnRate:" + this.m_dMaxTurnRate + "}";
    return str;
  }
});
