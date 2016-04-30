
var VMState = {
  "IDLE":     0,
  "DEBUG":    1,
  "RUNNING":  2,
  "ERROR":    3
}

var VM = (function(){
  var LOCK = false;
  var timestamp = 0;
  var cmdLineLen = 50;
  var instantiated;
  var m_vmState = -1;

  var m_inputString = "";
  var m_inputBufferLines =[];
  var m_instructionBuff = [];

  function _runOneInstruction(ins){
    ins.fun.apply(Controller,ins.params);
  }
  function RunningLoop3(callback){
    var stepCount = 0;
    clearTimeout(timestamp);
    function __onestep(){
      if(m_instructionBuff.length > 0){
        var curIns = m_instructionBuff.shift();
        _runOneInstruction(curIns); 
        //console.log("ins run.");
        timestamp = setTimeout(__onestep,10);
      }else{
        if(m_inputBufferLines.length > 0){
          var insList;
          View.clearCellsStyle();
          try{
            insList = _parseLineToInstructions(m_inputBufferLines.shift(),stepCount);
            //
          }catch(e){
            View.setErrorLine(stepCount);
            console.log(e);
            return;
          }
          View.markCurLine(stepCount);
          stepCount ++;
          insList.map(function(e){
            m_instructionBuff.push(e);
          });
          timestamp = setTimeout(__onestep,200);
        }else{
          console.log("Run script finish.");
        }
      }
    }
    __onestep();
  }

  function init(){
    cmdStr = "";
    lines = [];
    return {
      setInputCmd: function(str){
        m_vmState = VMState.IDLE;
        m_inputBufferLines = str.toUpperCase().split(/\r?\n/);
        console.log(str);
        clearTimeout(timestamp);
      },
      reset:function(){
        console.log("虚拟机状态归零");
        clearTimeout(timestamp);
        m_vmState = VMState.IDLE;
        m_inputBufferLines = [];
        m_instructionBuff = [];
        View.clearRowNumbers();
        View.clearCellsStyle();
      },
      onRun: function(callback){
        if(m_vmState === VMState.IDLE){
          m_vmState = VMState.RUNNING;
          m_curLineIndex = 0;
          clearTimeout(timestamp);
          //RunningLoop(callback);
          //RunningLoop2(callback);
          RunningLoop3(callback);
        }else{
          //Do nothing
        }
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