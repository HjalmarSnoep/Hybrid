 /*--
 SnoepGames: snoepHybrid - webview (idea: a iframe, we can set javascript to)
 V1.2.0 
---*/
 
Hybrid.createWebview=_hybridCrWeVw;
function _hybridCrWeVw(l,x,y,w,h,url,co) // configObject NOT supported yet!
{
  if(l.kind!="hybridl" && l.kind!="hybridBox")
  {
     Hybrid.debugmessage("createWebView reports: not attached to the right kind of object: "+l.kind);
	 // throw an error!
     return null;
  }
  var o={};
  o.box=Hybrid.createBox(l,x,y,w,h); // this is the container.
  // there is a fiddle with what we want!
  //http://jsfiddle.net/Masau/7WRHM/
  
  
  o.id="webv"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  o.kind="hybridWebview";
  o.src=url;
  o.co="";
  var html_string='<iframe style="position:absolute;top:0;left:0;width:100%; height:100%;" id="'+o.id+'_if" src="'+o.src+'" '+o.co+'></iframe>';
  if(o.src=="")
  {
	html_string='<iframe style="position:absolute;top:0;left:0;width:100%; height:100%;" id="'+o.id+'_if" '+o.co+'></iframe>';
  }
  Hybrid.debugmessage("webview create: "+html_string);
  o.box.jquery.html(html_string);
  o.jquery=$("#"+o.id);
  o.jquery.css("z-index",l.dynamic_element_counter); 
  o.ifr=$("#"+o.id+"_if");

  Hybrid.dynamic_element_counter++; // also increase the global element counter!
//  o.co=""; // default options!
 // if(co!=undefined)
 // {
//	Hybrid.styleWebview(o,co);
 // }
  return o; // return the object!
}
Hybrid.createInternalWebview=_hybridCrIntWeVw;
function _hybridCrIntWeVw(layer,x,y,w,h,cls) // configObject NOT supported yet!
{
   if(layer.kind!="hybridLayer" && layer.kind!="hybridBox")
  {
   Hybrid.debugmessage("createBox reports: not the right kind of object: "+layer.kind);
   return null;
  }
  var o={};
  o.dynamic_element_counter=0; // they may be nested!
  
  o.id="intWebview"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  //Hybrid.debugmessage("create new box: "+o.id);
  var html_string="<div id='"+o.id+"' class='"+cls+"'> HTML GOES HERE!</div>";
  //Hybrid.debugmessage("create new textbox: "+html_string);
  $(html_string).appendTo(layer.jquery);
  
  o.jquery=$("#"+o.id);
  o.jquery.css("z-index",layer.dynamic_element_counter);
  o.kind="hybridIntWebview";
  // keep ref of w and h!
  o.w=w;
  o.h=h;
  o.jquery.width(toPx(w)).height(toPx(h))
   .css("left",toPx(x)).css("top",toPx(y));
  layer.dynamic_element_counter++;
  Hybrid.dynamic_element_counter++; // also increase the global element counter!
  return o; // return the object!
}
Hybrid.feedIntWebView=_hybridFeedIntWebview;
function _hybridFeedIntWebview(o,content)
{
	o.jquery.html(content);
}
Hybrid.feedWebView=_hybridFeedWebview;
function _hybridFeedWebview(o,content)
{
	var doc = o.ifr[0].contentWindow.document;
	var $body = $('body',doc);
	$body.html(content);
}
function _hybridresizeWebView(o,w,h)
{
	Hybrid.debugmessage("_hybridresizeWebView took over!");
	//_hybridSizeBox(o.box,w,h);
	 o.w=w;
	 o.h=h;
	 o.ifr.width(toPx(w)).height(toPx(h));
	 o.box.jquery.width(toPx(w)).height(toPx(h));
	 o.box.jquery.width(toPx(w)).height(toPx(h));
	// we might have to fix the inner iframe like this
		//https://www.geeklog.net/forum/viewtopic.php?showtopic=43817
	//iframe.height=window.frames["NAME"].document.body.scrollHeight;
	//box.jquery.height(toPx(h));
	//Hybrid.debugmessage("height of iframe now is:"+box.jquery.height());
}

Hybrid.setWebviewURL=function (o,url){
  if(o.kind!="hybridWebview")
  {
    Hybrid.debugmessage("setWebviewURL reports: not the right kind of object: "+l.kind+" not set to "+url);
	// throw an error?
    return null;
  }
  o.src=url;
  var html_string='<iframe style="position:absolute;top:0;left:0;width:100%; height:100%;" id="'+o.id+'_if" src="'+o.src+'" '+o.co+'></iframe>';
  o.box.jquery.html(html_string);
};
Hybrid.styleWebview=function (o,co){
	if(o.kind!="hybridWebview")
	{
		Hybrid.debugmessage("setWebviewURL reports: not the right kind of object: "+l.kind+" not set to "+url);
		// throw an error?
		return null;
	}
	o.co="";
	if(co.transparent===true || co.transparant===true)
	{
		o.co+=' frameborder=0 ALLOWTRANSPARENCY="true"';
	}
	if(co.scrolling===true)
	{
		o.co+=' scrolling="auto"';
	}else
	{
		o.co+=' scrolling='+co.scrolling; // auto | yes | no
	}
    var html_string='<iframe style="position:absolute;top:0;left:0;width:100%; height:100%;" id="'+o.id+'_if" src="'+o.src+'" '+o.co+'></iframe>';
	o.box.jquery.html(html_string);
};