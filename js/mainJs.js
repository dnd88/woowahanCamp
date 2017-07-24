//service code
document.addEventListener('DOMContentLoaded', function(){
	
	//두번째 탭
	var tab2Btn = document.querySelector(".products_tabs_wrap .tabs");
	var TabControllerInstance = new TabController(tab2Btn);

	var tab2Content = document.querySelector(".content_mid");//하나 윗단계 동적이지 않은 곳에 이벤트를 걸어주기
	var ShowDetailInstance = new ShowDetail(tab2Content);

	var roll1Content = document.querySelector("#rollBox");
	var ShowDetailInstance2 = new ShowDetail(roll1Content);

	//초기 탭값 불러오기
	document.querySelector(".products_tabs_wrap .tabs .now").click();//성공

	//초기 롤값 불러오기
	ShowRollInstance.mainControl();
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
		document.querySelector(".content_mid").innerHTML = "";
		document.querySelector(".content_mid").appendChild(newNode); //미완 위치
		 
		//여기까지 끝나면... css 스타일 디폴트의 이미지가 나감, 스타일 적용 필요
		document.querySelector(".content_mid ul").className = "prds_list";
	}
	templateControlForTemplate(htData){
		var spot = document.querySelector("#listTemplate");
		//spot.innerHTML="";//다 지워주기 
		console.log(spot);
		console.log(htData);
		spot.innerHTML = htData;
	}
	test(htData){
		console.log(htData.items[0].image);
	}	
	
	//급해서 2개만듬... 인자값 추가로 한 함수로 만들것 
	templateControl2(htData){//인자값:: 템플릿 아이디, 뿌려줄 위치 추가하기 
		var theTemplateScript = document.querySelector("#listTemplate2").innerHTML; 
		var theTemplate = Handlebars.compile(theTemplateScript);
		var theCompiledHtml = theTemplate(htData);
		document.querySelector("#rollBox").innerHTML = theCompiledHtml;
	}
	templateControlForTemplate2(htData){
		var spot = document.querySelector("#listTemplate2");
		//spot.innerHTML="";//다 지워주기 
		console.log(spot);
		console.log(htData);
		spot.innerHTML = htData;
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

		this.templateUrl = "./template/template1.txt";
		this.init();
	}
	init(){
		this.baseElement.addEventListener("click", this.mainControl.bind(this));
	}
	mainControl(event){
		//1.현재 index 체크 해제
		document.querySelector(".tabs .now").className ="";
		
		//2.눌린 위치 체크
		var checkedTabNum = UtilInstance.replaceNum(event.target.id);
		document.querySelector(".tabs #tab"+checkedTabNum).className = "now";
		
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
		this.location = './detailView.html?detail_hash=';
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
		location.href = this.location + productId;
		//3.ajax호출로 받아와서... 다음페이지?다음페이로 url에 맵형식으로 보낼까 (모달이면 이페이지에서 정보를 뿌리는거니까 더 쉬운데)

	}
}

const ShowRoll = class{
	constructor(){
		this.url = "http://52.78.212.27:8080/woowa/main"; 
		this.templateUrl = "./template/template3.txt";
	}
	init(){

	}
	mainControl(){
		//3.ajax 호출 - 결과:: (data넘겨서)템플릿작업과 뿌려주는 기능 호출
		//템플릿 먼저 받아오기
		UtilInstance.callAjaxForTemplate(this.templateUrl, UtilInstance.templateControlForTemplate2);
		//데이터 받아오기
		UtilInstance.callAjax(this.url, UtilInstance.templateControl2);
		
	}
}
var ShowRollInstance = new ShowRoll();
