 /*--
 SnoepGames: snoepHybrid - anti-leeching
---*/
//Hybrid.debugmessage("leech protection 2.2");
Hybrid.aatd=[]; 
//Hybrid.aatd.push(""); // cannot allow "" because it is a contains....
//Hybrid.aatd.push("undefined"); // DOESN't WORK MUST ALLOW undefined referrer to circumvent problems with false positives, you can blank your referrer in firefox for instance.
// this is done by going 'about: config' in the url field  -> then going to http: header referrer and putting the normal "2" to "0";

Hybrid.aatd.push("687474703a2f2f6c6f63616c686f73742f"); //http://localhost/"); // debugging!
Hybrid.aatd.push("687474703a2f2f7777772e736e6f65702e61742f");//http://www.snoep.at/"); // these are default!
Hybrid.aatd.push("687474703a2f2f7777772e6d616b696e6767616d65732e6f72672f"); //http://www.makinggames.org/"); // these are default!

function _hybridLeechProtect(){
	// we do any number of referrer checks here!
	if(Hybrid.allowAllDomains==true)
	{
		Hybrid.debugmessage("WARNING: no leechprotect active.");
		return true;
	}
	if(Hybrid.aatd)
	{
		//allowed and trusted domains has been set!
		var rf1=eval(Hybrid.decodeString("646f63756d656e742e7265666572726572")); //document.referrer 
		if(typeof(rf1)==="undefined" || rf1=="")
		{
			// this is when referrer is blocked..
			// we cannot play then, so just allow..
			// it's rare and not always very steady.
			// this sucks, but it's true..
			return true;
		}
		// referrer turns out to work perfectly.. (Jeee! Damn.... Not so perfect vodafone standard doesn't give referrer and you can block it easily..)
		//var rf2="";
		//try
		//{
			//rf2=eval(Hybrid.decodeString("77696e646f772e746f702e6c6f636174696f6e2e68726566")); //"window.top.location.href"
			// this doesn't work. Checking document.href werkt ook niet, want je kunt gewoon mijn index in zijn geheel iframen.
			// met een try catch zou ik de error moeten kunnen opvangen. Werkt het WEL dan zitten we in een
			// oude browser.
		//}catch(err) 
		//{
			// this is probably just the 
			//window.alert("just caught an error: "+err.message);
			// we ignore the error!
		//}
		// this causes an error on the ipad and is not really something we want anyway..
		
		
		//Hybrid.debugmessage("encoded "+Hybrid.encodeString("window.top.location.href"));
		Hybrid.debugmessage("CHECKING REFS: "+rf1);
		//Hybrid.debugmessage("CHECKING REFS: "+rf2);
		var i,a=false;
		for(i=0;i<Hybrid.aatd.length;i++)
		{
			Hybrid.debugmessage("Checking aatd");
			Hybrid.debugmessage(rf1.substr(0,Hybrid.decodeString(Hybrid.aatd[i]).length)+"==='"+Hybrid.decodeString(Hybrid.aatd[i])+"'");
			//Hybrid.debugmessage(rf2.substr(0,Hybrid.decodeString(Hybrid.aatd[i]).length)+"==='"+Hybrid.decodeString(Hybrid.aatd[i])+"'");
			//Hybrid.debugmessage("encoded aatd: Hybrid.aatd[i] "+Hybrid.encodeString(Hybrid.aatd[i]));
			if(rf1.substr(0,Hybrid.decodeString(Hybrid.aatd[i]).length)==Hybrid.decodeString(Hybrid.aatd[i])) 
			 {
				Hybrid.debugmessage("Found a matching aatd");
				a=true;
			 }
			 //if(rf2.substr(0,Hybrid.decodeString(Hybrid.aatd[i]).length)==Hybrid.decodeString(Hybrid.aatd[i])
		}
		return a; // cannot run in direct mode!
	}else
	{
		return false;
	}
};
 /*-------------------------------------------------------------------------------------
 // obscuring
 ----------------------------------------------------------------------------------------*/ 
// Functions to hide strings that will not be obscure, for instance if you want to SAy "Hybrid" in debug.
// there are private and public versions. Both are equal.

Hybrid.encodeString=_hybridEncodeString;
Hybrid.decodeString=_hybridDecodeString;
function _hybridEncodeString(ins){
	var o="";
	var i;
	for(i=0;i<ins.length;i++)o+=ins.charCodeAt(i).toString(16);
	return o;
};
function _hybridDecodeString(ins){
	var o="";
	var i;
	for(i=0;i<ins.length;i+=2)o+=String.fromCharCode(parseInt("0x"+ins.substr(i,2)));
	return o;
};
