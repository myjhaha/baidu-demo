function Adapter(){
  this.JsonToBinary = function(commandObj){
    return IntToBinary(commandObj.id)+CommandToBrinary(commandObj.command);
  }
  this.BinaryToJson = function(binaryStr){
    var _id = parseInt(binaryStr.substr(0,8));
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

}