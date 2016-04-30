function Node(x,y,walkable,nodeType,cost,color){
  this.x = x;
  this.y = y;
  this.walkable = walkable;
  this.nodeType = nodeType;
  this.cost = cost;
  this.color = color;
}

var NodeFactory = {
  createNode:function(x,y,nodeType){
    switch(nodeType){
      case "empty": 
        return new Node(x,y,true,"empty",0,"#fff");
      case "brick":
        return new Node(x,y,false,"brick",-1,"#333");
      case "water":
        return new Node(x,y,true,"water",50,"#66f");
      case "forest":
        return new Node(x,y,forest,"water",20,"#900");
      default:
        throw new Error("not such Node-type:" + nodeType); 
    }
  }
}