var _nextID = 0;
var _nextSpaceshipID = 0;

var SpaceshipFactory = {
  
  createSpaceship: function(powType,ergType){
    var t = new Spaceship(_nextID++,_nextSpaceshipID++);
    t.init();
    var p = PowerSystemFactory.createPowerSystem(powType);
    var e = EnergySystemFactory.createEnergySystem(ergType);
    if(p ==null){
      throw new Error("Error: PowerSystem null. create type:" + powType);
    }
    if(e ==null){
      throw new Error("Error: EnergySystem null. create type:" + ergType);
    }
    t.setPowerSystem(p);
    t.setEnergySystem(e);
    EntityManager.getInstance().registerEntity(t);
    return t;
  }, 
  createSpaceshipToWorld: function(name, powType, ergType, orbitId){
    var s = SpaceshipFactory.createSpaceship(powType,ergType);
    var o = EntityManager.getInstance().getEntityFromID(orbitId);
    if(o == null){
      throw new Error("Orbit cannot be found.");
    }
    s.setOrbit(o);
    s.setName(name);
    World.getInstance().pushSpaceship(s);
    return s;
  }
};

var PlanetFactory = {
  createPlanet: function(x,y,r){
    var t = new Planet(_nextID++,x,y,r);
    EntityManager.getInstance().registerEntity(t);
    return t;
  },
  createPlanetToWorld: function(x,y,r){
    var t = new Planet(_nextID++,x,y,r);
    EntityManager.getInstance().registerEntity(t);
    World.getInstance().pushPlanet(t);
    return t;
  }

};

var OrbitFactory = {
  createOrbit: function(x,y,r){
    var t = new Orbit(_nextID++,x,y,r);
    EntityManager.getInstance().registerEntity(t);
    return t;
  }
};

var CommanderFactory = {
  createCommander: function(){
    var t = new Commander(_nextID++);
    EntityManager.getInstance().registerEntity(t);
    return t;
  }
};

var PowerSystemFactory = {
  createPowerSystem: function(powerSysType){
    switch (powerSysType){
      case 1:
        return new PowerSystem("前进号",200,5);
      case 2:
        return new PowerSystem("奔腾号",400,7);
      case 3:
        return new PowerSystem("超越号",800,9);
      case 4:
        return new PowerSystem("光束号",1600,10);
      default:
        return null;
    }
  }
}
var EnergySystemFactory = {
  createEnergySystem: function(ergSysType){
    switch (ergSysType){
      case 1:
        return new EnergySystem("劲量型",2);
      case 2:
        return new EnergySystem("光能型",3);
      case 3:
        return new EnergySystem("永久型",5);
      default:
        return null;
    }
  }
}

var MediatorFactory = {
  createMediator: function(mType){
    switch(mType){
      case "Mediator":
        var t = new NormalMediator(-1);
        //EntityManager.getInstance().registerEntity(t);
        return t;
      case "BUS":
        var t = new BUSMediator(-1);
        //EntityManager.getInstance().registerEntity(t);
        return t;
      default:
        return null;
    }
   
  }
}


