/**
 * SpaceShip owned States
 * Singleton
 */
// StandingBy, Working, Stop, Destroy
var SpaceshipStandingBy = (function(){
  var instantiated;
  function init(){
    return {
      Enter: function(owner){
        
      },
      Execute: function(owner, deltaTime){
        console.log(owner.toString() + "is StandingBy.");
      },
      Exit: function(owner){

      },
      OnMessage: function(owner, telegramMsg){

      },
      toString: function(){
        return "StandingBy";
      }
    }
  }
  return {
    getInstance: function(){
      if(!instantiated){
        instantiated = init();
      }
      return instantiated;
    }
  };
})();
var SpaceshipWorking = (function(){
  var instantiated;
  function init(){
    return {
      enter: function(owner){
        
      },
      execute: function(owner, deltaTime){
        owner.addEnergy(deltaTime);
        owner.useEnergy(deltaTime);
        owner.run(deltaTime);
        if(owner.isEnergyEmpty()){
          owner.changeState(SpaceshipStop.getInstance());
        }
      },
      exit: function(owner){

      },
      onMessage: function(owner, telegramMsg){
        if(telegramMsg !==null && telegramMsg.extraInfo !== null){
          // if(owner.id == telegramMsg.extraInfo.id){
            if(owner.id == telegramMsg.extraInfo.id){
            switch(telegramMsg.extraInfo.command){
              case 'stop': 
                owner.changeState(SpaceshipStop.getInstance());
                break;
              case 'work':
                break;
              case 'destroy':
                owner.changeState(SpaceshipDestroy.getInstance());
                break;
            }
          }
        }else{
          console.log("Warning: message Error");
        }
      },
      toString: function(){
        return "Working";
      }
    }
  }
  return {
    getInstance: function(){
      if(!instantiated){
        instantiated = init();
      }
      return instantiated;
    }
  };
})();

var SpaceshipStop = (function(){
  var instantiated;
  function init(){
    return {
      enter: function(owner){
        
      },
      execute: function(owner, deltaTime){
        //console.log(owner.toString());
        if(owner.isEnergyFull()){

          //owner.changeState(SpaceshipWorking.getInstance());
        }else{
          //console.log(Owner.toString());
          owner.addEnergy(deltaTime);
          //console.log(Owner.toString());
        }
        //console.log(deltaTime);
      },
      exit: function(owner){

      },
      onMessage: function(owner, telegramMsg){
        if(telegramMsg !==null && telegramMsg.extraInfo !== null){
          if(owner.id == telegramMsg.extraInfo.id){
            switch(telegramMsg.extraInfo.command){
              case 'stop': 
                break;
              case 'work':
                owner.changeState(SpaceshipWorking.getInstance());
                break;
              case 'destroy':
                owner.changeState(SpaceshipDestroy.getInstance());
                break;
            }
          }
        }else{
          console.log("Warning: message Error");
        }
      },
      toString: function(){
        return "Stop";
      }
    }
  }
  return {
    getInstance: function(){
      if(!instantiated){
        instantiated = init();
      }
      return instantiated;
    }
  };
})();


var SpaceshipDestroy = (function(){
  var instantiated;
  function init(){
    return {
      enter: function(owner){
        var obj1 = World.getInstance().removeSpaceship(owner);
        var obj2 = EntityManager.getInstance().removeEntity(owner);
        if(obj1 === null){
          console.log("Warning: cannot remove Spaceship["+owner.id+"] in World.");
          return;
        }
        if(!obj2){
          console.log("Warning: cannot remove Entity["+owner.id+"] in EntityManager.");
          return;
        }
        console.log(obj1);
        console.log(obj2);
      },
      execute: function(owner, deltaTime){
        
      },
      exit: function(owner){

      },
      onMessage: function(owner, telegramMsg){},
      toString: function(){
        return "State: SpaceshipDestroy";
      }
    }
  }
  return {
    getInstance: function(){
      if(!instantiated){
        instantiated = init();
      }
      return instantiated;
    }
  };
})();

