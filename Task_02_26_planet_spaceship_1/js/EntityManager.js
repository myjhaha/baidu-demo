/**
 * 实体管理类 单例
 */
var EntityManager = (function(){
  var instantiated;
  function init(){
    var objMap =  new Map();

    var obj =  {
      getEntityFromID: function(id){
        if(objMap.has(""+id)){
          return objMap.get(""+id);
        }else {
          console.log("Warning: cannot find entity by id=" + id);
          return null;
        }
      },
      removeEntity: function(entity){
        if(objMap.has(""+entity.id)){
          return objMap.delete(""+entity.id);
        }else{
          console.log("Warning: cannot delete entity by id=" + id);
          return false;
        }
      },
      registerEntity:function(entity){
        if(entity !== null){
          if(objMap.has(""+entity.id)){
            console.log("Warning: entity is already exist.");
          }else{
            objMap.set(""+entity.id, entity);
          }
        }
      }
    };
    return obj;
  }
  return {
    getInstance : function(){
      if(!instantiated){
        instantiated = init();
      }
      return instantiated;
    }
  };
})(); 