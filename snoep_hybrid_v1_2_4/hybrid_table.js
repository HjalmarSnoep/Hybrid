 /*--
 SnoepGames: snoepHybrid - table
 
 HTML5 GAME LIB
 by Hjalmar Snoep
 http://www.snoepgames.nl 
 
 Copyright (c)  2014 Hjalmar Snoep, Snoepgames.  
 http://www.snoep.at
 http://www.makinggames.org/nl/user/hjalmarsnoep
 http://www.youtube.com/user/hjalmarsnoep
 All rights reserved.
 
 V1.2.2 
---*/
 
Hybrid.createTable=_hybridCreateTable;
function _hybridCreateTable(layer,rows,columns)
{
  if(typeof(rows)==="undefined") rows=3; // standard ON!
  if(typeof(columns)==="undefined") columns=3; // standard ON!
  var o={};
  o.id="tab"+Hybrid.dynamic_element_counter; // use global for counting, or we will have collisions!
  var html_string="<table id='"+o.id+"' width='100%' height='100%'>";
  var y,x;
  for(y=0;y<columns;y++)
  {
	html_string+='<tr>';
	for(x=0;x<rows;x++)
	{
		if(y==0)
		{
			html_string+='<th id="'+o.id+'_'+x+'_'+y+'">';
			html_string+='</th id="'+o.id+'_'+x+'_'+y+'">';
		}else
		{
			html_string+='<td id="'+o.id+'_'+x+'_'+y+'">';
			html_string+='</td id="'+o.id+'_'+x+'_'+y+'">';
		}
	}
	html_string+='</tr>';
  }
  
  html_string="</table>";
  $(html_string).appendTo(layer.jquery);
  
  o.jquery=$("#"+o.id);
  o.jquery.css("z-index",layer.dynamic_element_counter).css({left: toPx(x), top: toPx(y)});
  o.kind="hybridTable";
  layer.dynamic_element_counter++;
  Hybrid.dynamic_element_counter++; // also increase the global counter.
  return o; // return the object!
};

Hybrid.setTableCellEditable=_hybridSetTableCellEditable;
function _hybridSetTableCellEditable(o,x,y,tf)
{
	
};

Hybrid.setTableValue=_hybridSetTableValue;
function _hybridSetTableValue(o,x,y,value)
{
	
};

Hybrid.getTableValue=_hybridGetTableValue;
function _hybridGetTableValue(o,x,y)
{
	return 0;
};

