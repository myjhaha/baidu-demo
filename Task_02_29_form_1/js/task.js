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
function validate_required(field,alerttxt){
  if (field.value==null||value=="")
    {alert(alerttxt);return false}
  else {return true}
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
function submit_form_event(thisform)
{
  if(thisform){
    var s = thisform["fieldname"].value;
    var len = getChatLength(s);
    if(len<4 ||len>16  ){
      tip_1.innerHTML="必填，长度为4到16个字符";
      tip_1.className="tip error";
    } else{
      tip_1.innerHTML="格式正确";
      tip_1.className="tip right";
    }
  }
  return false;
}

var inputTxt_1 = $("txt-1");
var btn_1 = $("btn-1");
var tip_1 = $("tip_1");
var form_1 = $("form-1");

