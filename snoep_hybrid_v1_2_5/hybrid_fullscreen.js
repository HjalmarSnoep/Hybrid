 /*--
 SnoepGames: snoepHybrid - Fullscreen
 
 HTML5 GAME LIB
 by Hjalmar Snoep
 http://www.snoepgames.nl 
 
 Copyright (c)  2014 Hjalmar Snoep, Snoepgames.  
 http://www.snoep.at
 http://www.makinggames.org/nl/user/hjalmarsnoep
 http://www.youtube.com/user/hjalmarsnoep
 All rights reserved.
 
 V1.2.5 
---*/
 
Hybrid.fullscreen={};
Hybrid.fullscreen.possible=false;
if(document.fullscreenEnabled) Hybrid.fullscreen.possible=true;
if(document.mozFullScreenEnabled) Hybrid.fullscreen.possible=true;
if(document.msFullscreenEnabled) Hybrid.fullscreen.possible=true;
if(document.webkitFullscreenEnabled) Hybrid.fullscreen.possible=true;
Hybrid.debugmessage("Hybrid.fullscreen.possible="+Hybrid.fullscreen.possible);
Hybrid.fullscreen.error=document.addEventListener("fullscreenerror", _hybridFullscreenError);
// full-screen available?



Hybrid.fullscreen.go=_hybridGoFullScreen
function _hybridGoFullScreen()
{
	Hybrid.debugmessage("_hybridGoFullScreen");
	if(Hybrid.fullscreen.possible)
	{
		var elem=document.documentElement;
		
		var anything=false;
		 elem.onwebkitfullscreenchange = _hybridOnFullScreenEnter;
		 elem.onmozfullscreenchange = _hybridOnFullScreenEnter;
		 elem.onfullscreenchange = _hybridOnFullScreenEnter;
		if(elem.webkitRequestFullScreen){ anything=true; elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);}
		if(elem.mozRequestFullScreen ) { anything=true; elem.mozRequestFullScreen();}
		if(elem.msRequestFullscreen){ anything=true;  elem.msRequestFullscreen();}
		if(elem.requestFullscreen){ anything=true;  elem.requestFullscreen(); } // standard
		Hybrid.fullscreen.possible=anything; // if any of these are true, it will register else, next time we know, it won't work!
	}else
	{
		Hybrid.showWarning("Your browser or the iframe this game resides in does not allow or  support fullscreen.");
	}
}

function _hybridOnFullScreenEnter() {
  console.log("Entered fullscreen initiated from button!");
  var elem=document.getElementById("hybridStage");
  elem.onwebkitfullscreenchange = _hybridOnFullScreenExit;
  elem.onmozfullscreenchange = _hybridOnFullScreenExit;
};
function _hybridOnFullScreenExit() {
  console.log("Exited fullscreen initiated from iframe");
};

Hybrid.fullscreen.stop=_hybridStopFullScreen
function _hybridStopFullScreen()
{
	if(Hybrid.fullscreen.possible)
	{
		if(typeof(document.webkitExitFullscreen)!="undefined")document.webkitExitFullscreen();
		if(typeof(document.mozCancelFullscreen)!="undefined")document.mozCancelFullscreen();
		if(typeof(document.msExitFullscreen)!="undefined")document.msExitFullscreen();
		if(typeof(document.exitFullscreen)!="undefined") document.exitFullscreen();
	}
}
Hybrid.fullscreen.active=_hybridAreWeFullScreen
function _hybridAreWeFullScreen()
{
	return (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
}
function _hybridFullscreenError()
{
	if(Hybrid.fullscreen.possible==false)
	{
		Hybrid.showWarning("Your browser or the iframe this game resides in does not allow or  support fullscreen.");
	}else
	{
		Hybrid.ThrowError("There has been an error going fullscreen.");
	}
}
