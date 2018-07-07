 /*--
 SnoepGames: snoepHybrid - widgets (actually interactive canvasses that always do the same thing, like custom scrollbars)
 V1.2.0 
---*/
_hybridWidgets={}; // we keep widgets here, to get the id's from the mouse reactors.. not ideal, but
_hybridWidgetsLayer=null;


// label MUST be unique..
// we can then keep the position of the scrollbar in a modelcopy inside _hybridWidgets..
Hybrid.createScrollbar=_hybridCrScBa;
function _hybridCrScBa(p,x,y,w,h,hv,s,sz,cb,offset_x,offset_y,label) // parent, x,y,w,h, kind, style, scrollsize, cb.
{
	
	//if(1)
	//{
	//	Hybrid.debugmessage("Hybrid.createScrollbar, parent"+p);
	//	Hybrid.debugmessage("Hybrid.createScrollbar, x"+x);
	//	Hybrid.debugmessage("Hybrid.createScrollbar, y"+y);
	//	Hybrid.debugmessage("Hybrid.createScrollbar, w"+w);
	//	Hybrid.debugmessage("Hybrid.createScrollbar, h"+h);
	//	Hybrid.debugmessage("Hybrid.createScrollbar, kind?"+hv);
	//	Hybrid.debugmessage("Hybrid.createScrollbar, style"+s);
	//	Hybrid.debugmessage("Hybrid.createScrollbar, size"+sz);
	//	Hybrid.debugmessage("Hybrid.createScrollbar, cb"+cb);
	//}

	var scroller={};
	scroller.kind="Hybrid_scrollbar";
	scroller.x=x;
	scroller.y=y;
	scroller.w=w;
	scroller.h=h;
	scroller.v=0; // initial value always 0, use setScrolBarValue to set it!
	
	scroller.value=0; // initial value always 0, use setScrolBarValue to set it!
	scroller.sz=sz; // size of the viewport :)
	scroller.cb=cb;
	// get the parent offset from jquery to get the mouse_start and stop.
	// create the canvas;
	scroller.canvas=Hybrid.createCanvas(p,x,y,w,h);

	
	var offset=p.jquery.offset();
//	scroller.mousestart_x=(offset.left - $(window).scrollLeft())*Hybrid.f; 
//	scroller.mousestart_y=(offset.top - $(window).scrollTop())*Hybrid.f;
	scroller.mousestart_x=(offset.left)*Hybrid.f+x; // this isn't accurate enough, but would be great if we could get to this through parent boxes!!
	scroller.mousestart_y=(-offset.top)*Hybrid.f+y;
	if(typeof(offset_x)!=="undefined")
		scroller.mousestart_x=offset_x;
	if(typeof(offset_y)!=="undefined")
		scroller.mousestart_y=offset_y;
	//Hybrid.debugmessage("created a scrollbar with offset: "+scroller.mousestart_x+","+scroller.mousestart_y);
	
	if(hv.charAt(0)=="v")
	{
		// it's a vertical scrollbar
		scroller.hv="v";
		scroller.lw=scroller.w/2; // line width
		scroller.min=scroller.lw/2; // line width
		scroller.max=h-sz-scroller.lw;
		scroller.len=h-scroller.lw; // earlier this was back_w
		scroller.offset=scroller.lw;// the offset in the other direction (so not min-max!)
		
	}else
	{
		// it's a horizontal scrolbar.
		scroller.hv="h";
		scroller.lw=scroller.h/2; // line width
		scroller.min=scroller.lw/2; // line width
		scroller.max=w-sz-scroller.lw;
		scroller.len=w-scroller.lw; // earlier this was back_w
		scroller.offset=scroller.lw;// the offset in the other direction (so not min-max!)
	}
	_hybridDrawScrollbar(scroller);
	// add the index as an attribute to the canvas..
	var index=label; //_hybridWidgets.length;
	scroller.label=label; // to give to callback in case of programmatical setValue.
	//Hybrid.debugmessage("creating a widget. NR: "+index);
	Hybrid.makeDraggable(scroller.canvas,_hybridScrollbarMouseDown,_hybridScrollbarMouseUp,_hybridScrollbarMouseDrag,_hybridScrollbarMouseOver,index+"|"+label);// the index  will be returned with mouseevents!
	//scroller.canvas.jquery.attr("lb",label); // you can put a label on it, so you'll know what to scroll!
	
	var old_value="none";
	if(typeof(_hybridWidgets[label])!=="undefined")
	{
		//seems we had a value all along..
		//Hybrid.showWarning("Hybrid.createScrollbar: widget label must be unique! "+label+" value was: "+_hybridWidgets[label].value );
		old_value=_hybridWidgets[label].value;
	}
	
	_hybridWidgets[label]=(scroller);
	if(old_value!=="none")
	{
		Hybrid.setScrollbarValue(label,old_value);
	}
	return scroller; // return the object!
}
Hybrid.setScrollbarValue=_hybridsetscrollbarvalue
function _hybridsetscrollbarvalue(label,value)
{
	var s=_hybridWidgets[label];
	s.value=value;
	//Hybrid.debugmessage("setScrollbarValue "+label+"="+value);
	s.v=s.min+value*(s.max-s.min);
	if(s.v<s.min) s.v=s.min;
	if(s.v>s.max) s.v=s.max;
	//Hybrid.debugmessage("setScrollbarValue to "+s.v+ " s.hv="+s.hv);
	
	// also shift the thing..
//		var value=(s.v-s.min)/(s.max-s.min);
//		s.value=value;// ;*(s.maxv-s.minv)+s.minv; // maxv en minv moeten worden gedefinieerd op het moment van 
//		s.cb(s.value,s.callback); // mag dit zo maar???
	_hybridDrawScrollbar(s);
	//Hybrid.debugmessage("initialise scrollbar on non-standard value: "+s.label+"="+s.value);
	s.cb(s.value,s.label);
}
function _hybridScrollbarMouseDown(i,x,y,label)
{
	// get the widget index!
	var scrollbar_index=label.split("|")[0];
	var callback_label=label.split("|")[1];
	//Hybrid.debugmessage("DOWN: pointer "+label);
	//Hybrid.debugmessage("DOWN: pointer "+i);
	//Hybrid.debugmessage("DOWN: pointerx "+x);
	//Hybrid.debugmessage("DOWN: pointery "+y);
	//Hybrid.debugmessage("DOWN: down label "+label);
	var s=_hybridWidgets[scrollbar_index];
	if(typeof(_hybridWidgets[scrollbar_index])==="undefined")
	{
		Hybrid.debugmessage("_hybridScrollbarMouseDown: WARNING no Hybridwidget defined at place "+scrollbar_index);
		return;
	}
	// at this point we know the scrollbar or other widget this is a mouse event for!.
	//Hybrid.debugmessage("you landed on a HybridScrolbarWidget.. nr:"+label);
	var mouse={};
	mouse.down=true;
	mouse.x=x-s.mousestart_x;
	mouse.y=y-s.mousestart_y;
	if(s.hv=="h")
	{
		// it's a horizontal one
//		Hybrid.debugmessage("DOWN: horizontal scrollbar widget at "+mouse.x+","+mouse.y);
		if(mouse.x>(s.min+s.v) && mouse.x<(s.min+s.v+s.sz))
		{
			s.grab=true;
			s.grab_p=mouse.x-s.v;
//			Hybrid.debugmessage("scrollerMouseDown grab_x"+s.grab_p);
		}else
		{
			s.grab=true;
			s.grab_p=s.sz/2;
	//		Hybrid.debugmessage("scrollerMouseDown miss"+mouse.x+","+mouse.y);
		}
	}else
	{
		// it's a vertical one
		//Hybrid.debugmessage("DOWN: vertical scrollbar widget at "+mouse.x+","+mouse.y);
		if(mouse.y>(s.min+s.v) && mouse.y<(s.min+s.v+s.sz))
		{
			s.grab=true;
			s.grab_p=mouse.y-s.v;
			//Hybrid.debugmessage("scrollerMouseDown grab"+s.grab_p);
		}else
		{
			s.grab=true;
			s.grab_p=s.sz/2;
			//Hybrid.debugmessage("scrollerMouseDown miss"+mouse.x+","+mouse.y);
		}
	}
	// create a special layer to handle dragging outside!
	if(_hybridWidgetsLayer==null)
	{
		_hybridWidgetsLayer=Hybrid.createLayer();
		//Hybrid.debugmessage("create draggable layer as extension of widget number:"+label);
		Hybrid.makeDraggable(_hybridWidgetsLayer,_hybridScrollbarMouseDown,_hybridScrollbarMouseUp,_hybridScrollbarMouseDrag,_hybridScrollbarMouseOver,label);// the index  will be returned with mouseevents!
	}
	
}
function _hybridScrollbarMouseUp(i,x,y,label)
{
	var scrollbar_index=label.split("|")[0];
	var callback_label=label.split("|")[1];
	if(_hybridWidgetsLayer!=null)
	{
		Hybrid.removeElement(_hybridWidgetsLayer);
		_hybridWidgetsLayer=null;
	}
	mouse={};
	mouse.down=false;
	// at this point there is only one editable pane.
	// else we have to test which pane this is..
	if(typeof(_hybridWidgets[scrollbar_index])==="undefined")
	{
		Hybrid.debugmessage("hybridScrollbarMouseUp: no Hybridwidget defined at place "+scrollbar_index);
		return;
	}
	var s=_hybridWidgets[scrollbar_index];
	s.grab=false;
	//Hybrid.debugmessage("scrollerMouseUp");
}
function _hybridScrollbarMouseDrag(i,x,y,dx,dy,label)
{
	var scrollbar_index=label.split("|")[0];
	var callback_label=label.split("|")[1];
	// at this point there is only one editable pane.
	// else we have to test which pane this is..
	var s=_hybridWidgets[scrollbar_index];
	if(typeof(_hybridWidgets[scrollbar_index])==="undefined")
	{
		Hybrid.debugmessage("hybridScrollbarMouseDrag: no Hybridwidget defined at place "+scrollbar_index);
		return;
	}
	var mouse={};
	mouse.x=x-s.mousestart_x;
	mouse.y=y-s.mousestart_y;
	if(s.hv=="h")
	{
		s.v=mouse.x-s.grab_p;
	}else
	{
		s.v=mouse.y-s.grab_p;
		//Hybrid.debugmessage("DRAG: vertical drag "+mouse.y +" - "+s.v+" "+s.grab_p+" min "+s.min+" max"+s.max);
	}
	if(s.v<s.min) s.v=s.min;
	if(s.v>s.max) s.v=s.max;
	// also shift the thing..
		var value=(s.v-s.min)/(s.max-s.min);
		s.value=value;// ;*(s.maxv-s.minv)+s.minv; // maxv en minv moeten worden gedefinieerd op het moment van 
		s.cb(s.value,callback_label);
	_hybridDrawScrollbar(s);
}
function _hybridScrollbarMouseOver(i,x,y,label)
{
	var scrollbar_index=label.split("|")[0];
	var callback_label=label.split("|")[1];
	var s=_hybridWidgets[scrollbar_index];
	if(typeof(_hybridWidgets[scrollbar_index])==="undefined")
	{
		//Hybrid.debugmessage("OVER: no Hybridwidget defined at place "+scrollbar_index);
		return;
	}
//	var mouse={};
//	mouse.x=x-s.mousestart_x;
//	mouse.y=y-s.mousestart_y;
	//Hybrid.debugmessage(" _hybridScrollbarMouseOver "+mouse.x+","+mouse.y);
	//var ctx=s.canvas.context;
	//ctx.fillRect(mouse.x,mouse.y,2,2);
	
	//Hybrid.debugmessage("scrollerMouseOver "+mouse.x+","+mouse.y);
	// at this point there is only one editable pane.
	// else we have to test which pane this is..
	//s.grab=false;
	//mouse.x=x-s.mousestart_x;
	//mouse.y=y;
	
}
function _hybridDrawScrollbar(s)
{	
	if(s.hv=="h")
	{
		_hybridDrawLineScrollHori(s) ;// we have only one kind now..
	}else
	{
		_hybridDrawLineScrollVerti(s) ;// we have only one kind now..
	}
}

function _hybridDrawLineScrollVerti(s)
{
	var ctx=s.canvas.context;
	// erase the canvas
	Hybrid.clearCanvas(s.canvas);

    ctx.lineWidth = s.lw;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#eee';
	ctx.beginPath();
    ctx.moveTo(s.offset,s.min);
    ctx.lineTo(s.offset,s.min+s.len);
    ctx.stroke(); // the background!
		
	 ctx.strokeStyle = '#bdccd4';
	ctx.beginPath();
    ctx.moveTo(s.offset,s.min+s.v);
    ctx.lineTo(s.offset,s.min+s.v+s.sz);
	//Hybrid.debugmessage((s.min+s.v)+","+s.offset +" -> "+(s.min+s.v+s.sz)+","+s.offset);
    ctx.stroke();
}
function _hybridDrawLineScrollHori(s)
{
	var ctx=s.canvas.context;
	// erase the canvas
	Hybrid.clearCanvas(s.canvas);

  //  ctx.lineWidth = 1/Hybrid.f;
   // ctx.lineCap = 'round';
   // ctx.strokeStyle = '#000';
   // ctx.moveTo(0,0);
   // ctx.lineTo(s.w,s.h);
   // ctx.moveTo(s.w,0);
   // ctx.lineTo(0,s.h);
   // ctx.stroke(); // the background!

	
    ctx.lineWidth = s.lw;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#eee';
	ctx.beginPath();
    ctx.moveTo(s.min, s.offset);
    ctx.lineTo(s.min+s.len, s.offset);
    ctx.stroke(); // the background!
		
	 ctx.strokeStyle = '#bdccd4';
	ctx.beginPath();
    ctx.moveTo(s.min+s.v, s.offset);
    ctx.lineTo(s.min+s.v+s.sz, s.offset);
	//Hybrid.debugmessage((s.min+s.v)+","+s.offset +" -> "+(s.min+s.v+s.sz)+","+s.offset);
    ctx.stroke();
}
// DROP DOWN WIDGET!
// WIDGETS style them with CSS, give a class!
Hybrid.createDropDown=_hybridCreateDropDown;
function _hybridCreateDropDown(layer,x,y,w,h,data,cls,placeHolder,fs,cb,lb,def_value)
{
 if(layer.kind!="hybridLayer" && layer.kind!="hybridBox")
 {
  Hybrid.debugmessage("createDropDown reports: not the right kind of parent: "+layer.kind);
  return null;
 }
 var o={};
 if(typeof(fs)==="undefined") fs=14;
 
 o.placeHolder=placeHolder; // keep it for special tricks
 o.dynamic_element_counter=0; // they may be nested!
 o.id="selectbox"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
 //Hybrid.debugmessage("create new textbox: "+o.id);
 var html_string;
 var style="style='font-size: "+toPx(fs)+"'";
 if(typeof(cls)!=="undefined") html_string="<select id='"+o.id+"' "+style+" class='"+cls+"'>";
 else html_string="<select id='"+o.id+"' "+style+">";
 var i;
 if(typeof(def_value)==="undefined") 
 {	
	def_value="";
 }else
 {
	 if(typeof(placeHolder)!="undefined") 
	 {
		html_string+="<option value='' disabled selected>"+placeHolder+"</option>";
	 }
 }
 
 for(i=0;i<data.length;i++)
 {
	if(data[i].v==def_value)
	{
		html_string+="<option selected value='"+data[i].v+"'>"+data[i].l+"</option>";
	}else
	{
		html_string+="<option value='"+data[i].v+"'>"+data[i].l+"</option>";
	}
 }
 html_string+="</select>";
 //Hybrid.debugmessage("html for create dropdown: "+html_string);
 //Hybrid.debugmessage("create new textbox: "+html_string);
 $(html_string).appendTo(layer.jquery);  
 o.jquery=$("#"+o.id).css("z-index",layer.dynamic_element_counter);
 
 if(typeof(cb)!=="undefined" && cb!=null)
 {
	_hybridAddCallbackAsAttr(o,"cb",cb); // if it's there it's added 
	//Hybrid.debugmessage("set a change handler");
	// we need to set the widgetCallback aswell!
	o.jquery.on( "change", _hybridGenericWidgetOnChangeHandler );
 }
  if(typeof(lb)!=="undefined" && lb!=null)
 {
	//Hybrid.debugmessage("created a dropdown with label: "+lb);
	// we need to set the widgetCallback aswell!
	o.jquery.attr( "lb", lb );
 }

 o.kind="hybridSelectBox";
  // keep ref
 o.jquery.width(toPx(w)).height(toPx(h))
   .css("left",toPx(x)).css("top",toPx(y))
   .css("cursor","default")
   .css("padding","0")
   .css("position","absolute"); 
 layer.dynamic_element_counter++;
 Hybrid.dynamic_element_counter++; // also increase the global counter.
 return o; // return the object!
}

Hybrid.getValueOfDropDown=_hybridgetvalueofdropdown;
function _hybridgetvalueofdropdown(o)
{
	return o.jquery.val();
}

// WIDGETS style them with CSS, give a class!
Hybrid.createBoolean=_hybridCreateBoolean;
function _hybridCreateBoolean(layer,x,y,w,h,s,cls,labels)
{
 if(layer.kind!="hybridLayer" && layer.kind!="hybridBox")
 {
  Hybrid.debugmessage("createBoolean reports: not the right kind of parent: "+layer.kind);
  return null;
 }
 var o={};
 if(typeof(labels)=="undefined")
 {
	labels=["true","false"]; // default
 }
 o.dynamic_element_counter=0; // they may be nested!
 o.id="boolean"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
 //Hybrid.debugmessage("create new textbox: "+o.id);
 var html_string;
 
 /*
 <div class="radio">
		<input id="Yes" type="radio" name="bool" value="1">
		<label for="Yes">Yes</label>
		<input id="No" type="radio" name="bool" value="0">
		<label for="No">No</label>
	</div>
 */
 
 if(typeof(cls)!="undefined") html_string="<div id='"+o.id+"' class='"+cls+"'>";
 else html_string="<div id='"+o.id+"'>";
 
 var sel="";
 if(s==0) sel="selected";
 html_string+="<input id='"+o.id+"_true"+"' type='radio' "+sel+" name='"+o.id+"' value='1'>";
 html_string+="<label for='"+o.id+"_true"+"'>"+labels[0]+"</label>";
 sel="";
 if(s==1) sel="selected";
 html_string+="<input id='"+o.id+"_false"+"' type='radio' "+sel+" name='"+o.id+"' value='0'>";
 html_string+="<label for='"+o.id+"_false"+"'>"+labels[1]+"</label>";
 html_string+="</div>";
 //Hybrid.debugmessage("html for create bool: "+html_string);
 //Hybrid.debugmessage("create new textbox: "+html_string);
 $(html_string).appendTo(layer.jquery);  
 o.jquery=$("#"+o.id).css("z-index",layer.dynamic_element_counter);
 o.kind="hybridBoolean";
  // keep ref
 o.jquery.width(toPx(w)).height(toPx(h))
   .css("left",toPx(x)).css("top",toPx(y))
   .css("cursor","default") 
   .css("position","absolute"); 
 layer.dynamic_element_counter++;
 Hybrid.dynamic_element_counter++; // also increase the global counter.
 return o; // return the object!
}
Hybrid.setFocus=_hybridSetFocus;
function _hybridSetFocus(o)
{
	o.jquery.focus();
}
function _hybridGenericInputFocusInHandler(ev)
{
	var functionName=$(this).attr("focusin");
	window[functionName]($(this).attr("lb")); // call a non-namespaced function by string, see 
}
function _hybridGenericInputFocusOutHandler(ev)
{
	var functionName=$(this).attr("focusout");
	var val=$(this).val();
	window[functionName]($(this).attr("lb"),val); // call a non-namespaced function by string, see 
}
Hybrid.setTextInputFocusIn=_hybridSetFocusIn;
function _hybridSetFocusIn(o,label,handler)
{
	if(handler==null)
	{
		o.jquery.off('focusin');
	}else
	{
		o.jquery.on('focusin', _hybridGenericInputFocusInHandler);
		if(typeof(label)!="undefined") o.jquery.attr("lb",label); // might be allready set by onChangeHandler!
		_hybridAddCallbackAsAttr(o,"focusin",handler); // if it's there it's added 
	}
}

Hybrid.setWidgetSelectable=_hybridSetSelect;
function _hybridSetSelect(o,tf)
{
	//Hybrid.debugmessage("Hybrid.setSelectable "+o.id+"="+tf);
	if(tf)
	{
		Hybrid.setVisible(o.unselectable,false);
	}	else
	{
		Hybrid.setVisible(o.unselectable,true); // aint nobody going to select this sucker :)
	}
}
Hybrid.setTextInputFocusOut=_hybridSetFocusOut;

Hybrid.setWidgetProp=_hybridSetWidgetProp;
function _hybridSetWidgetProp(o,prop,tf)
{
	o.jquery.prop(prop, tf);
}
Hybrid.setTextInputFocusOut=_hybridSetFocusOut;
function _hybridSetFocusOut(o,label,handler)
{
	if(handler==null)
	{
		o.jquery.off('focusout');
	}else
	{
		o.jquery.on('focusout', _hybridGenericInputFocusOutHandler);
		if(typeof(label)!="undefined") o.jquery.attr("lb",label); // might be allready set by onChangeHandler!
		_hybridAddCallbackAsAttr(o,"focusout",handler); // if it's there it's added 
	}
}
function _hybridGenericWidgetOnChangeHandler()
{
	var label=$(this).attr("lb");
	var functionName=$(this).attr("cb");
	var val=$(this).val();
	//Hybrid.debugmessage("_hybridGenericWidgetOnChangeHandler"+label+" ->"+functionName);
	window[functionName](label,val); // call a non-namespaced function by string, see 
}

function _hybridGenericWidgetOnEnterHandler(label,functionName,val)
{
	//Hybrid.debugmessage("_hybridGenericWidgetOnChangeHandler"+label+" ->"+functionName);
	window[functionName](label,val); // call a non-namespaced function by string, see 
}

// jquery plug-in to detect enterkey!
/*$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}*/


Hybrid.setTextInputOnEnter=_hybridsetTextInputOnEnter;
function _hybridsetTextInputOnEnter(o,label,handler)
{
	 if(o.kind=="hybridTextInput")
	 {
		_hybridAddCallbackAsAttr(o,"onenter",handler); // if it's there it's added 
		if(typeof(label)!="undefined") o.jquery.attr("lb",label); // might be allready set by onChangeHandler!
		o.jquery.keypress(function (ev) 
		{
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
				//Hybrid.debugmessage("yes you pressed enter on a textinput..");
				var label=$(this).attr("lb");
				var functionName=$(this).attr("onenter");
				var val=$(this).val();
				_hybridGenericWidgetOnEnterHandler(label,functionName,val);
//               
			}
        });
	 }
	 /*
			 $('.input').keypress(function (e) {
		  if (e.which == 13) {
			$('form#login').submit();
			return false;    //<---- Add this line
		  }
});
NOTE: You accepted bendewey's answer, but it is incorrect with its description of e.preventDefault(). Check out this stackoverflow answer: event.preventDefault() vs. return false

Essentially, "return false" is the same as calling e.preventDefault and e.stopPropagation().
	 */
}

Hybrid.createTextInput=_hybridCreateTextInput;
function _hybridCreateTextInput(layer,x,y,w,h,fontStyle,colorString,alignString,fontSize,placeHolder,value,special,special1,special2,special3)
{
 if(layer.kind!="hybridLayer" && layer.kind!="hybridBox")
 {
  Hybrid.debugmessage("createTextInput reports: not the right kind of parent: "+layer.kind);
  return null;
 }
 if(typeof(special)==="undefined")special="";
 if(typeof(special1)==="undefined")special1="";
 if(typeof(special2)==="undefined")special2="";
 if(typeof(special3)==="undefined")special3="";
 if(typeof(placeHolder)==="undefined")placeHolder="";
 if(typeof(value)==="undefined")value="";
 var o={};
 o.placeHolder=placeHolder; // keep it for special tricks
 o.dynamic_element_counter=0; // they may be nested!
 o.id="texti"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
 //Hybrid.debugmessage("create new textbox: "+o.id);
 var html_string;
 switch(special)
 {
	case "email":
		html_string="<input type='email' placeHolder='"+placeHolder+"' value='"+value+"' id='"+o.id+"'/>";
	break;
	case "number":
		html_string="<input type='number' min='"+special1+"' max='"+special2+"' step='"+special3+"' placeHolder='"+placeHolder+"' value='"+value+"' id='"+o.id+"'/>";
	break;
	case "date":
		html_string="<input type='date' placeHolder='"+placeHolder+"' value='"+value+"' id='"+o.id+"'/>";
	break;
	case "password":
		html_string="<input type='password' placeHolder='"+placeHolder+"' value='"+value+"' id='"+o.id+"'/>";
	break;
	default:
		if(special!="")
			Hybrid.debugmessage("special not recognised: "+special);
		html_string="<input type='text' placeHolder='"+placeHolder+"' value='"+value+"' id='"+o.id+"'/>";
 }
 //Hybrid.debugmessage("create new textbox: "+html_string);
 $(html_string).appendTo(layer.jquery);  
 o.jquery=$("#"+o.id).css("z-index",layer.dynamic_element_counter);
 o.kind="hybridTextInput";
  // keep ref
 o.jquery.width(toPx(w)).height(toPx(h))
   .css("left",toPx(x)).css("top",toPx(y))
   .css("color",colorString) 
   .css("cursor","default") 
   .css("position","absolute") 
   .css("text-align",alignString) 
   .css("font-size",toPx(fontSize))
   .css("padding","0") // this is because text field get extra padding by default, that is not handled by the reset stylesheet!
   .css("background-color","rgba(0,0,0,0)")
   .css("font-family",fontStyle)
   .css("border","0px");
   
  switch(alignString)
  {
	case "right":
		o.jquery.css("width",toPx(w-2)); // two hybrid pixels is minimum..
		o.jquery.css("padding-right",toPx(2)); // two hybrid pixels is minimum..
	break;
  
  }
 layer.dynamic_element_counter++;
 Hybrid.dynamic_element_counter++; // also increase the global counter.
 
 // now create a box on top of it to make it unselectable!
 // this is standard way for widgets to be unselectable in ALL browsers in an easy way!
 o.unselectable=Hybrid.createBox(layer,x,y,w,h);
 o.unselectable.jquery.html("<img width='100%' height='100%' src='"+Hybrid.dataurls['hotspots']+"' />"); // set a hotspot img there..
 Hybrid.setBoxColor(o.unselectable,"rgba(255,255,255,0.5)");
 Hybrid.setVisible(o.unselectable,false);
 return o; // return the object!
}
