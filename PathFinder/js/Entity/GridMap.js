
// var BlockRock = (function(){
//   function init(){
//     return {
//       isWalkable: function(){ return BlockTable.rock.walkable},
//       getCostRate: function(){ return BlockTable.rock.cost}
//       render: function(x,y,w){
//         context.fillStyle = BlockTable.rock.color;
//         context.fillRect(x-w/2+1, y-w/2+1, w-2,w-2);
//       }
//     }
//   }
//   return init();
// })();

var BlockType = {
  empty: 1,
  rock:  2,
  wood:  3,
  water: 4
};

/**
 * 地图单个节点类
 */
function GridNode(row,col,px,py,w,walkable){
  this.width = w;
  this.pos = new Vector2D(px,py);
  this.row = row;
  this.col = col;
  this.walkable = walkable;
}
GridNode.prototype.getPos = function() {
  return this.pos;
};
GridNode.prototype.getWidth = function(){
  return this.width;
};
GridNode.prototype.setWalkable = function(walkable){
  this.walkable = walkable;
};
GridNode.prototype.isWalkable = function(){
  return this.walkable;
};
GridNode.prototype.clone = function(){
  var w = this.walkable;
  var px = this.pos.x;
  var py = this.pos.y;
  var row = this.row;
  var col = this.col;
  var walkable = this.walkable;
  return new GridNode(row,col,px,py,w,walkable);
};
// GridNode.prototype.render = function(){
//   if(this.m_Walkable){
//     context.fillStyle = "rgba(255,255,255,0.6)";
//   }else{
//     context.fillStyle = "rgba(255,16,16,0.6)";
//   }
  
//   context.fillRect(x-w/2+1, y-w/2+1, w-2,w-2);
// }

/**
 * 地图类
 */
function GridMap(){
  this.matrix = null;
  this.rows = -1;
  this.cols = -1;
  this.gridNodeWidth = -1;
  this.viewWidth = -1;   //显示宽度
  this.viewHeight  = -1;  //显示高度
  this.nodeMap2D = null;
  //this._init(m_GridRows, m_GridCols, m_GridNodeWidth, m_Matrix);
}

GridMap.prototype.init = function (_rows,_cols,_w,_matrix){
  this.matrix = _matrix;
  this.rows = _rows;
  this.cols = _cols;
  this.gridNodeWidth = _w;
  this.viewWidth = _cols * _w;   //显示宽度
  this.viewHeight  = _rows * _w;  //显示高度
  this.nodeMap2D = new Array(_rows);
  for (var i=0;i<_rows;i++) {
    this.nodeMap2D[i] = new Array(_cols);
    for(var j=0;j<_cols;j++){
      this.nodeMap2D[i][j] = new GridNode(i,j,       // row col 
                                  _w/2+(_w)*j,  // pos.x
                                  _w/2+(_w)*i,  // pos.y
                                  _w,
                                  true);        // w
    }
  }
  for (var i=0;i<_rows;i++) {
    for(var j=0;j<_cols;j++){
      var index = _cols*i+j;
      if( _matrix[index] == 0){
        this.nodeMap2D[i][j].walkable = (true);
      }else{
        this.nodeMap2D[i][j].walkable = (false);
      }
    }
  }
  console.log("["+_rows+","+_cols+","+_w+"]");
}

  //-- --//
GridMap.prototype.render = function(){
  for (var i = this.nodeMap2D.length - 1; i >= 0; i--) {
    for (var j = this.nodeMap2D[i].length - 1; j >= 0; j--) {
      //m_Graph[i][j].render();
      if(this.nodeMap2D[i][j].walkable){
        context.fillStyle = "rgba(255,255,255,0.6)";
      }else{
        context.fillStyle = "rgba(16,16,16,0.6)";
      } 
      var w = this.gridNodeWidth;
      context.fillRect( (w)*j+1, 
                        (w)*i+1, w-2,w-2);
    };
  };

};

GridMap.prototype.clone = function(){
    var newGridMap = new GridMap();
    newGridMap.matrix = this.matrix;
    newGridMap.rows =  this.rows;
    newGridMap.cols = this.cols;
    newGridMap.gridNodeWidth = this.gridNodeWidth ;
    newGridMap.viewWidth = this.viewWidth;     //显示宽度
    newGridMap.viewHeight  = this.viewHeight;  //显示高度
    newGridMap.nodeMap2D = new Array(this.rows);
    var _w = newGridMap.gridNodeWidth;
    for (var i=0;i<this.rows;i++) {
      newGridMap.nodeMap2D[i] = new Array(this.cols);
      for(var j=0;j<this.cols;j++){
        this.nodeMap2D[i][j] = new GridNode(i,j,       // row col 
                                    _w/2+(_w)*j,  // pos.x
                                    _w/2+(_w)*i,  // pos.y
                                    _w,
                                    this.nodeMap2D[i][j].walkable);        // w
      }
    }
  };

GridMap.prototype.getNodeMap2D = function(){
  return this.nodeMap2D;
};

GridMap.prototype.getNodeWidth = function(){
  return this.gridNodeWidth;
};
GridMap.prototype.getRows = function(){
  return this.rows;
};
GridMap.prototype.getCols = function(){
  return this.cols;
};
GridMap.prototype.getNode = function(row,col){
  if(row>=0 && row<this.rows && col>=0 && col<this.cols){
    return this.nodeMap2D[row][col];
  }else{
    return null;
  }
};
GridMap.prototype.isIndex2DAvailable = function(row,col){
    return row>=0 && row<this.rows && col>=0 && col<this.cols;
};
GridMap.prototype.isWalkableAt = function(row,col){
    return row>=0 && row<this.rows && col>=0 && col<this.cols && this.nodeMap2D[row][col].walkable;
};
GridMap.prototype.setWalkableAt = function(row,col,walkable){
  if(row>=0 && row<this.rows && col>=0 && col<this.cols)
    this.nodeMap2D[row][col].setWalkable(walkable);
};
GridMap.prototype.getNeighborNodes = function(row,col,movementMethod){
    var neighbors = [],
        s0 = false, d0 = false,
        s1 = false, d1 = false,
        s2 = false, d2 = false,
        s3 = false, d3 = false,
        nodes = this.nodeMap2D;
    if(this.isWalkableAt(row-1,col)){
      s0 = true;
      neighbours.push(nodes[row-1][col]);
    }
    if(this.isWalkableAt(row,col+1)){
      s1 = true;
      neighbours.push(nodes[row][col+1]);
    }
    if(this.isWalkableAt(row+1,col)){
      s2 = true;
      neighbours.push(nodes[row+1][col]);
    }
    if (this.isWalkableAt(row,col-1)) {
      s3 = true;
      neighbours.push(nodes[row][col-1]);
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
    if (d0 && this.isWalkableAt(row-1, col-1)){
      neighbours.push(nodes[row-1][col-1]);
    }
    if (d1 && this.isWalkableAt(row-1,col+1)){
      neighbours.push(nodes[row-1][col+1]);
    }
    if(d2 && this.isWalkableAt(row+1,col+1)){
      neighbours.push(nodes[row+1][col+1]);
    }
    if(d3 && this.isWalkableAt(row+1,col-1)){
      neighbours.push(nodes[row+1][col-1]);
    }
    return neighbours;
  };