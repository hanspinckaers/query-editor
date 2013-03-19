
<script>

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
	
	
// OLD: 
// function createOpen(matchedTextNode) {
// 	var el = document.createElement("div");
// 	el.className = "up";
// 	el.appendChild(matchedTextNode);
// 	return el;
// }
// 
// function createClose(matchedTextNode) {
// 	var el = document.createElement("div");
// 	el.className = "leveldown";
// 	el.appendChild(matchedTextNode);
// 	return el;
// }
// 
// function insertAfter(referenceNode, newNode) {
// 	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
// }
// 
// function createOperator(matchedTextNode) {
// 	var el = document.createElement("div");
// 	el.className = "operator";
// 	matchedTextNode.data = "\n " + matchedTextNode.data + " \n";
// 	el.appendChild(matchedTextNode);
// 	return el;
// }
// 
// function createTag(matchedTextNode) {
// 	var el = document.createElement("div");
// 	el.className = "tag";
// 	matchedTextNode.data = "\n " + matchedTextNode.data + " \n";
// 	el.appendChild(matchedTextNode);
// 	return el;
// }
// 
// function shouldLinkifyContents(el) {
// 	// console.log(el);
// 	// if(el.tagName != "div") return true;
// 	// if(el.className == "tag" || el.className = "leveldown" || el.className = "operator" ) return false;
// 	// console.log(el);
// 	return true;
// }
// 
// function surroundInElement(el, regex, surrounderCreateFunc, shouldSurroundFunc) {
// 	var child = el.lastChild;
// 	while (child) {
// 		if (child.nodeType == 1 && shouldSurroundFunc(el)) {
// 			surroundInElement(child, regex, surrounderCreateFunc, shouldSurroundFunc);
// 		} else if (child.nodeType == 3) {
// 			surroundMatchingText(child, regex, surrounderCreateFunc);
// 		}
// 		child = child.previousSibling;
// 	}
// }
// 
// function surroundMatchingText(textNode, regex, surrounderCreateFunc) {
// 	var parent = textNode.parentNode;
// 	var result, surroundingNode, matchedTextNode, matchLength, matchedText;
// 	while ( textNode && (result = regex.exec(textNode.data)) ) {
// 		matchedTextNode = textNode.splitText(result.index);
// 		matchedText = result[0];
// 		matchLength = matchedText.length;
// 		textNode = (matchedTextNode.length > matchLength) ?
// 			matchedTextNode.splitText(matchLength) : null;
// 		surroundingNode = surrounderCreateFunc(matchedTextNode.cloneNode(true));
// 		// console.log(surroundingNode, matchedTextNode);
// 		parent.insertBefore(surroundingNode, matchedTextNode);
// 		var space = document.createElement("span");
// 		space.innerHTML = "\u200B";
// 		range.insertNode(space);
// 		parent.removeChild(matchedTextNode);
// 		insertAfter(surroundingNode, br);
// 	}
// }
// 
// function updateLinks(selection, doAddPadding) {
// 	var el = document.getElementById("query");
// 	if(selection) var savedSelection = rangy.saveSelection();
// 	surroundInElement(el, /OR|AND|NOT/, createOperator, shouldLinkifyContents);
// 	surroundInElement(el, /\[[^\]]*\]/, createTag, shouldLinkifyContents);
// 	surroundInElement(el, /\(/, createOpen, shouldLinkifyContents);
// 	surroundInElement(el, /\)/, createClose, shouldLinkifyContents);
// 	if(doAddPadding) addPadding(el);
// 	if(selection) rangy.restoreSelection(savedSelection);
// }
// 
// function keyUpLinkifyHandler() {
// 	updateLinks(true, false);
// 
// 	var queryEl = document.getElementById("query");
// 	var rawQueryEl = document.getElementById("rawquery");
// 	rawQueryEl.value = queryEl.textContent.replace(/\s+/g, ' ');;
// 	
// 	checkLastChild();
// }
// 
// function addPadding(el)
// {
// 	var child = el.firstChild;
// 	var up = new Array();
// 	while (child) 
// 	{
// 		addPadding(child);
// 		nextChild = child.nextSibling;
// 
// 		if (child.nodeType == 1) {
// 			if(child.className == "up")
// 			{
// 				console.log("level found!");
// 				up.push(child);
// 			}
// 			else if(child.className == "leveldown")
// 			{
// 				var level = up.pop();
// 				if(!level) continue;
// 				level.className = "levelup";
// 				child.className = "down";
// 				// child.innerHTML = "";
// 				console.log(level);
// 				var levelChilds = new Array();
// 				var levelChild = level.nextSibling;
// 				var found = false;
// 				while (levelChild) 
// 				{
// 					console.log(levelChild);
// 					levelChilds.push(levelChild);
// 					if(levelChild == child) break;
// 					levelChild = levelChild.nextSibling;
// 				}
// 				if(levelChilds.length > 0)
// 				{
// 					// child.innerHTML = "";
// 					// level.innerHTML = "";
// 				}
// 				for (var i = 0; i < levelChilds.length; i++) {
// 					level.appendChild(levelChilds[i]);
// 				}
// 
// 			}
// 		}
// 		 
// 		child = nextChild;
// 	}
// }
