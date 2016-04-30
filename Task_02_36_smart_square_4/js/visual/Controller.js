

var Controller = {
  grid:null,
  player:null,
  getPlayer: function(){
    return this.player;
  },
  getGrid: function(){
    return this.grid;
  },
  getEmptyNodes :function(){
    var arr = [];
    for(var i =0; i< this.grid.nodes.length;i++){
      for(var j =0;j< this.grid.nodes[i].length;j++){
        if(this.grid.nodes[i][j].nodeType == "empty"){
          if( this.grid.nodes[i][j].x !== this.player.x ||
              this.grid.nodes[i][j].y !== this.player.y  ){
            arr.push(this.grid.nodes[i][j]);
          }
            
        }
      }
    }
    return arr;
  },
  init:function(width,height){
    this.grid = new Grid(width,height);
    this.player = new Player(random(0,width),random(0,height));

    if(!this.grid.isInside(this.player.x, this.player.y)){
      throw new Error("player is not inside the grid.");
    }
    View.init(width,height);
    View.generateGrid();

    View.setPlayerPos(this.player.x,this.player.y);
  },
  reset: function(){
    console.log("棋盘清空");
    this.init(this.grid.width,this.grid.height);
  },
  playerTurn:function(flag){
    switch(flag){
      case "LEFT":
        this.player.turnLeft();
        View.setPlayerDir(this.player.direction);
        break;
      case "RIGHT":
        this.player.turnRight();
        View.setPlayerDir(this.player.direction);
        break;
      case "BACK":
        this.player.turnBack();
        View.setPlayerDir(this.player.direction);
        break;
      default: 
        throw new Error("Instruction error");
    }
  },
  setPlayerDirection: function(flag){
    switch(flag){
      case "TOP":
      case Direction.UP:
        this.player.setDirection(Direction.UP);
        View.setPlayerDir(Direction.UP);
        break;
      case "BOTTOM":
      case Direction.DOWN:
        this.player.setDirection(Direction.DOWN);
        View.setPlayerDir(Direction.DOWN);
        break;
      case "RIGHT":
      case Direction.RIGHT:
        this.player.setDirection(Direction.RIGHT);
        View.setPlayerDir(Direction.RIGHT);
        break;
      case "LEFT":
      case Direction.LEFT:
        this.player.setDirection(Direction.LEFT);
        View.setPlayerDir(Direction.LEFT);
        break;
      default:
        throw new Error("Direction Error");
    }
  },
  getPlayerDirection:function(){
    return this.player.getDirection();
  },
  playerTransfer: function(flag){
    var x = this.player.x;
    var y = this.player.y;
    var newX = x;
    var newY = y;
    switch(flag){
      case "TOP":
        newY -= 1;
        break;
      case "RIGHT":
        newX += 1;
        break;
      case "BOTTOM":
        newY += 1;
        break;
      case "LEFT":
        newX -= 1;
        break;
      default:
        throw new Error("Directio Error");
    }
    if(this.grid.isWalkableAt(newX, newY)){
      this.player.setPos(newX, newY);
      View.setPlayerPos(newX, newY);
      return true;
    }else{
      console.log("TRA ("+x +","+y+") -- > ("+newX +","+newY+") 没法走了");
      return false;
    }
  },
  playerGo: function(){
    var p = this.player.direction;
    var x = this.player.x;
    var y = this.player.y;
    var newX = x;
    var newY = y;
    switch(p){
      case Direction.UP:
        newY -= 1;
        break;
      case Direction.RIGHT:
        newX += 1;
        break;
      case Direction.DOWN:
        newY += 1;
        break;
      case Direction.LEFT:
        newX -= 1;
        break;
      default:
        throw new Error("Directio Error");
    }
    if(this.grid.isWalkableAt(newX, newY)){
      this.player.setPos(newX, newY);
      View.setPlayerPos(newX, newY);
      return true;
    }else{
      console.log("("+x +","+y+") -- > ("+newX +","+newY+") 没法走了");
      return false;
    }
  },
  playerBuild:function(){
    var p = this.player.direction;
    var x = this.player.x;
    var y = this.player.y;
    var newX = x;
    var newY = y;
    switch(p){
      case Direction.UP:
        newY -= 1;
        break;
      case Direction.RIGHT:
        newX += 1;
        break;
      case Direction.DOWN:
        newY += 1;
        break;
      case Direction.LEFT:
        newX -= 1;
        break;
      default:
        throw new Error("Directio Error");
    }
    if(this.grid.isInside(newX,newY) ){
      this.grid.buildNodeAt(newX,newY,"brick");
      View.setColorAt(newX,newY,this.grid.nodes[newY][newX].color);
    }else{
      console.log("没法在位置(" + newX +"," +newY+")法建造墙");
    }
  },
  playerBrush: function(color){
    var p = this.player.direction;
    var x = this.player.x;
    var y = this.player.y;
    var newX = x;
    var newY = y;
    switch(p){
      case Direction.UP:
        newY -= 1;
        break;
      case Direction.RIGHT:
        newX += 1;
        break;
      case Direction.DOWN:
        newY += 1;
        break;
      case Direction.LEFT:
        newX -= 1;
        break;
      default:
        throw new Error("Directio Error");
    }
    if(this.grid.isInside(newX,newY)) {
      if(this.grid.nodes[newY][newX].nodeType =="brick" ){
        this.grid.nodes[newY][newX].color = color;
        View.setColorAt(newX,newY,color);
      }else{
        console.log("位置(" + newX +"," +newY+")并没有墙，没法刷");
      }
    }else{
      console.log("位置(" + newX +"," +newY+")已经越界了");
    }
  },
  playerMovTo:function(x,y,method){
    var method = method || "AStar";

  },
  randomBuildBrick: function(){
    var w = this.grid.width;
    var h = this.grid.height;
    var arr = this.getEmptyNodes();
    if(arr.length <=1 ){
      return false;
    }
    var i = random(0,arr.length);
    this.grid.buildNodeAt(arr[i].x,arr[i].y,"brick");
    View.setColorAt(arr[i].x,arr[i].y,this.grid.nodes[arr[i].y][arr[i].x].color);
    
  }

}