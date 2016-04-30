var $ = function(id){
  return document.getElementById(id);
} 
function addEventHandler(element, ev, handler){
  if(element.addEventListener){
    element.addEventListener(ev,handler,false);
  }else if(element.attachEvent){
    element.attachEvent("on" + ev, handler);
  }else{
    element["on" + ev] = handler;
  }
}

function getChatLength(str){
  var len = 0;
  var s = str.trim();
  for(var i = 0;i<s.length;i++){
    var chatCode = s.charCodeAt(i);
    if(chatCode >= 0 && chatCode <= 128){
      len += 1;
    }else{
      len += 2;
    }
  }
  return len;
}


var div_1 = $("div-1");
var div_2 = $("div-2");
var div_3 = $("div-3");
var div_4 = $("div-4");
var submitBtn = $("submit-btn");

function ValidateDiv(targetDiv,rules,success,error,validateFunc){
  var inputTxt = targetDiv.querySelector("input[type=text]");
  var tip = targetDiv.querySelector("p");
  function onFocusFun(ev){
    tip.innerHTML = rules;
    targetDiv.className="form-field-div";
  }
  function onBlurFun(ev){
    if(validateFunc(ev.target.value.trim())){
      tip.innerHTML = success;
      targetDiv.className="form-field-div correct";
    }else{
      tip.innerHTML = error;
      targetDiv.className="form-field-div error";
    }
  }
  addEventHandler(inputTxt,"focus",onFocusFun);
  addEventHandler(inputTxt,"blur",onBlurFun);
  this.clean = function(){
    tip.innerHTML = "";
    targetDiv.className="form-field-div";
  }
  this.check = function(){
    if(validateFunc(inputTxt.value.trim())){
      tip.innerHTML = success;
      targetDiv.className="form-field-div correct";
    }else{
      tip.innerHTML = error;
      targetDiv.className="form-field-div error";
    }
  }
}


var validateFuncSet = {
  checkName: function(_name){
    var len = getChatLength(_name);
    if( len < 4  || len > 16)
      return false;
    else
      return true;
  },
  checkEmail:function(_email){
    return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(_email);
  },
  checkTelephone:function(_tel){
    return /^[0-9]{5,}$/.test(_tel);
  },
  checkNotNull:function(_str){ // unfinish
    if(_str == null || _str == "" )
      return false;
    else
      return true;
  }
}

var d1 = new ValidateDiv(  div_1,
    "提示：长度4-16个字符（中文算2个），不能为空",
    "格式正确",
    "输入有误，必填，长度4-16个字符",
    validateFuncSet.checkName
    );
var d2 = new ValidateDiv(  div_2,
    "提示：请输入一个合法的电子邮箱",
    "格式正确",
    "输入有误，邮箱地址不合法",
    validateFuncSet.checkEmail
    );
var d3 = new ValidateDiv(  div_3,
    "提示：至少5位以上电话号码",
    "格式正确",
    "输入有误，电话号码都是5位以上",
    validateFuncSet.checkTelephone
    );
var d4 = new ValidateDiv(  div_4,
    "提示：请输入联系地址",
    "格式正确",
    "输入地址不能为空",
    validateFuncSet.checkNotNull
    );

function submit_form_event(targetFrom){
  d1.clean();
  d2.clean();
  d3.clean();
  d4.clean();
  d1.check();
  d2.check();
  d3.check();
  d4.check();
  return false;
}