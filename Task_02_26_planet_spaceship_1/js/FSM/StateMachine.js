/**
 * State interface
 */
function State(){
}
State.prototype.execute = function(Owner){
   throw new Error("该方法必须被重载!");
}
State.prototype.exit = function(Owner){
   throw new Error("该方法必须被重载!");
}
State.prototype.enter = function(Owner){
   throw new Error("该方法必须被重载!");
}
/**
 * StateMachine
 */
function StateMachine(owner){
  //console.log("||||"+owner);
  this.m_owner = owner;
  this.m_currentState = null;
  this.m_previousState = null;
  this.m_globalState = null;
}
StateMachine.prototype.setCurrentState = function(s){
  this.m_currentState = s;
}
StateMachine.prototype.setPreviousState = function(s){
  this.m_previousState = s;
}
StateMachine.prototype.setGlobalState = function(s){
  this.m_globalState = s;
}
StateMachine.prototype.update = function(deltaTime){
  if(this.m_globalState !== null){
    this.m_globalState.execute(this.m_owner,deltaTime);
  }
  if(this.m_currentState !== null){
    this.m_currentState.execute(this.m_owner,deltaTime);
  }
  //console.log(deltaTime);
}
StateMachine.prototype.handleMessage = function(tgMsg){
  if(this.m_currentState && this.m_currentState.onMessage(this.m_owner, tgMsg)){
    return true;
  }
  if(this.m_globalState && this.m_globalState.onMessage(this.m_owner, tgMsg)){
    return true;
  }
  return false;
}
StateMachine.prototype.changeState = function(newState){
  console.log(this.m_owner.toString()+" ChangeState["+ this.m_currentState +"] to [" + newState + "]");
  this.m_previousState = this.m_currentState;
  this.m_currentState.exit(this.m_owner);
  this.m_currentState = newState;
  this.m_currentState.enter(this.m_owner, newState);
}
StateMachine.prototype.revertToPreviousState = function(){
  console.log("something.......");
  this.changeState(this.m_previousState);
}
//statemachine end...

