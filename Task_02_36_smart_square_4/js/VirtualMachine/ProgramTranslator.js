var Token = {
  "^" :      0,
  "TUN" :    1,
  "TRA" :    2,
  "LEFT" :   3,
  "RIGHT" :  4,
  "BACK" :   5,
  "GO" :     6,
  "BOTTOM" : 7,
  "TOP" :    8,
  "MOV" :    9,
  "id" :    10,
  "BY" :     11,
  "," :      12,
  "$" :      13,
  "TO" :     14,
  "BUILD" :  15,
  "BRU" :    16
}
var stateTable = [
  //        0    1    2    3    4    5    6    7    8    9    10   11   12   13    14    15     16
  /* 0 */ [-1,   1,   3,  -1,  -1,  -1,  15,  -1,  -1,   6,  -1,  -1,  -1, 999,   -1,    17,    -1],
  /* 1 */ [-1,  -1,  -1,   2,   2,   2,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,   -1,    -1,    -1],
  /* 2 */ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, 999,   -1,    -1,    -1],
  /* 3 */ [-1,  -1,  -1,   4,   4,  -1,  -1,   4,   4,  -1,  -1,  -1,  -1,  -1,   -1,    -1,    -1],
  /* 4 */ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,   5,  -1,  -1, 999,   -1,    -1,    -1],
  /* 5 */ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, 999,   -1,    -1,    -1],
  /* 6 */ [-1,  -1,  -1,   7,   7,  -1,  -1,   7,   7,  -1,  -1,  -1,  -1,  -1,    9,    -1,    -1],
  /* 7 */ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,   8,  -1,  -1, 999,   -1,    -1,    -1],
  /* 8 */ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, 999,   -1,    -1,    -1],
  /* 9 */ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  10,  -1,  -1,  -1,   -1,    -1,    -1],
  /* 10*/ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  11,  -1,   -1,    -1,    -1],
  /* 11*/ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  12,  -1,  -1,  -1,   -1,    -1,    -1],
  /* 12*/ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  13,  -1, 999,   -1,    -1,    -1],
  /* 13*/ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  14,  -1,  -1,  -1,   -1,    14,    -1],
  /* 14*/ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, 999,   -1,    -1,    -1],
  /* 15*/ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  16,  -1,  -1, 999,   -1,    -1,    -1],
  /* 16*/ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, 999,   -1,    -1,    -1], 
  /* 17*/ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, 999,   -1,    -1,    -1],
  /* 18*/ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  19,  -1,  -1,  -1,   -1,    -1,    -1],
  /* 19*/ [-1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, 999,   -1,    -1,    -1] //END
];

  /**
   * 交付得到一个这样的指令集，保存在m_stepStack中
   * [ 
   *    [ins_1, ins_2, ins_3 ....],
   *    [ins_1, ins_2, ins_3 ....],
   *    [ins_1, ins_2, ins_3 ....]
   *     ...
   *     ...
   *  ]
   */
function parseAllScript(str){
  var inputLineBuffer = str.toUpperCase().split(/\r?\n/);
  var stepStack = [];
  var _curLineIndex = 0;
  while( _curLineIndex < inputLineBuffer.length){
    var line = inputLineBuffer[_curLineIndex];
    stepStack.push(_parseLineToInstructions(line,_curLineIndex));
    _curLineIndex ++;
  }
  return stepStack;
}
var pattern1 = /^(TUN)\s+(LEFT|RIGHT|BACK)\s*$/; 
var pattern2 = /^(TRA)\s+(LEFT|RIGHT|TOP|BOTTOM)\s*$/ ;
var pattern3 = /^(TRA)\s+(LEFT|RIGHT|TOP|BOTTOM)\s+(\d+)\s*$/ ; 
var pattern4 = /^(MOV)\s+(LEFT|RIGHT|TOP|BOTTOM)\s*$/ ;
var pattern5 = /^(MOV)\s+(LEFT|RIGHT|TOP|BOTTOM)\s+(\d+)\s*$/ ;
var pattern6 = /^(MOV\s+TO)\s+(\d+)\s*,\s*(\d+)\s*$/  ;
var pattern7 = /^(GO)\s*$/ ;
var pattern8 = /^(GO)\s+(\d)\s*$/ ;
var pattern9 = /^(BUILD)\s*$/
var pattern10 = /^(BRU)\s+(#?\w+)\s*$/;
var pattern11 = /^\s*$/;
var pattern12 = /^(MOV\s+TO)\s+(\d+)\s*,\s*(\d+)\s+BY\s+(\w+)\s*$/
function stepStackToInsList(stepStack){
  var list = [];
  for(var i = 0;i<stepStack.length;i++){
    for(var j = 0; j<stepStack[i].length;j++){
      list.push(stepStack[i][j]);
    }
  }
  return list;
}
function pathToInstructions(path,curStep){
  var insList =[];
  if(path.length <= 1)return insList;
  for(var i=1;i<path.length;i++){
    var d = getDirection(path[i-1],path[i]);
    ins = { 
            fun:Controller.setPlayerDirection, 
            params:[d],
            curLineIndex:curStep,
            extrainfo:"setDir["+d+"]"
          };
    insList.push(ins);
    ins = {
            fun:Controller.playerGo,
            params:[],
            curLineIndex:curStep,
            extraInfo:"player Go"
          };
    insList.push(ins);
  }
  return insList;
}
function _parseLineToInstructions(str,lineIndex){ 
  var insStack = [];
  str = str.trim();
  if(pattern1.test(str)){
    var res = pattern1.exec(str);
    var instruction = { 
                fun:Controller.playerTurn, 
                params:[res[2]],
                curLineIndex:lineIndex 
              };
    insStack.push(instruction);
  }else if( pattern2.test(str) ){
    var res = pattern2.exec(str);
    var instruction = { 
                fun:Controller.playerTransfer, 
                params:[res[2]],
                curLineIndex:lineIndex 
              };
    insStack.push(instruction);
  }else if( pattern3.test(str) ){
    var res = pattern3.exec(str);
    var len = parseInt(res[3]);
    for(var i =0;i<len;i++){
      var instruction = { 
                fun:  Controller.playerTransfer, 
                params:   [res[2]],
                curLineIndex:lineIndex
                };
      insStack.push(instruction);
    }
  }else if( pattern4.test(str) ){
    var res = pattern4.exec(str);
    var instruction = {
                fun:Controller.setPlayerDirection,
                params:[res[2]],
                curLineIndex:lineIndex
              };
    insStack.push(instruction);
    instruction = {
                fun: Controller.playerGo,
                params:[],
                curLineIndex:lineIndex
              };
    insStack.push(instruction);
  }else if( pattern5.test(str) ){
    var res = pattern5.exec(str);
    var instruction = {
              fun:Controller.setPlayerDirection,
              params:[res[2]],
              curLineIndex:lineIndex
        };
    insStack.push(instruction);
    var len = parseInt(res[3]);
    for(var i =0;i<len;i++){
      instruction = {
              fun:Controller.playerGo,
              params:[],
              curLineIndex:lineIndex
        };
      insStack.push(instruction);
    }
  }else if( pattern6.test(str) ){
    var res = pattern6.exec(str);
    //console.log(res);
    var pathFinder = new AStarFinder({debug:true});
    //var pathFinder = new BreathFirstFinder({debug:true});
    var p = Controller.getPlayer();
    var startX = p.x;
    var startY = p.y;
    var endX = parseInt(res[2]);
    var endY = parseInt(res[3]);
    var grid = Controller.getGrid();
    var path = pathFinder.findPath(startX,startY,endX,endY,grid.clone());
    /*  
    path.map(function(e){
      View.setColorAt(e[0],e[1],"#ccc");
    }); */
    var arr = pathToInstructions(path,lineIndex);
    //console.log(arr);
    arr.map(function(e){
      insStack.push(e);
    });
    console.log("path.length="+path.length);
  }else if( pattern7.test(str) ){
    var res = pattern7.exec(str);
    var instruction = {
            fun:Controller.playerGo,
            params:[],
            curLineIndex:lineIndex
          };
    insStack.push(instruction);
  }else if( pattern8.test(str) ){
    var res = pattern8.exec(str);
    var len = res[2];
    for(var i =0;i<len;i++){
      instruction = {
            fun:Controller.playerGo,
            params:[],
            curLineIndex:lineIndex
          };
      insStack.push(instruction);
    }
  }else if( pattern9.test(str) ){
    var res = pattern9.exec(str);
    instruction = {
              fun:Controller.playerBuild,
              params:[],
              curLineIndex:lineIndex
        };
    insStack.push(instruction);

  }else if( pattern10.test(str) ){
    var res = pattern10.exec(str);
    instruction = {
              fun:Controller.playerBrush,
              params:[res[2]],
              curLineIndex:lineIndex
        };
    insStack.push(instruction);
  }else if(pattern11.test(str)){
    // do nothing for ""
  }else if(pattern12.test(str)){
    var res = pattern12.exec(str);
    //console.log(res);
    var pathFinder;
    try{
      pathFinder = getPathFinder(res[4]);
    }
    catch(e){
      e.Errorline = lineIndex;
      throw e;
    }
    var p = Controller.getPlayer();
    var startX = p.x;
    var startY = p.y;
    var endX = parseInt(res[2]);
    var endY = parseInt(res[3]);
    var grid = Controller.getGrid();
    var path =  pathFinder.findPath(startX,startY,endX,endY,grid.clone());
    var arr = pathToInstructions(path,lineIndex);
    arr.map(function(e){
      insStack.push(e);
    });
    console.log("path.length="+path.length);
  }else{
    var e = new Error("translate line[" + lineIndex +"] - [" + str +"] Error" );
    e.Errorline = lineIndex;
    throw  e;
  }
  return insStack;
}

function getPathFinder(type){
  var t = type.toUpperCase();
  switch(t){
    case "ASTAR":
      return new AStarFinder({debug:true});
    case "BFS":
      return new BreathFirstFinder({debug:true});
    case "DFS":
      return new DepthFirstFinder({debug:true});
    default:
      throw new Error("PathFinder["+type+"] not exist..");
  }
}