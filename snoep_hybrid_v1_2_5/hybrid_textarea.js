 /*--
 SnoepGames: snoepHybrid - textarea
 
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

 Hybrid.getTextAreaContent=_hybridGetTextAreaContent;
 function _hybridGetTextAreaContent(tb)
 {
	if(tb===undefined)
	{	
		 Hybrid.debugmessage("---WARNING: getTextAreaContent reports unknown textarea! Request ignored..");
		return;
	}

	if(tb.kind!="hybridTextArea")
	{
	    Hybrid.debugmessage("getTextAreaContent reports: not the right kind of object: "+tb.kind);
	   return null;
	}
	return tb.jquery.value();
}


 Hybrid.setTextAreaContent=_hybridSetTextAreaContent;
 function _hybridSetTextAreaContent(tb,content)
 {
	if(tb===undefined)
	{	
		 Hybrid.debugmessage("---WARNING: setTextAreaContent reports unknown textArea! Request ignored..");
		return;
	}

	if(tb.kind!="hybridTextArea")
	{
	    Hybrid.debugmessage("setTextAreaContent reports: not the right kind of object: "+tb.kind);
	   return null;
	}
	tb.jquery.html(content);
}

function _hybridDefaultTextAreaChangeListener()
{
	Hybrid.debugmessage("editable textArea changed how: "+Hybrid.lastTextAreaChange);
	Hybrid.debugmessage("textArea changed: "+Hybrid.lastTextAreaToChange);
	Hybrid.debugmessage("textArea changed to: "+Hybrid.lastTextAreaChangedTo);
}
Hybrid.clearTextAreaChangeListener=function ()
{
	Hybrid.textAreaChangeListener=_hybridDefaultTextAreaChangeListener;
}

function _hybridTextAreaChanged(tb,how)
{
	Hybrid.lastTextAreaChange=how;
	Hybrid.lastTextAreaToChange=tb;
	Hybrid.lastTextAreaChangedTo=tb.jquery.html();
	Hybrid.textChangeListener();
}

Hybrid.createTextArea=_hybridCreateTextArea;
function _hybridCreateTextArea(layer,x,y,w,h)
{
 if(layer.kind!="hybridLayer" && layer.kind!="hybridBox")
 {
  Hybrid.debugmessage("createTextArea reports: not the right kind of parent: "+layer.kind);
  return null;
 }
 var o={};
 o.dynamic_element_counter=0; // they may be nested!
 o.id="texta"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
 //Hybrid.debugmessage("create new textArea: "+o.id);
 //<textarea rows="3" cols="20">Enter your text here...</textarea>
 var html_string="<textarea autofocus placeholder='code goes here' wrap='hard' id='"+o.id+"' name='"+o.id+"'></textarea>"
 Hybrid.debugmessage(html_string);
 html_string='<textarea id="example_2" style="height: 250px; width: 100%;" name="test_2"></textarea>';
 $(html_string).appendTo(layer.jquery);
 o.jquery=$("#"+o.id).css("z-index",layer.dynamic_element_counter);
 //o.jquery.css('overflow', 'hidden');
 // make it grow automatically!
 /*o.jquery.keyup(function(e) {
    while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
        $(this).height($(this).height()+1);
    };
  });*/
 o.kind="hybridTextArea";
  // keep ref
 //o.jquery.css("position","absolute"); // this isn't a normal this in hybrid CSS obviously.
 //o.jquery.width(toPx(w)).height(toPx(h))
  // .css("left",toPx(x)).css("top",toPx(y))
//   .css("color",colorString) 
//   .css("cursor","default") 
//   .css("text-align",alignString) 
//   .css("font-size",toPx(fontSize))
//   .css("font-family",fontStyle)
//   .html(initialText);
   
 layer.dynamic_element_counter++;
 Hybrid.dynamic_element_counter++; // also increase the global counter.
 return o; // return the object!
}
