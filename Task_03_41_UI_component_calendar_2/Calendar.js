var CalendarNameSpace = {
  getDaysInMonth: function(yy,mm){
    switch(mm){
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        return 31;
      case 3:
      case 5:
      case 8:
      case 10:
        return 30;
      case 1:
        if(yy%4!=0){
          return 28;
        }else if(yy%400!=0 && yy%100==0){
          return 28;
        }else{
          return 29;
        }
      default:
        throw new Error("month:"+mm+" not exit.");
    }
  },
  addEventHandler: function(element, ev, handler){
    if(element.addEventListener){
      element.addEventListener(ev,handler,false);
    }else if(element.attachEvent){
      element.attachEvent("on" + ev, handler);
    }else{
      element["on" + ev] = handler;
    }
  },
  //yyyy-MM-dd
  getYYYYMMDD: function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + "-" + ((month<10)?("0"+month):(month+"")) + "-" + ((day<10)?("0"+day):(day+"")) ;
  },
  getYYYYMM: function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + "年" + month+"月";
  },
  insertAfter:function (newElement, targetElement){
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
      // 如果最后的节点是目标元素，则直接添加。因为默认是最后
      parent.appendChild(newElement);
    }
    else {
      parent.insertBefore(newElement, targetElement.nextSibling);
      //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
    }
  }
}

//----------------- --------------------------

function Calendar(config){
  'use strict';
  var m_WeekDay = ["日","一","二","三","四","五","六"];
  var m_ViewDate = config.date ? new Date(config.date): new Date();
  var m_DOMTree = document.createElement("div");
  m_DOMTree.style.position="absolute";
  m_DOMTree.style.display="none";
  m_DOMTree.style.width="14em";
  m_DOMTree.style.opacity="0.9";
  var m_BindInputTxt = null;
  _render();
  if(config.id ){
    _bind(config)
  }
  
  //mm 表月份，从0-11
  function _dateItemClickEventFun(e){
    var target = e.target;
    if(target.classList.contains("date-item")){
      var d = new Date(target.getAttribute("date"));
      if(m_ViewDate.getTime() == d.getTime()){ //相同就不用刷新了
        return;
      }
      m_ViewDate = d;
      m_BindInputTxt.value = CalendarNameSpace.getYYYYMMDD(m_ViewDate);
      _render();
      //console.log(target.getAttribute("date"));
    }
  }
  function _OptClickEventFun(e){
    var target = e.target;
    if(target.classList.contains("pre-year-btn")){//年份的选择就没那么讲究了
      var y = m_ViewDate.getFullYear();
      y--;
      m_ViewDate.setYear(y);
      m_BindInputTxt.value = CalendarNameSpace.getYYYYMMDD(m_ViewDate);
      _render(); 
    }else if(target.classList.contains("pre-month-btn")){
      var d = m_ViewDate.getDate();
      m_ViewDate.setDate(0); //变成上一个月了
      var m = m_ViewDate.getMonth();
      var y = m_ViewDate.getFullYear();
      var days = CalendarNameSpace.getDaysInMonth(y,m);
      if(d>days){
        d = days;
      }
      m_ViewDate.setDate(d);
      m_BindInputTxt.value = CalendarNameSpace.getYYYYMMDD(m_ViewDate);
      _render();
    }else if(target.classList.contains("next-month-btn")){
      var d = m_ViewDate.getDate();
      m_ViewDate.setDate(1); //变成本月第一天
      var m = m_ViewDate.getMonth();
      m++;
      m_ViewDate.setMonth(m); //变成下一个月，还是第一天
      m = m_ViewDate.getMonth();
      var y = m_ViewDate.getFullYear();
      var days = CalendarNameSpace.getDaysInMonth(y,m);
      if(d>days){
        d = days;
      }//保证上一月的某天不会超过下一月的总天数
      m_ViewDate.setDate(d);
      m_BindInputTxt.value = CalendarNameSpace.getYYYYMMDD(m_ViewDate);
      _render();
    }else if(target.classList.contains("next-year-btn")){
      var y = m_ViewDate.getFullYear();
      y++;
      m_ViewDate.setYear(y);
      m_BindInputTxt.value = CalendarNameSpace.getYYYYMMDD(m_ViewDate);
      _render();
    }else{

    }
  }
  function _submitClickEventFun(e){
    var target = e.target;
    if(target.classList.contains("confirm-btn")){
      if(m_BindInputTxt != null && m_BindInputTxt != undefined){
        m_BindInputTxt.value = CalendarNameSpace.getYYYYMMDD(m_ViewDate);
      }
      m_DOMTree.style.display="none";
    }else if(target.classList.contains("cancel-btn")){
      m_DOMTree.style.display="none";
    }else{
      // do nothing
    }
  }
  function _show(){
    m_DOMTree.style.display="block";
    var inputLeft = m_BindInputTxt.offsetLeft;
    console.log(inputLeft);
    m_DOMTree.style.left = inputLeft+"px";
  }
  function _hidden(){
    m_DOMTree.style.display="none";
  }
  function _render(){
    console.log("_render()");
    m_DOMTree.innerHTML ="";
    //时间显示
    var optDiv = document.createElement("div");
    optDiv.style.backgroundColor="#fff";
    optDiv.className = "opt-div";
    optDiv.style.padding="0.2em";
    optDiv.style.borderLeft="1px solid #999";
    optDiv.style.borderTop="1px solid #999";
    optDiv.style.borderRight="1px solid #999";
    var optDiv1 = document.createElement("div");
    optDiv1.style.whiteSpace="nowrap"; 
    optDiv1.style.display="inline-block";
    optDiv1.style.width = "28%";
    optDiv1.style.textAlign="left";
    optDiv.appendChild(optDiv1);
    var optDiv2 = document.createElement("div");
    optDiv2.style.display="inline-block";
    optDiv2.style.width = "44%";
    optDiv2.style.textAlign="center";
    optDiv2.style.whiteSpace="nowrap"; 
    optDiv.appendChild(optDiv2);
    var optDiv3 = document.createElement("div");
    optDiv3.style.display="inline-block";
    optDiv3.style.width = "28%";
    optDiv3.style.textAlign="right";
    optDiv3.style.whiteSpace="nowrap"; 
    optDiv.appendChild(optDiv3);
    //上一年
    var btn0 = document.createElement("button");
    btn0.innerHTML="<<";
    btn0.className="pre-year-btn";
    btn0.style.paddingLeft="0.1em";
    btn0.style.paddingRight="0.1em";
    btn0.style.marginLeft="0.1em";
    btn0.style.marginRight="0.1em";
    btn0.style.display="inline-block";
    optDiv1.appendChild(btn0);
    //上一月
    var btn1 = document.createElement("button");
    btn1.innerHTML="<";
    btn1.className="pre-month-btn";
    btn1.style.paddingLeft="0.1em";
    btn1.style.paddingRight="0.1em";
    btn1.style.marginLeft="0.1em";
    btn1.style.marginRight="0.1em";
    btn1.style.display="inline-block";
    optDiv1.appendChild(btn1);
    //当前月份
    var span = document.createElement("span");
    span.innerHTML = CalendarNameSpace.getYYYYMM(m_ViewDate);
    optDiv2.appendChild(span);
    //下一月
    var btn2 = document.createElement("button");
    btn2.innerHTML=">";
    btn2.className="next-month-btn";
    btn2.style.paddingLeft="0.1em";
    btn2.style.paddingRight="0.1em";
    btn2.style.marginLeft="0.1em";
    btn2.style.marginRight="0.1em";
    btn2.style.display="inline-block";
    optDiv3.appendChild(btn2);
    //下一年
    var btn3 = document.createElement("button");
    btn3.innerHTML=">>";
    btn3.className="next-year-btn";
    btn3.style.paddingLeft="0.1em";
    btn3.style.paddingRight="0.1em";
    btn3.style.marginLeft="0.1em";
    btn3.style.marginRight="0.1em";
    btn3.style.display="inline-block";
    optDiv3.appendChild(btn3);

    //opt Div 加入组件
    m_DOMTree.appendChild(optDiv);

    //日历表
    var table = document.createElement("table");
    table.style.borderCollapse="collapse";
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    //生成表头，就是星期一、星期二等等
    var tr0 = document.createElement("tr");
    m_WeekDay.map(function(e){
      var th = document.createElement("th");
      th.style.borderWidth="1px";
      th.style.borderColor="#999";
      th.style.borderStyle="solid";
      th.style.backgroundColor="#ccc";
      th.style.width="2em";
      th.style.inlineHeight="2em";
      th.style.height="2em";
      th.style.textAlign="center";
      th.innerHTML=e;
      tr0.appendChild(th);
    });
    thead.appendChild(tr0);
    table.appendChild(thead);
    //年，月，月初的日、星期
    var _year = m_ViewDate.getFullYear(); // xxxx
    var _month = m_ViewDate.getMonth(); //0-11
    var _date = m_ViewDate.getDate();   //1-31
    var _day = m_ViewDate.getDay();     //0-6
    var _tmp = new Date(m_ViewDate);
    _tmp.setDate(1);
    var _d = -_tmp.getDay()+1; 
    if(_d==1)
      _d = -6;
      //日历显示第一天的实际偏移
    var _daysInMonth = CalendarNameSpace.getDaysInMonth(_year,_month); //28,29,30,31
    
    for(var i=0;i<6;i++){
      var tr1 = document.createElement("tr");
      for(var j=0;j<7;j++,_d++){
        var td = document.createElement("td");
        td.style.borderWidth="1px";
        td.style.borderColor="#999";
        td.style.borderStyle="solid";
        td.style.width="2em";
        td.style.inlineHeight="1.6em";
        td.style.height="1.6em";
        td.style.textAlign="center";
        td.style.cursor = "pointer";
        _tmp.setTime(m_ViewDate.getTime());
        _tmp.setDate(_d);
        td.setAttribute("date",new Date(_tmp)); //附加一个属性到td,方便以后修改
        var txtNode = document.createTextNode(_tmp.getDate());
        if(_d <1 ){ //上一个月的
          td.style.backgroundColor = "#eec";
          td.className = "date-item preMonthItem";
        }else if(_d <= _daysInMonth){ //本月的
          td.className = "date-item CurrentMonthItem";
          td.style.backgroundColor="#fff";
        }else{ // 下一个月的
          td.style.backgroundColor = "#eec";
          td.className = "date-item NextMonthItem";
        }
        if(_d == _date){
          td.style.backgroundColor = "#99f";
          td.style.color= "#fff";
        }
        td.appendChild(txtNode);
        tr1.appendChild(td);
      }
      tbody.appendChild(tr1);
    }
    table.appendChild(tbody);
    
    m_DOMTree.appendChild(table);
    // submit div
    var submitDiv = document.createElement("div");
    submitDiv.className="submit-div"
    submitDiv.style.backgroundColor="#fff";
    submitDiv.style.padding="0.4em";
    submitDiv.style.borderLeft="1px solid #999";
    submitDiv.style.borderRight="1px solid #999";
    submitDiv.style.borderBottom="1px solid #999";
    //
    var confirmBtn = document.createElement("button");
    confirmBtn.innerHTML="确认";
    confirmBtn.className="confirm-btn";
    confirmBtn.style.paddingLeft="0.2em";
    confirmBtn.style.paddingRight="0.2em";
    confirmBtn.style.marginLeft="0.2em";
    confirmBtn.style.marginRight="0.2em";
    confirmBtn.style.display="inline-block";
    submitDiv.appendChild(confirmBtn);
    //
    var cancelBtn = document.createElement("button");
    cancelBtn.innerHTML="取消";
    cancelBtn.className="cancel-btn";
    cancelBtn.style.paddingLeft="0.2em";
    cancelBtn.style.paddingRight="0.2em";
    cancelBtn.style.marginLeft="0.2em";
    cancelBtn.style.marginRight="0.2em";
    cancelBtn.style.display="inline-block";
    submitDiv.appendChild(cancelBtn);
    m_DOMTree.appendChild(submitDiv);
    CalendarNameSpace.addEventHandler(table,"click",_dateItemClickEventFun);
    CalendarNameSpace.addEventHandler(optDiv,"click",_OptClickEventFun);
    CalendarNameSpace.addEventHandler(submitDiv,"click",_submitClickEventFun);
  }

  this.getDOMTree = function(){
    return m_DOMTree;
  }
  this.getSelectedDate = function(){
    return new Date(m_ViewDate);
  }
  this.getYYYYMMDD = function(){
    return CalendarNameSpace.getYYYMMDD(m_ViewDate);
  }
  this.setSelectedDate = function(dateStr){
    var d = dateStr ? new Date(dateStr):new Date() ;
    if(d.getTime()){  //不成功会返回 NaN
      m_ViewDate = d;
      _render();
    }else{
      //m_ViewDate = new Date();
      // do nothing
    }
  }
  function _setSelectedDate (dateStr){
    var d = dateStr ? new Date(dateStr):new Date() ;
    if(d.getTime()){  //不成功会返回NaN，注意IE只认2016-01-01的形式，少个0都不行
      m_ViewDate = d;
      _render();
    }else{
      m_ViewDate = new Date();
      _render();
    }
  }

  function _bind(_config){
    var inputDOM = document.querySelector(_config.id); 
    if (inputDOM == null || inputDOM == undefined){
      throw new Error("config.id:"+config.id+" not exist.");
    }
    if(inputDOM.tagName.toLowerCase() != "input"){
      throw new Error("doc Obj id:"+config.id+" is not a <input>.");
    }
    m_BindInputTxt = inputDOM;
    inputDOM.value=CalendarNameSpace.getYYYYMMDD(m_ViewDate);
    inputDOM.setAttribute("readonly","readonly");
    CalendarNameSpace.insertAfter(m_DOMTree,inputDOM);
    CalendarNameSpace.addEventHandler(m_BindInputTxt,"focus",function(e){
      _setSelectedDate(m_BindInputTxt.value);
      _show();
    });
  }

}