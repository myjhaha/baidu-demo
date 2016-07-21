function Graph_SearchDFS(opt){
  opt = opt || {};
  this.successFlag = false;
  this.heuristic = opt.heuristic || Heuristic.euclidean;
  this.allowDiagonal = opt.allowDiagonal || true;
  this.dontCrossCorners = opt.dontCrossCorners || false;
  this.diagonalMovement = opt.diagonalMovement || DiagonalMovement.Always;
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

Graph_SearchDFS.prototype.runFindPath = function*(from,to, graph, pathFinder){
  var successFlag = false;
  var openSet = new Queue();
  var startNode = graph.getNode(from);
  startNode.parent = null;
  var endNode = graph.getNode(to);
  var diagonalMovement = this.diagonalMovement || DiagonalMovement.Never;
  var abs = Math.abs;
  if(startNode === undefined || startNode === null){
    throw new Error("DFSFinder: Cannot get startNode.");
  }
  if(endNode === undefined || endNode === null){
    throw new Error("DFSFinder: Cannot get endNode.");
  }
  graph.cleanNodeState(); //清理掉opened closed 标志
  openSet.push(startNode);
  startNode.opened = true;
  startNode.closed = false;
  startNode.g =0;   //到start的真实距离，随着搜索的展开，会不断更新
  startNode.h =0;
  startNode.f =0;   //g+h 的结果，其中h为启发式评估当前点到终点的距离
  var iStep = 1;
  while(!openSet.isEmpty()){
    var node = openSet.pop();
    yield iStep ++;
    node.closed = true;
    node.opened = false;
    if(node === endNode){
      successFlag = true;
       //告诉PathFinder 跑完了 
      console.log("Get the path from["+startNode.extraInfo.index2D[0]+","+startNode.extraInfo.index2D[1]+"]"+
        " to["+endNode.extraInfo.index2D[0]+","+endNode.extraInfo.index2D[1]+"]");
      pathFinder.setPath( backtrace(node)); // return [[x0,y0] .... [x_n,y_n]]
      pathFinder.setRunningState(2); 
      return;
    }
    
    var neighbours = graph.getNeighbours(node, diagonalMovement);
    for(var i=0;i<neighbours.length;i++){
      var neighbour = neighbours[i]
      if(neighbour.closed || neighbour.opened){
        continue;
      }
      neighbour.parent = node;
      openSet.push(neighbour);
      neighbour.opened = true;
      neighbour.closed = false;
      yield iStep ++;
    } //for loop end
  }//main loop end
  console.log("No path from["+startNode.extraInfo.index2D[0]+","+startNode.extraInfo.index2D[1]+"]"+
        " to["+endNode.extraInfo.index2D[0]+","+endNode.extraInfo.index2D[1]+"]");
  pathFinder.setPath([]);
}
Graph_SearchDFS.prototype.setHeuristic  = function(callback){
  this.heuristic = callback;
}