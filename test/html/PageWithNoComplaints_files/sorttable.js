addEvent(window, "load", sortables_init);

var SORT_COLUMN_INDEX;

function sortables_init() {
    // Find all tables with class sortable and make them sortable
    if (!document.getElementsByTagName) return;
    tbls = document.getElementsByTagName("table");
    for (ti=0;ti<tbls.length;ti++) {
        thisTbl = tbls[ti];
        if (((' '+thisTbl.className+' ').indexOf("sortable") != -1) && (thisTbl.id)) {
            //initTable(thisTbl.id);
            ts_makeSortable(thisTbl);
        }
    }
}

function ts_makeSortable(table) {
    if (table.rows && table.rows.length > 0) {
        var firstRow = table.rows[0];
    }
    if (!firstRow) return;
    
    // We have a first row: assume it's the header, and make its contents clickable links
    for (var i=0;i<firstRow.cells.length;i++) {
        var cell = firstRow.cells[i];
        var txt = ts_getInnerText(cell);
        var headerlink = ts_getInnerHeaderLink(cell);
        var newdiv=document.createElement("div");
        if(i == 0)
        {
		newdiv.setAttribute("class", "selsortheaderdiv");
		newdiv.className = "selsortheaderdiv";
		newdiv.innerHTML = '<a href="#" class="sortheader" '+ 
			'onclick="ts_resortTable(this, '+i+');return false;">' + 
			txt+'<span class="sortarrow">&nbsp;&nbsp;&darr;</span></a>';
	}
	else
	{
		newdiv.setAttribute("class", "sortheaderdiv");
		newdiv.className = "sortheaderdiv";
		newdiv.innerHTML = '<a href="#" class="sortheader" '+ 
			'onclick="ts_resortTable(this, '+i+');return false;">' + 
			txt+'<span class="sortarrow">&nbsp;&nbsp;&nbsp;</span></a>';
	}
        cell.innerHTML = "";
        cell.appendChild(newdiv);
        if(headerlink != null)
        {
        	headerlink.innerHTML = "(Help)";
	        newdiv.appendChild(headerlink);
	}
    }
}

function ts_getInnerText(el) {
	if (typeof el == "string") return el;
	if (typeof el == "undefined") { return el };
	//if (el.innerText) return el.innerText;	//Not needed but it is faster
	var str = "";
	
	var cs = el.childNodes;
	var l = cs.length;
	for (var i = 0; i < l; i++) {
		switch (cs[i].nodeType) {
			case 1: //ELEMENT_NODE
				if(cs[i].getAttribute("class")!= 'headerlink' && cs[i].className != 'headerlink')
				{
					str += ts_getInnerText(cs[i]);
				}
				break;
			case 3:	//TEXT_NODE
				str += cs[i].nodeValue;
				break;
		}
	}
	return str;
}
function ts_getInnerHeaderLink(el) {
//	if (typeof el == "string") return el;
//	if (typeof el == "undefined") { return el };
//	if (el.innerText) return el.innerText;	//Not needed but it is faster
	var str = "";
	
	var cs = el.childNodes;
	var l = cs.length;
	for (var i = 0; i < l; i++) {
		if(cs[i].nodeType == 1){
			if(cs[i].getAttribute("class") == 'headerlink' || cs[i].className == 'headerlink'){
				return cs[i];
			}
		}
	}
	return null;
}

var sortlog = "";
function ts_resortTable(lnk,clid) {
    // get the span
    var span;
    for (var ci=0;ci<lnk.childNodes.length;ci++) {
        if (lnk.childNodes[ci].tagName && lnk.childNodes[ci].tagName.toLowerCase() == 'span') span = lnk.childNodes[ci];
    }
    var spantext = ts_getInnerText(span);
    var td = lnk.parentNode;
    var column = null;
    if(clid == 0)
    	column = 0;
    else
    	column = clid || td.cellIndex;
    var table = getParent(td,'TABLE');
    
    // Work out a type for the column
    if (table.rows.length <= 1) return;
    var itm = ts_getInnerText(table.rows[1].cells[column]);
    sortfn = ts_sort_caseinsensitive;
    if(lnk.innerHTML.match("STATUS")) {sortfn = ts_sort_status;}
    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/)){sortfn = ts_sort_date;}
    if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d$/)) sortfn = ts_sort_date;
    if (itm.match(/^\d+\s+[A-Za-z0-9]/) || itm.match(/^\d+-.+?\s+[A-Za-z0-9]/)){sortfn = ts_sort_address;}
    if (itm.match(/^[£$]/)) sortfn = ts_sort_currency;
    if (itm.match(/^[\d\.]+$/)) sortfn = ts_sort_numeric;
    SORT_COLUMN_INDEX = column;
    var firstRow = new Array();
    var newRows = new Array();
    for (i=0;i<table.rows[0].length;i++) { firstRow[i] = table.rows[0][i]; }
    for (j=1;j<table.rows.length;j++) { newRows[j-1] = table.rows[j]; }

    newRows.sort(sortfn);
//    alert(sortlog);
//    sortlog = "";

    if (span.getAttribute("sortdir") == 'down') {
        ARROW = '&nbsp;&nbsp;&uarr;';
        span.setAttribute('sortdir','up');
    } else {
        ARROW = '&nbsp;&nbsp;&darr;';
        newRows.reverse();
        span.setAttribute('sortdir','down');
    }
    
    // We appendChild rows that already exist to the tbody, so it moves them rather than creating new ones
    // don't do sortbottom rows
    for (i=0;i<newRows.length;i++) { if (!newRows[i].className || (newRows[i].className && (newRows[i].className.indexOf('sortbottom') == -1))){ if(i % 2 == 1) { newRows[i].style.backgroundColor = '#dedede'; } else { newRows[i].style.backgroundColor = '#ffffff';} table.tBodies[0].appendChild(newRows[i]);} }
    // do sortbottom rows only
    for (i=0;i<newRows.length;i++) { if (newRows[i].className && (newRows[i].className.indexOf('sortbottom') != -1)){ if(i % 2 == 1) { newRows[i].style.backgroundColor = '#dedede'; } else { newRows[i].style.backgroundColor = '#ffffff';} table.tBodies[0].appendChild(newRows[i]);}}
    
    // Delete any other arrows there may be showing
    var allspans = document.getElementsByTagName("span");
    for (var ci=0;ci<allspans.length;ci++) {
        if (allspans[ci].className == 'sortarrow') {
            if (getParent(allspans[ci],"table") == getParent(lnk,"table")) { // in the same table as us?
                allspans[ci].innerHTML = '&nbsp;&nbsp;&nbsp;';
            }
        }
    }
    var alldivs = document.getElementsByTagName("div");
    for (var ci=0;ci<alldivs.length;ci++) {
        if (alldivs[ci].className == 'selsortheaderdiv') {
            if (getParent(alldivs[ci],"table") == getParent(lnk,"table")) { // in the same table as us?
                alldivs[ci].className = 'sortheaderdiv';
            }
        }
    }
        
    span.innerHTML = ARROW;
    td.className = 'selsortheaderdiv';
}

function getParent(el, pTagName) {
	if (el == null) return null;
	else if (el.nodeType == 1 && el.tagName.toLowerCase() == pTagName.toLowerCase())	// Gecko bug, supposed to be uppercase
		return el;
	else
		return getParent(el.parentNode, pTagName);
}
function ts_sort_date(a,b) {
    // y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa.length == 10) {
        dt1 = aa.substr(6,4)+aa.substr(0,2)+aa.substr(3,2);
    } else {
        yr = aa.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt1 = yr+aa.substr(3,2)+aa.substr(0,2);
    }
    if (bb.length == 10) {
        dt2 = bb.substr(6,4)+bb.substr(0,2)+bb.substr(3,2);
    } else {
        yr = bb.substr(6,2);
        if (parseInt(yr) < 50) { yr = '20'+yr; } else { yr = '19'+yr; }
        dt2 = yr+bb.substr(3,2)+bb.substr(0,2);
    }
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
}

function ts_sort_currency(a,b) { 
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).replace(/[^0-9.]/g,'');
    return parseFloat(aa) - parseFloat(bb);
}

function ts_sort_numeric(a,b) { 
    aa = parseFloat(ts_getInnerText(a.cells[SORT_COLUMN_INDEX]));
    if (isNaN(aa)) aa = 0;
    bb = parseFloat(ts_getInnerText(b.cells[SORT_COLUMN_INDEX])); 
    if (isNaN(bb)) bb = 0;
    return aa-bb;
}

function ts_sort_caseinsensitive(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]).toLowerCase();
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]).toLowerCase();
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}
function ts_sort_address(a,b) 
{
	aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
	bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
	var re = /^(\d+)\s+(.*)$/
	var a_st = 2;
	var b_st = 2;
	var aaresults = re.exec(aa);
	var bbresults = re.exec(bb);
	if(!aaresults)
	{
		re = /^(\d+)-(.+?)\s+(.*)$/;
		aaresults = re.exec(aa);
		a_st = 3;
	}
	if(!bbresults)
	{
		re = /^(\d+)-(.+?)\s+(.*)$/;
		bbresults = re.exec(bb);
		b_st = 3;
	}
	if(aaresults && bbresults)
	{
//		alert(aaresults[1] + "::" + aaresults[2] + "::" + aaresults[3] + "\n" +
//		      bbresults[1] + "::" + bbresults[2] + "::" + bbresults[3]);
		if(aaresults[a_st] == bbresults[b_st])
		{
			var aar = parseFloat(aaresults[1]);
			if (isNaN(aar)) aar = 0;
			if(a_st == 3)
			{
				var aard = parseFloat(aaresults[2]) / 100;
				if(isNaN(aard)) aard = 0;
				aar += aard;
			}
			var bbr = parseFloat(bbresults[1]); 
			if (isNaN(bbr)) bbr = 0;
			if(b_st == 3)
			{
				var bbrd = parseFloat(bbresults[2]) / 100;
				if(isNaN(bbrd)) bbrd = 0;
				bbr += bbrd;
			}
			return aar-bbr;
		}
		else
		{
			if(aaresults[a_st] < bbresults[b_st]) return -1;
			return 1;
		}
	}
	else
	{
		if (aa==bb) return 0;
		if (aa<bb) return -1;
		return 1;
	}
}

function ts_sort_status(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    aa = statuses[aa];
    bb = statuses[bb];
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}

function ts_sort_default(a,b) {
    aa = ts_getInnerText(a.cells[SORT_COLUMN_INDEX]);
    bb = ts_getInnerText(b.cells[SORT_COLUMN_INDEX]);
    if (aa==bb) return 0;
    if (aa<bb) return -1;
    return 1;
}


function addEvent(elm, evType, fn, useCapture)
// addEvent and removeEvent
// cross-browser event handling for IE5+,  NS6 and Mozilla
// By Scott Andrew
{
  if (elm.addEventListener){
    elm.addEventListener(evType, fn, useCapture);
    return true;
  } else if (elm.attachEvent){
    var r = elm.attachEvent("on"+evType, fn);
    return r;
  } else {
    alert("Handler could not be removed");
  }
} 
