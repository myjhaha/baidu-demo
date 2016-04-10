function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
    this.domEle = null;
}
function Tree(data){
  var node = new Node(data);
  this._root = node;
}

/**
 * 深度优先
 * @param function(node)
 */
Tree.prototype.traverseDF = function (callback){
  function recursion(curNode){
    callback(curNode);
    for(var i = 0; i < curNode.children.length; i++ ){
      recursion(curNode.children[i]);
    }
  }
  recursion(this._root);
}

/**
 * 广度优先
 * @param function(node)
 */
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

/**
 * 全树搜索
 * @param function(node)
 */
Tree.prototype.contains = function(callback, traversal){
  traversal.call(this, callback);
}
/**
tree.contains(function(node){
  if(node.data === "two"){
    console.log(node);
  }
});
*/

/**
 * 添加
 */
Tree.prototype.add = function(data, toData, traversal){
  var newChild = new Node(data);
  var parent = null;
  var callback = function (node){
    if(node.data == toData)
      parent = node;
  }
  this.contains(callback, traversal);
  if(parent){
    newChild.parent = parent;
    parent.children.push(newChild);
  }else{
    throw new Error("Cannot add node to a non-existent parent.");
  }
}

/**
 * 生产一个DOM树，每个node添加一个指针指向对应的DOM节点
 */
Tree.prototype.createDOMTree = function ( ){
  var root = this._root;
  function BFSTree(){
    var r = root;
    var ele = document.createElement("div");
    var nodeQ = [];
    var eleQ = [];
    nodeQ.push(r);
    eleQ.push(ele);
    var nowNode = nodeQ.shift();
    var nowEle = eleQ.shift();
    while(nowNode){
      nowNode.domEle = nowEle;
      nowEle.className = "tree-node";
      nowEle.setAttribute("id", "tree-node-" + nowNode.data);
      var txt = document.createTextNode(nowNode.data);
      nowEle.appendChild(txt);
      for(var i = 0; i< nowNode.children.length; i++){
        nodeQ.push(nowNode.children[i]);
        var e = document.createElement("div");
        nowEle.appendChild(e);
        eleQ.push(e);
      }
      nowNode = nodeQ.shift();
      nowEle = eleQ.shift();
    }
    return ele;
  }
  return BFSTree();
}


///////
function addEventHandler(element, ev, handler){
  if(element.addEventListener){
    element.addEventListener(ev,handler,false);
  }else if(element.attachEvent){
    element.attachEvent("on" + ev, handler);
  }else{
    element["on" + ev] = handler;
  }
}