
//service code
document.addEventListener('DOMContentLoaded', function(){
	
	var tabBtn = document.querySelector(".tabBtn");
	var TabControllerInstance = new TabController(tabBtn);

	var detailLink = document.querySelector(".productListContainer");//하나 윗단계 동적이지 않은 곳에 이벤트를 걸어주기
	var ShowDetailInstance = new ShowDetail(detailLink);


});


//공용 클래스(ajax)
const Util = class{
	constructor(){

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
		var newNode = document.createElement("ul");// 여기가 항상 ul은 아닐텐데
		newNode.innerHTML = theCompiledHtml;
		document.querySelector(".productListContainer").innerHTML = "";
		document.querySelector(".productListContainer").appendChild(newNode); //미완 위치
		//핸들바 임포트 시켜놓기... 템플릿을 따로 어떻게 저장하지?...  
		//여기까지 끝나면... css 스타일 디폴트의 이미지가 나감, 스타일 적용 필요
		document.querySelector(".productListContainer ul").className = "productList";
	}
	templateControlForTemplate(htData){
		var spot = document.querySelector("#listTemplate");
		console.log(spot);
		console.log(htData);
		spot.innerHTML = htData;
	}
	test(htData){
		console.log(htData.items[0].image);
	}	
	
}
var UtilInstance = new Util();



const TabController = class{
	constructor(baseElement){
		this.baseElement = baseElement;
		//this.func = func;
		//여기서만 쓰는 데이터 여기 넣어두자
		this.tabUrl1 ="http://52.78.212.27:8080/woowa/best/17011200";
		this.tabUrl2 ="http://52.78.212.27:8080/woowa/best/17011000";
		this.tabUrl3 ="http://52.78.212.27:8080/woowa/best/17010200";
		this.tabUrl4 ="http://52.78.212.27:8080/woowa/best/17010300";
		this.tabUrl5 ="http://52.78.212.27:8080/woowa/best/17011400";
		//this.tabUrl6 ="http://52.78.212.27:8080/woowa/best/17011200";

		this.templateUrl = "./templatePack/templatePack1.txt";
		this.init();
	}
	init(){
		this.baseElement.addEventListener("click", this.mainControl.bind(this));
	}
	mainControl(event){
		//1.현재 index 체크 해제
		document.querySelector(".tabBtn .now").className ="";
		
		//2.눌린 위치 체크
		var checkedTabNum = UtilInstance.replaceNum(event.target.id);
		document.querySelector(".tabBtn #tab"+checkedTabNum).className = "now";
		
		//3.ajax 호출 - 결과:: (data넘겨서)템플릿작업과 뿌려주는 기능 호출
		//템플릿 먼저 받아오기
		UtilInstance.callAjaxForTemplate(this.templateUrl, UtilInstance.templateControlForTemplate);
		//데이터 받아오기
		UtilInstance.callAjax(eval('this.tabUrl'+checkedTabNum), UtilInstance.templateControl);
		//console.log(eval('this.tabUrl'+checkedTabNum));//동적 변수명 사용 eval
	}
}


const ShowDetail = class{
	constructor(baseElement){
		this.baseElement = baseElement;
		this.baseUrl = "http://52.78.212.27:8080/woowa/detail/";
		this.init();
	}
	init(){
		this.baseElement.addEventListener("click", this.mainControl.bind(this));
	}
	mainControl(event){
		//1.무엇이 클릭되었는지 id로 체크
		var productId = event.target.id;
		console.log(productId);
		//2.ajax주소 받기, 디테일 뷰페이지로 리다이렉트? 포워드? 맵형식으로 이 상품 id값만 url로 보낼까?
		location.href = './detailView.html?detail_hash='+productId;
		//3.ajax호출로 받아와서... 다음페이지?다음페이로 url에 맵형식으로 보낼까 (모달이면 이페이지에서 정보를 뿌리는거니까 더 쉬운데)

	}
}



