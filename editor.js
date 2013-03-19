String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

function loadExample()
{
	var query = '"Systems Biology"[mesh] OR ("Computer Simulation"[majr] AND "Models, Biological"[majr]) AND ("whole-cell" OR "cell simulation") AND (bacteria OR virus)';
	var el = document.getElementById("rawquery");
	document.getElementById("rawquery").value = query;
	parse_pubmed_query(query, el);
	refreshPubmed();
}

function queryFromHTML(html)
{
	html = html.replace(/<(?:.|\n)*?>/gm,' ')
		.replace("\n"," ")
		.replace("\r"," ")
		.replace("&nbsp;"," ")
		.replace(/\s{2,}/g, ' ')
		.replace(/^\s+/,'')
		.replace(/\s+$/,'');
	// return html;
	return removeUneededSpaces(html);
}

function removeUneededSpaces(query)
{
	var re = /["|\[|\]|\(|\)]\s+["|\[|\]|\(|\)]/gi;
	var match = re.exec(query);
	while (match != null)
	{
	  var before_length = match.index;
	  var before = query.substring(0, before_length);
	  var after_index = match.index + match[0].length;
	  var after = query.substring(after_index);
	  var substr = query.substr(match.index, match[0].length);
	  substr = substr.replace(" ", "•");
	  query = before+substr+after;
	  match = re.exec(query);
	}
	return query.replace(/•/g, "").replace(/\(\s+/g, "(")
		.replace(/\s+\)/g, ")")
		.replace(/\s+\[/g, "[");
}

function parse_pubmed_query(query, element) 
{	
	var html = '<span class="word">' + query;

	html = html.replace(/\s?\bOR\b\s?/gi, "</span><div class='operator'>OR</div><span class='word'>");
	html = html.replace(/\s?\bAND\b\s?/gi, "</span><div class='operator'>AND</div><span class='word'>");
	html = html.replace(/\s?\bNOT\b\s?/gi, "</span><div class='operator'>NOT</div><span class='word'>");

	html = html.replace(/\[/gi, "</span><span class='tag'>[");
	html = html.replace(/\]/gi, "]</span><span class='word'>");
	
	html = html.replace(/\s*\(/gi, "</span><div class='levelup'>(<div class='secondlevel'><span class='word'>");
	html = html.replace(/\)\s*/gi, "</span><br/></div>)</div><span class='word'>");



	element.innerHTML = html + "<br/></span>";
	searchForWordsWithoutQoutes();
}

function searchForWordsWithoutQoutes()
{
	var words = document.getElementsByClassName('word');  
	for(var i=0; i<words.length; i++)
	{
		var word = words[i];     
		var text = word.textContent.trim();
		
		var firstChar = text.charAt(0);
		var lastChar = text.charAt(text.length-1);
		
		if(lastChar == "|") lastChar = text.charAt(text.length-2);
		if(firstChar == "|") lastChar = text.charAt(1);

		if(text.indexOf(' ') != -1 && 
		  (firstChar != '"' || lastChar != '"'))
		{
			word.className = 'noqoutes';
		}
	}

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
	var text = queryFromHTML(queryEl.innerHTML);
	if(letter == 13)
	{
		rawQueryEl.value = text;
		searchPubmed(text);
	} 
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
	
	text = queryFromHTML(queryEl.innerHTML);
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