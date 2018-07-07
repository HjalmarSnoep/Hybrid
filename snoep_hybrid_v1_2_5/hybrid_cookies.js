 /*--
 SnoepGames: snoepHybrid cookie
V1.2.0 
---*/
//Local Storage is more secure then cookies (
// WE SHOULD ALSO DO THE NORMAL COOKIE, but take care of XSS attacks
  
Hybrid.setCookie=_hybridSetCookieValue
 function _hybridSetCookieValue(id,val){
  if(typeof(Storage)!=="undefined")
  {
  // Code for localStorage/sessionStorage.
	// Store with appid as prefix
	localStorage.setItem(id, val);
  }
 };
 
function _hybridIsEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
 
Hybrid.getCookie=_hybridGetCookieValue
function _hybridGetCookieValue(id){
	if(typeof(Storage)!=="undefined")
	{
	  // Code for localStorage/sessionStorage.
		// Store
		
		if(_hybridIsEmptyObject(localStorage.getItem(id)))
		{
			// this is never good and leads to errors, so make it null, that's easy to test!
			// test for ===null, not for typeof(...)==="null", that would return "object", sadly..
			return null;
		}else
		{
			return localStorage.getItem(id);
		}
	}
	else
	{
		// Sorry! No Web Storage support..
		return null;
	}
 };
Hybrid.getAllCookieKeys=_hybridGetAllCookieKeys;
function _hybridGetAllCookieKeys(){
	if(typeof(Storage)!=="undefined")
	{
		var list=[];
	  for(var i=0, len=localStorage.length; i<len; i++) 
	  {
			list.push(localStorage.key(i));
	  }
	  return list;
	}else
	{
		return [];
	}
 };
Hybrid.removeCookie=_hybridRemoveCookie;
function _hybridRemoveCookie(key){
	if(typeof(Storage)!=="undefined")
	{
		localStorage.removeItem(key);
	}
 };

 