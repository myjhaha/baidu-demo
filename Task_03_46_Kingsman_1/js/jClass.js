/***********************************************************************************************
*函数名 : jClass
*函数功能描述 : 用于实现继承，等价于java的类声名
*函数参数 : baseClass-基类名 prop-对象形式的类成员声名
*函数返回值 : 一个等价于java的类
*作者 : null
*函数创建日期 : 2016-5-1
*函数修改日期 : null
*修改人 ：null
*修改原因 :  null
*版本 : 1.0
*历史版本 : 无
***********************************************************************************************/
var initializing = false;
function jClass(baseClass, prop){
  //只有一个参数的情况
  if(typeof(baseClass) === "object"){
    prop = baseClass;
    baseClass = null;
  }
  // 本次调用所创建的类（构造函数），jClass实际上就是返回这个玩意
  function F(){
    if(!initializing){
      if(baseClass){
        this.baseprototype = baseClass.prototype;
      }
      this.init.apply(this,arguments);
    }
  }
  //如果是从其他类扩展
  if(baseClass){
    initializing = true;
    F.prototype = new baseClass();
    F.prototype.constructor = F;
    initializing = false;
  }
  //覆盖父类同名方法
  for(var name in prop){
    if(prop.hasOwnProperty(name)){
      if(baseClass && typeof(prop[name]) === "function" && typeof(F.prototype[name]) === "function"){
        F.prototype[name] = (function(name,fn){
          return function(){
            this.base = baseClass.prototype[name];
            return fn.apply(this, arguments);
          };
        })(name, prop[name]);
      }else{
        F.prototype[name] = prop[name];
      }
    }
  }
  return F;
}
