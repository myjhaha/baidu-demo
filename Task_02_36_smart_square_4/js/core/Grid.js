function Grid(width, height){
  this.width = width;
  this.height = height;
  this.nodes = this._buildNodes(width, height);
}

Grid.prototype._buildNodes = function(width, height) {
  var i,j,nodes = new Array(height);
  for( i =0;i<height;i++){
    nodes[i] = new Array(width);
    for ( j=0;j<width;j++) {
       nodes[i][j] = NodeFactory.createNode(j,i,"empty"); 
    };
  }
  return nodes;
};
Grid.prototype.isInside = function(x,y){
  return (x>=0 && y>=0 && x<this.width && y<this.height);
}
Grid.prototype.getNodeAt=function(x,y){
  if(this.isInside(x,y))
    return this.nodes[y][x];
  else
    return null;
}
Grid.prototype.isWalkableAt = function(x,y){
  return (this.isInside(x,y) && this.nodes[y][x].walkable);
}
Grid.prototype.setWalkableAt = function(x,y,walkable){
  if(this.isInside(x,y))
    this.nodes[y][x].walkable = walkable;
}
/**
 * s:  0 up;  1 right; 2 down; 3 left
 * d:  0 up-left;  1 up-right; 2 down-right; 3 dow-left
 *
 */
Grid.prototype.getNeighbours = function(node,movementMethod){
  var x = node.x,
      y = node.y;
      neighbours = [];
      s0 = false, d0 = false,
      s1 = false, d1 = false,
      s2 = false, d2 = false,
      s3 = false, d3 = false,
      nodes = this.nodes;
      if(this.isWalkableAt(x,y-1)){
        s0 = true;
        neighbours.push(nodes[y-1][x]);
      }
      if(this.isWalkableAt(x+1,y)){
        s1 = true;
        neighbours.push(nodes[y][x+1]);
      }
      if(this.isWalkableAt(x,y+1)){
        s2 = true;
        neighbours.push(nodes[y+1][x]);
      }
      if (this.isWalkableAt(x-1,y)) {
        s3 = true;
        neighbours.push(nodes[y][x-1]);
      };
      if(movementMethod === DiagonalMovement.Never){
        return neighbours;
      }
      if(movementMethod === DiagonalMovement.OnlyWhenNoObstacles){
        d0 = s3 && s0;
        d1 = s0 && s1;
        d2 = s1 && s2;
        d3 = s3 && s2;
      }else if(movementMethod === DiagonalMovement.IfAtMostOneObstacle){
        d0 = s3 || s0;
        d1 = s0 || s1;
        d2 = s1 || s2;
        d3 = s3 || s2;
      }else if(movementMethod === DiagonalMovement.Always){
        d0 = true;
        d1 = true;
        d2 = true;
        d3 = true;
      }else{
        throw new Error("DiagonalMovement flag Error with:" +movementMethod);
      }
      if (d0 && this.isWalkableAt(x-1, y-1)){
        neighbours.push(nodes[y-1][x-1]);
      }
      if (d1 && this.isWalkableAt(x+1,y-1)){
        neighbours.push(nodes[y-1][x+1]);
      }
      if(d2 && this.isWalkableAt(x+1,y+1)){
        neighbours.push(nodes[y+1][x+1]);
      }
      if(d3 && this.isWalkableAt(x-1,y+1)){
        neighbours.push(nodes[y+1][x-1]);
      }
      return neighbours;
}
Grid.prototype.clone = function(){
  var i,j,
      width = this.width,
      height = this.height,
      thisNodes = this.nodes,

      newGrid = new Grid(width,height);
      newNodes = new Array(height);

  for(i=0;i<height;i++){
    newNodes[i] = new Array(width);
    for(j=0;j<width;j++){
      //newNodes[i][j] = new Node(j,i,thisNodes[i][j].walkable);   
      newNodes[i][j] = NodeFactory.createNode(j,i,thisNodes[i][j].nodeType) ;
    }
  }
  newGrid.nodes = newNodes;
  return newGrid;
}
Grid.prototype.buildNodeAt = function(x,y,type){
  if(this.isInside(x,y)){
    this.nodes[y][x] = NodeFactory.createNode(x,y,type);
  }else{
    //do nothing
  }
}
Grid.prototype.clearNodeAt = function(x,y){
  if(this.isInside(x,y)){
    this.nodes[y][x] = NodeFactory.createNode(x,y,"empty");
  }else{
    //do nothing
  }
}

