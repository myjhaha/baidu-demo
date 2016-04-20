function DataCenter(){
  var ships = [];
  var m_msgRepertory = {};
  this.pushMessage = function(msgObj){
    var id = msgObj.id;
    var shipId = msgObj.shipId;
    var name = msgObj.name;
    var ergName = msgObj.ergName;
    var powName = msgObj.powName;
    var state = msgObj.state;
    var curOil = msgObj.curOil;
    var obj ={};
    if("id" in msgObj){
      if(msgObj.id+"" in m_msgRepertory){
        m_msgRepertory[msgObj.id+""]["state"] == "destroy" ? /*"I do nothing..")*/1 : m_msgRepertory[msgObj.id+""]["state"] = state;
        m_msgRepertory[msgObj.id+""]["curOil"] = curOil;
      }else{
        m_msgRepertory[msgObj.id+""] = {};
        m_msgRepertory[msgObj.id+""]["id"] = id;
        m_msgRepertory[msgObj.id+""]["shipId"] = shipId;
        m_msgRepertory[msgObj.id+""]["name"] = name;
        m_msgRepertory[msgObj.id+""]["ergName"] = ergName;
        m_msgRepertory[msgObj.id+""]["powName"] = powName;
        m_msgRepertory[msgObj.id+""]["state"] = state;
        m_msgRepertory[msgObj.id+""]["curOil"] = curOil;
      }
    }
    //this.updateStateTable();
  }
  this.updateStateTable = function(){
    var str = "<tr> \
        <th>卫星</th> \
        <th>卫星序号</th> \
        <th>标识</th> \
        <th>动力系统</th> \
        <th>能源系统</th> \
        <th>飞行状态</th> \
        <th>剩余燃料</th> \
      </tr>";
      for (var keys in m_msgRepertory) {
        str += ("<tr>");
        str += ("<td>");
          str += (m_msgRepertory[keys].name);
        str += ("</td>");
        str += ("<td>");
          str += (m_msgRepertory[keys].shipId);
        str += ("</td>");
        str += ("<td>");
          str += (m_msgRepertory[keys].id);
        str += ("</td>");
        str += ("<td>");
          str += (m_msgRepertory[keys].powName); 
          //str += "NaN";
        str += ("</td>");
        str += ("<td>");
          str += (m_msgRepertory[keys].ergName);
          //str += "NaN";
        str += ("</td>");
        str += ("<td>");
          str += (m_msgRepertory[keys].state);
        str += ("</td>");
        str += ("<td>");
          str += (m_msgRepertory[keys].curOil);
        str += ("</td>");
        str += ("</tr>");
      };
      spaceshipStateTable.innerHTML = str;
  }

}