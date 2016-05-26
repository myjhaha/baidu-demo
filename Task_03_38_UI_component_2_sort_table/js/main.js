
var tableContent = $("#table-content");
var createBtn = $("#generate-table");


function createTableFun(){
  //数据格式示例
  var data = {
    head:["学号","分数1","分数2"],
    data:[
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)],
      [randomIntStr(0,100)+"",randomNum(0,10),randomNum(0,10)]
    ]
  };
  var t = new SortableTable(data);
  tableContent.innerHTML="";
  tableContent.appendChild(t.getTableDOM());
}

addEventHandler(createBtn,"click",createTableFun);

window.onload = function(e){
  //用testData的数据建一个可排序表格
  var t = new SortableTable(testData);
  tableContent.appendChild(t.getTableDOM());
}