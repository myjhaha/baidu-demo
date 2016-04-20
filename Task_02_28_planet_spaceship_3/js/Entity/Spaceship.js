
function Spaceship(id,shipId){
  this.id = id;
  this.shipId = shipId;
  this.w = 20;
  this.h = 20;
  this.m_name = "未命名";
  this.m_selected = false;
  this.m_oilContent = 100;  // 最大油量 固定为100
  this.m_currentOil = 0; //当前油量

  this.m_curCircular = 0; //位置信息
  this.m_orbit = null; //设定轨道
  //this.m_velocity = -1;  // 运行速度
  //this.m_energyConsumption = -1; // 能耗
  this.m_powerSystem = null;
  this.m_energySystem = null;
  //this.m_energyRecoveryRate = -1; // 能源回复速度
  this.m_signalReceptor = null; // 接收器
  this.m_stateMachine =  null // 状态机
  // set get
  this.m_lastSendStateMsgTime = 0;
  this.m_livingTime = 0;
  this.m_adapter = null;
  this.m_msgSender = null;
}
Spaceship.prototype = {
  get x(){
    return this.m_orbit.x + this.m_orbit.r * Math.sin(this.m_curCircular);
  },
  get y(){
    return this.m_orbit.y + this.m_orbit.r * Math.cos(this.m_curCircular);
  }
}
Spaceship.prototype.sendStateMsg = function(){
  //var m = World.getInstance().getMediator();
  // var hbObj = {
  //     id:this.id, 
  //     state:this.getCurrentStateName(),
  //     curOil:Math.round(this.m_currentOil)
  //   };
  // var binStr = this.m_adapter.modulate(hbObj);
  this.m_msgSender.sendHeartBeat();
  //console.log(this.m_name +" 发送心跳["+binStr+"]");
}
Spaceship.prototype.setOrbit = function(orbit){
  this.m_orbit = orbit;
}
Spaceship.prototype.setEnergySystem = function(ergSys){
  if(ergSys === null){
    throw new Error("Error: EnergySystem cannot be null.");
  }
  this.m_energySystem = ergSys;
  ergSys.m_owner = this;
}
Spaceship.prototype.setPowerSystem = function(powSys){
  if(powSys === null){
    throw new Error("Error: PowerSystem cannot be null.");
  }
  this.m_powerSystem = powSys;
  powSys.m_owner = this;
}

Spaceship.prototype.init = function(){
  this.m_msgSender = new SpaceshipMsgSender(this);
  this.m_stateMachine = new StateMachine(this); 
  this.m_adapter = new SpaceshipSingleAdapter();
  this.m_currentOil = 50;
  this.m_curCircular = Math.PI*2*Math.random();
  this.m_stateMachine.setCurrentState(SpaceshipStop.getInstance());
  //console.log(this.m_stateMachine);
}

Spaceship.prototype.toString = function(){

  return (this.m_name+"["+this.shipId+"](id:"+this.id+")");
}
Spaceship.prototype.setSelected = function(flag){
  this.m_selected = flag;
}
Spaceship.prototype.getSelected = function(){
  return this.m_selected;
}
Spaceship.prototype.setName = function(name){
  this.m_name = name;
}
Spaceship.prototype.toDetialString = function(){
  return ("Spaceship { id:"+ this.id +", " +
            "弧度:" + this.m_curCircular.toFixed(2) + ", " +
            "轨道半径:"+(this.m_orbit.r).toFixed(2) + ", " +
            "当前油量:"+(this.m_currentOil).toFixed(2) +"}"
            );
}


Spaceship.prototype.addEnergy = function(deltaTime){
  if(this.m_energySystem !== null){
    this.m_currentOil += (this.m_energySystem.m_energyRecoveryRate * deltaTime / 1000.0);
    if(this.m_currentOil >= this.m_oilContent)
      this.m_currentOil = this.m_oilContent;
  }else{
    throw new Error("Error: EnergySystem is null.");
  }
}
Spaceship.prototype.useEnergy = function(deltaTime){
  if(this.m_powerSystem !== null){
    this.m_currentOil -= (this.m_powerSystem.m_energyConsumption* deltaTime /1000.0 );
    if(this.m_currentOil <= 0)
      this.m_currentOil = 0;
  }else{
    throw new Error("Error: PowerSystem is null.");
  }
  //console.log("curOil:"+ this.m_currentOil);
}
Spaceship.prototype.isEnergyFull = function(){
  if(this.m_currentOil >= this.m_oilContent){
    this.m_currentOil = this.m_oilContent
    return true;
  }else{
    return false;
  }
    
}
Spaceship.prototype.isEnergyEmpty = function(){
  if(this.m_currentOil <= 0.0){
    this.m_currentOil = 0.0
    return true;
  }else{
    return false;
  }
}
Spaceship.prototype.handleMessage = function(telegram){
  //console.log("handleMessage:" + telegram);
  if(telegram.receiver == this.id){  
    if(telegram.msgType == MessageType.MSG_SEND_TO_SPACESHIP){
      var bstr = telegram.extraInfo;
      telegram.extraInfo = this.m_adapter.demodulate(bstr); //解调
      if(telegram.extraInfo.id != this.id){
        //console.log("{" +this.toString() + "}解调 二进制:["+bstr+"]->json:{id:"+telegram.extraInfo.id+",command:"+telegram.extraInfo.command+"} id不匹配，丢弃..");
        return false;
      }else{
        console.log("" +this.toString() + " 解调 二进制:["+bstr+"] -> json:{id:"+telegram.extraInfo.id+",command:"+telegram.extraInfo.command+"} id匹配成功.");
        return this.m_stateMachine.handleMessage(telegram);
      }
    }else{
      return false;
    }
    
  }
  else{
    //都不是发你的
    return false;
  }
}
Spaceship.prototype.getCurrentStateName = function(){
  return this.m_stateMachine.m_currentState.toString();
}
Spaceship.prototype.changeState = function(newState){
  this.m_stateMachine.changeState(newState);
}
Spaceship.prototype.update = function(deltaTime){
  if (this.m_stateMachine != null){
    this.m_stateMachine.update( deltaTime);
  }
  //console.log(deltaTime);
  this.m_livingTime += deltaTime;
  if(this.m_livingTime - this.m_lastSendStateMsgTime >= 1000){
    this.sendStateMsg();
    this.m_lastSendStateMsgTime = this.m_livingTime;
  }
}
Spaceship.prototype.run = function(delteTime){
  if(this.m_powerSystem == null)return ;
  var v = this.m_powerSystem.m_velocity;
  var deltaCircular = v*delteTime/(2000.0*Math.PI*this.m_orbit.r)
  this.m_curCircular += deltaCircular;
  if(this.m_curCircular >= Math.PI*2)
    this.m_curCircular = 0;
  //console.log("OrbitVehicle v:"+ v +" Cirular:" + this.m_curCircular);
  var x = this.m_orbit.x + this.m_orbit.r * Math.sin(this.m_curCircular);
  var y = this.m_orbit.y + this.m_orbit.r * Math.cos(this.m_curCircular);
}
Spaceship.prototype.draw = function(){
  var x = this.x - this.w / 2;
  var y = this.y - this.h / 2;
  //context.fillStyle = greenColor;
  //context.fillRect(x, y, this.w, this.h);
  if(planetImg.complete){
    context.drawImage(planetImg, x, y, this.w, this.h); 
  }
  context.font="10px Arial";
  context.fillStyle = "#fff";
  //context.fillText("id:"+this.id+ "   弧度:" + this.m_curCircular.toFixed(2), x+25, y+25);
  context.fillText(" * "+this.m_name+" [ " +this.shipId+" ]", x+this.w, y+this.h);
  //context.fillText("轨道半径:"+(this.m_orbit.r).toFixed(2), x+25, y+25+14);
  //context.fillText("油量:"+(this.m_currentOil).toFixed(2), x+25, y+25+28);

  context.fillStyle = greenColor;
  if(this.m_selected){
    context.strokeStyle = "#ff0";
    context.lineWidth = 3;
    context.strokeRect(x-2,y-2,this.w+4,this.h+4); 
    context.lineWidth = 1;
    context.strokeStyle = greenColor;
  }
  //血条
    context.strokeStyle = "#ff0";
    context.lineWidth = 0.8;
    context.strokeRect(x+this.w+5,y,this.w*2.5,4);
    context.fillRect(x+this.w+5+1,y+1, (this.w*2.5-1)*this.m_currentOil / this.m_oilContent ,2)
    context.lineWidth = 1;
    context.strokeStyle = greenColor;
}




