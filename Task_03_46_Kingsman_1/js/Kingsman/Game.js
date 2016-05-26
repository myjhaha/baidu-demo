var Game = (function(){
  var instantiated;
  var m_KeyManager = KeyManager;
  var m_World = World;

  var m_PauseFlag = false;
  var m_PauseTime = 0;


  var m_MaxMsgCount = 0;
  var m_Pretimestamp = 0;

  function _update(curTimestamp){
    var deltaTime = curTimestamp - m_Pretimestamp;
    m_Pretimestamp = curTimestamp;
    
    //console.log(i++ + " [" +deltaTime + "]");
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "#f00";
    context.fillText("运行时间:"+(curTimestamp/1000.0).toFixed(2)+"秒", 10, 20);
    if(!m_PauseFlag){
      World.update(deltaTime/1000); //世界里的单位是秒
    }
    World.render();

    //requestAnimationFrame(update);
  }

  function init(){
    var obj = {
      update: function(runningTime){
        _update(runningTime);
      },
      onMouseEvent:function(e){
        World.setCurrentTarget(e.clientX, e.clientY);
        var p = World.getPlayer();
        if(!p) return ;
        var s = p.getSteering();
        s.setTarget(World.getCurrentTarget());

        if(s.on(BehaviorType.follow_path)){
          s.allOff();
          s.arriveOn();
          s.setTarget(World.getCurrentTarget());
        }
      },
      isPause:function(){
        return m_PauseFlag;
      },
      start:function(){
        m_PauseFlag = false;
      },
      pause:function(){
        m_PauseFlag = true;
        m_PauseTime = m_Pretimestamp;
      }
    };
    return obj;
  }
  return init();
})(); 