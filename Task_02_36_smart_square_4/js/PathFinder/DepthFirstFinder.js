function DepthFirstFinder(opt){
  opt = opt || {};
  this.debug = opt.debug || false;
  this.heuristic = opt.heuristic || Heuristic.manhattan;
  this.allowDiagonal = opt.allowDiagonal || false;
  this.dontCrossCorners = opt.dontCrossCorners || true;
  this.diagonalMovement = opt.diagonalMovement || DiagonalMovement.Never;
  this.weight = opt.weight || 1;
  if(!this.diagonalMovement){
    if (!this.allowDiagonal) {
      this.diagonalMovement = DiagonalMovement.Never;
    } else {
      if (this.dontCrossCorners) {
        this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
      } else {
        this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
      }
    }
  }
}
DepthFirstFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
  // a, b is Node
  var openSet = new Queue();
  var startNode = grid.getNodeAt(startX, startY);
  var endNode = grid.getNodeAt(endX, endY);
  if(!grid.isWalkableAt(endNode.x, endNode.y)){
    console.log("endNode["+endNode.x+","+endNode.y+"] cannot arrive");
    return [];
  }
  var heuristic = this.heuristic || Heuristic.manhattan;
  var diagonalMovement = this.diagonalMovement || DiagonalMovement.Never;
  var abs = Math.abs, SQRT2 = Math.SQRT2;
  if(startNode === undefined || startNode === null){
    throw new Error("AStarFinder: Cannot get startNode.");
  }
  if(endNode === undefined || endNode === null){
    throw new Error("AStarFinder: Cannot get endNode.");
  }
  openSet.push(startNode);
  startNode.opened = true;
  startNode.g =0;   //到start的真实距离，随着搜索的展开，会不断更新
  startNode.f =0;   //g+h 的结果，其中h为启发式评估当前点到终点的距离
  markPos(startNode.x,startNode.y, 1, this.debug);// test

  while(!openSet.isEmpty()){
    var node = openSet.pop();
    node.closed = true;
    if(node === endNode){
      markPos(node.x,node.y, 2,this.debug); //// test, mark node to close
      return backtrace(node); // return [[x0,y0] .... [x_n,y_n]]
    }
    markPos(node.x,node.y, 0,this.debug); //// test, mark node to close
    var neighbours = grid.getNeighbours(node, diagonalMovement);
    for(var i=0;i<neighbours.length;i++){
      var neighbour = neighbours[i]
      if(neighbour.closed){
        markPos(neighbour.x,neighbour.y, 0,this.debug); //// test, mark node to close
        continue;
      }
      var x = neighbour.x;
      var y = neighbour.y;

      neighbourG = node.g + ((x - node.x ===0 || y - node.y === 0)?1:SQRT2);

      if(!neighbour.opened || neighbourG < neighbour.g){
        neighbour.g = neighbourG;
        neighbour.h = neighbour.h || this.weight * heuristic(abs(x - endX), abs(y - endY));
        neighbour.f = neighbour.g + neighbour.h;
        neighbour.parent = node;
        markPos(neighbour.x,neighbour.y, 1,this.debug); //// test, mark node to open
        if(!neighbour.opened){
          openSet.push(neighbour);
          neighbour.opened = true;
        }else{
          openSet.updateItem(neighbour);// in queue, this function do nothing
        }
      }
    } //for loop end
  }//main loop end
  console.log("endNode["+endNode.x+","+endNode.y+"] cannot arrive");
  return [];
};

