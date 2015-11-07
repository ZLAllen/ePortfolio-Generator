/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//PATH
var IMG_PATH;
var DATA_PATH;
var CSS_PATH;


//DATA
var template;
var color;
var font;
var student;
var navbar;
var page;

function Page(initTitle, initFooter, initBanner){
    this.title = initTitle;
    this.footer = initFooter;
    this.banner = initBanner;
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
    
    navbar = new Array();
    
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
    page = new Page(pageData.page.title, pageData.page.footer,pageData.page.banner);
}

function initContent(){
    for(i=0; i< navbar.length;i++){
        $("#navbar").append("<a class = 'nav' href='" + navbar[i].navLink + "'>"+ navbar[i].navTitle + "</a>");
    }
    $("#student").html(student);
    $("#title").html(page.title);
    $("#banner_image").attr("src", IMG_PATH + page.banner);
    $("#footer").html(page.footer);
}



