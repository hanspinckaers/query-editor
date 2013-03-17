function searchPubmedAfterDelay()
{
	setTimeout(function() { 
		refresh();
	} , 100);
}

function refreshPubmed()
{
	searchPubmed($("#rawquery")[0].value) ;
	parse_pubmed_query($("#rawquery")[0].value, document.getElementById('query'));
}

function searchPubmed(query)
{
	if(query.length == 0) return;
	
	$("#pubmed").css("opacity", "0.5");
	$("#pubmedlink").attr("href", "http://www.ncbi.nlm.nih.gov/pubmed/?term="+query);
	
	$.get("http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi", { db: "pubmed", term: query } ).done(function(data)
	{
		var json = $.xml2json(data);
		var queryTranslation = json["QueryTranslation"];
		var count = json["Count"];

		$("#queryTranslation").text(queryTranslation);
		$("#queryTranslation").css("color", "#1a6f10");
		$("#pubmed").css("display", "block");
		$("#count").text("("+count+" results)");

		var dmp = new diff_match_patch();
		var text1 = query;
		var text2 = queryTranslation;
		dmp.Diff_Timeout = parseFloat(2);
		dmp.Diff_EditCost = parseFloat(4);
		var d = dmp.diff_main(text1, text2);		
		dmp.diff_cleanupEfficiency(d);
		var ds = dmp.diff_prettyHtml(d);
		$('#queryDiff')[0].innerHTML = ds;
		$("#pubmed").css("opacity", "1.0");

	});
}

function parseXML(xml) {
   var dom = null;
   if (window.DOMParser) {
	  try { 
		 dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
	  } 
	  catch (e) { dom = null; }
   }
   else if (window.ActiveXObject) {
	  try {
		 dom = new ActiveXObject('Microsoft.XMLDOM');
		 dom.async = false;
		 if (!dom.loadXML(xml)) // parse error ..

			window.alert(dom.parseError.reason + dom.parseError.srcText);
	  } 
	  catch (e) { dom = null; }
   }
   else
	  alert("cannot parse xml string!");
   return dom;
}

// {
// 	"eSearchResult": {
// 		"Count": "39115",
// 		"RetMax": "20",
// 		"RetStart": "0",
// 		"IdList": {
// 			"Id": [
// 				"23494929",
// 				"23490170",
// 				"23490169",
// 				"23490164",
// 				"23489703",
// 				"23489499",
// 				"23488913",
// 				"23486197",
// 				"23486196",
// 				"23485846",
// 				"23485038",
// 				"23483257",
// 				"23481670",
// 				"23473900",
// 				"23468471",
// 				"23468288",
// 				"23468232",
// 				"23455885",
// 				"23454152",
// 				"23453681"
// 			]
// 		},
// 		"TranslationSet": {
// 			"Translation": {
// 				"From": "penis",
// 				"To": "\"penis\"[MeSH Terms] OR \"penis\"[All Fields]"
// 			}
// 		},
// 		"TranslationStack": {
// 			"TermSet": [
// 				{
// 					"Term": "\"penis\"[MeSH Terms]",
// 					"Field": "MeSH Terms",
// 					"Count": "32736",
// 					"Explode": "Y"
// 				},
// 				{
// 					"Term": "\"penis\"[All Fields]",
// 					"Field": "All Fields",
// 					"Count": "21369",
// 					"Explode": "Y"
// 				}
// 			],
// 			"OP": [
// 				"OR",
// 				"GROUP"
// 			]
// 		},
// 		"QueryTranslation": "\"penis\"[MeSH Terms] OR \"penis\"[All Fields]"
// 	}
// }