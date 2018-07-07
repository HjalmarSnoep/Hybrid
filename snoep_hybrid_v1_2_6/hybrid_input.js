 /*--
 SnoepGames: snoepHybrid - input
 
 HTML5 GAME LIB
 by Hjalmar Snoep
 http://www.snoepgames.nl 
 
 Copyright (c)  2014 Hjalmar Snoep, Snoepgames.  
 http://www.snoep.at
 http://www.makinggames.org/nl/user/hjalmarsnoep
 http://www.youtube.com/user/hjalmarsnoep
 All rights reserved.
 
 V1.2.0 
---*/
Hybrid.switches.support_multitouch = true; // see the touchStart handler for implementation, this is a switch rather than a support
Hybrid.input={}; // keep input stuff here!
Hybrid.input.mouse={}; // keep mouse/pointer stuff here!
Hybrid.input.rawmouse={}; // done by the hybrid context menu!
Hybrid.input.KEY_RIGHT=39;
Hybrid.input.KEY_UP=38;
Hybrid.input.KEY_LEFT=37;
Hybrid.input.KEY_DOWN=40;
Hybrid.input.KEY_SHIFT=16;
Hybrid.input.KEY_CTRL=17;
Hybrid.input.KEY_ALT=18;


document.addEventListener('mousemove', _hybridonMouseUpdate, false);
document.addEventListener('mouseenter', _hybridonMouseUpdate, false);

function _hybridonMouseUpdate(e) {
	var o=_hybridUnifyMouseCoords({x:e.pageX,y:e.pageY});
    Hybrid.input.mouse.x = o.x;
    Hybrid.input.mouse.y = o.y;
}

// get the mousewheel
Hybrid.listenToMouseWheel=_hybridListenToMouseWheel
Hybrid.mouseWheelCallback=null;
function _hybridListenToMouseWheel(callback)
{
	if(typeof(callback)==="function")
	{
		//Hybrid.debugmessage("Hybrid listening to mousewheel, relaying to: "+callback + "->"+typeof(callback) );
		Hybrid.mouseWheelCallback=callback;
	}else
	{
		Hybrid.showWarning("Hybrid.listenToMouseWheel called with a non-function as argument: "+callback);
	}
	$(window).bind('mousewheel DOMMouseScroll MozMousePixelScroll', _hybridMouseWheelCallback)
}
function _hybridMouseWheelCallback(e)
{
	// complication with FF, see http://stackoverflow.com/questions/13274326/firefoxjquery-mousewheel-scroll-event-bug
	// this is a work around for ALL browsers.
	//Hybrid.debugmessage("got a mousewheel callback!");
	 e.stopImmediatePropagation();
     e.stopPropagation();
     e.preventDefault();

	 var delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail);
	if(Hybrid.mouseWheelCallback!==null)
	{
		Hybrid.mouseWheelCallback(delta);
	}else
	{
		//Hybrid.debugmessage("null=="+Hybrid.mouseWheelCallback);
	}
    return false;
}

function _hybridIsTouchDevice(){
//	if(navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)) return true;
	// this below is not enough in iOs7, obviously, so a little browser sniffing fixes that..
//  return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;

	// this is the agnostic check from..
	// https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
	// also works on ipad!
	if (('ontouchstart' in window) ||
		 (navigator.maxTouchPoints > 0) ||
		 (navigator.msMaxTouchPoints > 0)){
		  /* browser with either Touch Events of Pointer Events
			 running on touch-capable device */
			 return true;
		}
	return false; 
};
 // you can call Hybrid.capabilities.maxtouches, it's set in init! If that =0 you don't need to care about touch!
function _hybridGetMaxTouches(){

	if(Hybrid.capabilities.touchmode)
	{
		if(navigator.maxTouchPoints > 1)return navigator.maxTouchPoints;
		if(navigator.msMaxTouchPoints > 1)return navigator.msMaxTouchPoints; // windows 8 and the like
		return 1;
	}
	return 0;
 }

Hybrid.buttonDownSound=null;
Hybrid.buttonOverSound=null;
 Hybrid.setButtonOverSound=_hybridSetButtonOverSound;
 function _hybridSetButtonOverSound(e)
 {
	Hybrid.buttonOverSound=e;
 }
 Hybrid.setButtonDownSound=_hybridSetButtonDownSound;
 function _hybridSetButtonDownSound(e)
 {
	Hybrid.buttonDownSound=e;
 }
 
 
 // BUTTONS Various kinds :)
Hybrid.standardButtonCallback=_hybridStandardiseButtonClick;// nothing should change this, by the way.. It's no longer public, this is for backward compatibility.
function _hybridStandardiseButtonClick(e)
{
	// this can be called by a touch or a mouse event, it doesn't matter, we only use the label!
	// now the event coming in, might be a touch event from windows points!
	_hybridRegisterMouse(e); // get the coordinates on any click, up or pointer event.
	if(Hybrid.buttonDownSound!=null)Hybrid.playSound(Hybrid.buttonDownSound);
	e.stopPropagation();
	e.preventDefault();
	
	var functionName=$(this).attr("cb");
	window[functionName]($(this).attr("label")); // call a non-namespaced function by string, see 
	 // article http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
	 // for namespacing, now not possible..
	 
	// just execute it..
//	if(e.handled !== true) 
//	{
//		Hybrid.standardButtonCallback($(this).attr("label"));
//    } else 
//	{
//		return false;
//	}
}


function _hybridNewStandardiseButtonClick(ev)
{
   if (ev.preventManipulation)
		ev.preventManipulation();
	if (ev.preventDefault)
		ev.preventDefault();

	// get the callbacks to do
	var label=ev.target.getAttribute("label"); // label!
	var cbo=ev.target.getAttribute("cbo"); // callback over
	var cb=ev.target.getAttribute("cb"); // callback
 
	var touchPoints = (typeof ev.changedTouches != 'undefined') ? ev.changedTouches : [ev];
	for (var i = 0; i < touchPoints.length; ++i) 
	{
		var touchPoint = touchPoints[i];
		// pick up the unique touchPoint id if we have one or use 1 as the default
		var touchPointId = (typeof touchPoint.identifier != 'undefined') ? touchPoint.identifier : (typeof touchPoint.pointerId != 'undefined') ? touchPoint.pointerId : 1;
		
		if (ev.type.match(/(down|start)$/i)) {
			// process mousedown, MSPointerDown, and touchstart
			var crsr=_hybridUnifyMouseCoords({x:touchPoint.pageX,y:touchPoint.pageY});
			Hybrid.input.mouse.x=crsr.x;
			Hybrid.input.mouse.y=crsr.y; // register the mouse!
			Hybrid.debugmessage("KeyReplacer touched "+label);

			window[cb](label,i); // call a non-namespaced function by string, also give the pointer that clicks it..
			
		}
		else if (ev.type.match(/(over|out|up|end|leave)$/i)) 
		{
			var crsr=_hybridUnifyMouseCoords({x:touchPoint.pageX,y:touchPoint.pageY});
			if(typeof(cbo)!="undefined")
			{
				if (ev.type.match(/(over)$/i)) 
				{
					if(Hybrid.buttonOverSound!=null)Hybrid.playSound(Hybrid.buttonOverSound);
					var over=ev.target.getElementById("over");
					var norm=ev.target.getElementById("norm");
					if(over!=null)
					{
						over.style.display = "block"; // might have to be initial??
					}
					if(norm!=null)
					{
						norm.style.display = "none";
					}
					if(typeof(cbo)!=="undefined")
						window[cbo](label,"over",i);
				}
				else
				{
					var over=ev.target.getElementById("over");
					var norm=ev.target.getElementById("norm");
					if(over!=null)
					{
						over.style.display = "none"; // might have to be initial??
					}
					if(norm!=null)
					{
						norm.style.display = "block";
					}
					if(typeof(cbo)!=="undefined")
						window[cbo](label,"over",i);
				
					window[cbo](label,i,"out");
				}
				Hybrid.debugmessage("NewStandardised button over or out "+label);
			}
		}
	}
}

function _hybridRegisterMouse(e)
{
// this works on jquery!! mouseevents to get the coordinates into Hybrid.input.mouse.
	if (e.type.match(/(up|end)$/i)) 
	{
		// these can't be trusted, because, they don't have mousecoords!
		// so just keep the last ones we got, always better... ala
	}else
	{
		var o=_hybridUnifyMouseCoords({x:e.pageX,y:e.pageY});
		Hybrid.input.mouse.x=o.x;
		Hybrid.input.mouse.y=o.y;
		// might be a touch event!
		if(e.originalEvent)
		{
			if(e.originalEvent.touches)
			{
				if(e.originalEvent.touches[0])
				{
					var o=_hybridUnifyMouseCoords({x:e.originalEvent.touches[0].pageX,y:e.originalEvent.touches[0].pageY});
					Hybrid.input.mouse.x=o.x;
					Hybrid.input.mouse.y=o.y;
					//Hybrid.showWarning("mouse Registration iPad"+o.x+","+o.y);
				}
			}
		}
		if(e.touches) // this is provided by JQuery to handle windows 8, or so it seems!
		{
			var o=_hybridUnifyMouseCoords({x:e.touches[0].pageX,y:e.touches[0].pageY});
			Hybrid.input.mouse.x=o.x;
			Hybrid.input.mouse.y=o.y;
			//Hybrid.showWarning("mouse Registration windows8"+o.x+","+o.y);
		}
	}

}
 Hybrid.standardButtonOverCallback=null;
  function _hybridStandardiseButtonOver(e)
 {
	// this can be called by a touch or a mouse event, it doesn't matter, we only use the label!
	//Hybrid.debugmessage("_hybridStandardiseButtonOver: "+$(this).attr("label") +" "+e.type);
	_hybridRegisterMouse(e);
	e.stopPropagation();
	e.preventDefault();
	var functionName=$(this).attr("cbo");
	if(e.type==="mouseover")
	{
		if($(this).has("#over"))
		{
			$(this).find("#over").show();
		}
		if($(this).has("#norm"))
		{
			$(this).find("#norm").hide();
		}
//		Hybrid.debugmessage("buttonOverSound: "+Hybrid.buttonOverSound);
		if(Hybrid.buttonOverSound!=null)Hybrid.playSound(Hybrid.buttonOverSound);

		if(typeof(functionName)!=="undefined")
		window[functionName]($(this).attr("label"),"over");
//
//		Hybrid.standardButtonOverCallback($(this).attr("label"),"over");
		//Hybrid.debugmessage("overcallback over!");
	}else
	{
		if($(this).has("#over"))
		{
			$(this).find("#over").hide();
		}
		if($(this).has("#norm"))
		{
			$(this).find("#norm").show();
		}
		if(typeof(functionName)!=="undefined")
			window[functionName]($(this).attr("label"),"out");
//		Hybrid.standardButtonOverCallback($(this).attr("label"),"out");
		//Hybrid.debugmessage("overcallback out!");
	}
 }
Hybrid.saveButtonContext=_hybridSaveButtonContext; // this makes it possible to do popups with a new context and then restore on close!
Hybrid.restoreButtonContext=_hybridRestoreButtonContext;
function _hybridSaveButtonContext()
{
	// this prevents accidental loss by double clicking  etc..
	if(Hybrid.savedButtonContext!=Hybrid.standardButtonCallback)
	{
		Hybrid.savedButtonContext=Hybrid.standardButtonCallback;
		Hybrid.savedButtonContextOver=Hybrid.standardButtonOverCallback;
	}
}
function _hybridRestoreButtonContext()
{
	if(Hybrid.savedButtonContext!=Hybrid.standardButtonCallback)
	{
		Hybrid.standardButtonCallback=Hybrid.savedButtonContext;
		Hybrid.standardButtonOverCallback=Hybrid.savedButtonContextOver;
	}
}
 
// use this function to make areas of the screen handle like parts of the keyboard (for touch especially)
Hybrid.makeKeyReplacer=_hybridMakeKeyReplacer;
function _hybridMakeKeyReplacer(o, keyc)  // this callback ONLY wants to know what keyboard key to override and calls back Hybrid.KeyListener if set!
{
  if(o.kind!="hybridLayer" && o.kind!="hybrido" && o.kind!="hybridTexto" && o.kind!="hybridCanvas" && o.kind!="hybridCssSprite")
  {
   Hybrid.debugmessage("makeKeyReplacer reports: not the right kind of object: "+o.kind);
   return null;
  }
 if(o.kind=="hybridLayer" || o.kind=="hybrido") 
	if(o.jquery.html()=="") o.jquery.html("<img width='100%' height='100%' src='"+Hybrid.dataurls['hotspots']+"' />");
    // for a canvas of a sprite or whatever this is sillyness.!
  
  var htsp=o.jquery;
  htsp.attr("keycode",keyc);
  
  // for windows 8 (tablet events to come through, we need to do the following.
  var htsp=document.getElementById(o.jquery.attr("id")); // NOW it's a DOM element, that's different!
  if (typeof htsp.style.msTouchAction != 'undefined')
		htsp.style.msTouchAction = "none";
	// this one makes it NOT scroll standard, if you try to make it scroll. Might be what is happening to our thing with the div-scrolling....
		
 // Hybrid.debugmessage("Enabled KeyReplacer"+htsp.jquery+" - "+htsp.attr("keyc"));
 
	if (window.navigator.msPointerEnabled) 
	{
	  // Pointer events are supported.
		htsp.addEventListener("MSPointerDown", _hybridStandardisedKeyReplacer, false);
		htsp.addEventListener("MSPointerUp", _hybridStandardisedKeyReplacer, false);
		htsp.addEventListener("MSPointerOut", _hybridStandardisedKeyReplacer, false);
	}
	htsp.onmousedown=_hybridStandardisedKeyReplacer;
	htsp.onmouseup=_hybridStandardisedKeyReplacer;
	htsp.onmouseout=_hybridStandardisedKeyReplacer;
	htsp.ontouchstart=_hybridStandardisedKeyReplacer;
	htsp.ontouchend=_hybridStandardisedKeyReplacer;
	htsp.ontouchcancel=_hybridStandardisedKeyReplacer;	
  
  // back to jquery!
  htsp=o.jquery;
  htsp.bind('dragstart',_jQueryAdditionstopEvent); // this ACTUALLY stops selecting the stuff.
};
function _hybridStandardisedKeyReplacer(ev)
{
   if (ev.preventManipulation)
		ev.preventManipulation();
	if (ev.preventDefault)
		ev.preventDefault();

	// get the keycode to set
	var keycode=ev.target.getAttribute("keycode"); // label!
	Hybrid.debugmessage("KeyReplacer touched or released "+keycode);
 
	var touchPoints = (typeof ev.changedTouches != 'undefined') ? ev.changedTouches : [ev];
	for (var i = 0; i < touchPoints.length; ++i) 
	{
		var touchPoint = touchPoints[i];
		// pick up the unique touchPoint id if we have one or use 1 as the default
		var touchPointId = (typeof touchPoint.identifier != 'undefined') ? touchPoint.identifier : (typeof touchPoint.pointerId != 'undefined') ? touchPoint.pointerId : 1;
		
		if (ev.type.match(/(down|start)$/i)) {
			// process mousedown, MSPointerDown, and touchstart
			var crsr=_hybridUnifyMouseCoords({x:touchPoint.pageX,y:touchPoint.pageY});
			Hybrid.input.mouse.x=crsr.x;
			Hybrid.input.mouse.y=crsr.y;
			
			Hybrid.debugmessage("KeyReplacer touched "+keycode);
			if(Hybrid.input.keys[keycode]!=true)
			{
				Hybrid.input.keys[keycode]=true;
				if(typeof(Hybrid._userKeyHandler)!="undefined")
				{
					Hybrid._userKeyHandler(keycode,true,false);
				}
			}
		}
		else if (ev.type.match(/(up|end|leave)$/i)) 
		{
			// process mouseup, MSPointerUp, and touchend
			var crsr=_hybridUnifyMouseCoords({x:touchPoint.pageX,y:touchPoint.pageY});
			Hybrid.debugmessage("KeyReplacer released "+keycode);
			if(Hybrid.input.keys[keycode]!=false)
			{
				Hybrid.input.keys[keycode]=false;
				if(typeof(Hybrid._userKeyHandler)!="undefined")
				{
					Hybrid._userKeyHandler(keycode,false);
				}
			}
		}
	}
}






 Hybrid.makeButton=_hybridMakeButton;
function _hybridMakeButton(o, label, cb, cb_over)
{
	//Hybrid.debugmessage("WARNINIG: do no longer use makebutton, it will not work with IE touch, use createSpriteButton instead.");

  if(o.kind!="hybridLayer" && o.kind!="hybridBox" && o.kind!="hybridTextBox" && o.kind!="hybridCanvas" && o.kind!="hybridCssSprite")
  {
   Hybrid.debugmessage("makeButton reports: not the right kind of object: "+o.kind);
   return null;
  }
 
  // maybe the o is an empty box, then we add a transparent image.
  if(o.jquery.html()=="" && (o.kind=="hybridLayer" || o.kind=="hybridBox")) o.jquery.html("<img width='100%' height='100%' src='"+Hybrid.dataurls['hotspots']+"' />");
 
 // the rest of this code is adapted from createSpriteButton!

	// we set the class to class="image_button" .. We might still need to do that.
   // get function names and save the callback functions in the button!:
   o.jquery.attr("label",label);
   
   _hybridAddCallbackAsAttr(o,"cb",cb);
   if(typeof(cb_over)!="undefined")_hybridAddCallbackAsAttr(o,"cbo",cb_over);
	o.jquery.on('click',_hybridStandardiseButtonClick);
	if(Hybrid.capabilities.maxtouches>0)
	{
		o.jquery.on('click touchstart', _hybridStandardiseButtonClick);
		o.jquery.bind('touchend', function(e) 	{
		  e.preventDefault();
		  // Add your code here.
		  // this actually should prevent a double tap zoom on windows 8 touch!
		  // we still use bind.. on doesn't seem to have the same effect.
		});
		var id=o.jquery.attr("id");
		var button=document.getElementById(id);
		button.style.cursor="pointer";
	}else
	{
		// we are on desktop!
		Hybrid.standardButtonOverCallback=cb_over;
		// we also need to hear about mouse in and out!
		o.jquery.on('mouseover', _hybridStandardiseButtonOver);
		o.jquery.on('mouseout', _hybridStandardiseButtonOver);
	}
	o.jquery.bind('dragstart',_jQueryAdditionstopEvent ); // this ACTUALLY stops selecting the stuff.
	// http://stackoverflow.com/questions/7892863/jquery-click-not-working-with-ipad
	// to fix the click not working, because it registers as a hover!

	// http://stackoverflow.com/questions/7892863/jquery-click-not-working-with-ipad
	// to fix the click not working on Ipad, because it registers as a hover!
	
};

function _hybridHasTilt()
{
	//Hybrid.showWarning("detect tilt");
	var c=false;
	if (window.DeviceOrientationEvent)c=true;
    if (window.DeviceMotionEvent)c=true;
	if (window.MozOrientationEvent)c=true; // not too sure about this one, bit dodgy in docs..
	return c;
}
Hybrid.listenToTilt=_hybridListenToTilt;
function _hybridListenToTilt(tf,uth)
{
    // source: 
    //http://stackoverflow.com/questions/4378435/how-to-access-accelerometer-gyroscope-data-from-javascript
	// example of:
	// http://isthisanearthquake.com
	
	if(Hybrid.capabilities.tilt==false)
	{
		Hybrid.debugmessage("Your device doesn't seem to be able to detect tilt."); // we should use priority here!
		// don't do anything after this...
	}else
	{
		Hybrid.debugmessage("Your device seems to be able to detect tilt.");
		if(tf)
		{
			Hybrid._userTiltHandler=uth;
			if (window.DeviceOrientationEvent) {
				window.addEventListener("deviceorientation", _hybridTiltListener1,true);
			} else if (window.DeviceMotionEvent) {
				window.addEventListener('devicemotion',_hybridTiltListener2, true);
			} else {
				window.addEventListener('MozOrientation',_hybridTiltListener3, true);
			}
		}else
		{
			if (window.DeviceOrientationEvent) {
				window.removeEventListener("deviceorientation", _hybridTiltListener1,true);
			} else if (window.DeviceMotionEvent) {
				window.removeEventListener("devicemotion", _hybridTiltListener2,true);
			} else {
				window.removeEventListener("MozOrientation", _hybridTiltListener3,true);
			}	
		}
	}
};
function _hybridTransformTilt(obj)
{
	var new_obj={};
	new_obj.h=obj.h;
	switch (window.orientation) {  
    case 0:  
        // Portrait 
		new_obj.x=-obj.x;
		new_obj.y=-obj.y;
        break; 
    case 180:  
        // Portrait (Upside-down)
		new_obj.x=-obj.x;
		new_obj.y=-obj.y;
        break; 
    case -90:  
    	new_obj.x=-obj.x;
		new_obj.y=-obj.y;
        // Landscape (Clockwise)
        break;  
  
    case 90:  
    	new_obj.x=obj.x;
		new_obj.y=obj.y;
        // Landscape  (Counterclockwise)
        break;
    }
	return new_obj;
}
// this is for the different methods of detecting Tilt!
function _hybridTiltListener1(event)
{
	//alpha= kompasrichting.
	// beta = long direction of device tilt (landscape == x (or -x) ) 
	// gamme : short direction of device tilt
	// alpha is not needed for us now, but we need to use
	// screen.orientation to get the right values!
	switch(top.orientation) 
	{
		case -90:
			Hybrid._userTiltHandler({x:-event.beta,y:event.gamma,h:1,a:event.alpha,t:top.orientation}); // this is the one used on iPad (and Chrome??)
		break;
		case 90:
			Hybrid._userTiltHandler({x:event.beta,y:-event.gamma,h:1,a:event.alpha,t:top.orientation}); // this is the one used on iPad (and Chrome??)
		break;
		case 0:
			Hybrid._userTiltHandler({x:event.gamma,y:event.beta,h:1,a:event.alpha,t:top.orientation}); // this is the one used on iPad (and Chrome??)
		break;
		case 180:
			Hybrid._userTiltHandler({x:-event.gamma,y:-event.beta,h:1,a:event.alpha,t:top.orientation}); // this is the one used on iPad (and Chrome??)
		break;
		default:
			Hybrid._userTiltHandler({x:event.beta,y:event.gamma,h:1,a:"top orientaiton not matched : "+event.alpha}); // this is the one used on iPad (and Chrome??)
	}
	// the -minus one depends on how you hold the ipad.. jeeez..
	// but x is always the same.
}
function _hybridTiltListener2(event)
{
	Hybrid._userTiltHandler({x:event.acceleration.x,y:event.acceleration.y,h:2,a:"none"});
}
function _hybridTiltListener3(event)
{
	Hybrid._userTiltHandler({x:orientation.x , y:orientation.y,h:3,a:"none"});
}
Hybrid.listenToKeys=_hybridListenToKeys;
function _hybridListenToKeys(tf,ukh)
{

	if(typeof(Hybrid.input)==="undefined")
		Hybrid.input={};

		
	Hybrid.input.keys=[];// no key down!
	Hybrid.input.anykey_touched=false; // this will be set if ANY key was actually touched, so not by a replacer!
	Hybrid.input.key_modifiers={};// no modifiers down.
		
	if(tf)
	{
		/*
		 * this swallows backspace keys on any non-input element.
		 * stops backspace -> back
		 */
		var rx = /INPUT|SELECT|TEXTAREA/i;
		$(document).bind("keydown keypress", function(e){
			if( e.which == 8 ){ // 8 == backspace
				if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
					e.preventDefault();
				}
			}
		});
		// works in chrome!
		// see discussion here:
		// http://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back
		// end of backspace fix!
	
		$(document).keydown(_hybridKeyHandler);
		$(document).keyup(_hybridKeyHandler);
		Hybrid.debugmessage("Hybrid is now listening to Keys.");
		Hybrid._userKeyHandler=ukh;
	}
	else
	{
		$(document).unbind("keydown keypress keyup"); // this one does work in stead of the previous, which actually fired the event!
		
//		$(document).keydown(); // this fires the event, does NOT unbind it!
//		$(document).keyup();
		Hybrid._userKeyHandler=null;
		Hybrid.debugmessage("Hybrid stopped listening to Keys.");
	}
}
function _hybridKeyHandler(ev)
{
	//Hybrid.debugmessage("_hybridKeyHandler");
	var down=(ev.type=="keydown");
	if(Hybrid.input.keys[ev.which]!=down) // use which in stead of ev.keyCode because jqUERY normalised crossbrowser.
	{
		Hybrid.input.anykey_touched=true;
		if(typeof(Hybrid._userKeyHandler)!="undefined")
		{
			Hybrid._userKeyHandler(ev.which,down);
		}
	}
	if(ev.which==16)
	{
		Hybrid.input.key_modifiers.shift=down;
	}
	if(ev.which==17)
	{
		Hybrid.input.key_modifiers.ctrl=down;
	}
	if(ev.which==18)
	{
		Hybrid.input.key_modifiers.alt=down;
	}
	if(ev.which==20)
	{
		Hybrid.input.key_modifiers.capslock=down;
	}
	if(ev.which==144)
	{
		Hybrid.input.key_modifiers.numlock=down;
	}
//	if(ev.shiftKey) Hybrid.input.key_modifiers.shift=down; // this works as a double fire, disabling in CHROME
//	if(ev.ctrlKey) Hybrid.input.key_modifiers.ctrl=down;
//	if(ev.altKey) Hybrid.input.key_modifiers.alt=down;
	
	Hybrid.input.keys[ev.which]=down; // record it for checking later!
	ev.preventDefault; // this stops any key commands, like backspace=back..
	//Hybrid.debugmessage(ev.keyCode+ "." +down+" jQuery normalised: "+ev.which);
}


Hybrid.makeDraggable=_hybridMakeSingleDraggable;
function _hybridMakeSingleDraggable(o,down,up,drag,move,label)
{
	// move is an optional function, you can leave it open!
	
	// if it's a blank o, fill it with a transparent img
	if(o.jquery.html()=="")
	{
		o.jquery.html("<img width='100%' height='100%' src='"+Hybrid.dataurls['hotspots']+"' />");
	}
	
	// we could attach attributes, just like in buttons..
	
	_genericDrag.up=up; // there can be only ONE generic drag area per page.
	_genericDrag.down=down; // but usually that suffices..
	_genericDrag.drag=drag;
	_genericDrag.move=move;
	
	var hotspot=o.jquery;
	//Hybrid.debugmessage("make "+o.jquery.attr("id")+" draggable");

	if(typeof(label)!=="undefined")	 o.jquery.attr("lb",label); // label!
	 // propagate to all children
	 hotspot.find('*').attr("lb",label);
	

	 _hybridAddCallbackAsAttr(o,"up",up);
	 _hybridAddCallbackAsAttr(o,"down",down);
	 _hybridAddCallbackAsAttr(o,"drag",drag);
	 
	 if(typeof(move)!="undefined")_hybridAddCallbackAsAttr(o,"move",move);
	
	
	// for windows 8 (tablet events to come through, we need to do the following.
	var htsp=document.getElementById(o.jquery.attr("id"));
	if (typeof htsp.style.msTouchAction != 'undefined')
		htsp.style.msTouchAction = "none";
		
	// windows 8
	if (window.navigator.msPointerEnabled) 
	{
	  // Pointer events are supported.
		htsp.addEventListener("MSPointerMove", _hybridGenericDragHandler, false);
		htsp.addEventListener("MSPointerDown", _hybridGenericDragHandler, false);
		htsp.addEventListener("MSPointerUp", _hybridGenericDragHandler, false);
		if(typeof(move)!=="undefined")
		{
			Hybrid.debugmessage("Draggable AND mousemove enabled (windows tablet)!");
			htsp.addEventListener("MSPointerOver", _hybridGenericDragHandler, false);
//			htsp.addEventListener("mousemove", _hybridGenericDragHandler, false); // this might to be necessary to get windos 8 to play along
		}
	  //  regular_dom.MSPointerOver
	   // regular_dom.MSPointerOut
	   // regular_dom.MSPointerHover
	}
	
	//jQueryAddition_MakeUnselectable(hotspot);
	// bind mouse and touch to this hotspot
	document.onmouseout=_hybridGenericDragHandler; // this is reported to even catches mouse up outside the draggable area window!
	document.onmouseup=_hybridGenericDragHandler; // this is reported to even catches mouse up outside the draggable area window!
	htsp.onmousedown=_hybridGenericDragHandler;
	htsp.onmouseup=_hybridGenericDragHandler;
	htsp.onmousemove=_hybridGenericDragHandler;
	//htsp.onmouseleave=_hybridGenericDragHandler; // in some cases (dragging and over) it might be prudent to add mouseleave as an up!
	htsp.ontouchstart=_hybridGenericDragHandler;
	htsp.ontouchmove=_hybridGenericDragHandler;
	htsp.ontouchend=_hybridGenericDragHandler;
	htsp.ontouchcancel=_hybridGenericDragHandler;	
	// prevent default jquery behaviour on dragstart events to be able to handle gestures over hotspots and images yourself!
	hotspot.on('dragstart', function (e) {  e.preventDefault(); console.log("dragstart");});
}

// get offset_x,y recommended practice, for original event!.
// source http://stackoverflow.com/questions/8389156/what-substitute-should-we-use-for-layerx-layery-since-they-are-deprecated-in-web
function _hybridGetOffsetCoord(evt) 
{
  var el = evt.target,
      x = 0,
      y = 0;

  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - el.scrollLeft;
    y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }

  x = evt.clientX - x;
  y = evt.clientY - y;

  return { x: x, y: y };
}


var _genericDrag={};
_genericDrag.lastXY={};
function _hybridGenericDragHandler(ev)
{
	//Hybrid.debugmessage("_hybridGenericDragHandler ev.type "+ev.type);
	// add mouseleave as an up!
	
   // stop panning and zooming so we can draw
   if (ev.preventManipulation)
		ev.preventManipulation();
 
	// we are handling this event
	if (ev.preventDefault)
		ev.preventDefault();

	// get the callbacks
	var down=window[ev.target.getAttribute("down")];
	var drag=window[ev.target.getAttribute("drag")];
	var up=window[ev.target.getAttribute("up")];
	var move=window[ev.target.getAttribute("move")];
	var label=ev.target.getAttribute("lb"); // label!

	// if we have an array of changedTouches, use it, else create an array of one with our ev
	var touchPoints = (typeof ev.changedTouches != 'undefined') ? ev.changedTouches : [ev];
	for (var i = 0; i < touchPoints.length; ++i) 
	{
		var touchPoint = touchPoints[i];
		// pick up the unique touchPoint id if we have one or use 1 as the default
		var touchPointId = (typeof touchPoint.identifier != 'undefined') ? touchPoint.identifier : (typeof touchPoint.pointerId != 'undefined') ? touchPoint.pointerId : 1;
		
		if (ev.type.match(/(down|start)$/i)) {
			// process mousedown, MSPointerDown, and touchstart
			var crsr=_hybridUnifyMouseCoords({x:touchPoint.pageX,y:touchPoint.pageY});
			Hybrid.input.mouse.x=crsr.x;
			Hybrid.input.mouse.y=crsr.y;
			
			_genericDrag.lastXY[touchPointId] = { x: crsr.x, y: crsr.y };
			if(typeof(down)!=="undefined")
				down(touchPointId, crsr.x, crsr.y,label);
			if(typeof(drag)!=="undefined")
				drag(touchPointId, crsr.x, crsr.y,0,0,label); // speed!
			// the reason for all these ifs, is.. Children of a draggable container might not have any actions set, but they will try to fire an event. If none is set, that would be an error!
		}
		else if (ev.type.match(/move$/i)) 
		{
			// process mousemove, MSPointerMove, and touchmove
			if (_genericDrag.lastXY[touchPointId] && !(_genericDrag.lastXY[touchPointId].x == touchPoint.pageX && _genericDrag.lastXY[touchPointId].y == touchPoint.pageY)) 
			{
				if(typeof(drag)!=="undefined")
				{
					var crsr=_hybridUnifyMouseCoords({x:touchPoint.pageX,y:touchPoint.pageY});
					Hybrid.input.mouse.x=crsr.x;
					Hybrid.input.mouse.y=crsr.y;
					var dx=crsr.x-_genericDrag.lastXY[touchPointId].x;
					var dy=crsr.y-_genericDrag.lastXY[touchPointId].y;
					_genericDrag.lastXY[touchPointId] = { x: crsr.x, y: crsr.y };
					if(typeof(drag)!=="undefined")
						drag(touchPointId, crsr.x, crsr.y,dx,dy,label);
				}else
				{
					Hybrid.debugmessage("drag is undefined on "+ev.target);
				}
			}else
			{
				if(typeof(move)!=="undefined")
				{
					var crsr=_hybridUnifyMouseCoords({x:ev.pageX,y:ev.pageY});
					move(1, crsr.x, crsr.y,label);
				}
			}
		}
		else if (ev.type.match(/(up|end|leave)$/i)) 
		{
			// process mouseup, MSPointerUp, and touchend
			var crsr=_hybridUnifyMouseCoords({x:touchPoint.pageX,y:touchPoint.pageY});
			//Hybrid.debugmessage("up '"+up+"' up==undefined"+(typeof(up)==="undefined"));
			if(typeof(up)!=="undefined")
				up(touchPointId, crsr.x, crsr.y,label);
			// remove the id!
			delete _genericDrag.lastXY[touchPointId];
		}
	}
}

Hybrid.createHotspot=_hybridCreateHotspot;
function _hybridCreateHotspot(o,handler)
{
	if(o.jquery.html()=="")
	{
		o.jquery.html("<img width='100%' height='100%' src='"+Hybrid.dataurls['hotspots']+"' />");
	}
	
	
	// if you are unsure if hotspots are being made, the next is a handy debug rule!
	// layer.jquery.html("<img src='../static/img/show_ho_old_tspots.png' width='100%' height='100%'>");
	var hotspot=o.jquery;
	Hybrid.debugmessage("makeHotSpot of: "+o.jquery.attr("id"));

	// for windows 8 (tablet events to come through, we need to do the
	// following.
	// to do that, we need to see if we even HAVE a document.getElementById
	var regular_dom=document.getElementById(o.jquery.attr("id"));
	if (typeof regular_dom.style.msTouchAction != 'undefined')
		regular_dom.style.msTouchAction = "none";
		
	
	//jQueryAddition_MakeUnselectable(hotspot);
	// bind mouse and touch to this hotspot
	$(window).mouseup(handler); // this is reported to even catches mouse up outside window!
	if(Hybrid.capabilities.touchmode)
	{
		//disablePageScrolling(); // no more pagescrolling for duration of game
		//alert("READY! in support.touchmode!");
		hotspot.on('touchstart touchend touchcancel touchmove', handler);
		$("body").on("touchend", handler); 
		$(document).on("touchend", handler); // this overrides the touchend tester on context menu!
		$(document).on("mouseup", handler); // this overrides the touchend tester on context menu!
		$('html').on("touchend", handler); 
		hotspot.mouseover(handler); 
		hotspot.mouseup(handler); 
		// this works on an iPad, but buttons will no longer work, so we need to fix that!
	}else
	{
		//alert("READY! in desktopmode!");
		// add handler to support clicking on background in user_agent_iOs!
		hotspot.mouseover(handler); // makes it possible to detect when you are outside a hotspot!
		hotspot.mouseleave(handler); // makes it possible to detect when you are outside a hotspot!
		hotspot.click(handler);
		hotspot.mousedown(handler);
		$("body").mouseup(handler); // should's this be $document and or $body, like touchend?
		$(document).mouseup(handler); // this even catches mouse up outside pane!
		$('html').mouseup(handler);
		hotspot.mousemove(handler);
	}
	// prevent default behaviour on dragstart events to be able to handle gestures over hotspots and images yourself!
	hotspot.on('dragstart', function (e) {  e.preventDefault(); console.log("dragstart");});
}

Hybrid.unifyMouseCoords=_hybridUnifyMouseCoords;
function _hybridUnifyMouseCoords(obj)
{
	//debugmessage("hybridUnifyMouseCoords from: "+obj.x+","+obj.y);
	obj.x=(obj.x-Hybrid.ox)/Hybrid.f;
	obj.y=(obj.y-Hybrid.oy)/Hybrid.f;
	//debugmessage("hybridUnifyMouseCoords to: "+obj.x+","+obj.y);
	return obj;
}


Hybrid.spriteButtonSelected=_hybridSpriteButtonSelected; //layer,x,y,w,h,image,anim,label,cb)
function _hybridSpriteButtonSelected(o,tf) 
{
	if(o.kind!="hybridSpriteButton")
	{
		Hybrid.debugmessage("spriteButtonSelected: sorry, you can only set selected of sprite buttons, not: "+l.kind);
		return;
	}
	if(typeof(Hybrid.graphics_manifest[o.image].ss[o.anim][2])==="undefined")
	{
		Hybrid.debugmessage("spriteButtonSelected: No third frame for sprite button"+l.kind);
		return;
	}
    var x1=Hybrid.graphics_manifest[o.image].ss[o.anim][0][0];
    var y1=Hybrid.graphics_manifest[o.image].ss[o.anim][0][1];
    var w1=Hybrid.graphics_manifest[o.image].ss[o.anim][0][2];
    var h1=Hybrid.graphics_manifest[o.image].ss[o.anim][0][3];
    var x2=Hybrid.graphics_manifest[o.image].ss[o.anim][2][0];
    var y2=Hybrid.graphics_manifest[o.image].ss[o.anim][2][1];
    var w2=Hybrid.graphics_manifest[o.image].ss[o.anim][2][2];
    var h2=Hybrid.graphics_manifest[o.image].ss[o.anim][2][3];
    var ii=Hybrid.graphics_manifest[o.image].img;
	// 
	if(tf==false)
	{
		o.context.drawImage(ii,x1,y1,w1,h1,0,0,w1,h1);// restore first image
	}else
	{
		o.context.drawImage(ii,x2,y2,w2,h2,0,0,w2,h2);// set third image as first image
	}
	// the ipad doesn't automatically release, so let's do that NOW and maybe break the active state...
	o.link_to_in.css("top","0");
}
// this is a helper function, shorthand, because we use it so much to create buttons and draggable area's
function _hybridAddCallbackAsAttr(hybrid_element,attr,cb)
{
	var hotspot=hybrid_element.jquery;
	var fn;
	if(typeof(cb)!=="undefined")
	{
		// we are searching for 'function', which plays merry hob with our obfuscator.
		// and criples our local obfuscation list, which in turn stops the release
		// from working the same as the build.
		// so we crypt this 'function!'
	  var fnc_crpt=Hybrid.decodeString("66756e6374696f6e20"); // 'function '
	  fn= cb.toString();
	  fn = fn.substr(fnc_crpt.length);
	  fn = fn.substr(0, fn.indexOf('('));
	  hotspot.attr(attr,fn);
	  
  	 // propagate to all children
	 hotspot.find('*').attr(attr,fn);
	  
	  // Hybrid.debugmessage("set function to attr: "+attr+" on "+hybrid_element.id);
	  
	}else
	{
	   Hybrid.debugmessage("WARNING no callback given for _hybridAddCallbackAsAttr with attr: "+attr+" on "+hybrid_element.id);
	}
}

Hybrid.createSpriteButton=_hybridSpriteButton; //layer,x,y,w,h,image,anim,label,cb)
function _hybridSpriteButton(l,x,y,w,h,image,anim,label,cb,cb_over) 
{
  if(l.kind!="hybridLayer" && l.kind!="hybridBox")
  {
   Hybrid.debugmessage("createImageButton reports: not the right kind of object: "+l.kind);
   return null;
  }
  //Hybrid.standardButtonCallback=cb;
  
  

  /*if(Hybrid.standardButtonCallback==null || Hybrid.standardButtonCallback==cb)
  {
  }else
  {
	Hybrid.debugmessage("_hybridSpriteButton reports: May be a callback conflict!!");
  }*/
  var o={};
  o.id="hybridSpriteButton"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  o.kind="hybridSpriteButton";
  o.label=label;
//  o.callback=cb; // this is unneccessary
  o.container=Hybrid.createBox(l,x,y,w,h);
   o.container.jquery.attr("label",label);
  o.jquery=o.container.jquery; // must have this to be able to hide it.
//  o.container.jquery.html('<a class="btn" style="width: '+toPx(w)+'; height: '+toPx(h)+';" href="#"><span class="btn-content" style="padding: '+toPx((h-14)/2.2)+'; font-size: '+toPx(14)+';">'+tekst+'</span></a>');
  // create a canvas inside this l!
  
  // the old way to do this was create a twice as high canvas. But better is to create two.
  // css rounds very strangely to pixels and two makes more sense.
  // you can still use css to automatically hide them..
  
  var canvas_w,canvas_h;
  o.image=image;
  o.anim=anim;
  o.container.jquery.html('<div class="image_button" id="'+o.id+'_in" style="width: 100%; height: 200%; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none;" href="#"><canvas id="'+o.id+'_canv"></canvas></div>');
  o.link_to_in=$("#"+o.id+"_in");
  var html_string="<canvas id='"+o.id+"'></canvas>";
  o.canvas=$("#"+o.id+"_canv")[0];
  
  var hh=Hybrid.graphics_manifest[image];
  var x1=hh.ss[anim][0][0];
  var y1=hh.ss[anim][0][1];
  var w1=hh.ss[anim][0][2];
  var h1=hh.ss[anim][0][3];
  var x2=hh.ss[anim][1][0];
  var y2=hh.ss[anim][1][1];
  var w2=hh.ss[anim][1][2];
  var h2=hh.ss[anim][1][3];
  var ii=hh.img;
  canvas_w=w1; // frame 0 width (of max!)
  if(w2>canvas_w)canvas_w=w2; // frame 1 width
  canvas_h=h1+h2; // frame 0 height + frame 1 height
  
  o.canvas.width = canvas_w; 
  o.canvas.height = canvas_h; 
  $("#"+o.id+"_canv").width(toPx(w))
					 .height(toPx(h*2)); // css scale to be determined by containing div.
  o.context = o.canvas.getContext('2d'); 
  // draw the sprites now on that canvas..
  
  o.context.drawImage(ii,x1,y1,w1,h1,0,0,w1,h1);// i think this will set the first image nicely!
  o.context.drawImage(ii,x2,y2,w2,h2,0,h1,w2,h2);// i think this will set the first image nicely!
   
   // get function names and save the callback functions in the button!:
   _hybridAddCallbackAsAttr(o,"cb",cb);
   if(typeof(cb_over)!="undefined")_hybridAddCallbackAsAttr(o,"cbo",cb_over);
   
   
  o.container.jquery.on('click',_hybridStandardiseButtonClick);
  if(Hybrid.capabilities.maxtouches>0)
  {
    o.container.jquery.on('touchstart', _hybridStandardiseButtonClick);
	if(navigator.userAgent.indexOf("Android") == -1)
	{
		// we are NOT on android so make sure you bind all.
		// on android itself this gives you 3 events, where you'd expect one!
		
		// it seems the iPad has the same problem in iOS8. So we might need to
		// put the doubling in for lower versions, but for now this will work.
		
		//o.container.jquery.on('touchend', _hybridStandardiseButtonClick);
		//o.container.jquery.on('touchmove', _hybridStandardiseButtonClick); // bind all to get better responses!
	}
  }else
  {
	if(1)// we can now ALWAYS do this!
  	{
			Hybrid.standardButtonOverCallback=cb_over;
			// we also need to here about mouse in and out!
			o.container.jquery.on('mouseover', _hybridStandardiseButtonOver);
			o.container.jquery.on('mouseout', _hybridStandardiseButtonOver);
		}
  }
  o.container.jquery.bind('dragstart',_jQueryAdditionstopEvent ); // this ACTUALLY stops selecting the stuff.
  // allthough calling hybridMakePageUnselectable does it for everything in the page, all at once.
  l.dynamic_element_counter++;
  Hybrid.dynamic_element_counter++; // also increase the global element counter!
  return o; // return the object!
 }


Hybrid.createImageButton=_hybridCreateImageButton;
function _hybridCreateImageButton(layer,x,y,w,h,image,label,cb)
{
  if(layer.kind!="hybridLayer" && layer.kind!="hybridBox")
  {
   Hybrid.debugmessage("createImageButton reports: not the right kind of object: "+layer.kind);
   return null;
  }
 // Hybrid.standardButtonCallback=cb;
    // get function names and save the callback functions in the button!:
   var fn = cb.toString();
   var fnc_crpt=Hybrid.decodeString("66756e6374696f6e20"); // 'function '
  fn = fn.substr(fnc_crpt.length);
  fn = fn.substr(0, fn.indexOf('('));
  hotspot.attr("cb",fn);
    if(typeof(cb_over)!=="undefined")
  {
	  fn = cb_over.toString();
	  fn = fn.substr(fnc_crpt.length);
	  fn = fn.substr(0, fn.indexOf('('));
	  hotspot.attr("cbo",fn);
  }

  /*
  if(Hybrid.standardButtonCallback==null || Hybrid.standardButtonCallback==cb)
  {
	Hybrid.standardButtonCallback=cb;
  }else
  {
	Hybrid.debugmessage("createImageButton reports: May be a callback conflict!!");
  }*/
  var o={};
  o.id="hybridImageButton"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  o.kind="hybridImageButton";
  o.label=label;
//  o.callback=cb; // this is unneccessary
  o.container=Hybrid.createBox(layer,x,y,w,h);
   o.container.jquery.attr("label",label);
  o.jquery=o.container.jquery; // must have this to be able to hide it.
//  o.container.jquery.html('<a class="btn" style="width: '+toPx(w)+'; height: '+toPx(h)+';" href="#"><span class="btn-content" style="padding: '+toPx((h-14)/2.2)+'; font-size: '+toPx(14)+';">'+tekst+'</span></a>');
  o.container.jquery.html('<div class="image_button" style="width: 100%; height: 200%; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none;" href="#"><img src="'+Hybrid.img_src_path+Hybrid.graphics_manifest[image].src+'" width="100%" height="100%"></div>');
  
  o.container.jquery.on('click',_hybridStandardiseButtonClick);
  if(Hybrid.capabilities.maxtouches>0)
  {
    o.container.jquery.on('touchstart', _hybridStandardiseButtonClick);
    o.container.jquery.on('touchend', _hybridStandardiseButtonClick);
    o.container.jquery.on('touchmove', _hybridStandardiseButtonClick); // bind all to get better responses!
  }
  o.container.jquery.bind('dragstart',_jQueryAdditionstopEvent ); // this ACTUALLY stops selecting the stuff.
  // allthough calling hybridMakePageUnselectable does it for everything in the page, all at once.
  layer.dynamic_element_counter++;
  Hybrid.dynamic_element_counter++; // also increase the global element counter!
  return o; // return the object!
 }
 
 
Hybrid.createCustomButton=_hybridCreateStandardButton; 
Hybrid.createTextButton=_hybridCreateStandardButton;
function _hybridCreateStandardButton(l,x,y,w,h,text,label,cb, customdrawcb)
{
	// if it weren't for IE 9 and 10, we'd use border-image: css property..
	// This really sucks bigtime, but hey..
  if(l.kind!="hybridLayer" && l.kind!="hybridBox")
  {
   Hybrid.debugmessage("createStandardButton reports: not the right kind of object: "+l.kind);
   return null;
  }
  var o={};
  o.id="hybridCanvasButton"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  o.kind="hybridCanvasButton";
  o.label=label;
//  o.callback=cb; // this is unneccessary
  o.container=Hybrid.createBox(l,x,y,w,h);
  o.container.jquery.attr("label",label);
  o.jquery=o.container.jquery; // must have this to be able to hide it.
  o.jquery.css("cursor","pointer"); // display cursor as button thing..
  // create the two canvasses for both states of the button!
  
 // html+='<canvas '+style+' id="norm"></canvas>';
 // html+='<canvas '+style+' id="over"></canvas>';
  //o.container.jquery.html(html);
  o.canvas2=Hybrid.createCanvas(o.container,0,0,w,h);
  Hybrid.setVisible(o.canvas2,false);
  o.canvas1=Hybrid.createCanvas(o.container,0,0,w,h);
//  o.canvas1=o.container.jquery.find("#norm")[0];
 // o.canvas2=o.container.jquery.find("#over")[0];
  //o.container.jquery.find("#over").hide();
//  o.canvas1.width = w; 
 // o.canvas1.height = h; 
 // o.canvas2.width = w; 
 // o.canvas2.height = h; 

//  $("#1_"+o.id+"_canv").width(toPx(w))
//					 .height(toPx(h)); // css scale to be determined by containing div.
 // $("#2_"+o.id+"_canv").width(toPx(w))
//					 .height(toPx(h)); // css scale to be determined by containing div.
					 
  var ctx = o.canvas1.context; 
  // draw something on there!
  if(typeof(customdrawcb)==="undefined")
  {
	  var grd = ctx.createLinearGradient(0, 0, 0, h*Hybrid.f);
	  grd.addColorStop(0.0, '#949494');
	  grd.addColorStop(1, '#818181');
	  ctx.fillStyle = grd;
	  ctx.beginPath();
	  Hybrid.drawRoundedRect(ctx,1,1,w-2,h-2,5);
	  ctx.strokeStyle="rgba(0,0,0,1)";
	  ctx.fill();
	  ctx.stroke();
	  ctx.lineWidth=1;
	  ctx.strokeStyle="rgba(255,255,255,0.7)";
	  ctx.beginPath();
	  Hybrid.drawRoundedRect(ctx,2,2,w-4,h-4,4);
	  ctx.stroke();
	  ctx.font = Math.floor(h/2)+'px Calibri';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText(text.toUpperCase(), w/2, h/2+1);
      ctx.fillStyle = '#fff';
      ctx.fillText(text.toUpperCase(), w/2, h/2);
	  
	  ctx = o.canvas2.context; 
		grd = ctx.createLinearGradient(0, 0, 0, h*Hybrid.f);
	  grd.addColorStop(0.0, '#cccccc');
	  grd.addColorStop(1, '#818181');
	  ctx.fillStyle = grd;
	  ctx.beginPath();
	  Hybrid.drawRoundedRect(ctx,1,1,w-2,h-2,5);
	  ctx.strokeStyle="rgba(0,0,0,1)";
	  ctx.fill();
	  ctx.stroke();
	  ctx.lineWidth=1;
	  ctx.strokeStyle="rgba(255,255,255,0.7)";
	  ctx.beginPath();
	  Hybrid.drawRoundedRect(ctx,2,2,w-4,h-4,4);
	  ctx.stroke();
	  ctx.font = '13pt Calibri';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText(text.toUpperCase(), w/2, h/2+1);
      ctx.fillStyle = '#fff';
      ctx.fillText(text.toUpperCase(), w/2, h/2);
	  
   }else
   {
		customdrawcb(o.canvas1,"button",w,h,text); // let customdraw callback handle the drawing of the actual canvases.
		customdrawcb(o.canvas2,"over",w,h,text);
   }
  
  // get function names and save the callback functions in the button!:
  _hybridAddCallbackAsAttr(o,"cb",cb);
   if(typeof(cb_over)!="undefined")_hybridAddCallbackAsAttr(o,"cbo",cb_over);
   
   _hybridSetElementID(o.canvas1,"norm"); 
   _hybridSetElementID(o.canvas2,"over");
  o.container.jquery.on('click',_hybridStandardiseButtonClick); 
  if(Hybrid.capabilities.maxtouches>0)
  {
    o.container.jquery.on('touchstart', _hybridStandardiseButtonClick);
  }else
  {
	// we also need to hear about mouse in and out!
	o.container.jquery.on('mouseover', _hybridStandardiseButtonOver); // this wants a over and norm named canvas, so we need a id-changer in the layout..
	o.container.jquery.on('mouseout', _hybridStandardiseButtonOver);
  }
  o.container.jquery.bind('dragstart',_jQueryAdditionstopEvent ); // this ACTUALLY stops selecting the stuff.
  // allthough calling hybridMakePageUnselectable does it for everything in the page, all at once.
  l.dynamic_element_counter++;
  Hybrid.dynamic_element_counter++; // also increase the global element counter!
  return o; // return the object!
 }