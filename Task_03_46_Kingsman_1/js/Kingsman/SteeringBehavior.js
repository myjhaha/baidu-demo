

function SteeringBehavior(world,agent){
  var m_iFlags = BehaviorType.arrive;
  var m_vTarget = null;
  var m_pWorld = world;
  var m_pOwner = agent;
  var m_vSteeringForce = new Vector2D(0,0);

  var m_pTargetAgent1 = null;
  var m_pTargetAgent2 = null;
  var m_pPath = null;

  var m_dWeightSeek = Prm.SeekWeight;
  var m_dWeightFlee = Prm.FleeWeight;
  var m_dWeightArrive = Prm.ArriveWeight;
  var m_dWeightFollow = Prm.FollowWeight;
  var m_dWaypointSeekDistSq = Prm.WaypointSeekDistSq;//WaypointSeekDistSq

  ////////////////////////////////////////////////////////////////
  function accunulateForce(runningTot, forceToAdd){
    var magnitudeSoFar = runningTot.getLength();
    var agnitudeRemaining = m_pOwner.getMaxForce() - magnitudeSoFar;
    if(agnitudeRemaining <= 0.0){
      return false;
    }
    var magnitudeToAdd = forceToAdd.getLength();
    if (magnitudeToAdd < agnitudeRemaining){
      //runningTot.addWithAssign(forceToAdd);
      runningTot.x += forceToAdd.x;
      runningTot.y += forceToAdd.y;
    }else{
      var len = forceToAdd.getLength();
      runningTot.x += (forceToAdd.x / len * agnitudeRemaining);
      runningTot.y += (forceToAdd.y / len * agnitudeRemaining);
    }
    return true;
  }
  function accunulateForce2(runningTot, forceToAdd){
    var tmpx = runningTot.x + forceToAdd.x;
    var tmpy = runningTot.y + forceToAdd.y;
    var len = Math.sqrt(tmpx*tmpx + tmpy*tmpy);
    var maxForce = m_pOwner.getMaxForce();
    if(len <= maxForce){
      runningTot.addWithAssign(forceToAdd);
      return true;
    }else{
      return false;
    }
  }
  function seek(vTarget){
    if(!vTarget){return new Vector2D(0,0)};
    var pos = m_pOwner.getPos();
    var v = m_pOwner.getVelocity();
    //var DesiredVelocity = new Vector2D(pos.x - vTarget.x, pos.y - vTarget.y);
    var DesiredVelocity = new Vector2D(vTarget.x - pos.x, vTarget.y - pos.y);
    DesiredVelocity.normalize();
    DesiredVelocity.scalarWithAssign(m_pOwner.getMaxSpeed());
    DesiredVelocity.x -= (v.x);
    DesiredVelocity.y -= (v.y);
    return DesiredVelocity;
  }
  function arrive(vTarget,deceleration){
    if(!vTarget){return new Vector2D(0,0)};
    var pos = m_pOwner.getPos();
    var v = m_pOwner.getVelocity();
    var toTarget = new Vector2D(vTarget.x-pos.x, vTarget.y-pos.y);
    var dist = toTarget.getLength();
    if(dist > 0){
      var DecelerationTweaker = 0.3;
      var speed =  dist / (deceleration * DecelerationTweaker);
      speed = (speed < m_pOwner.m_dMaxSpeed) ? speed : m_pOwner.m_dMaxSpeed;
      toTarget.scalarWithAssign(speed / dist);
      toTarget.subWithAssign(v);
      //console.log(toTarget.getLength());
      return toTarget;
    }
    return new Vector2D(0,0);
  };
  function followPath(path){
    if(m_pPath.isEnd()) 
      return arrive(m_vTarget,1);
    if( Vec2DDistanceSq(m_pOwner.getPos(), m_pPath.getCurrentPoint()) < m_dWaypointSeekDistSq){
      m_pPath.setNextPoint();
    }
    if(!m_pPath.isLast()){
      return seek(m_pPath.getCurrentPoint());
      //return arrive(m_pPath.getCurrentPoint(),1);
    }else{
      return arrive(m_pPath.getCurrentPoint(),1);
    }
  }
  //////////////////////////////////////////////

  this.on = function( bt){
    return ((m_iFlags & bt) == bt);
  };
  this.setTarget = function(x,y){
    if((typeof(x) == "object")){
      m_vTarget = x;
      return;
    }
    if(m_vTarget){
      m_vTarget.x = x;
      m_vTarget.y = y;
    }else{
      m_vTarget = new Vector2D(x,y);
    }
  };
  this.getTarget = function(){
    return m_vTarget;
  };
  this.setPath = function(path){
    m_pPath = path;
  };
  this.getPath = function(){
    return m_pPath;
  };
  this.addPointToPath = function(p){
    if(!m_pPath){
      m_pPath = [];
    }
    m_pPath.push(p);
  };
  this.allOff = function(){
    m_iFlags = 0x00000;
  };
  this.seekOn = function(){
    m_iFlags |= BehaviorType.seek;
  };
  this.seekOff = function(){
    m_iFlags ^= BehaviorType.seek;
  };
  this.arriveOn = function(){
    m_iFlags |= BehaviorType.arrive;
  };
  this.arriveOff = function(){
    m_iFlags ^= BehaviorType.arrive;
  };
  this.followPathOn = function(){
    m_iFlags |= BehaviorType.follow_path;
  };
  this.followPathOff = function(){
    m_iFlags ^= BehaviorType.follow_path;
  };
  this.calculate = function(){
    m_vSteeringForce.zero();
    //console.log("m_iFlags:"+m_iFlags);
    if( this.on(BehaviorType.seek)){
      if( !accunulateForce(m_vSteeringForce,seek(m_vTarget).scalarWithAssign(m_dWeightSeek)) ){
        return m_vSteeringForce;
      }
    }
    if( this.on(BehaviorType.arrive)){
      if(!accunulateForce(m_vSteeringForce,arrive(m_vTarget,1).scalarWithAssign(m_dWeightArrive)) ){
        return m_vSteeringForce;
      }
    }
    if( this.on(BehaviorType.follow_path)){
      if(!accunulateForce(m_vSteeringForce,followPath(m_pPath).scalarWithAssign(m_dWeightFollow)) ){
        return m_vSteeringForce;
      }
    }
    return m_vSteeringForce;
  };
}
