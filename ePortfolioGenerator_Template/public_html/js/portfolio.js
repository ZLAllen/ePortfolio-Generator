/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//PATH
var IMG_PATH;
var DATA_PATH;
var CSS_PATH;
var VIDEO_PATH;
var ICON_PATH;
var SLIDESHOW_SLEEP_TIME;
var FADE_TIME;
var SCALED_IMAGE_HEIGHT;


//DATA
var template;
var color;
var font;
var student;
var navbar;
var page;
var collection;
var currentSlide;

// TIMER FOR PLAYING SLIDESHOW
var timer;

// COUNTER FOR SLIDESHOW COMPONENT
var slideshow_counter = 0;

function Slides(){
    this.slides = new Array();
}

function Slide(initImgFile, initCaption) {
    this.imgFile = initImgFile;
    this.caption = initCaption;
}

function Page(initTitle, initFooter, initBanner,initComponent){
    this.title = initTitle;
    this.footer = initFooter;
    this.banner = initBanner;
    this.components = new Array();
    this.components = initComponent;
}

function NavObject(initTitle, initLink){
    this.navTitle = initTitle;
    this.navLink = initLink;
}


function initPage(){
    // var sPath = window.location.pathname;
    // var sPage = sPath.substring(sPath.lastIndexOf('/')+1, sPath.lastIndexOf('.html'));
    
    IMG_PATH = "./img/";
    DATA_PATH = "./data/";
    CSS_PATH = "./css/";
    VIDEO_PATH = "./video/";
    ICON_PATH = "./icons/";
    SCALED_IMAGE_HEIGHT = 300;
    SLIDESHOW_SLEEP_TIME = 3000;
    FADE_TIME = 1000;
    
    navbar = new Array();
    components = new Array();
    collection = new Array();
    currentSlides = new Array();
    timer = null;
    
    // loadData(DATA_PATH + sPage + ".json");
    loadData(DATA_PATH + "portfolio.json");
    
}

function loadData(jsonFile){
    $.getJSON(jsonFile, function(json){
        loadPage(json);
        initContent();
    });
}

function loadPage(pageData){
    student = pageData.student;
    for(i=0;i<pageData.navbar.length;i++){
        var tempNav = pageData.navbar[i];
        navbar[i] = new NavObject(tempNav.title, tempNav.link);
    }
    
    page = new Page(pageData.page.title, pageData.page.footer,pageData.page.banner, pageData.page.components);
    
}

function initContent(){
    for(i=0; i< navbar.length;i++){
        $("#navbar").append("<a class = 'nav' href='" + navbar[i].navLink + "'>"+ navbar[i].navTitle + "</a>");
    }
    $("#student").html(student);
    $("#title").html(page.title);
    $("#banner_image").attr("src", IMG_PATH + page.banner);
    $("#footer_text").html(page.footer);
    initComponent();
}

function initComponent(){
    for(i=0; i<page.components.length;i++){
        var temp = page.components[i];
        switch(temp.type){
            case "text":
                var hyperlink = new Array();
                hyperlink = temp.text.hyperlink;
                var tempText = temp.text.content;
                var appendText = "";
                var previousIndex = 0;
                for(j = 0; j < hyperlink.length; j++){
                    var start = parseInt(hyperlink[j].start);
                    var end = parseInt(hyperlink[j].end);
                    appendText += tempText.substring(previousIndex,start)
                                    + "<a class = 'hyperlink' href='" + hyperlink[j].link + "'>"
                                    + tempText.substring(start, end + 1) + "</a>";
                    previousIndex = end + 1; 
                }
                appendText += tempText.substring(previousIndex);
                
                $("#component").append("<p class = 'text_layout' style = 'font-family:" + temp.text.family + 
                        "'>" + appendText + "</p>" + "<hr>" );
                $("head").append("<link href='" + temp.text.font +
                        "' rel='stylesheet' type='text/css'>");
                break;
            case "image":
                $("#component").append("<img id = 'image_comp' class = 'image_layout' style = 'width: " + temp.image.width + 
                        "%' src = '"+ IMG_PATH + temp.image.image + "' alt = 'image not found'/> " + "<hr>" );
                break;
            case "video":
                $("#component").append("<video id = 'video_comp' class = 'video_layout' style = 'width: "+ temp.video.width +
                        "%' controls><source src='" + VIDEO_PATH + temp.video.video + "'type = 'video/mp4'> Your browser does not support the video tag.</video> " + "<hr>" );
                break;
            case "sildeshow":
                var slideshowData = temp.slideShow.slides;
                var slideshowObject = new Slides();
               for(k = 0; k < slideshowData.length;k++){
                    var rawSlide = slideshowData[k];
                    slideshowObject.slides.push(new Slide(rawSlide.image_file_name, rawSlide.caption));    
                }
                
                collection.push(slideshowObject);
                
                $("#component").append("<img id= 'slide_img' src = './img/ArchesUtah.jpg/'>" +
                                     "<div id='slide_caption'><p id = 'caption'></p></div>"+
                                    "<div id='slideshow_controls'>"+
                                    "<input class = 'control' id='previous_button' type='image' src='./icons/Previous.png' onclick='processPreviousRequest()'>"+
                                    "<input class = 'control 'id='play_pause_button' type='image' src='./icons/Play.png' onclick='processPlayPauseRequest()'>"+
                                    "<input class = 'control 'id='next_button' type= 'image' src='./icons/Next.png' onclick='processNextRequest()'> </div>"+
                                      "<hr>");
                
                if(slideshowObject.slides.length > 0){
                    currentSlide = 0;
                    $("#slide_img").attr("src", IMG_PATH + slideshowObject.slides[0].imgFile);
                    $("#caption").html(slideshowObject.slides[0].caption);
                    autoScaleImage();
                }else{
                    currentSlide = -1;
                }           
               break;
    
        }     
    }
    
}

function autoScaleImage(){
    var origHeight = $("#slide_img").height();
    var scaleFactor = SCALED_IMAGE_HEIGHT/origHeight;
    var origWidth = $("#slide_img").width();
    var scaledWidth = origWidth * scaleFactor;
    $("#slide_img").height(SCALED_IMAGE_HEIGHT);
    $("#slide_img").width(scaledWidth); 
}

function fadeInCurrentSlide() {
    var slides = collection[0].slides;
    var filePath = IMG_PATH + slides[currentSlide].imgFile;
    $("#slide_img").fadeOut(FADE_TIME, function(){
	$(this).attr("src", filePath).bind('onreadystatechange load', function(){
	    if (this.complete) {
		$(this).fadeIn(FADE_TIME);
		$("#slide_caption").html(slides[currentSlide].caption);
		autoScaleImage();
	    }
	});
    });     
}

function processPreviousRequest() {
    currentSlide--;
    if (currentSlide < 0)
	currentSlide = collection[0].slides.length-1;
    fadeInCurrentSlide();
}

function processPlayPauseRequest() {
    if (timer === null) {
	timer = setInterval(processNextRequest, SLIDESHOW_SLEEP_TIME);
	$("#play_pause_button").attr("src", ICON_PATH + "Pause.png");
    }
    else {
	clearInterval(timer);
	timer = null;
	$("#play_pause_button").attr("src", ICON_PATH + "Play.png");
    }	
}

function processNextRequest() {
    currentSlide++;
    if (currentSlide >= collection[0].slides.length)
	currentSlide = 0;
    fadeInCurrentSlide();
}

