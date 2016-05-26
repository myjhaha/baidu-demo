/**
 * 世界
 */

var World = (function(){
  var instantiated;
  function init(){
    var curTarget = null;
    var m_Player = null;
    var path = new Path(9,50,50,500,500,true);
    var bots =[];
    function renderCurrentTarget(){
      if(curTarget){
        context.strokeStyle='#000';
        context.lineWidth=1;
        context.beginPath();
        context.moveTo(curTarget.x-8,curTarget.y);
        context.lineTo(curTarget.x+8,curTarget.y);
        context.moveTo(curTarget.x,curTarget.y-8);
        context.lineTo(curTarget.x,curTarget.y+8);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.arc(curTarget.x,curTarget.y,5,0,Math.PI*2,true);  
        context.closePath();
        context.stroke();
      }
    }
    function renderPlayerInfo(){
     if(m_Player){
        context.fillStyle = "#000";
        context.fillText("player速度:"+m_Player.getVelocity().getLength().toFixed(2),
                            10,50);
        context.fillText("player受力:"+m_Player.m_vForce.getLength().toFixed(2), 
                            10,70);
        context.strokeStyle='#000';
        context.lineWidth=1;
        context.beginPath();
        context.moveTo(m_Player.getPos().x,m_Player.getPos().y);
        context.lineTo( m_Player.getPos().x +m_Player.m_vForce.x ,
                        m_Player.getPos().y +m_Player.m_vForce.y  );
        context.closePath();
        context.stroke();
      }
    }

    var obj =  {
      init:function(){
        m_Player = new Vehicle( World,                //world
                            new Vector2D(50,50),  //vPos
                            Prm.BotBeginRotation,         //rotation
                            Prm.BotBeginVelocity,   //vVelocity
                            Prm.BotMass,          //mass
                            Prm.BotMaxSpeed,       //max_speed
                            Prm.BotMaxForce,      //max_force
                            Prm.BotMaxTurnRate,      //max_turn_rate
                            Prm.BotScale  );                //scale
        
        m_Player.m_pPath = World.getPath();
        m_Player.getSteering().arriveOn();
      },
      update: function(deltaTime){
        if(m_Player){
          m_Player.update(deltaTime);
        }
        for (var i = bots.length - 1; i >= 0; i--) {
          bots[i].update(deltaTime);
        };
      },
      render: function(){
        renderCurrentTarget();
        renderPlayerInfo();
        if(m_Player){
          m_Player.render();
        }
        for (var i = bots.length - 1; i >= 0; i--) {
          bots[i].render();
        };
        path.render();
      },
      addBot: function(b){
        bots.push(b);
      },
      setCurrentTarget: function(x,y){
        if(curTarget){
          curTarget.x = x;
          curTarget.y = y;
        }else{
          curTarget = new Vector2D(x,y);
        }
      },
      getCurrentTarget: function(){
        if(curTarget){
          return curTarget;
        }else{
          return null;
        }
      },
      // player
      setPlayer:function(p){
        m_Player = p;
      },
      getPlayer: function(){
        return m_Player;
      },
      setPath: function(p){
        path = p;
      },
      getPath: function(){
        return path;
      }

    };
    return obj;
  }
  return init();
})(); 