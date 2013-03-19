function loadExample()
{
	var query = '"Systems Biology"[mesh] OR ("Computer Simulation" [majr] AND "Models, Biological"[majr])) AND ("whole-cell" OR "cell simulation") AND (bacteria OR virus)';
	var el = document.getElementById("rawquery");
	document.getElementById("rawquery").value = query;
	parse_pubmed_query(query, el);
	refreshPubmed();
}

function parse_pubmed_query(query, element) 
{
	var html = '';
	
	// add line between two operators
	// html = query.replace(/\s+AND\s+AND\s+/gi, " AND <br/> AND ")
	// html = html.replace(/\s+OR\s+OR\s+/gi, " OR <br/> OR ")
	// html = html.replace(/\s+NOT\s+NOT\s+/gi, " NOT <br/> NOT ")
	// 
	// html = html.replace(/\s+AND\s+NOT\s+/gi, " AND <br/> NOT ")
	// html = html.replace(/\s+NOT\s+AND\s+/gi, " NOT <br/> AND ")
	// html = html.replace(/\s+AND\s+OR\s+/gi, " AND <br/> OR ")
	// html = html.replace(/\s+OR\s+AND\s+/gi, " OR <br/> AND ")
	// html = html.replace(/\s+NOT\s+OR\s+/gi, " NOT <br/> OR ")
	// html = html.replace(/\s+OR\s+NOT\s+/gi, " OR <br/> NOT ")
	
	// html = html.replace(/\s?\bOR\b\s?/gi, "<div class='operator'> OR </div>");
	// html = html.replace(/\s?\bAND\b\s?/gi, "<div class='operator'> AND </div>");
	// html = html.replace(/\s?\bNOT\b\s?/gi, "<div class='operator'> NOT </div>");
	
	html = query.replace(/\s?\bOR\b\s?/gi, "<div class='operator'>OR</div>");
	html = html.replace(/\s?\bAND\b\s?/gi, "<div class='operator'>AND</div>");
	html = html.replace(/\s?\bNOT\b\s?/gi, "<div class='operator'>NOT</div>");
	
	html = html.replace(/\[/gi, "<span class='tag'>[");
	html = html.replace(/\]/gi, "]</span>");
	
	html = html.replace(/\s*\(/gi, "<div class='levelup focus_1'>(");
	html = html.replace(/\)\s*/gi, ")</div>");

	element.innerHTML = html + "<br/>";
}

function searchElForString(el, needle)
{
	var child = el.firstChild;
	while(child)
	{
		var index = child.textContent.indexOf(needle);
		if(index > -1)
		{
			if(child.firstChild) return searchElForString(child, needle);
			else return new Array(child, index);
		}
		child = child.nextSibling;
	}
}

var prevQuery = "";

function markup(e) 
{
	var letter = e.which;
	if(letter == 32 || letter == 37 || letter == 38 || letter == 39 || letter == 40) return;
	
	var selection = rangy.getSelection();
	if (selection.rangeCount == 0 || !rangy.getSelection().isCollapsed) return;
	var range = selection.getRangeAt(0);

	var rawQueryEl = document.getElementById("rawquery");
	var queryEl = document.getElementById("query");
	var text = queryEl.innerHTML.replace(/<(?:.|\n)*?>/gm,' ').replace("\n"," ").replace("\r"," ").replace("&nbsp;"," ").replace(/\s{2,}/g, ' ').replace(/^\s+/,'').replace(/\s+$/,'');
	if(letter == 13) searchPubmed(text);
	if(text == prevQuery) return;	
	prevQuery = text;

	// add | token
	var cursor = document.createTextNode("|");
	range.insertNode(cursor);
	range.setStartAfter(cursor);
	range.setEndAfter(cursor);
	range.collapse(false);
	selection.removeAllRanges();
	selection.addRange(range);
	
	text = queryEl.innerHTML.replace(/<(?:.|\n)*?>/gm,' ').replace("\n"," ").replace("\r"," ").replace("&nbsp;"," ").replace(/\s{2,}/g, ' ').replace(/^\s+/,'').replace(/\s+$/,'');
	// parse
	parse_pubmed_query(text, queryEl); 
	rawQueryEl.value = text.replace("|","");
	
	var arr = searchElForString(queryEl, "|");	
	arr[0].data = arr[0].data.replace("|", "");

	var newRange = rangy.createRange();
	newRange.setStart(arr[0], arr[1]);	
	newRange.collapse(true);
	var sel = rangy.getSelection();
	sel.setSingleRange(newRange);
}

// use br instead of div div
function insertBR(e) 
{
	if (e.which == 13 || e.which == 124) 
	{
		if (rangy.getSelection()) 
		{
			var selection = rangy.getSelection();
			var range = selection.getRangeAt(0);
			range.deleteContents();
			range.collapse(false);
			selection.removeAllRanges();
			selection.addRange(range);
			return false;
		}
	}
}

function cancelReturn(e) 
{
	if (e.which == 13) 
	{
		e.preventDefault();
		refreshPubmed();
		return false;
	}
}