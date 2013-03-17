function parse_pubmed_query(query, element) 
{
	var html = '';
	
	// add line between two operators
	html = query.replace(/\s+AND\s+AND\s+/gi, " AND <br/> AND ")
	html = html.replace(/\s+OR\s+OR\s+/gi, " OR <br/> OR ")
	html = html.replace(/\s+NOT\s+NOT\s+/gi, " NOT <br/> NOT ")

	html = html.replace(/\s+AND\s+NOT\s+/gi, " AND <br/> NOT ")
	html = html.replace(/\s+NOT\s+AND\s+/gi, " NOT <br/> AND ")
	html = html.replace(/\s+AND\s+OR\s+/gi, " AND <br/> OR ")
	html = html.replace(/\s+OR\s+AND\s+/gi, " OR <br/> AND ")
	html = html.replace(/\s+NOT\s+OR\s+/gi, " NOT <br/> OR ")
	html = html.replace(/\s+OR\s+NOT\s+/gi, " OR <br/> NOT ")
	
	// html = html.replace(/\s?\bOR\b\s?/gi, "<div class='operator'> OR </div>");
	// html = html.replace(/\s?\bAND\b\s?/gi, "<div class='operator'> AND </div>");
	// html = html.replace(/\s?\bNOT\b\s?/gi, "<div class='operator'> NOT </div>");
	
	html = html.replace(/\s?\bOR\b\s?/gi, "<div class='operator focusnext'> OR </div>");
	html = html.replace(/\s?\bAND\b\s?/gi, "<div class='operator focusnext'> AND </div>");
	html = html.replace(/\s?\bNOT\b\s?/gi, "<div class='operator focusnext'> NOT </div>");
	html = html.replace(/\[/gi, "<span class='tag'>[");
	html = html.replace(/\]/gi, "]</span>");
	
	html = html.replace(/\s*\(/gi, "<div class='levelup focus_1'>(");
	html = html.replace(/\)\s*/gi, ")</div>");
	console.log(query + " : " + html + "-");
	element.innerHTML = html + "";
}

function getPathTo(element) 
{
	if (element.id !== '')
		return 'id("' + element.id + '")';
	if (element === document.body)
		return element.tagName;

	var ix = 0;
	var siblings = element.parentNode.childNodes;
	for (var i = 0; i < siblings.length; i++) {
		var sibling = siblings[i];
		if (sibling === element)
			return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
		if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
			ix++;
	}
}

var prevLetter = 0;
var letter = 0;
var oldQuery = "";

function findElementForXPath(xpath)
{
	var result = document.evaluate (
		xpath, // XPath expression
		document.body, // context node
		null, // namespace resolver
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null // for firefox
	);
	
	var newEl = result.singleNodeValue;
	
	if(xpath.indexOf("query") == -1) return null;
	else if (!newEl) 
	{
		var newXpath = xpath.split("/");
		newXpath.pop();
		console.log(newXpath.join("/"));
		return findElementForXPath(newXpath.join("/"));
	}
	console.log(newEl);
	return newEl;
}

function firstTextNodeForElement(el)
{
	var child = el.firstChild;
	if(el.childNodes.length == 0 || el.nodeType == 3) return el;
	while (child)
	{
		console.log(child);
		if(child.nodeType == 3) return child; // textnode found
		else if(child.childNodes.length > 0) // this child has childnodes, search for textnode
		{
			var textnode = firstTextNodeForElement(child); // find textnode in childnodes of child
			if(textnode) return textnode; // found? return textnode
		}
		child = child.nextSibling;
	}
	return null;
}

function isEmpty(str) {
  return str.replace(/^\s+|\s+$/g, '').length == 0;
}

function markup(e) 
{
	prevLetter = letter;
	letter = e.which;
	
	console.log("-------\n" + letter);

	// check for space
	if(letter == 32) return;

	if (rangy.getSelection()
		.rangeCount == 0 || !rangy.getSelection()
		.isCollapsed) return;
	var range = rangy.getSelection()
		.getRangeAt(0);
	var start = range.startOffset;

	// check for space
	var str = range.startContainer.textContent.replace("&nbsp;"," ");
	var lastChar = str.charAt(start - 1);
	console.log("lastChar: " + lastChar);
	if(isEmpty(lastChar)) return;	
	
	var rawQueryEl = document.getElementById("rawquery");
	oldQuery = rawQueryEl.value;	
	var queryEl = document.getElementById("query");
	console.log("-" + queryEl.innerHTML + "-")
	var text = queryEl.innerHTML.replace(/<(?:.|\n)*?>/gm,'').replace(/\s{2,}/, ' ').replace("\n","").replace("\r","").replace("&nbsp;"," ");
	rawQueryEl.value = text;
	
	console.log("-" + queryEl.innerHTML + "-")

	var changedSize = false;
	if(rawQueryEl.value != oldQuery) changedSize = true;	
	
	
	if(!changedSize && letter != 13)
	{
		console.log("no change in size:" + rawQueryEl.value + " " + oldQuery);
		return;
	}
	
	if(letter == 37 || letter == 38 || letter == 39 || letter == 40 || letter == 8) return;



	var searchForChildren = range.startContainer;
	var parent = range.startContainer.parentNode;
	
	var tookDoubleParent = false; // cannot explain code:
	// if(parent.childNodes.length <= 1)
	// {
	// 	searchForChildren = parent;
	// 	parent = parent.parentNode;	
	// 	tookdoubleparent = true;
	// } 
	
	var children = parent.childNodes;
	var length = children.length;
	var index = 0;

	for (var i = 0; i < length; i++) 
	{
		if (children[i] == searchForChildren) 
		{
			index = i;
		}
	}
	console.log(parent + " " + parent.childNodes.length + " " + index);

	var xpath = getPathTo(range.startContainer);
	var tookparent = false;
	var oldEl = range.startContainer;

	if (range.startContainer.nodeType == 3 || !xpath || oldEl.childNodes.length == 0)
	{
		xpath = getPathTo(range.startContainer.parentNode);	
		if(!tookDoubleParent)
		{
			if(range.startContainer.nodeType == 3) console.log("was a text node");
			if(!xpath) console.log("no xpath");
			tookparent = true;
		}
	} 

	xpath = xpath.replace("query", "testquery");

	// parse into the hidden field
	parse_pubmed_query(text, document.getElementById("testquery"));

	var newEl = findElementForXPath(xpath);
	
	if (!newEl || xpath.indexOf("testquery") == -1) 
	{
		return;
	}
	else {
		queryEl.innerHTML = document.getElementById("testquery").innerHTML;
		xpath = xpath.replace("testquery", "query");
		newEl = findElementForXPath(xpath);
	}

	var newRange = rangy.createRange();

	console.log(xpath);

	// TODO:
	// get text node of newEl
	// write comments
	// add focus after to operator!
	// add focus on first to levelup!
	
	if(oldEl.nodeType != 3)
	{
		// what what
		console.log("oldEL is not an textnode")
	}
	
	console.log("newEl; ");
	console.log(newEl);
	
	var selectEl = null;
	if(tookparent)
	{
		console.log("tookparent");
		// node deleted, take the new one
		if(!newEl.childNodes[index] && newEl.childNodes[index-1])
		{
			selectEl = firstTextNodeForElement(newEl.childNodes[index-1]);
		}
		else if(newEl.childNodes[index])
		{	
			console.log("child found: "+index);
			selectEl = firstTextNodeForElement(newEl.childNodes[index]);
		}
		else {
			console.log("child not found!");
			selectEl = firstTextNodeForElement(newEl);
		}
	} 
	else {
		selectEl = firstTextNodeForElement(newEl);
	}
	
	console.log("SelectEL; ");
	console.log(selectEl);
	
	// text added by parser?
	if(oldEl.data && selectEl.data && oldEl.data.length < selectEl.data.length)
	{
		console.log("OldEl: " + oldEl.data + " is smaller than selectEl: " + selectEl.data);

		console.log("length of OldEl " + oldEl.data.length + " is smaller than selectEl" + selectEl.data.length + ", prosumably added text, changing start");
		start += selectEl.data.length - oldEl.data.length;
	}

	// so if newEl = textnode, and oldEl = textnode, and de cursor is on a position out of bounds of newEl, find next sibling
	if (selectEl.nodeType == 3 &&
		oldEl.nodeType == 3 &&
		start > selectEl.data.length)
	{
		console.log("first");
		
		var length = selectEl.data.length;
		var diff = start - length;
		var newEl = selectEl.nextSibling;
		
		if(!newEl) newEl = selectEl.parentNode.nextSibling; // we are inside a tag div in a textnode, get out!.
		// var newElTextContent = firstTextNodeForElement(newEl);
		// span is inline
		if(newEl.nextSibling && diff > newEl.textContent.length && newEl.nextSibling.tagName == "SPAN") newEl = newEl.nextSibling;
		
		// check if newEl classname is focusnext! than we have to get the next one!
		if (newEl)
		{
			var length = selectEl.data.length;
			selectEl = firstTextNodeForElement(newEl);
			
			// find the start
			var calculatedStart = start - length;
			if(calculatedStart > selectEl.data.length) calculatedStart = selectEl.data.length;			
			newRange.setStart(selectEl, calculatedStart);
			start = calculatedStart;
		} 
		else {
			// set after selectEl (should be a warning)
			console.log("warning: nextSibling not found, position out of bounds of newEl");
			newRange.setStartAfter(selectEl);
		}
	} 
	else if (oldEl.nodeType == 3 && 
			 selectEl.nodeType == 3) 
	{	
		if(start == selectEl.data.length)
		{
			
		}
		// if both are textnodes
		console.log("second");
		
		newRange.setStart(selectEl, start);
		// childrenindex?
	} 
	else if (selectEl) 
	{
		// not really possible
		console.log("third");
		
		if(selectEl == queryEl)
		{
			newRange.setStartAfter(firstTextNodeForElement(selectEl.lastChild));
		}
		else {
			if(selectEl.nextSibling)
			{
			    newRange.setStart(firstTextNodeForElement(selectEl.nextSibling), 0);		
			}
			else {
			    newRange.setStartAfter(firstTextNodeForElement(selectEl));
			}
		}						
	} 
	else {
		return;
	}

	console.log(selectEl.length, selectEl, start);

	newRange.collapse(true);
	var sel = rangy.getSelection();
	sel.setSingleRange(newRange);
}


// make sure br is always the lastChild of contenteditable
function checkLastChild() 
{
	var el = document.getElementById("query");

	if (!el.lastChild || el.lastChild.nodeName.toLowerCase() != "br") 
	{
		var br = document.createElement('br');
		el.appendChild(br);
	}
}

// use br instead of div div
function insertBR(e) 
{
	if (e.which == 13) 
	{
		if (window.getSelection) 
		{
			var selection = window.getSelection(),
			    range = selection.getRangeAt(0);
			    // br = document.createTextNode("");
			range.deleteContents();
			// range.insertNode(br);
			// range.setStartAfter(br);
			// range.setEndAfter(br);
			range.collapse(false);
			selection.removeAllRanges();
			selection.addRange(range);
			return false;
		}
	}
}

function log(string)
{
	console.log(string);
}
