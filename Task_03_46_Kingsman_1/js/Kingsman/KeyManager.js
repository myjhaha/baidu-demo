var KeyManager = (function(){
  var instantiated;
  var keysDown = {};
  function init(){
    var obj = {
      onKeyDown: function(e){
        console.log(e);
        keysDown[e.keyCode] = true;
      },
      onKeyUp: function(e){
        console.log(e);
        keysDown[e.keyCode] = false;
      },
      isKeyDown: function(keyCode){
        if(keysDown[keyCode] == true){
          return true;
        }else{
          keysDown[keyCode] = false;
          return false;
        }
      }
    };
    return obj;
  }
  return init();
})(); 