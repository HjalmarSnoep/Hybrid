 /*--
 SnoepGames: snoepHybrid - debug
---*/

Hybrid.debug = false; // you can switch it on with the url switching!
Hybrid.internalDebugWindow = false; // you can switch it on with the menu
Hybrid.debugEchoDiv = false;
Hybrid.setDebugEchoDiv=_hybridSetDebugEchoDiv;


window.onerror=_hybridGlobalErrorListener;

var hybrid_debug_message_string="";
// debugmessage relays to console, but also to internal debug-window that you might use on a tablet.
Hybrid.debugmessage=hybrid_debugmessage;
Hybrid.debugmessages=0;
function hybrid_debugmessage(message){

	Hybrid.debugmessages++;
  if(typeof(top_debug)!="undefined")
  {
	  if(top_debug===true)
	  {
			var parentdebugwindow=window.parent.document.getElementById('debug'); 
			if(parentdebugwindow!=null)
			{
				parentdebugwindow.innerHTML+=message;
				parentdebugwindow.scrollTop = parentdebugwindow.scrollHeight;
			}
	  }
  }
  
  if(typeof(log_debug)!="undefined")
  {
	  if(log_debug===true)
	  {
			// log it to a name, we put in cookie, to get a session!
			//console.log("log to debug session: "+Hybrid.debug_session_id);
			var url = "debug_log.php";
			var data = {};
			data.debug_session_id=Hybrid.debug_session_id;
			data.event=message;
			Hybrid.setVars(url,data);
	  }
  }

  // if log it, then send to PHP!
  if(typeof console == "object")console.log(message);
  hybrid_debug_message_string+=message+"<br>";
  if(Hybrid.debugEchoDiv)
  {
	Hybrid.debugEchoDiv.append('<br>'+message);
  }
  if($("#internal_debug_window").length!=0){
	$("#internal_debug_window").html(hybrid_debug_message_string);
  }
};

Hybrid.throwError=hybrid_throwError;
function hybrid_throwError(message)
{
	hybrid_debugmessage(message);
	throw(message);
};


Hybrid.showWarning=_hybridShowWarning;
function _hybridShowWarning(message)
{
	window.alert(message);
	console.log(message); // this makes it a little more easy to copy and edit.!
};
// this function enables Chrome to pinpoint minified errors, also you get an alert for an error on iPad and stuff!
function _hybridGlobalErrorListener(errorMsg, url, lineNumber, column, errorObj) 
{
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' +  errorObj);
	hybrid_debugmessage('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' +  errorObj);
}

// allows debugmessages to appear (during loading)
function _hybridSetDebugEchoDiv(jqo)
{
	// get's a jquery object to echo to..
	Hybrid.debugEchoDiv=jqo;
}

function _hybridSwitchInternalDebug(value){
	if(value=="1"){
	   Hybrid.internalDebugWindow=true;
		// create a top div just below the menu
	   var html_string="";
	   html_string+="<div class='hybrid-menu' id='hybrid-debug'>";
	   html_string+="<hr><h1 id='hybrid-debug-title'>Hybrid Internal Debug Window</h1><ul><hr>";
	   html_string+="<p id='internal_debug_window' style='text-align: left; word-break:break-all; word-wrap: break-word; width:300px;  height:300px; overflow: auto;'></p>";
	   html_string+="</div>";
	   $(html_string).appendTo("body");
		$("#internal_debug_window").css("background-color","#ffffff");
		_jQueryAddition_MakeSelectable($("#internal_debug_window"));
		$("#internal_debug_window").html(hybrid_debug_message_string);
		 $('#hybrid-debug-title').mousedown(_hybridDebugMenu_dragmousedown);
	}else{
		$("#hybrid-debug").remove();
		Hybrid.internalDebugWindow=false;
	}
	 _hybridHideContextMenu(); // if you selected this option from this menu, it dissapears to show you the right context next time!
};

 function _hybridDebugMenu_dragmousedown(e){
	//Hybrid.debugmessage("start drag debug menu!");
    Hybrid.dragging = {};
    Hybrid.dragging.pageX0 = e.pageX;
    Hybrid.dragging.pageY0 = e.pageY;
    Hybrid.dragging.elem = $('#hybrid-debug');
    Hybrid.dragging.offset0 = $('#hybrid-debug').offset();
	// we need to do this for touch as well!!!
    function _hybridTempHandleDraggingForDebug(e){
        var left =  Hybrid.dragging.offset0.left + (e.pageX -  Hybrid.dragging.pageX0);
        var top =  Hybrid.dragging.offset0.top + (e.pageY -  Hybrid.dragging.pageY0);
        $( Hybrid.dragging.elem)
        .offset({top: top, left: left});
    }
    function _hybridTempHandleMouseUpForDebug(e){
        $('body').off('mousemove', _hybridTempHandleDraggingForDebug).off('mouseup', _hybridTempHandleMouseUpForDebug);
    }
    $('body').on('mouseup', _hybridTempHandleMouseUpForDebug).on('mousemove', _hybridTempHandleDraggingForDebug);
}

function _hybridImagePreloadFailed(e)
{
	var mes="Error occured while trying to load image "+Hybrid.currentImageIndex+".";
	Hybrid.debugmessage(mes);
	//_hybridReportProblem(mes); // you shouldn't do this, it relocates the user!
}
function _hybridAudioLoadError(e) 
{
	if(e)
	Hybrid.debugmessage("Error " + e.target.status + " occurred while trying to load audio.");
}

function  _hybridReportProblem(errormessage){
	// usually from context menu, but can be called in other places...
	//throw new Error(errormessage);
	Hybrid.debugmessage("_hybridReportProblem called..");
		if(typeof(Hybrid.app_id)!=="undefined")
	{
	// add supportlink to the message before you throw
		if(typeof(Hybrid.app_id)!=="undefined")
		{
			// something is very wrong with this somehow in the illusion_slenderman!
			location.href=Hybrid.supportlink+Hybrid.app_id;
			top.location.href=Hybrid.supportlink+Hybrid.app_id; // top doesn't always work, so try the other one first!
		}else
		{
			location.href=Hybrid.supportlink;
			top.location.href=Hybrid.supportlink;  // top doesn't always work, so try the other one first.
		}
	}

}
