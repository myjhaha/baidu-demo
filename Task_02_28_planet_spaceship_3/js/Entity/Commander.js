function Commander(id){
  var _spaceshipIDs = [];
  this.id = id;
  this.m_planet = null;
  // function saveMsg( telegram){
  //   World.getInstance().getPlanet()
  // }
  this.setPlanet = function(planet){
    this.m_planet = planet;
  }
  this.launchSpaceship = function(name, powType, ergType, orbitId){
    var t = SpaceshipFactory.createSpaceshipToWorld(name, powType, ergType, orbitId);
    if(this.m_planet){
      var id = t.id;
      var shipId = t.shipId;
      var name = t.m_name;
      var ergName = t.m_energySystem.m_name;
      var powName = t.m_powerSystem.m_name;
      var state = t.m_stateMachine.m_currentState.toString();
      var curOil = t.m_currentOil;
      var obj = {id:id,shipId:shipId,name:name,ergName:ergName,powName:powName,state:state,curOil:curOil};
      this.m_planet.getDataCenter().pushMessage(obj);
      this.m_planet.getDataCenter().updateStateTable();
    }else{
      console.warn("Warning: commander must have a planet.")
    }
    return t;
  }
  // this.sendCommand2 = function (_receiverId, _command){
  //   var msgObj = {id:_receiverId,command:_command};
  //   var mediator = World.getInstance().getMediator();
  //   MessageDispatcher.getInstance().dispatchMsg(100.0,this.id,mediator.id,3,msgObj);
  // }
  this.sendCommand = function (_receiverId, _command){
    if(this.m_planet == null){
      throw new Error("Error: commander's planet cannot be null.");
    }else{
      //this.m_planet.getMessageSender().sendMsg(this.id,_receiverId,_command);
      var ship = EntityManager.getInstance().getEntityFromID(_receiverId);
      console.log("指挥官 向["+ship.m_name+"("+ship.shipId+")] 发送命令:" + _command);
      this.m_planet.sendCommand(this.id,_receiverId,_command);
    }
  }
  this.handleMessage = function(telegram){

  }
}
