 /*--
 SnoepGames: snoepHybrid - textbox
 
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

Hybrid.getTextboxHeight=_hybridGTBH;
function _hybridGTBH(tb) // width not supported yet
{
	// the purpose of this function is to figure out the height after we strip that from the div..
	// so it becomes a stretchable div!!!
	var old_h=tb.jquery.height();
	//Hybrid.debugmessage("getTextboxHeight "+tb.jquery.attr("id")+" old_height was: "+old_h+" ->"+(old_h/Hybrid.f)+" hybrid pixels" );
	tb.jquery.css("height", "auto"); // else innerheight just returns height+padding!
	var ih=tb.jquery.innerHeight();
	tb.jquery.height(old_h+"px"); // reset the height to old value!
	//Hybrid.debugmessage("getTextboxHeight "+tb.jquery.attr("id")+" innerheight: "+(ih/Hybrid.f)+" for "+tb.jquery.html());
	return (ih/Hybrid.f);
}

Hybrid.TextboxCallbackOnEnter=_hybridSetCallbackOnEnter;
function _hybridSetCallbackOnEnter(e,cb,label)
{
	if(typeof(label)=="undefined") label="none";
	_hybridAddCallbackAsAttr(e,"cb",cb);
	e.jquery.attr("label",label);
	e.jquery.keyup(_hybridEnterChecker);
};
function _hybridEnterChecker(e) 
{
	if (e.keyCode == 13) 
	{
		Hybrid.debugmessage("_hybridEnterChecker do it! "+e.keyCode+" e.target="+e.target +" this: "+$(this) );
		// Do something
		// get the callback name from the attribute!
		var functionName=$(this).attr("cb");
		var label=$(this).attr("label")
		Hybrid.debugmessage("call "+functionName+" "+label);
		window[functionName](label); // call a non-namespaced function by string, see 
	}
}

Hybrid.setTextBorder=_hybridSetTextBorder
function _hybridSetTextBorder(tb,color,width) // width not supported in all browsers yet, but we expect HTML5 to grow up!
{
	// if we have webkit, this will do the trick, if not, we have NO width!
	if(width===undefined)
	{	
		width=2;
	}
	if(tb===undefined)
	{	
		Hybrid.debugmessage("---WARNING: setTextBorder reports unknown textbox! Request ignored..");
		return;
	}
	if(tb.kind!="hybridTextBox")
	{
	   Hybrid.debugmessage("setTextBorder reports: not the right kind of object: "+tb.kind);
	   return null;
	}
	tb.jquery.css("text-shadow","4px 0 0 "+color+", -2px 0 0 "+color+", 0 2px 0 "+color+", 0 -2px 0 "+color+", 3px 1px 0 "+color+", -1px 1px 0 "+color+", -1px 1px 0 "+color+", -1px -1px 0 "+color);
	// oh lets be ready for the future..
	tb.jquery.css("-webkit-stroke-fill-color",color);
	tb.jquery.css("-webkit-stroke-fill-width",toPx(width));
 }
 
 Hybrid.setTextShadow=_hybridSetTextShadow
function _hybridSetTextShadow(tb,x,y,blur,color) // width not supported in all browsers yet, but we expect HTML5 to grow up!
{
	// if we have webkit, this will do the trick, if not, we have NO width!
	if(typeof(x)==="undefined")x=2;
	if(typeof(y)==="undefined")y=2;
	if(typeof(blur)==="undefined")blur=2;
	if(tb===undefined)
	{	
		Hybrid.debugmessage("---WARNING: setTextShadow reports unknown textbox! Request ignored..");
		return;
	}
	if(tb.kind!="hybridTextBox")
	{
	   Hybrid.debugmessage("setTextBorder reports: not the right kind of object: "+tb.kind);
	   return null;
	}
	tb.jquery.css("text-shadow",toPx(x)+" "+toPx(y)+" "+toPx(blur)+" "+color);
 }
 
 
 Hybrid.getTextboxContent=_hybridGetTextBoxContent;
 Hybrid.getText=_hybridGetTextBoxContent;
 function _hybridGetTextBoxContent(tb)
 {
	if(tb===undefined)
	{	
		 Hybrid.debugmessage("---WARNING: getTextboxContent reports unknown textbox! Request ignored..");
		return;
	}
	switch(tb.kind)
	{
		case "hybridTextInput":
			return tb.jquery.val();
		break;
		case "hybridTextBox":
			//Hybrid.debugmessage("getTextboxContent reports: not the right kind of object: "+tb.kind);
			return tb.jquery.html();
		break;
		default:
			Hybrid.debugmessage("getTextboxContent reports: not the right kind of object: "+tb.kind);
			return null;
		break;
	}
}


 Hybrid.setText=_hybridSetTextBoxContent;
 Hybrid.setTextboxContent=_hybridSetTextBoxContent;
 function _hybridSetTextBoxContent(tb,content)
 {
	// Hybrid.debugmessage("setTextBoxContent to set text:"+content);
 	if(tb===undefined)
	{	
		 Hybrid.debugmessage("---WARNING: setTextBoxContent reports unknown textbox! Request ignored..");
		return;
	}
	switch(tb.kind)
	{
		case "hybridTextInput":
			//Hybrid.debugmessage("textbox = input: "+tb.jquery.attr('id'));
			tb.jquery.val(content);
			//Hybrid.debugmessage("textbox = input: "+tb.jquery.attr('id')+" new value: "+tb.jquery.val());
		break;
		case "hybridTextBox":
			tb.jquery.html(content);
		break;
		default:
			Hybrid.debugmessage("setTextBoxContent reports: not the right kind of object: "+tb.kind);
	}
}



Hybrid.setPadding=_hybridsetpadding;
function _hybridsetpadding(a,t,l,b,r)
{
	a.jquery.css("padding",toPx(t)+" "+toPx(l)+" "+toPx(b)+" "+toPx(r)+" ");
}

Hybrid.setAttr=_hybridsetattr;
function _hybridsetattr(e,a,b)
{
	return e.jquery.attr(a,b);
}
Hybrid.getAttr=_hybridgetattr;
function _hybridgetattr(e,a)
{
	return e.jquery.attr(a);
}
Hybrid.getFocussedInputInTable=_hybridgetfocussedInputInTable;
function _hybridgetfocussedInputInTable(attr)
{
	var f=$(':focus');
	if($('input:focus').length == 0) return {x:-1,y:-1,v:null}; // no inputs selected, sorry...
	return {x:f.attr("x"),y:f.attr("y"),v:f.val()};
}

Hybrid.blurTextField=_hybridBlurTextField;
function _hybridBlurTextField(het)
{
// we might need to set focus to a dummy textbox, to kill any softkeyboard on ipad, but theoretically this should be enough!
	het.jquery.blur();
}

function _hybridDefaultTextChangeListener()
{
	var a;
	a=a+1; // there must be something in here, because the debugmessages get thrown away..
	//Hybrid.debugmessage("editable textbox changed how: "+Hybrid.lastTextboxChange);
	//Hybrid.debugmessage("textbox changed: "+Hybrid.lastTextboxToChange);
	//Hybrid.debugmessage("textbox changed to: "+Hybrid.lastTextboxChangedTo);
}
//Hybrid.textChangeListener=_hybridDefaultTextChangeListener; // this is done by erasepage!
Hybrid.clearTextChangeListener=function ()
{
	Hybrid.textChangeListener=_hybridDefaultTextChangeListener;
}

function _hybridTextboxChanged(tb,how)
{
	Hybrid.lastTextboxChange=how;
	Hybrid.lastTextboxToChange=tb;
	//Hybrid.debugmessage("tb: "+tb);
	Hybrid.lastTextboxChangedTo=tb.jquery.html();
	Hybrid.textChangeListener();
}

Hybrid.setTextEditable=_hybridSetEditable;
function _hybridSetEditable(tbx,tf,optblrfnc)
{
 if(tbx.kind!="hybridTextBox")
 {
  Hybrid.debugmessage("_hybridSetEditable reports: not the right kind of object: "+tbx.kind);
  return null;
 }
 if(tf)
 {
	tbx.jquery.attr('contenteditable','true');
	//tbx.jquery.css('position','relative'); // back to the default!
//	position: relative;
	_jQueryAddition_MakeSelectable(tbx.jquery);
	tbx.jquery.on('input change keyup', function() {_hybridTextboxChanged(tbx,"change");} ); // we should let the hybrid know which textbox is being edited!
	tbx.jquery.on('focus', function() {_hybridTextboxChanged(tbx,"focus");} ); // we should let the hybrid know which textbox is being edited!
	tbx.jquery.on('blur', function() {_hybridTextboxChanged(tbx,"blur");} ); // we should let the hybrid know which textbox is being edited!
	tbx.jquery.css("cursor","text"); 
	 /*if(optblrfnc)
	 {
		Hybrid.editableTextBlurFunction=optblrfnc;
		tbx.jquery.blur(_hybridEditableTextBlurFunction);
	 }*/
	Hybrid.debugmessage("setEditable: "+tf);
 }
 else
 {
	tbx.jquery.attr('contenteditable','false');
	tbx.jquery.attr('overflow','hidden'); // back to the default!
	_jQueryAddition_MakeUnselectable(tbx.jquery);
	//tb.jquery.on('keyup change', null ); // we should let the hybrid know which textbox is being edited!
	// cannot unbind the keyup, but should never be fired when unselectable??
	tbx.jquery.css("cursor","default"); 
	//tb.jquery.blur(null); // no action on blur anymore!
	//Hybrid.debugmessage("setEditable: "+tf);
 }
}
Hybrid.editableTextBlurFunction=null; //
function _hybridEditableTextBlurFunction()
{
	if(Hybrid.editableTextBlurFunction!=null)
	{
		Hybrid.editableTextBlurFunction();
	}
}
Hybrid.setTextBoxColor=_hybridsTextBoxColor;
Hybrid.setTextColor=_hybridsTextBoxColor;
function _hybridsTextBoxColor(o,cs)
{
	o.jquery.css("color",cs);
}

Hybrid.createTextBox=_hybridCreateTextBox;
function _hybridCreateTextBox(layer,x,y,w,h,fontStyle,colorString,alignString,fontSize,initialText)
{
 if(layer.kind!="hybridLayer" && layer.kind!="hybridBox")
 {
  Hybrid.debugmessage("createTextBox reports: not the right kind of object: "+layer.kind);
  return null;
 }
 var o={};
 o.initialText=initialText; // keep it for special tricks with editable textboxes..
 o.dynamic_element_counter=0; // they may be nested!
 o.id="textb"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
 //Hybrid.debugmessage("create new textbox: "+o.id);
 var html_string="<div id='"+o.id+"'></div>"
 //Hybrid.debugmessage("create new textbox: "+html_string);
 $(html_string).appendTo(layer.jquery);
  
 o.jquery=$("#"+o.id).css("z-index",layer.dynamic_element_counter);
 o.kind="hybridTextBox";
  // keep ref
 o.jquery.width(toPx(w)).height(toPx(h))
   .css("left",toPx(x)).css("top",toPx(y))
   .css("color",colorString) 
   .css("cursor","default") 
   .css("text-align",alignString) 
   
//   .css("font-weight","normal") // supposedley fixes the cut-off bug in chrome!
   // https://code.google.com/p/googlefontdirectory/issues/detail?id=152 I don't see any difference with Luckiest Guy!
   // there is another issue posted here: https://code.google.com/p/chromium/issues/detail?id=391183
   // this fix doesn't fix anything, but changes the normal behaviour of text, let's not do this right now.
   .css("font-size",toPx(fontSize))
   .css("font-family",fontStyle)
   .html(initialText);
   
  Hybrid.setTextEditable(o,false);  // default it's NOT editable!
 layer.dynamic_element_counter++;
 Hybrid.dynamic_element_counter++; // also increase the global counter.
 return o; // return the object!
}

