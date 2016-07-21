function Graph_SearchAStar(opt){
  opt = opt || {};
  this.successFlag = false;
  this.heuristic = opt.heuristic || Heuristic.manhattan;
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

Graph_SearchAStar.prototype.runFindPath = function*(from,to, graph, pathFinder){
  var successFlag = false;
  var openSet = new PriorityQueue(function(a,b){
        return (b.f - a.f);
      });
  var startNode = graph.getNode(from);
  startNode.parent = null;
  var endNode = graph.getNode(to);
  var heuristic = this.heuristic || Heuristic.manhattan;
  var diagonalMovement = this.diagonalMovement || DiagonalMovement.Never;
  var abs = Math.abs, SQRT2 = Math.SQRT2;
  if(startNode === undefined || startNode === null){
    throw new Error("AStarFinder: Cannot get startNode.");
  }
  if(endNode === undefined || endNode === null){
    throw new Error("AStarFinder: Cannot get endNode.");
  }
  graph.cleanNodeState(); //清理掉opened closed 标志
  openSet.push(startNode);
  startNode.opened = true;
  startNode.closed = false;
  startNode.g =0;   //到start的真实距离，随着搜索的展开，会不断更新
  startNode.f =0;   //g+h 的结果，其中h为启发式评估当前点到终点的距离
  var iStep = 1;
  while(!openSet.isEmpty()){
    var node = openSet.shift();
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
      var neighbour = neighbours[i];
      if(neighbour.closed){
        continue;
      }
      var x = neighbour.extraInfo.index2D[0];
      var y = neighbour.extraInfo.index2D[1];
      var neighbourG = node.g + ((x - node.extraInfo.index2D[0] ===0 || y - node.extraInfo.index2D[1] === 0)?1:SQRT2);
      if(!neighbour.opened || neighbourG < neighbour.g){
        neighbour.g = neighbourG;
        neighbour.h = this.weight * heuristic(abs(x - endNode.extraInfo.index2D[0]), abs(y - endNode.extraInfo.index2D[1]));
        
        neighbour.f = neighbour.g + neighbour.h;
        // console.log( "g:"+(neighbour.g).toFixed(2) +
        //             " h:"+(neighbour.h).toFixed(2)  + 
        //             " f:"+(neighbour.f).toFixed(2) );
        neighbour.parent = node;
        if(!neighbour.opened){
          openSet.push(neighbour);
          neighbour.opened = true;
          neighbour.closed = false;
          yield iStep ++;
        }else{
          openSet.updateItem(neighbour);
        }
      }
    } //for loop end
  }//main loop end
  console.log("No path from["+startNode.extraInfo.index2D[0]+","+startNode.extraInfo.index2D[1]+"]"+
        " to["+endNode.extraInfo.index2D[0]+","+endNode.extraInfo.index2D[1]+"]");
  pathFinder.setPath([]);
};

Graph_SearchAStar.prototype.setHeuristic  = function(callback){
  this.heuristic = callback;
}
