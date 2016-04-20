/**
 * 世界
 */

var World = (function(){
  var instantiated;
  function init(){
    var m_commander = null;// CommanderFactory.createCommander();
    var m_planet = null;
    var m_orbits = [];
    var m_spaceships = [];
    var m_RuningTime = 0;
    var m_mediator = MediatorFactory.createMediator("BUS");

    var obj =  {
      setMediator :function(mediator){
        m_mediator = mediator;
      },
      getMediator: function(){
        return m_mediator;
      },
      setCommander: function(commander){
        m_commander = commander;
      },
      getCommander: function(){
        return m_commander;
      },
      getPlanet: function (id){
        return m_planet;
      },  
      getOrbitById: function(id){
        for (var i = m_orbits.length - 1; i >= 0; i--) {
          if(m_orbits[i].id == id)
            return m_orbits[i];
        };
        return null;
      },
      getSpaceshipById: function(id){
        for (var i = m_spaceships.length - 1; i >= 0; i--) {
          if(m_spaceships[i].id == id)
            return m_spaceships[i];
        };
        return null;
      },
      getPlanetId: function(){
        if(m_planet)
          return m_planet.id;
        else
          return null;
      },
      getAllOrbitsId: function(){
        var a =[];
        for(var i =0;i<m_orbits.length;i++)
          a.push(m_orbits[i].id);
        return a;
      },
      getSpaceshipsByName: function(name){
        var arr = [];
        for (var i = m_spaceships.length - 1; i >= 0; i--) {
          if(m_spaceships[i].m_name == name){
            arr.push(m_spaceships[i]);
          }
        };
        return arr;
      },
      getAllSpaceshipsId: function(){
        var a =[];
        for(var i =0;i<m_spaceships.length;i++)
          a.push(m_spaceships[i].id);
        return a;
      },
      getAllSpaceship: function(){
        return m_spaceships;
      },
      setPlanet: function(planet){
        m_planet = planet;
      },
      pushOrbit: function (orbit){
        m_orbits.push(orbit);
      },
      pushSpaceship: function (ship){
        m_spaceships.push(ship);
      },
      removeSpaceship:function(ship){
        for (var i = m_spaceships.length - 1; i >= 0; i--) {
          if(m_spaceships[i] == ship){
            var objs = m_spaceships.splice(i,1);
            return objs[0];
          }
        };
        return null;
      },
      removeOrbit: function(orbit){
        for (var i = m_orbits.length - 1; i >= 0; i--) {
          if(m_orbits[i] == orbit){
            var obsj = m_orbits.splice(i,1);
            return objs[0];
          }
        };
      },
      getCurTime: function(){
        return m_RuningTime;
      },
      draw: function(){
        //console.log("WORLD draw..");
        m_planet.draw();
        for (var i = m_orbits.length - 1; i >= 0; i--) {
          m_orbits[i].draw();
        };
        for (var i = m_spaceships.length - 1; i >= 0; i--) {
          m_spaceships[i].draw();
        };
      },
      update: function(deltaTime){
        m_RuningTime += deltaTime;
        for (var i = m_spaceships.length - 1; i >= 0; i--) {
          m_spaceships[i].update(deltaTime);
        };
        m_planet.update(deltaTime);
      }
    };
    return obj;
  }
  return {
    getInstance : function(){
      if(!instantiated){
        instantiated = init();
      }
      return instantiated;
    }
  };
})(); 