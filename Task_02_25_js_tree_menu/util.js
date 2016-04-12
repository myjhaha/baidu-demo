/**
 * getElementById
 */
function $(id) { return document.getElementById(id);}
/**
 * 事件绑定
 */
function addEventHandler(element, ev, handler){
  if(element.addEventListener){
    element.addEventListener(ev,handler,false);
  }else if(element.attachEvent){
    element.attachEvent("on" + ev, handler);
  }else{
    element["on" + ev] = handler;
  }
}

/**
 * 节点 @prarm [string,type]
 */
function Node(data){
  this.folded = false;
  this.data = data;
  this.parent = null;
  this.children = [];
  this.eleDom = document.createElement("div");
  this.eleDom.classList.add("tree-node"); //马上给一个DOM
  this.eleDom.treeNode = this; //指回去
  // title icon
  var a = document.createElement("a");
  a.setAttribute("href","javascript:void(0)");
  var icon = document.createElement("i");
  icon.className="fa fa-file-o";
  var txt = document.createTextNode(data);
  a.appendChild(icon);
  a.appendChild(txt);
  // btn-group
  
  var iconDel = document.createElement("i");
  iconDel.className="fa fa-remove del-btn";
  iconDel.appendChild(document.createTextNode("删除"));

  var iconAdd = document.createElement("i");
  iconAdd.className="fa fa-plus add-btn";
  iconAdd.appendChild(document.createTextNode("添加"));

  var btnGroup = document.createElement("div");
  btnGroup.className="btn-group";
  btnGroup.appendChild(iconDel);
  btnGroup.appendChild(iconAdd);
  // title
  var title = document.createElement("div");
  title.appendChild(a);
  title.appendChild(btnGroup);  // 加入操作btn-group
  title.classList.add("tree-node-title");
  title.classList.add("unfolded");
  this.eleDom.appendChild(title);
}
Node.prototype = {
  constructor:Node,
  isLeaf: function(){
    return (this.children.length == 0);
  },
  render: function(){
    if(this.folded == true){
      this.eleDom.classList.remove("unfolded");
      this.eleDom.classList.add("folded");
    }else{
      this.eleDom.classList.remove("folded");
      this.eleDom.classList.add("unfolded");
    }
    var icon = this.eleDom.querySelector("i");
    if(this.isLeaf()){
      icon.className="fa fa-file-o";
    }else{
      if(this.folded == true){
        icon.className="fa fa-folder-o";
      }else{
        icon.className="fa fa-folder-open-o";
      }
    }
  },
  addChild:function(data){
    var newNode = new Node(data);
    newNode.parent = this;

    this.eleDom.appendChild(newNode.eleDom); //添加DOM到父节点
    this.children.push(newNode);  //推入Tree中
    this.folded = false; //插入出直接展开节点
    this.render();
  },
  removeNode:function(){
    if(!this.isLeaf()){ //递归删孩子节点
      for (var i = this.children.length - 1; i >= 0; i--) {
        this.children[i].removeNode();
      };
    }
    if(this.parent !== null){ //不删根节点
      this.parent.eleDom.removeChild(this.eleDom);
      for (var i = this.parent.children.length - 1; i >= 0; i--) {
        if(this.parent.children[i] == this){
          this.parent.children.splice(i,1);
          break;
        }
      };
    }
  },
  fold:function(flag){
    this.folded = flag;
    this.render();
  },
  toggleState:function(){
    if(this.folded == true)
      this.folded = false;
    else
      this.folded = true;
    this.render();
  }
}

function Tree(data){
  this._root = new Node(data);
}
Tree.prototype.traverseDF = function (callback){
  function recursion(curNode){
    callback(curNode);
    for(var i = 0; i < curNode.children.length; i++ ){
      recursion(curNode.children[i]);
    }
  }
  recursion(this._root);
}
Tree.prototype.traverseBF = function (callback){
  var queue = [];
  queue.push(this._root);
  var curNode = queue.shift();
  while(curNode){
    for(var i = 0; i < curNode.children.length; i++){
      queue.push(curNode.children[i]);
    }
    callback(curNode);
    curNode = queue.shift();
  }
}
Tree.prototype.contains = function(callback, traversal){
  traversal.call(this, callback);
}
/**
 * 添加
 */
Tree.prototype.add = function(data, toData, traversal){
  var parent = null;
  var callback = function (node){
    if(node.data == toData)
      parent = node;
  }
  this.contains(callback, traversal);
  if(parent !== null){
    parent.addChild(data);
  }else{
    throw new Error("Cannot add node to a non-existent parent.");
  }
}

Tree.prototype.cleanStyle = function(){
  var eleArr = this._root.eleDom.querySelectorAll(".tree-node");
  for (var i = eleArr.length - 1; i >= 0; i--) {
    eleArr[i].className = "tree-node";
    eleArr[i].treeNode.render();
  };
  //this.render();
}