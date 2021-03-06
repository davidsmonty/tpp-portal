// customise title 
newPageTitle = _config.client_name; 
document.title = newPageTitle; 

// customise logos
var logodark = "/assets/aspsp-assets/" + _config.subdomain + "/logo-dark.png";
var logolight = "/assets/aspsp-assets/" + _config.subdomain + "/logo-light.png";
var icon0 = "/assets/aspsp-assets/" + _config.subdomain + "/favicon.png";
var icon1 = "/assets/aspsp-assets/" + _config.subdomain + "/icon-196x196.png";
var icon2 = "/assets/aspsp-assets/" + _config.subdomain + "/touch-icon-iphone.png";
var icon3 = "/assets/aspsp-assets/" + _config.subdomain + "/touch-icon-ipad.png";
var icon4 = "/assets/aspsp-assets/" + _config.subdomain + "/touch-icon-iphone-retina.png";
var icon5 = "/assets/aspsp-assets/" + _config.subdomain + "/touch-icon-ipad-retina.png";

function loadGraphics(){
    console.log(1)
    document.getElementById("logo-dark").src = logodark;
    document.getElementById("logo-light").src = logolight;
    document.getElementById("icon0").src = icon0;
    document.getElementById("icon1").src = icon1;
    document.getElementById("icon2").src = icon2;
    document.getElementById("icon3").src = icon3;
    document.getElementById("icon4").src = icon4;
    document.getElementById("icon5").src = icon5;
    console.log(2)
}
window.onload = function(){
    console.log('333')
    loadGraphics();
    console.log('456')
};

// customise pisp
if (_config.pisp === 0) {
    $(".pisp").hide();
}

// customise client name
$("#client").text(_config.client_name);

// interface id
$("#iface_uuid").text(_config.iface_uuid);