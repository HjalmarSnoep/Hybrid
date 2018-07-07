 /*--
 SnoepGames: snoepHybrid - layout
 V1.2.0 
---*/
 
Hybrid.resizeTimeout=false;
function _hybridGetPageScale()
{
 // this fills the data with information about the page and user-agent.
  //debugmessage("getPageScale!");
  // first display the content in the right size and place!
  // take the div height, not the window height.
  var wh,ww,f;
  ww=$(window).innerWidth();
  wh=$(window).innerHeight();
  if(!Hybrid.width)Hybrid.width=800; // default square!! for those times there hasn't been an init!
  if(!Hybrid.height)Hybrid.height=800;
  if(!Hybrid.stageAlign)Hybrid.stageAlign="center";// possible values are center and top-left
  if(!Hybrid.stageScale)Hybrid.stageScale="lineair"; // possible values are responsive ,lineair, responsive width,
  // android gives us the wrong innerHeight, so..
  if(Hybrid.platform.browser=="android")
  {
	//fixed innerheight bug on android!");
	wh=$(window).outerHeight();
  }
  // Ios7 has a little bug (confirmed) in landscape, where the last 20 pixels disappear..
  // http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
  // if(Hybrid.platform.OS=="iOs7")
  // {
  //  this is confirmed on iPad, height is a bit too big!
  //  window.alert(ww+"x"+wh);
  //  wh-=1;
  // }
  // we now KNOW the right window-size.
  if(Hybrid.platform.OS=="iOs7")
  {
	// this is a true BUG, bit only of window in portrait..
	// there is no easy work around, it needs to be in the page around this!
	// it was never fixed until iOs8!
	// we must fix this in the iFrame, because this would only be true for full-screen stuff!
//	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone) 
//	{
//		// if we are in web mode!
//		wh-=20;
//		// we set the offset to 20 as well, or we get a balk on the bottom!
//	}
  }
  
  //Hybrid.debugmessage("stageScale:"+Hybrid.stageScale);
  switch(Hybrid.stageScale)
  {
	case "lineair":
		  var fx=ww/Hybrid.width;
		  var fy=wh/Hybrid.height;
		   
		  //Hybrid.debugmessage("Window width: "+ww+", hybrid width: "+Hybrid.width+" factor: "+Math.floor(fx*100)+"%");
		  //Hybrid.debugmessage("Window height: "+wh+", hybrid height: "+Hybrid.height+" factor: "+Math.floor(fy*100)+"%");
		   
		  Hybrid.f=fy;
		  if(fx<fy)Hybrid.f=fx;
		  // keep it safe!
		  //Hybrid.debugmessage("--lineair scalefactor: "+Math.floor(Hybrid.f*100)+"%");
		  // calculate top and left offset, to keep it centered!
		  Hybrid.ox=(ww-Hybrid.width*Hybrid.f)/2;
		  Hybrid.oy=(wh-Hybrid.height*Hybrid.f)/2;
		  //Hybrid.debugmessage("--offset: x"+Hybrid.ox);
		  //Hybrid.debugmessage("--offset: y"+Hybrid.oy);
		  
		  if($("#hybridStage").length!=0)
		  {
			$("#hybridStage").css("left",Hybrid.ox+"px")
						.css("top",Hybrid.oy+"px")
						.css("width",toPx(Hybrid.width))
						.css("height",toPx(Hybrid.height));
		  }
	break;
	case "responsive-width":
		// ok, we scale everything to fit the HEIGHT, then we make the sides responsive.
		  Hybrid.f=wh/Hybrid.height;
		//Hybrid.debugmessage("Window width: "+ww+", hybrid width: "+Hybrid.width+" factor: "+Math.floor(Hybrid.f*100)+"%");
		  //Hybrid.debugmessage("Window height: "+wh+", hybrid height: "+Hybrid.height+" factor: "+Math.floor(Hybrid.f*100)+"%");

		   
		  // calculate top and left offset, to keep it centered!
		  Hybrid.ox=0;
		  Hybrid.oy=0;
		  Hybrid.width=Hybrid.height*(ww/wh);
		  Hybrid.height=Hybrid.height;
		  if($("#hybridStage").length!=0)
		  {
			$("#hybridStage").css("left",Hybrid.ox+"px")
						.css("top",Hybrid.oy+"px")
						.css("width",toPx(Hybrid.width))
						.css("height",toPx(Hybrid.height));
		  }
	break;
	case "responsive":
	   
		  Hybrid.f=1;
		//Hybrid.debugmessage("Window width: "+ww+", hybrid width: "+Hybrid.width+" factor: "+Math.floor(Hybrid.f*100)+"%");
		  //Hybrid.debugmessage("Window height: "+wh+", hybrid height: "+Hybrid.height+" factor: "+Math.floor(Hybrid.f*100)+"%");
		  // calculate top and left offset, to keep it centered!
		  Hybrid.ox=0;
		  Hybrid.oy=0;
		  Hybrid.width=ww;
		  Hybrid.height=wh;
		  if($("#hybridStage").length!=0)
		  {
			$("#hybridStage").css("left",Hybrid.ox+"px")
						.css("top",Hybrid.oy+"px")
						.css("width",toPx(Hybrid.width))
						.css("height",toPx(Hybrid.height));
		  }
	break;
	default:
		Hybrid.throwError("Not a known scalemode for hybrid stage: '"+Hybrid.stageScale+"'\n");
	break;
  }
  if(Hybrid.platform.OS=="iOs7")
  {
	// this is a true BUG, bit only of window in portrait..
	// there is no easy work around, it needs to be in the page around this!

//	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone) 
//	{
		// if we are in web mode!
//		Hybrid.oy=20;
		// we set the offset to 20 as well, or we get a balk on the bottom!
//	}
  }
};

Hybrid.setBackColor=_hybridSetBackColor;
function _hybridSetBackColor(col)
{
	Hybrid.stageColor=col;
	// somehow this doesn't seem to work.. I don't know why.
	//Hybrid.debugmessage("setting body color to: "+col);
	$('#back').css('background-color', col+' !important');
} 
// getting the scrollbar width for this browser
Hybrid.getScrollbarWidth=_hybridGetScrollbarWidth;
function _hybridGetScrollbarWidth() 
{
  var box1=$('<div style="width:100px;height:100px;overflow:auto;"></div>').appendTo('body');
  var box2=$('<div style="width:200px;height:200px;background-color:#aaa;"></div>').appendTo(box1);
  var box3=$('<div style="width:100%"></div>').appendTo(box1);
  // the idea is to have a box width a known with, with a bigger box inside, than to add a third div which will obtain all available width!
  // and then throw it all away. You can only call this on document ready.. Sorry..
  var width=100-box3.width();
  box1.remove();
 return width;
};
// getting the scrollbar width for this browser
Hybrid.makeScrollable=_hybridMakeScrollable;
function _hybridMakeScrollable(o) 
{
	o.jquery.css("overflow-y","scroll");
	o.jquery.css("-webkit-overflow-scrolling","touch");
};

Hybrid.setPadding=_hybridSetPadding;
function _hybridSetPadding(o,t,r,b,l) 
{
	o.jquery.css("padding",toPx(t)+" "+toPx(r)+" "+toPx(b)+" "+toPx(l));
};

Hybrid.setVisible=_hybridSetHybridElementVisible;
function _hybridSetHybridElementVisible(e,v)
{
	if(v)
		e.jquery.show();
	else
		e.jquery.hide();
}


Hybrid.cssAnimationEffect=function (e,name,length,easing) {Hybrid.debugmessage("cssAnimationEffect deprecated, please use setAnimationEffect");
_hybridCssAnimation(e,name,length,easing);};


Hybrid.setAnimationEffect=_hybridCssAnimation;
function _hybridCssAnimation(e,name,length,easing)
{
	// set the animation-keyframes in the external stylesheet or use one of the Hybrid Defaults!
	if(typeof(easing)==="undefined")
		easing="ease-in-out";
	if(typeof(length)==="undefined")
		length=0.5;
	// see discussion on http://stackoverflow.com/questions/14990963/cross-browser-offsetwidth
	// on re-triggering animations!
	e.jquery.css("-webkit-animation","none"); // set animation style!
	e.jquery.css("-moz-animation","none");
	e.jquery.css("-o-animation","none");
	e.jquery.css("animation","none");	
	if(name=="none")
	{
		return;
	}
		
		// -> triggering reflow /* The actual magic */
  // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
	var element= document.getElementById(e.id);
	element.offsetWidth = element.offsetWidth;
		
		
		e.jquery.css("-webkit-animation",name+" "+length+"s "+easing); // set animation style!
		e.jquery.css("-moz-animation",name+" "+length+"s "+easing);
		e.jquery.css("-o-animation",name+" "+length+"s "+easing);
		e.jquery.css("animation",name+" "+length+"s "+easing);	
		
	//e.jquery.css("-webkit-animation",name+" "+length+"s "+easing+";"); // set animation style!
	//	e.jquery.css("-moz-animation",name+" "+length+"s "+easing+";");
	//	e.jquery.css("-o-animation",name+" "+length+"s "+easing+";");
	//	e.jquery.css("animation",name+" "+length+"s "+easing+";");
	
}


Hybrid.setTransitionTiming=_hybridSetTransitionTiming;
function _hybridSetTransitionTiming(e,length,easing)
{
	if(typeof(length)==="undefined") length="0.4";
	if(typeof(easing)==="undefined") easing="ease";
	length+="s";
	var tx1=0.250; // tangent1 x,y
	var ty1=0.100;
	var tx2=0.250; // tangent 2 x,y
	var ty2=1.000;
	switch(easing)
	{
		case "none":
			
  
		e.jquery.css("-webkit-transition","none"); // set animation style!
		e.jquery.css("-moz-transition","none");
		e.jquery.css("-o-transition","none");
		e.jquery.css("transition","none");
		return;
  
		break;
		case "linear":
			tx1=0.250;
			ty1=0.250;
			tx2=0.750;
			ty2=0.750;
		break;
		case "ease": // default!
			tx1=0.250;
			ty1=0.100;
			tx2=0.250;
			ty2=1.000;
		break;
		case "easeOut":
			tx1=0.0;
			ty1=0.0;
			tx2=0.580;
			ty2=1.000;
		break;			
		case "easeIn":
			tx1=0.42;
			ty1=0.0;
			tx2=1.00;
			ty2=1.000;
		break;		
		case "easeInOut":
			tx1=0.455;
			ty1=0.030;
			tx2=0.515;
			ty2=0.955;
		break;
		case "easeInOutBack":
			tx1=0.680;
			ty1=-0.550;
			tx2=0.265;
			ty2=1.550;
		break;
		case "easeInBack":
			tx1=0.600;
			ty1=-0.280;
			tx2=0.735;
			ty2=0.045;
		break;
		case "easeOutBack":
			tx1=0.175;
			ty1=0.885;
			tx2=0.320;
			ty2=1.275;
		break;
	}
	
	var value="cubic-bezier("+tx1+", "+ty1+", "+tx2+", "+ty2+")";
	tx1=Math.max(0, Math.min(tx1, 1)); // clamp to [0,1]
	ty1=Math.max(0, Math.min(ty1, 1));
	tx2=Math.max(0, Math.min(tx2, 1));
	ty2=Math.max(0, Math.min(ty2, 1));
	// documentation: http://matthewlein.com/ceaser/
	
	var value_clipped="cubic-bezier("+tx1+", "+ty1+", "+tx2+", "+ty2+")";
	e.jquery.css("-webkit-transition","all "+length+" "+value_clipped); // set for older webkit browsers!
	
	e.jquery.css("-webkit-transition","all "+length+" "+value); // set animation style!
	e.jquery.css("-moz-transition","all "+length+" "+value);
	e.jquery.css("-o-transition","all "+length+" "+value);
	e.jquery.css("transition","all "+length+" "+value);

	e.jquery.css("-webkit-transition-timing-function",value_clipped);// set for older webkit browsers!
	e.jquery.css("-webkit-transition-timing-function",value); // set animation style!
	e.jquery.css("-moz-transition-timing-function",value);
	e.jquery.css("-o-transition-timing-function",value);
	e.jquery.css("transition-timing-function",value);
	
}
// private function!
function _hybridResizeFunction()
{
	// check if we are on mobile, android and ONLY the height changed.
	// That means a keyboard popped up and we don't want to resize at all.
	//Hybrid.debugmessage("document active element!"+typeof(document.activeElement));
	if(navigator.userAgent.indexOf("Android") > -1)
	{
		// we are on an android..
		var focused = $(':focus');
		if(focused.is("input")) return; // don't resize, this is to fix the resize on android browsers soft keyboard!
	}
	_hybridGetPageScale();
	// rebuild the page from dynamic elements!
	if(typeof(Hybrid.resizeFunction)!=="undefined")
	{
		//Hybrid.debugmessage("Custom resize function has been defined!");
		Hybrid.resizeFunction();
	}
	Hybrid.debugmessage("window just resized!");
}
Hybrid.removeElement=_destroyHybridElement;
function _destroyHybridElement(layer)
 {
    layer.jquery.remove();			
 }
Hybrid.emptyElement=_hybridClearElement;
Hybrid.clearElement=_hybridClearElement;
function _hybridClearElement(layer)
 {
    layer.jquery.html("");			
 }
 
function _hybridSetElementID(layer,id)
 {
    layer.jquery.attr("id",id);
 }
 Hybrid.setBorder=_hybridSetBorder;
 function _hybridSetBorder(layer,bs,bt,bc)
 {
	layer.jquery.css("border-style",bs);
	layer.jquery.css("border-width",toPx(bt));
	layer.jquery.css("border-color",bc);
 }
 
Hybrid.pixelprecision="float";
// private function!
function toPx(x){
 switch(Hybrid.pixelprecision)
 {
	case "float":
		return ((Hybrid.f*x)+"px"); //this provides half pixels, but the values are rounded down by (most) browsers, which saves a lot of processing time.!
	break;
	case "round":
		return ((Math.round(Hybrid.f*x))+"px"); // this gives you high precision, but is a bit slower..!
	break;
	case "floor":
		return ((Math.floor(Hybrid.f*x))+"px"); // this gives you almost high precision, and is slightly faster than round!
	break;
 }
}
// function to start a NEW page afresh!
Hybrid.erasePage=_hybridErasePage;
function _hybridErasePage()
{
	var $body = $('body');
	var html_string="<div id='back'  style='left: 0px; top: 0px; width: 100%; height: 100%;'><div id='hybridStage' style='left: "+Hybrid.ox+"px; top: "+Hybrid.oy+"px;width: "+toPx(Hybrid.width)+"; height: "+toPx(Hybrid.height)+";'></div></div>"; // deletes all layers accept top one
	if(Hybrid.stageColor)
	{
		html_string="<div id='back' style='background-color: "+Hybrid.stageColor+"; left: 0px; top: 0px; width: 100%; height: 100%;'><div id='hybridStage' style='background-color: "+Hybrid.stageColor+"; left: "+Hybrid.ox+"px; top: "+Hybrid.oy+"px;width: "+toPx(Hybrid.width)+"; height: "+toPx(Hybrid.height)+";'></div></div>"; // deletes all layers accept top one	
	}
	$body.html(html_string);
	$body.css("background-color",Hybrid.stageColor);
	// somehow Draggable areas seem to persist for the onup function!
	window.onmouseup=null;
	Hybrid.input.mouse.down=false; // always mouse up on page change!
	_genericDrag.up=null; // there can be only ONE generic drag area per page.
	_genericDrag.down=null; // but usually that suffices..
	_genericDrag.drag=null;
	_genericDrag.move=null;
	
	Hybrid.mouseWheelCallback=null;// Hybrid.listenToMouseWheel. cut out!
	
	// erase all elements we have created and stop the loop
	Hybrid.standardButtonCallback=null;
	Hybrid.hybridButtonKeeper=[];
	Hybrid.elements={};
	Hybrid.dynamic_element_counter=0;
	Hybrid.muted_music_loop=""; // clear any muted music loops!
	Hybrid.stopLoop();
	Hybrid.stopTimeouts();
	Hybrid.clearTextChangeListener(); // this is default to kill all events from that page.
}

 