 /*--
 SnoepGames: snoepHybrid - inject css
 V1.2.1
---*/

 Hybrid.createStyleSheet = (function() 
 {
	// Create the <style> tag
	var style = document.createElement("style");

	// Add a media (and/or media query) here if you'd like!
	// style.setAttribute("media", "screen")
	// style.setAttribute("media", "only screen and (max-width : 1024px)")

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(style);

	return style.sheet;
})();

Hybrid.addCSSRule= _hybridAddCSSRule
function _hybridAddCSSRule(sheet, selector, rules, index)
{
	if("insertRule" in sheet) 
	{
		sheet.insertRule(selector + "{" + rules + "}", index);
	}
	else if("addRule" in sheet) 
	{
		sheet.addRule(selector, rules, index);
	}
};

// set default styles for the custom menu:
Hybrid.setHybridStyles=function 
{
	var sheet=Hybrid.createStyleSheet();
	// reset sheet!
	Hybrid.addCSSRule(sheet, "html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre,a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed,  figure, figcaption, footer, header, hgroup,  menu, nav, output, ruby, section, summary, time, mark, audio, video ", "margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; font-family: sans-serif; vertical-align: baseline;");
}();

