//---------common function-------
var $ = function(eleId){
  return document.querySelector(eleId);
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

//---------

function NeatDialog(element){
  //记录获取的节点信息，用于恢复
  var _elementToShow = element;
  var _elementParent = element.parentNode;
  var _dialogContent = null;
   
  function _open(){
  //dialog background
    if(_dialogContent !== null){
      return;
    }
    var dbg = document.createElement("div");
    dbg.className = "neat-dialog-bg";
    //close btn
    var closeBtn = document.createElement("button");
    closeBtn.className="close-btn";
    //dialog
    var dg = document.createElement("div");
    dg.className = "neat-dialog";
    dg.appendChild(closeBtn);
    dg.appendChild(element);
    element.style.display="block";
    // dialog content
    var dgc = document.createElement("div");
    dgc.className = "neat-dialog-cont";
    dgc.appendChild(dbg);
    dgc.appendChild(dg);
    
    if (document.body.offsetLeft > 0)
      dgc.style.marginLeft = document.body.offsetLeft + "px";
    
    _dialogContent = dgc;
    addEventHandler(closeBtn,"click",function(){
       _close();
      });
    document.body.appendChild(dgc);
    _elementToShow.style.display="block";
  }
  function _close(){
    if (_dialogContent){
      //this.dialogContent.style.display = "none";
      _elementToShow.style.display="none";
      _elementParent.appendChild(_elementToShow);
      _dialogContent.parentNode.removeChild(_dialogContent);
      _dialogContent = null;
    }
  }
  this.open = function(){
    _open();
  };
}


var nd;

function onClickFun(){
  nd.open();
}

window.onload = function(e1){
  var btn = $("#pop-dialog-btn");
  addEventHandler(btn,"click",onClickFun);
  nd = new NeatDialog($("#neat-dialog-test"));
}