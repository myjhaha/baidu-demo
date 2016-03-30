/**
 *
 * a wrap function...
 */
 (function(){ window.onload = function(){

/**** all begin here.     ******/

var aqi_city_input = document.getElementById("aqi-city-input");
var aqi_value_input = document.getElementById("aqi-value-input");
var add_btn = document.getElementById("add-btn");
var table = document.getElementById("aqi-table");
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = aqi_city_input.value;
	var val = parseInt(aqi_value_input.value);
	aqiData[city] = val;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var str = "<tr><th>城市</th><th>空气质量</th><th>操作</th></tr>";
	for(var key in aqiData){
		str += ("<tr>" +
					"<td>" + key + "</td>" +
					"<td>" + aqiData[key] + "</td>" +
					"<td><button>删除</button></td>" +
				"</tr>"
			);
	}
	table.innerHTML = str;
}



/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  	addAqiData();
  	renderAqiList();

	console.log( aqiData );
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
  // do sth.
  	var cityToDel = this.parentNode.parentNode.firstChild.innerHTML ;
  	delete aqiData[cityToDel];
  	renderAqiList();
}

/**
 * 
 *
 */
function delegateEvent(sender){	
	console.log(sender);
	var target = sender.target;
	if(target && (target.tagName == "BUTTON") ){
		delBtnHandle.call(target);
	}
	
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  	add_btn.onclick = addBtnHandle;

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  	table.addEventListener("click", delegateEvent, false);

}

init();


/********** wrap function end  *************/
}})();
