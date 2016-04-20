
function Adapter(){
  this.demodulate = function(binaryStr){
    throw new Error("该方法必须被重载!");
  }
  this.modulate = function(heartbaetJson){
    throw new Error("该方法必须被重载!");
  }
}

function PlanetSingleAdapter(){
  function BinaryToHeartbeatJson (binaryStr){
    var _id = parseInt(binaryStr.substr(0,8),2);
    var _state = "";
    switch(binaryStr.substr(8,8)){
      case "00000001":
        _state="work";
        break;
      case "00000010":
        _state="stop";
        break;
      case "11111100":
        _state="destroy";
        break;
    } 
    var _curOil = parseInt(binaryStr.substr(16),2);
    return {id:_id, state:_state, curOil:_curOil};
  }
  function CommandJsonToBinary (commandObj){
    return IntToBinary(commandObj.id)+CommandToBrinary(commandObj.command);
  }
  //signal processing;
  this.demodulate = function(binaryStr){
    return BinaryToHeartbeatJson(binaryStr);
  }
  this.modulate = function(cmdObj){
    return CommandJsonToBinary(cmdObj);
  }
}

function SpaceshipSingleAdapter(){
  function HeartbeatJsonToBinary(hJon){
    return (  IntToBinary(hJon.id)+
              StateToBinary(hJon.state) +
              IntToBinary(hJon.curOil) );
  }
  function BinaryToCommandJson(binaryStr){
    var _id = parseInt(binaryStr.substr(0,8),2);
    var _command = "";
    switch(binaryStr.substr(8)){
      case "00000001":
        _command="work";
        break;
      case "00000010":
        _command="stop";
        break;
      case "11111100":
        _command="destroy";
        break;
    } 
    return {id:_id, command:_command};
  }
  //signal processing;
  this.demodulate = function(binaryStr){
    return BinaryToCommandJson(binaryStr);
  }
  this.modulate = function(heartbaetJson){
    return HeartbeatJsonToBinary(heartbaetJson);
  }
}