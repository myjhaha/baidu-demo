function Graph_SearchDBFS(opt){
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

Graph_SearchDBFS.prototype.runFindPath = function*(from,to, graph, pathFinder){
  var successFlag = false;
  var openSetStart = new Queue();
  var openSetEnd = new Queue();
  var startNode = graph.getNode(from);
  startNode.parent = null;
  var endNode = graph.getNode(to);
  var diagonalMovement = this.diagonalMovement || DiagonalMovement.Never;
  var abs = Math.abs;
  var path0 = null;
  var path1 = null;
  if(startNode === undefined || startNode === null){
    throw new Error("BFSFinder: Cannot get startNode.");
  }
  if(endNode === undefined || endNode === null){
    throw new Error("BFSFinder: Cannot get endNode.");
  }
  graph.cleanNodeState(); //清理掉opened closed 标志
  // startQueue
  openSetStart.push(startNode);
  startNode.opened = true;
  startNode.closed = false;
  startNode.g =0;   //到start的真实距离，随着搜索的展开，会不断更新
  startNode.h =0;   //标记这是从start开始找的
  startNode.f =0;   // 
  // endQueue
  openSetEnd.push(endNode);
  endNode.opened = true;
  endNode.closed = false;
  endNode.g =0;   //到start的真实距离，随着搜索的展开，会不断更新
  endNode.h =1;   //标记这是从end开始找的
  endNode.f =0;   // 
  var iStep = 1;
  while(!openSetStart.isEmpty() && !openSetEnd.isEmpty()){
    var len1 = openSetStart.getLength();
    var len2 = openSetEnd.getLength();
    var openSet;
    if(len1 < len2){
      openSet = openSetStart;
    }else{
      openSet = openSetEnd;
    }
    var node = openSet.shift();
    yield iStep ++;
    node.closed = true;
    node.opened = false;
    // if(node === endNode){
    //   successFlag = true;
    //    //告诉PathFinder 跑完了 
    //   console.log("Get the path from["+startNode.extraInfo.index2D[0]+","+startNode.extraInfo.index2D[1]+"]"+
    //     " to["+endNode.extraInfo.index2D[0]+","+endNode.extraInfo.index2D[1]+"]");
    //   pathFinder.setPath( backtrace(node)); // return [[x0,y0] .... [x_n,y_n]]
    //   pathFinder.setRunningState(2); 
    //   return;
    // }
    
    var neighbours = graph.getNeighbours(node, diagonalMovement);
    for(var i=0;i<neighbours.length;i++){
      var neighbour = neighbours[i];
      if(node.h == 0 && neighbour.h == 1){
        //get it 
        path0 = backtrace(node);
        path1 = backtraceNoReverse(neighbour);
        var pathTmp = path0.concat(path1);
        pathFinder.setPath(pathTmp);
        pathFinder.setRunningState(2); 
        console.log("Get the path from["+startNode.extraInfo.index2D[0]+","+startNode.extraInfo.index2D[1]+"]"+
           " to["+endNode.extraInfo.index2D[0]+","+endNode.extraInfo.index2D[1]+"] len["+pathTmp.length+"]");
        return;
      }else if(node.h ==1 && neighbour.h == 0){
        // get it
        path0 = backtrace(neighbour);
        path1 = backtraceNoReverse(node);
        var pathTmp = path0.concat(path1);
        pathFinder.setPath(pathTmp);
        pathFinder.setRunningState(2); 
        console.log("Get the path from["+startNode.extraInfo.index2D[0]+","+startNode.extraInfo.index2D[1]+"]"+
          " to["+endNode.extraInfo.index2D[0]+","+endNode.extraInfo.index2D[1]+"] len["+pathTmp.length+"]");

        return;
      };

      if(neighbour.closed || neighbour.opened){
        continue;
      }
      neighbour.parent = node;
      neighbour.h = node.h;
      openSet.push(neighbour);
      neighbour.opened = true;
      neighbour.closed = false;
      yield iStep ++;
    } //for loop end
  }//main loop end
  console.log("No path from["+startNode.extraInfo.index2D[0]+","+startNode.extraInfo.index2D[1]+"]"+
        " to["+endNode.extraInfo.index2D[0]+","+endNode.extraInfo.index2D[1]+"]");
  pathFinder.setPath([]);
};

Graph_SearchBFS.prototype.setHeuristic  = function(callback){
  this.heuristic = callback;
}