 /*--
 SnoepGames: snoepHybrid - canvas
 
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
 
 // USE &#x2716; as standard close sign! (fat cross strak) Or you might try: &#x2715; (slim) or &#x2718; or &#x2717; (fat and slim cartoon)
 
function _hybridSetupContextMenu(){
  //_hybridMakePageUnselectable();

  if(Hybrid.contextMenu!=false)
  {
	  $(document).on("contextmenu", _hybridShowContextMenu);
	//  $(document).click(_hybridHideContextMenu); // not mousedown, because then the mouseup in the 
	  $(document).mouseup(_hybridCheckContextMenuClick); // this is for compatibility!
	  
	  // if we are in a touch environment..
	  
	 if (window.navigator.msPointerEnabled) 
	 {
			document.addEventListener("MSPointerMove", _hybridCheckContextMenuClick, false); // we need move, cause end hasn't got coordinates.
			document.addEventListener("MSPointerDown", _hybridCheckContextMenuClick, false);
			document.addEventListener("MSPointerUp", _hybridCheckContextMenuClick, false);
	 }
		
	  if(Hybrid.capabilities.touchmode)
	  {
		document.onmousedown=_hybridCheckContextMenuClick;
		document.onmouseup=_hybridCheckContextMenuClick;
		document.onmousemove=_hybridCheckContextMenuClick;
		document.ontouchstart=_hybridCheckContextMenuClick;
		document.ontouchmove=_hybridCheckContextMenuClick;
		document.ontouchend=_hybridCheckContextMenuClick;
		document.ontouchcancel=_hybridCheckContextMenuClick;	
	  }
  }

};

function _hybridCheckContextMenuClick(eventObject){

	var touchPoints = (typeof eventObject.changedTouches != 'undefined') ? eventObject.changedTouches : [eventObject];
	for (var i = 0; i < touchPoints.length; ++i) 
	{
		var touchPoint = touchPoints[i];
		var touchPointId = (typeof touchPoint.identifier != 'undefined') ? touchPoint.identifier : (typeof touchPoint.pointerId != 'undefined') ? touchPoint.pointerId : 1;
		
		if (eventObject.type.match(/(down|start)$/i)) {
			var crsr={x:touchPoint.pageX,y:touchPoint.pageY};
			Hybrid.input.rawmouse.x=crsr.x;
			Hybrid.input.rawmouse.y=crsr.y;
		}
		else if (eventObject.type.match(/move$/i)) 
		{
			// process mousemove, MSPointerMove, and touchmove
			if (_genericDrag.lastXY[touchPointId] && !(_genericDrag.lastXY[touchPointId].x == touchPoint.pageX && _genericDrag.lastXY[touchPointId].y == touchPoint.pageY)) 
			{
				var crsr={x:touchPoint.pageX,y:touchPoint.pageY};
				Hybrid.input.rawmouse.x=crsr.x;
				Hybrid.input.rawmouse.y=crsr.y;
			}else
			{
				if(typeof(_genericDrag.move)!=="undefined")
				{
					var crsr={x:eventObject.pageX,y:eventObject.pageY};
					Hybrid.input.rawmouse.x=crsr.x;
					Hybrid.input.rawmouse.y=crsr.y;
				}
			}
		}
		else if (eventObject.type.match(/(up|end)$/i)) 
		{
			var crsr={x:touchPoint.pageX,y:touchPoint.pageY};
			if(typeof(touchPoint.pageX)==="undefined")
			{
				//Hybrid.showWarning("touchpoint coordinates undefined");
				crsr={x:Hybrid.input.rawmouse.x,y:Hybrid.input.rawmouse.y};
			}
			//Hybrid.showWarning("up on: "+crsr.x+","+crsr.y);
			// remove the id!
		
			if(crsr.x<50 && crsr.y<50)
			{
				_hybridShowContextMenu({type:"other",pageX:crsr.x,pageY:crsr.y}); // make sure it opens on the right spot!
			}
		}
	}
	return;
	/*********************************/
	/*********************************/
	/*********************************/
	/*********************************/
	/*********************************/
	/*********************************/

};

function _hybridHideContextMenu(event){ 
 $("#context-menu").remove();
};
function _hybridShowContextMenu(event) 
 { 
 // bind to right click by jQuery..
 // in the case of a touch platform (so no right mouse), we might want to set up a listenener and check for a right corner click or something..
  
  if(event.stopPropagation) event.stopPropagation(); // it's usually some kind of user event!
  if(event.preventDefault) event.preventDefault();
  
  //Hybrid.debugmessage("Show the context menu!"+event.type);
  var top_window=100,left_window=100;
  switch(event.type)
  {
	case "mouseup":
		left_window=event.pageX-160;
		top_window=event.pageY-75;
	break;
	case "contextmenu":
		left_window=event.pageX-160;
		top_window=event.pageY-75;
	break;
   }
   if(left_window<0) left_window=0;
   if(top_window<0) top_window=0;
  
  if($("#context-menu").length == 0 )
  {
	// this hybrid menu is NOT working on iPad..
	// use the default Hybrid popup to make it work, please!
   var html_string="";
   html_string+="<div class='hybrid-menu' id='context-menu'>";
   //Hybrid.debugmessage("encoded: "+Hybrid.encodeString("Hybrid Game engine v")); 
   
   html_string+="<hr>";
   html_string+="<h1 id='context-menu-title' style='cursor:default;'><table><tr><td> &nbsp; "+Hybrid.decodeString("4879627269642047616d6520656e67696e652076")+Hybrid.version+" &nbsp; </td><td>";
   html_string+="<ul><li onclick='_hybridHideContextMenu(0);'><a href='javascript: _hybridHideContextMenu();' title='Sluiten'>X</a></li><ul></td></tr></table></h1>";
	// we should insert a close button here!   
   html_string+="<ul><li><li><h2>Opties</h2></li>";
   if(Hybrid.switches.sound)
   {
    html_string+="<li><a href='javascript: _hybridSwitchSound(0);' onclick='_hybridSwitchSound(0);' title='Geluidseffecten uit'>&#8738;<b>&#9587;</b>  Geluid uit</a></li>";
   }else
   {
    html_string+="<li><a href='javascript: _hybridSwitchSound(1);'  onclick='_hybridSwitchSound(1);' title='Geluidseffecten aan'>&#8738; Geluid aan</a></li>";
   }
   if(Hybrid.switches.music)
   {
    html_string+="<li><a href='javascript: _hybridSwitchMusic(0);' onclick='_hybridSwitchMusic(0);' title='Muziek uit'>&#9836;<b>&#9587;</b>  Muziek uit</a></li>";
   }else
   {
    html_string+="<li><a href='javascript: _hybridSwitchMusic(1);' onclick='_hybridSwitchMusic(1);' title='Muziek aan'>&#9836; Muziek aan</a></li>";
   }
   if(typeof(Hybrid.fullscreen)!="undefined" && Hybrid.fullscreen.possible==true)
   {
	   if(Hybrid.fullscreen.active())
	   {
		html_string+="<li><a href='javascript: Hybrid.fullscreen.stop();' onclick='Hybrid.fullscreen.stop()' title='Fullscreen uit'>&boxVH; Fullscreen uit</a></li>";
	   }else
	   {
		html_string+="<li><a href='javascript: Hybrid.fullscreen.go();' onclick='Hybrid.fullscreen.go()' title='Fullscreen aan'>&square;  Fullscreen aan</a></li>";
	   }
   }
   if(Hybrid.internalDebugWindow)
   {
    html_string+="<li><a onclick='_hybridSwitchInternalDebug(0);' title='Debug uit'>Debug uit</a></li>";
   }else
   {
    html_string+="<li><a onclick='_hybridSwitchInternalDebug(1);' title='Debug aan'>Debug aan</a></li>";
   }
   html_string+="<li><a href='javascript: _hybridReportProblem();' title='Debug aan'>Meld een probleem</a></li>";
   html_string+="<li><i>...</i></li>";
   var str=Hybrid.platform.browser;
   if(Hybrid.platform.browser=="unidentified") str="-";
   html_string+="<li>"+Hybrid.platform.device+", "+Hybrid.platform.OS+" "+str+"<h2>GameEngine + Audio</h2></li><li><a href='http://www.snoep.at/games/?language=nl' target=_top title='HTML5 gameEngine by www.SnoepGames.nl'>&copy; 2014/2015 SnoepGames</a></li>";
   if(typeof(Hybrid.copyright_url)!=="undefined" && typeof(Hybrid.copyright_name)!=="undefined")
   {
	// show client copyright..
	html_string+="<li><h2>Edition copyright</h2></li><li><a href='"+Hybrid.copyright_url+"' target=_top title='copyright client'>&copy; "+Hybrid.copyright_year+" "+Hybrid.copyright_name+"</a></li>";
	
   }
   html_string+="<li><hr></li>";
   html_string+="</ul></div>";
   // might be a touch event, a mouse event or a NON-event.
   // determin the right place to show the menu!
  
   
   $(html_string)
    .appendTo("body")
    .css({top: top_window + "px", left: left_window + "px"});
    //Hybrid.debugmessage("Show the context menu!"+event.type);

	
   $('#context-menu-title').mousedown(_hybridContextMenu_dragmousedown);
  }else
  {
	// we repeated the creation event, so destroy it!
    // Hybrid.debugmessage("destroy context menu!"+event.type);
	 _hybridHideContextMenu();
	 // old code
     // just show and set the position!
     //$("div.context-menu").css({top: top_window + "px", left: left_window + "px"});
     //$("div.context-menu").toggle();
  }
 }
 
 function _hybridContextMenu_dragmousedown(e){
	Hybrid.debugmessage("start drag context menu!");
    Hybrid.dragging = {};
    Hybrid.dragging.pageX0 = e.pageX;
    Hybrid.dragging.pageY0 = e.pageY;
    Hybrid.dragging.elem = $('#context-menu');
    Hybrid.dragging.offset0 = $('#context-menu').offset();
	// we need to do this for touch as well!!!
    function _hybridTempHandleDragging(e){
        var left =  Hybrid.dragging.offset0.left + (e.pageX -  Hybrid.dragging.pageX0);
        var top =  Hybrid.dragging.offset0.top + (e.pageY -  Hybrid.dragging.pageY0);
        $( Hybrid.dragging.elem)
        .offset({top: top, left: left});
    }
    function _hybridTempHandleMouseUp(e){
        $('body').off('mousemove', _hybridTempHandleDragging).off('mouseup', _hybridTempHandleMouseUp);
    }
    $('body').on('mouseup', _hybridTempHandleMouseUp).on('mousemove', _hybridTempHandleDragging);
}
