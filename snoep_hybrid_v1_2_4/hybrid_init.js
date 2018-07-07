 /*--
 SnoepGames: snoepHybrid - init
 
 HTML5 GAME LIB
 by Hjalmar Snoep
 http://www.snoepgames.nl 
 
 Copyright (c)  2014 Hjalmar Snoep, Snoepgames.  
 http://www.snoep.at
 http://www.makinggames.org/nl/user/hjalmarsnoep
 http://www.youtube.com/user/hjalmarsnoep
 All rights reserved.
 
 V1.2.4 
---*/

/*---------------------OVERRIDE THESE----------------------------------------------*/
var Hybrid={}; // this will be the SINGULAR object that holds all, we will minify this layer to _H!
Hybrid.version="1.2.4"; // this version will center web apps and uses local Storage and have a singular object.!
// the .1 version changed something about the css.
// I don't find this a major version change, because I want to integrate the css anyway.
// the 1.2.2 version was created to be able to circumvent the leeching protect problems of 31-10-2014 (see mail with Maurice en Ruud) Css still not integrated, but first attempts made.

Hybrid.graphics_manifest = {};  // it's an object now, take care! This saves getting the refs.. You should define these yourself ALWAYS!!
Hybrid.audio_manifest = [];  // but just in case you don't we'll set this empty ones..
Hybrid.font_manifest = []; // you need to set these, to have the hybrid wait for the loading of these fonts, before displaying!

//console.log("Hybrid.font_manifest.length "+Hybrid.font_manifest.length);

Hybrid.initPageFunction=null; // you need to set this, once everything is loaded, we'll go here!
Hybrid.loadingProgressFunction=null;// you don't need to set this, only if you want to give feedback about loading the manifests.
Hybrid.img_src_path = "img/"; // img path is where you put your images.
Hybrid.font_path='/static/fonts/';  // /static/fonts/ is where you put your images, [fontname]/font.css 

// create the hotspots and any other images we might always need HERE!
Hybrid.dataurls=[];
Hybrid.dataurls['hotspots']="data:image/png;base64,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";

/*-------------------------------------------------------------------------------------
 // GLOBAL VARS
----------------------------------------------------------------------------------------*/
// create internal objects.
Hybrid.f = 1; // page size = 1 means TheoreticalPageWidthxTheoreticalPageHeight! (0.5=400x0300)
Hybrid.capabilities = {}; // will be filled by first sweep!
Hybrid.platform = {}; // will be filled by first sweep!
Hybrid.switches={}; // we might ask the user about these in options.
Hybrid.pageInterval = 0;  // reference to the current loop of active page!

Hybrid.language=navigator.language; // use in localisation later!
Hybrid.img_preload = 0; // total of img files to be preloaded, always the whole manifest!


/* CONTSTANTS -----------------------------------------------------------------------------
*/
Hybrid.helplink="http://www.makinggames.org/nl/help/"; //algmeen!
Hybrid.supportlink="http://www.makinggames.org/nl/support/"; //add name of game or part behind..

/* methods -----------------------------------------------------------------------------
*/

/*-------------------------------------------------------------------------------------
 // CORE FUNCTIONS 
----------------------------------------------------------------------------------------*/
function _hybridInit(){

	Hybrid.allowAllDomains=true;// because of the pesky NTR server!
	// set Hybrid Stylesheet
	// before we do ANYthing..
	Hybrid.debug_session_id=new Date().getTime();
	// this function is called!
    Hybrid.setDebugEchoDiv($('#hybridDiv')); // WE SET this now.. if we erase the page to show loading, we need to RESET this!!

	// set some standard allowed and trusted domains
	
	Hybrid.debugmessage(_hybridDecodeString("4879627269642076")+Hybrid.version+" "+_hybridDecodeString("2d20496e697469616c6973696e67")); // prints Hybrid v1.2.0 - Initialising.
	Hybrid.debugmessage(_hybridDecodeString("a9207777772e736e6f65702e6174")); // writes copyright message!
	var ua=navigator.userAgent.toLowerCase();
	//Hybrid.debugmessage("Raw UA: "+ua);

	
	//Hybrid.debugmessage("ENCODED: "+_hybridEncodeString("Hybrid v")); // writes copyright message!
	_hybridGetCapabilities(); // hidden function only (private if you will!)
   // we need to show the capabilities briefly on the initpage..
   // we also show a possibility there to do debug (if you have the password)
   // and a little branding.

   // here we do a top-domain and referer check!
	//Hybrid.debugmessage("encoded "+Hybrid.encodeString("ERROR: Referrer mismatch! This game has not been licensed to run on this site! Contact www.snoep.at to obtain the proper licenses."));
   if(!_hybridLeechProtect())
   {
	// someone is trying to leech, or I just forgot to set anything....
		Hybrid.showWarning("Referrer: '"+document.referrer+"'\n\n"+Hybrid.decodeString("4552524f523a205265666572726572206d69736d617463682120546869732067616d6520686173206e6f74206265656e206c6963656e73656420746f2072756e206f6e207468697320736974652120436f6e74616374207777772e736e6f65702e617420746f206f627461696e207468652070726f706572206c6963656e7365732e"));
		//Hybrid.throwError(Hybrid.decodeString("4552524f523a2052656665726572206d69736d617463682120546869732067616d6520686173206e6f74206265656e206c6963656e73656420746f2072756e206f6e207468697320736974652120436f6e74616374207777772e736e6f65702e617420746f206f627461696e207468652070726f706572206c6963656e7365732e"));
   }else
   {
		// we also want to be able to detect a set to home screen on ipad and maybe display a little add to home popup!
		// how to: https://www.youtube.com/watch?v=dJGLdjJGTwo
		// http://www.lynda.com/CSS-tutorials/Create-iPad-Web-App/98830-2.html?utm_medium=viral&utm_source=youtube&utm_campaign=videoupload-98830-0002
		// http://mobilewebbestpractices.com/resources/
		// http://www.lucidmeetings.com/blog/your-lucid-meetings-ipad-web-application-here
		// http://mobilewebbestpractices.com/resources/
		// http://cubiq.org/add-to-home-screen
	   _hybridGetPageScale(); // we only need to call this once to get f and support values!
	   // now we setup the context menu and handles to get it with both touch and mouse.
	   // on local it's more handy NOT to have this
	   if(Hybrid.showContextMenu==true)
	   	   _hybridSetupContextMenu();// right click is non existent on touch devices.., so top left corner 50x50 works too now!
	   Hybrid.debugEchoDiv = false; // we don't have to echo any more we can get to the debug!!
		
	   Hybrid.erasePage(); 
		// todo: set a text displaying hybrid and version..
		
		// we might want to show the user something here as a default!!
		
		// we might want to show the user something here!
		//doPreload(); // will set up the preloading.
		//pageInterval=_hybridStartLoop(hybridLoadingLoop,200); // we update every fifth of a second !
	   
	   
		// if there are any web fonts to be loaded, let's do this, before we process the graphics manifest, so we can use fonts in creators and stuff.
		if(typeof(Hybrid.font_manifest)!=="undefined" && Hybrid.font_manifest.length!=0)
		{
			console.log("preloading webfonts");
			_hybridPreloadFonts(_hybridDoPreload);
		}else
		{
			if(Hybrid.autopreload==true)
				_hybridDoPreload(); // will set up the preloading.
		}
	
		
	}

};

// normal resizing!
$( window ).resize(function() {
		if(Hybrid.resizeTimeout !== false)
			clearTimeout(Hybrid.resizeTimeout);
			Hybrid.resizeTimeout = setTimeout(_hybridResizeFunction, 50); //200 is time in miliseconds
});  

// -----------------------------
//  looping
// -----------------------------
Hybrid.def_pageloop=-1;
Hybrid.def_pageloopFunction=null;
function _hybrid_hybridStartLoopHandler()
{
	Hybrid.def_pageloopFunction();
}
// public function to do loops
Hybrid.startLoop=_hybridStartLoop;
function _hybridStartLoop(func, interval)
{
	if(Hybrid.def_pageloop!=-1)
	{
		_hybridStopLoop();
	}
	Hybrid.def_pageloopFunction=func;
	Hybrid.def_pageloop=window.setInterval(_hybrid_hybridStartLoopHandler,interval);
}
Hybrid.stopLoop=_hybridStopLoop;
function _hybridStopLoop()
{
	if(Hybrid.def_pageloop==-1) return false;
	window.clearInterval(Hybrid.def_pageloop);
	Hybrid.def_pageloop=-1;
	Hybrid.def_pageloopFunction=null;
	return true;
} 
// -----------------------------
//  end of looping
// -----------------------------
// public function to do loops
Hybrid.def_pageTimouts=[];
Hybrid.setTimeout=_hybridSetTimeout;
function _hybridSetTimeout(func, interval)
{
	var t=window.setTimeout(func,interval);
	Hybrid.def_pageTimouts.push(t);
	return t;
}
Hybrid.stopTimeouts=_hybridStopTimeouts;
function _hybridStopTimeouts()
{
	var i;
	for(i=0;i<Hybrid.def_pageTimouts.length;i++)
	{
		// make sure these don't happen.
		window.clearTimeout(Hybrid.def_pageTimouts[i]);
	}
	Hybrid.def_pageTimouts=[];
} 

// Platform / os / browser and version / capabilites sweep..
function _hybridGetCapabilities(){
  // start with some sniffing!!
  var nua=navigator.userAgent;
  var is_chrome = nua.indexOf('Chrome') > -1;
  var is_explorer = nua.indexOf('MSIE') > -1;
  var is_firefox = nua.indexOf('Firefox') > -1;
  var is_safari = nua.indexOf("Safari") > -1;
  var is_android = nua.indexOf("Android") > -1;
  var is_Opera = nua.indexOf("Presto") > -1;
  if(is_android==true && is_chrome==false) 
       Hybrid.showWarning("You are using Android Default Browser. For way better performance, please switch to Chrome.");
	   
  if ((is_chrome)&&(is_safari)) 
  {
   // somehow chrome sometimes identifies itself as being safari!
   is_safari=false;
  }
  // exception for ie 11
 if( !(window.ActiveXObject) && "ActiveXObject" in window) is_explorer=true;
  
  // report on these findings for debugging.
  Hybrid.platform.browser="unidentified";
  if(is_chrome) Hybrid.platform.browser="chrome";
  if(is_explorer) Hybrid.platform.browser="explorer";
  if(is_firefox) Hybrid.platform.browser="firefox";
  if(is_safari) Hybrid.platform.browser="safari";
  if(is_android) Hybrid.platform.browser="android";
  if(is_Opera) Hybrid.platform.browser="opera";

  // we also might want to be device specific..
  _hybridGetDevice(); // fills Hybrid.platform.device

  // and operating system specific..
  _hybridGetOS(); // fills Hybrid.platform.OS // operating system

  // show it in the default div stage object
  Hybrid.debugmessage('OS: '+Hybrid.platform.OS);
  Hybrid.debugmessage('device: '+Hybrid.platform.device);
  Hybrid.debugmessage('browser: '+Hybrid.platform.browser);

  // from now on it's capability sniffing with the above information to edit exceptions.
  _hybridTestForAudioSupport(); // comes from hybrid_AUDIO.js!
  
  //Hybrid.debugmessage("Capabilities.sound="+Hybrid.capabilities.sound);
  //Hybrid.debugmessage("Capabilities.audioContext="+Hybrid.capabilities.audioContext);
  //Hybrid.debugmessage("Capabilities.audio_preload="+Hybrid.capabilities.audio_preload);
  
  Hybrid.capabilities.touchmode=_hybridIsTouchDevice();
  Hybrid.capabilities.maxtouches=_hybridGetMaxTouches();
  //Hybrid.debugmessage("Capabilities.touch="+Hybrid.capabilities.touchmode);
  //Hybrid.debugmessage("Capabilities.maxtouches="+Hybrid.capabilities.maxtouches);

  Hybrid.capabilities.canvas=_hybridIsCanvasSupported(); // resides in canvas helper functions!
  //Hybrid.debugmessage("Capabilities.canvas="+Hybrid.capabilities.canvas);
  Hybrid.capabilities.tilt=_hybridHasTilt();
   
   //navigator.geolocation = [object Geolocation]
   //navigator.webkitPersistentStorage = [object DeprecatedStorageQuota]
   //navigator.webkitTemporaryStorage = [object DeprecatedStorageQuota]
   //navigator.doNotTrack = null
   //navigator.onLine = true
   //navigator.product = Gecko
   //navigator.appCodeName = Mozilla
   //navigator.userAgent = Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36
   //navigator.platform = Win32
   //navigator.appVersion = 5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36
   //navigator.appName = Netscape
   //navigator.vendorSub = 
   //navigator.vendor = Google Inc.
   //navigator.productSub = 20030107
   //navigator.cookieEnabled = true
   //navigator.mimeTypes = [object MimeTypeArray]
   //navigator.plugins = [object PluginArray]
   //navigator.language = nl
   //navigator.javaEnabled = function javaEnabled() { [native code] }
   //navigator.getStorageUpdates = function getStorageUpdates() { [native code] }
   //navigator.vibrate = function vibrate() { [native code] }
   //navigator.webkitGetGamepads = function webkitGetGamepads() { [native code] }
   //navigator.webkitGetUserMedia = function webkitGetUserMedia() { [native code] }
   //navigator.registerProtocolHandler = function registerProtocolHandler() { [native code] }
   
   Hybrid.capabilities.keyboard=true;
   if(Hybrid.capabilities.maxtouches>0) Hybrid.capabilities.keyboard=false;
   // this is a bit rough on windows8, but there is currently no way to do this..
   
 };
 
 function _hybridGetOS(){
	Hybrid.platform.OS=navigator.platform;
	var ua=navigator.userAgent.toLowerCase();
	/*
   * Macs
   */
  if ((ua.indexOf("macintosh") !=-1) || (ua.indexOf("mac os x") !=-1) || (ua.indexOf("mac_powerpc") !=-1) ||
             (ua.indexOf("powerpc-apple") !=-1) || (ua.indexOf("mac_ppc") !=-1) || (ua.indexOf("darwin") !=-1)) 
			{
				Hybrid.platform.OS="Mac";
			 }

  /*
   * Windows
   */
	if ((ua.indexOf("win95") !=-1) || (ua.indexOf("windows 95") !=-1)) Hybrid.platform.OS="Windows (95)";
    if ((ua.indexOf("win 9x 4.90") !=-1)  || (ua.indexOf("windows me") !=-1)) Hybrid.platform.OS="Windows (Me)";
    if ((ua.indexOf("windows 2000") !=-1) || (ua.indexOf("windows nt 5.0") !=-1)) Hybrid.platform.OS="Windows (2000)";
    if ((ua.indexOf("windows nt 5.1") !=-1) || (ua.indexOf("windows xp") !=-1)) Hybrid.platform.OS="Windows (XP)";
    if (ua.indexOf("windows nt 5.2 x64") !=-1) Hybrid.platform.OS="Windows (XP 64-bit)";
    if (ua.indexOf("windows nt 5.2") !=-1) Hybrid.platform.OS="Windows (Server 2003)";
    if (ua.indexOf("windows nt 6.0") !=-1) Hybrid.platform.OS="Windows (Vista)";
    if (ua.indexOf("windows nt 6.1") !=-1) Hybrid.platform.OS="Windows (7)";
    if (ua.indexOf("windows nt 6.2") !=-1) Hybrid.platform.OS="Windows (8)";
    if ((ua.indexOf("windows nt 4.0") !=-1) || (ua.indexOf("winnt") !=-1) || (ua.indexOf("windows nt") !=-1))  Hybrid.platform.OS="Windows (NT)";
    if ((ua.indexOf("windows 98") !=-1) || (ua.indexOf("win98") !=-1))  Hybrid.platform.OS="Windows (98)";
    if (ua.indexOf("windows 3.1") !=-1) Hybrid.platform.OS="Windows (3.1)";
    if (ua.indexOf("microsoft windows") !=-1)Hybrid.platform.OS="Windows (?)";
 
   if (Hybrid.platform.device=="iPhone" || Hybrid.platform.device=="iPod" || Hybrid.platform.device=="iPad")
   {
		if(ua.match(/ OS 5_/i)) Hybrid.platform.OS="iOs5";
		if(ua.match(/ OS 6_/i)) Hybrid.platform.OS="iOs6";
		if(ua.match(/ OS 7_/i)) Hybrid.platform.OS="iOs7";
		if(ua.match(/ OS 8_/i)) Hybrid.platform.OS="iOs8";
   }
 };
 
 function _hybridGetDevice(){
	var ua=navigator.userAgent.toLowerCase();
   Hybrid.platform.device="unknown";
   // tentative sniff.
   if (ua.match(/windows/i)) Hybrid.platform.device="desktop";

   // device sniff. 
   if (ua.match(/iphone/i)) Hybrid.platform.device="iPhone";
   if (ua.match(/ipod/i)) Hybrid.platform.device="iPod";
   if (ua.match(/ipad/i)) Hybrid.platform.device="iPad";
   if (ua.match(/iPad/i)) Hybrid.platform.device="iPad"; // ipad ios 8!
   if (ua.match(/android/i)) Hybrid.platform.device="Android";
   if (ua.match(/blackberry/i)) Hybrid.platform.device="BlackBerry";
};


// Public function to check the native language (flash/js) for platform specific functionality.
Hybrid.getNativeLanguage=_hybridGetNativeLanguage;
function _hybridGetNativeLanguage(){return "js";};

// Puclib Function to allow creation of a app specific focus manager.
// default the loop will halt, but you might also want to stop audio playback on blur!
Hybrid.setFocusManager=_hybridSetFocusManager;
function _hybridSetFocusManager(pause,restart){
  $(window).blur(pause);
  $(window).focus(restart);
};
// Public Function to clear app specific focus manager.
Hybrid.clearFocusManager=_hybridClearFocusManager;
function _hybridClearFocusManager(){
  $(window).blur();
  $(window).focus();
};

// get any queryvars!
function _hybridGetQueryVars()
{
	Hybrid.query_vars={};
	if(location.href.indexOf("?")!=-1)
	{
		var pairs=location.href.split("?")[1].split("&");
		for(var all in pairs)
		{
			var p=pairs[all].split("=");
			//Hybrid.debugmessage("getting variables from querystring: "+p[0]+" = "+p[1]);
			Hybrid.query_vars[p[0]]=p[1];
		}
	}
}
_hybridGetQueryVars(); // must be a function block, or it might interfere with the minified namespace!!
// we hade an error here on Hybrid.setTextBoxEditable, because it wasn't a function block
// and it used _p, which was ALSO used as obfuscated function name for setTextBoxEditable!
Hybrid.changeQueryVars=_hybridChangeQueryVars;
function _hybridChangeQueryVars(querystring)
{
/*	if (typeof(window.parent.history.pushState) !== 'undefined') 
	{
		title = "hybridChangeQueryVars: "+querystring;
		var a = document.createElement('a');
		a.href = top.location.href;
		var o={};
		o.query = querystring;
		window.parent.history.pushState(o, title, a.pathname+querystring);
	}*/
	if (typeof(window.parent.history.replaceState) !== 'undefined') 
	{
		title = "hybridChangeQueryVars: "+querystring;
		var a = document.createElement('a');
		a.href = top.location.href;
		var o={};
		o.query = querystring;
		window.parent.history.replaceState(o, title, a.pathname+querystring);
	}
	
	
}		



// Public Function to set switches
Hybrid.setSwitch=_hybridSetSwitch;
function _hybridSetSwitch(labelname,value)
 {
  //Hybrid.debugmessage("setSwitch: "+labelname+" to "+value);
  if(value=="1")
   Hybrid.switches[labelname]=true;
  else
   Hybrid.switches[labelname]=false;
 }
// Public Function to make all in page unselectable.
Hybrid.makePageUnselectable=_hybridMakePageUnselectable;
function _hybridMakePageUnselectable()
{
	//Hybrid.debugmessage("makePageUnselectable()");
	_jQueryAddition_MakeUnselectable($(document));
	_jQueryAddition_MakeUnselectable($('body'));
	_jQueryAddition_MakeUnselectable($('html'));
}
Hybrid.makePageSelectable=_hybridMakePageSelectable;
function _hybridMakePageSelectable()
{
	//Hybrid.debugmessage("warning: makePageSelectable()");
	_jQueryAddition_MakeSelectable($(document));
	_jQueryAddition_MakeSelectable($('body'));
	_jQueryAddition_MakeSelectable($('html'));
}

Hybrid.makeSelectable=_hybridMakeSelectable;
function _hybridMakeSelectable(h,tf)
{
	if(tf)
	{
		_jQueryAddition_MakeSelectable(h.jquery);
	}else
	{
		_jQueryAddition_MakeUnselectable(h.jquery);
	}
}
function _jQueryAddition_MakeUnselectable(jQuery_elements)
 {
	// on should be live according to 
  jQuery_elements.on('dragstart selectstart touchstart touchmove', _jQueryAdditionstopEvent);
	
  jQuery_elements.attr('unselectable','on')
   .css({'-moz-user-select':'-moz-none',
   '-moz-user-select':'none',
   '-o-user-select':'none',
   '-khtml-user-select':'none', /* you could also put this in a class */
   '-webkit-user-select':'none',/* and add the CSS class here instead */
   '-ms-user-select':'none',
   'user-select':'none',
   '-webkit-touch-callout':'none'
   });
 }
 function _jQueryAdditionstopEvent(event){
	event.preventDefault(); 
	event.stopPropagation();
	//event.cancelBubble=true; // this is for if you stop using jQuery !!
    //event.returnValue=false;
	 //return false; // this one is deprecated!
 }
 function _jQueryAddition_MakeSelectable(jQuery_elements)
 {
 //Hybrid.debugmessage("warning element made selectable!");
 jQuery_elements.off('dragstart selectstart touchstart touchmove', _jQueryAdditionstopEvent);
  jQuery_elements.attr('unselectable','')
   .css({'-moz-user-select':'text',
   '-moz-user-select':'text',
   '-o-user-select':'text',
   '-khtml-user-select':'text', /* you could also put this in a class */
   '-webkit-user-select':'text',/* and add the CSS class here instead */
   '-ms-user-select':'text',
   'user-select':'text'
   });
 }
Hybrid.disablePageScrolling=_hybridDisablePageScrolling;
function _hybridDisablePageScrolling()
{
	$('html, body').on('touchmove', function(e)
	{ 
		 //prevent native touch activity like scrolling
		 e.stopPropagation(); 
		 e.preventDefault(); 
	});
};

 /*-------------------------------------------------------------------------------------
 // STANDARD PAGE FUNCTIONS
 ----------------------------------------------------------------------------------------*/ 
 $(document).ready(_hybridInit);