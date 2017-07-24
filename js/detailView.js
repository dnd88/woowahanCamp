document.addEventListener('DOMContentLoaded', function(){
	//상품 아이디 체크
	UtilInstance.checkDetailProductId();
	ViewControllerInstance.mainControl();
});	

//공통 네
const Util = class{
	constructor(url){
		this.url = url;
		this.detailProductId = "";//이 값으로 정보 받아오기 
	}
	checkDetailProductId(){
		var temp = this.url.split("?");
		var data=temp[1].split("=");
		var key = data[0];
		var value = data[1];
		this.detailProductId = value;
		//alert(value);
	}
	callAjax(url, callback){
		var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function(e){
                var htData  = JSON.parse(oReq.responseText);
                console.log(htData);
                callback(htData);
        });
        oReq.open("GET", url);
        oReq.send(); 
	}
	callAjaxForTemplate(url, callback){
		var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function(e){
               
                var htData  = oReq.responseText;//JSON.parse 뺴면 문자열로 오니까 
                console.log(htData);
                callback(htData);
        });
        oReq.open("GET", url);
        oReq.send(); 
	}
	replaceNum(string){//정규표현식, 숫자만남기기, int값으로 전달
	    var result;
	    result = string.replace(/[^0-9]/g,"");
	    return parseInt(result);
	}
	templateControl(htData){//인자값:: 템플릿 아이디, 뿌려줄 위치 추가하기 
		var theTemplateScript = document.querySelector("#listTemplate").innerHTML; 
		var theTemplate = Handlebars.compile(theTemplateScript);
		var theCompiledHtml = theTemplate(htData);
		//document.querySelector(".product_detail_top .clearfix").innerHTML = "";
		document.querySelector(".clearfix").innerHTML = theCompiledHtml;
	
	}
	templateControlForTemplate(htData){
		var spot = document.querySelector("#listTemplate");
		console.log(spot);
		console.log(htData);
		spot.innerHTML = htData;
	}
}
var UtilInstance = new Util(location.href);//현재 url전달

const ViewController = class{
	constructor(){
		this.url = "http://52.78.212.27:8080/woowa/detail/";
		this.templateUrl = "./template/template2.txt";
	}
	init(){

	}
	mainControl(){
		//3.ajax 호출 - 결과:: (data넘겨서)템플릿작업과 뿌려주는 기능 호출
		//템플릿 먼저 받아오기
		UtilInstance.callAjaxForTemplate(this.templateUrl, UtilInstance.templateControlForTemplate);
		//데이터 받아오기
		UtilInstance.callAjax(this.url + UtilInstance.detailProductId, UtilInstance.templateControl);
		
	}
}
var ViewControllerInstance = new ViewController();
