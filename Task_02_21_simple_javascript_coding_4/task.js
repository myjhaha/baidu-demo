// test String
/**
 * 
  中国中国中中国国中
 中国， 美国, 中国，美国,，意大利 越南　蒙古。朝鲜．德国，．日本．苏联、菲律宾/韩国 
 
 英国 俄国;德国.意大利/越南=菲律宾-蒙古+朝鲜）
 
 韩国  
 加拿大 　日本，，，,,，苏联 印度 以色列
 中国中国中中国国中
 */


/**
 * 一个类
 */
function TagShow(){
	var o = new Object();
	o.inputTarget = null;
	o.renderTarget = null;
	o.queueData = [];
	o.has = function(tag){
		if (tag == "")
			return false;
		for (var i = o.queueData.length - 1; i >= 0; i--) {
			if(tag == o.queueData[i])
				return true;
		};
		return false;
	}
	o.pushTag = function(tag){
		if (tag && tag != "") {
			var arr = parseInput(tag);
			for (var i = 0; i < arr.length; i++) {
				if(!o.has(arr[i])){
					if(o.queueData.length >= 10){
						o.queueData.shift();
					}
					o.queueData.push(arr[i]);
				}
			}
		}
	}; 
	o.splice = function(index){
		return o.queueData.splice(index,1);
	};
	o.render = function(){
		if(o.renderTarget){
			var str = "";
			o.queueData.filter(function(e){return (e && e != "");}).map(function(e){
				str += ( "<div class=\"list-item\">" + e + "</div>" );
			});
			o.renderTarget.innerHTML = str;
		}
		
	}
	
	o.bindRenderDiv = function(_renderTarget){
		o.renderTarget = _renderTarget;
		addEventHandler(o.renderTarget, "click", delegateDeleteEvent);
	}
	o.init = function( _renderTarget){
		console.log(o);
		o.renderTarget = _renderTarget;
		//addEventHandler(o.inputTarget, "keyup", inputTxtChange);
		addEventHandler(o.renderTarget, "click", delegateDeleteEvent);
		// test
		o.queueData.push("ab");
		o.queueData.push("abcdc");
	};
	//private function

	function delegateDeleteEvent(ev){
		var target = ev.target;
		if(target && target.tagName == "DIV" && target.className == "list-item"){
			var index = [].indexOf.call(target.parentNode.children, target);
			o.queueData.splice(index,1);
			o.render();
		}
	}
	//u3002 全角空心句号
	//uff0c 全角空心逗号
	//uff0e 全角实心句号
	//u3000 全角空格
	//u3001 全角顿号
	//uFF1B 全角分号
	//u003b 分号
	function parseInput(str){
		var arr = str.split(/[\s\u003b\uff1b\u3002\u002c\u3001\uff0c\u3000\uff0e\u002e\u000d\u000a\u002f]+/).filter(function(e){return (e && e!="");});
		console.log(arr);
		return arr;
	}
	return o;
}
 
/**
 * page 
 */
var intpuTxt1;
var intpuTxt2;
var intpuTxt3;
var tagContainer1;
var tagContainer2;
var tagContainer3;
var commitBtn;
/**
 * 事件插入浏览器兼容
 */
function addEventHandler(element, ev, handler){
  if(element.addEventListener){
    element.addEventListener(ev,handler,false);
  }else if(element.attachEvent){
    element.attachEvent("on" + ev, handler);
  }else{
    element["on" + ev] = handler;
  }
}

function initPage(){
	intpuTxt1 = intpuTxt1 || document.getElementById("input-text-1");
	intpuTxt2 = intpuTxt2 || document.getElementById("input-text-2");
	intpuTxt3 = intpuTxt3 || document.getElementById("input-text-3");
	tagContainer1 = tagContainer1 || document.getElementById("tag-container-1");
	tagContainer2 = tagContainer2 || document.getElementById("tag-container-2");
	tagContainer3 = tagContainer3 || document.getElementById("tag-container-3");
	commitBtn = commitBtn || document.getElementById("commit-btn");
}

function bindInput(tagShow, inputTxt){
	addEventHandler(inputTxt, "keyup", function(e){
		console.log(e.keyCode);
		if(	e.keyCode == 188 || e.keyCode == 191 || 
			e.keyCode == 186 || e.keyCode == 13 || 
			e.keyCode == 190 || e.keyCode == 32 ){
		var tag = inputTxt.value.trim();
		inputTxt.value = "";
		tagShow.pushTag(tag);
		tagShow.render();
	}
	});
}
function bindTags(tagShow, btn, inputTxt){
	addEventHandler(btn, "click", function(e){
		console.log(e);
		var str = inputTxt.value.trim();
		tagShow.pushTag(str);
		tagShow.render();
	});
	
}


function renderChart(tagList, target){
	tagList.render(target);
}

window.onload = function(){
	initPage();
	// tag 1
	var t1 = TagShow();
	t1.bindRenderDiv(tagContainer1);
	bindInput(t1, intpuTxt1);
	// tag 2
	var t2 = TagShow();
	t2.bindRenderDiv(tagContainer2);
	bindInput(t2, intpuTxt2);
	// tag 3
	var t3 = TagShow();
	t3.bindRenderDiv(tagContainer3);
	bindTags(t3,commitBtn,intpuTxt3);

}