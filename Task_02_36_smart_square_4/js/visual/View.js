var View = {
  nodeSize: 14,
  nodeStyle:{
    rotate_0:{
      transform:"rotate(0)",
      "z-index":100
    },
    rotate_90:{
      transform:"rotate(90deg)",
      "z-index":100
    },
    rotate_180:{
      transform:"rotate(180deg)",
      "z-index":100
    },
    rotate_270:{
      transform:"rotate(270deg)",
      "z-index":100
    }
  },
  init:function(width,height){
    this.checkerboard = $("#checkerboard");
    this.domGrid = null;
    this.playerDom = $("#player_1");
    this.numCols = width;
    this.numRows = height;
  },
  generateGrid:function(){
    var checkerboardDiv = this.checkerboard || $("#checkerboard");
    var i,j,rowDiv;
    var width = this.numCols;
    var height = this.numRows;
    checkerboardDiv.innerHTML = "";
    this.domGrid = new Array(this.numRows);
    for(i=0;i<height;i++){
      rowDiv = document.createElement("div");
      rowDiv.className="row";
      rowDiv.setAttribute("row-id",i);
      this.domGrid[i] = new Array(this.numCols);
      for(j=0;j<width;j++){
        var nodeDiv = document.createElement("div");
        nodeDiv.setAttribute("index-x", j);
        nodeDiv.setAttribute("index-y", i);
        nodeDiv.className = "cell";
        rowDiv.appendChild(nodeDiv);
        this.domGrid[i][j] = nodeDiv;
      }
      checkerboardDiv.appendChild(rowDiv);
    }
  },
  setPlayerAttr:function(styleObj){
    for(var key in styleObj){
      this.playerDom.style[key] = styleObj[key];
    }
  },
  setPlayerDir:function(dirFlag){
    switch(dirFlag){
      case Direction.UP:
        this.setPlayerAttr(View.nodeStyle.rotate_0);
        break;
      case Direction.RIGHT:
        this.setPlayerAttr(View.nodeStyle.rotate_90);
        break;
      case Direction.DOWN:
        this.setPlayerAttr(View.nodeStyle.rotate_180);
        break;
      case Direction.LEFT:
        this.setPlayerAttr(View.nodeStyle.rotate_270);
        break;
      default:
        throw new Error("Direction Error with:"+dirFlag );
    }
  },
  setPlayerPos:function(gridX,gridY){
    var p = this.toPageCoordinate(gridX,gridY);
    this.playerDom.style.left = p[0]+"px";
    this.playerDom.style.top = p[1]+"px";
    //this.playerDom.style.transition = "";
    
  },
  toPageCoordinate: function(gridX, gridY) {
        return [
            gridX * this.nodeSize + this.nodeSize,
            gridY * this.nodeSize + this.nodeSize
        ];
  },
  toGridCoordinate: function(pageX, pageY) {
        return [
            Math.floor(pageX / this.nodeSize),
            Math.floor(pageY / this.nodeSize)
        ];
    },
  setRunCmdBtnAvaliable: function(flag){
    var runBtn = $("#run-cmd-btn");
    if(flag){
      runBtn.attributes.removeNamedItem("disabled");
    }else{
      runBtn.setAttribute("disabled","disabled");
    }
  },
  setColorAt: function(x,y,color){
    this.domGrid[y][x].style.backgroundColor = color;
  },
  setErrorLine: function(line){
    var rowNumList = $("#row-number-list");
    var allDivs = rowNumList.childNodes;
    allDivs[line].classList.add("ERROR");
  },
  markCurLine: function(cur){
    var allDivs = document.querySelectorAll("#row-number-list > div");
    for (var i = allDivs.length - 1; i >= 0; i--) {
      allDivs[i].className="";
    };
    allDivs[cur].classList.add("CUR");
  },
  clearRowNumbers:function(){
    var allDivs = document.querySelectorAll("#row-number-list > div");
    for (var i = allDivs.length - 1; i >= 0; i--) {
      allDivs[i].className="";
    };
  },
  clearCellsStyle:function(){
    var width = this.numCols;
    var height = this.numRows;
    for(var i=0;i<height;i++){
      for(var j=0;j<width;j++){
        if(Controller.grid.nodes[i][j].nodeType === "empty"){
          this.domGrid[i][j].style.backgroundColor="";
        }else{
          this.domGrid[i][j].style.backgroundColor = Controller.grid.nodes[i][j].color;
        }
      }
    }
  }
};