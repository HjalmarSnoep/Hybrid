 /*--
 SnoepGames: snoepHybrid - server (ajax on javascript!)
 
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

Hybrid.callStack={ready:true};


Hybrid.getVars=_hybridGetVarsSync;
function _hybridGetVarsSync(url,data,cb,ecb)
{
	var str=url+"?";
	data.ck=new Date().getTime();
	for(all in data)
	{
		str+=all+"="+data[all]+"&";
	}
	Hybrid.debugmessage("getVars: "+str);


	if(typeof(cb)==="undefined") Hybrid.throwError("getVars requires a callback");
	if(typeof(ecb)==="undefined") Hybrid.throwError("getVars requires an error callback");
	if(Hybrid.callStack.ready!=true)
	{
		Hybrid.debugmessage("overlapping calls, please use getVars only for Sync calling");
		return;
	}else
	{
		Hybrid.callStack.url=url;
		Hybrid.callStack.data=data;
		Hybrid.callStack.cb=cb;
		Hybrid.callStack.ecb=ecb;
		Hybrid.callStack.ready=false;
		Hybrid.callStack.error=false;
		
		$.getJSON( url, data )
		  .done(_hybridHandleAjaxSucces)
		  .fail(_hybridHandleAjaxErrors);
	}
}


Hybrid.setVars=_hybridsetVars; // same as getvars, but no callback or error handling, great for stats and stuff. Just for sending!
function _hybridsetVars(url,data)
{
	var str=url+"?";
	var all; // not setting this got me a bug, because when logging debug this constanty reset the global value of all.. oops..
	data.ck=new Date().getTime();
	for(all in data)
	{
		str+=all+"="+data[all]+"&";
	}
	$.get(url,data); 
	//Hybrid.debugmessage("setVars: "+str);
	
}
function _hybridHandleAjaxSucces(json)
{
	Hybrid.callStack.ready=true;
	Hybrid.callStack.error=false;
	Hybrid.callStack.cb(json);
}
function _hybridHandleAjaxErrors(xhr, ajaxOptions, thrownError) 
{
	Hybrid.callStack.ready=true;
	Hybrid.callStack.error=true;
	Hybrid.callStack.ecb(Hybrid.callStack.url,Hybrid.callStack.data,thrownError,xhr.status);
	//Hybrid.debugmessage("calling: "+Hybrid.callStack.ecb);
	Hybrid.debugmessage("Request Failed: "+Hybrid.callStack.url+", "+xhr.status+" "+thrownError+" "+ajaxOptions);
	
//	Hybrid.throwError(_hybridGetVarsURLneededForErrorReporting+", WARNING: "+xhr.status+" "+thrownError);
}
// as we did it usually in Flash, but no arrays possible, so don't use.
Hybrid.getVarsFromServerTextRespons=_hybridGetVarsFromServerTextRespons;
function _hybridGetVarsFromServerTextRespons(str)
{
	var pairs=str.split("&");
	var i;
	var data={};
	for(i=0;i<pairs.length;i++)
	{
		if(pairs[i].indexOf("=")!=-1)
		{
			var val=pairs[i].split("=");
			//Hybrid.debugmessage("verbose getVarsFromResponse: "+val[0]+"="+val[1]);
			data[val[0]]=val[1];
		}
	}
	return data;
}

// as we did it usually in Flash, but no arrays possible, so don't use.
Hybrid.navigateTo=_hybridNavigateTo;
function _hybridNavigateTo(str,new_window)
{
	if(typeof(new_window)==="undefined")
	{
		new_window=false;
	}
	if(new_window==false)
	{
		//top.location.href=str; // if they don't allow this, the other one will get them!
		window.location.href=str;
	}else
	{
		window.open(str,'_blank'); // this in theory will open a new window.
	}
}


