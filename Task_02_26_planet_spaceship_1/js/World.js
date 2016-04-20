/**
 * 世界
 */

var World = (function(){
  var instantiated;
  function init(){
    var m_commander = CommanderFactory.createCommander();
    var m_transmitter = null;
    var m_planets = [];
    var m_orbits = [];
    var m_spaceships = [];
    var m_RuningTime = 0;
    var m_singleMediator = null;

    var obj =  {
      setSingleMediator :function(mediator){
        m_singleMediator = mediator;
      },
      getSingleMediator: function(){
        return m_singleMediator;
      },
      setCommander: function(commander){
        m_commander = commander;
      },
      getCommander: function(){
        return m_commander;
      },
      getPlanetById: function (id){
        for (var i = m_planets.length - 1; i >= 0; i--) {
          if(m_planets[i].id == id)
            return m_planets[i];
        };
        return null;
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
      getAllPlanetsId: function(){
        var a =[];
        for(var i =0;i<m_planets.length;i++)
          a.push(m_planets[i].id);
        return a;
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
      pushPlanet: function(planet){
        m_planets.push(planet);
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
      removePlanet:function(planet){
        for (var i = m_planets.length - 1; i >= 0; i--) {
          if(m_planets[i] == planet){
            var obsj = m_planets.splice(i,1);
            return objs[0];
          }
        };
      },
      getCurTime: function(){
        return m_RuningTime;
      },
      draw: function(){
        //console.log("WORLD draw..");
        for (var i = m_planets.length - 1; i >= 0; i--) {
          m_planets[i].draw();
        };
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