/*******************************************************************************
                   Meyshan Search King
                    Wordpress Plugin
                                                                                
Author: P. Dayaparan
Reformatted and some original code by Samuel Thurston
Copyright: P. Dayaparan 2007
License: GPL

********************************************************************************/
var meyshan_search_king_dialog = false;
var meyshan_search_king_dialog_iframe = false;
var meyshan_search_king_query = '';
var meyshan_search_king_scripturl = '';
var meyshan_search_king_siteurl = '';
var meyshan_search_king_coop = '';
var bubbleImagePath = 'bg.png';

// general execution

if( document.all && !document.getElementsByTagName )
  document.getElementsByTagName = function( nodeName )
  {
    if( nodeName == '*' ) return document.all;
    var result = [], rightName = new RegExp( nodeName, 'i' ), i;
    for( i=0; i<document.all.length; i++ )
      if( rightName.test( document.all[i].nodeName ) )
 result.push( document.all[i] );
    return result;
  };
document.getElementsByClassName = function( className, nodeName )
{
  var result = [], tag = nodeName||'*', node, seek, i;
  var rightClass = new RegExp( '(^| )'+ className +'( |$)' );
  seek = document.getElementsByTagName( tag );
  for( i=0; i<seek.length; i++ )
    if( rightClass.test( (node = seek[i]).className ) )
      result.push( seek[i] );
  return result;
};

// callback object for yahoo ui bubbleguru video call  -- this is not in use at the moment.

	var callback = 
	{ 
    //
	  success: function(o) {document.getElementById('meyshan-search-king-bubble').innerHTML = o.responseText}, 
	  failure: function(o) {alert('could not download video')}
	} 
    
    

/*******************************************************************************
  function: addLoadEvent(func);
  use: attachJSON creates a script element and attaches the json object to the document.
  returns: n/a
*******************************************************************************/

//adds an onload event to the current page
function addLoadEvent(func) {
         var oldonload = window.onload;
         if (typeof window.onload != 'function') {
            window.onload = function() {func();};
         } else {
            window.onload = function() {
               oldonload();
               func();
            }
         }//end if
}//end function addLoadEvent


/*******************************************************************************
  function: meyshan_search_king_attachJSON(jsonURL);
  use: attachJSON creates a script element and attaches the json object to the document.
  returns: n/a
*******************************************************************************/
function meyshan_search_king_attachJSON(jsonUrl){
         var script = document.createElement('script');
         script.type = 'text/javascript';
         script.src = jsonUrl;
         document.body.appendChild(script);
}

/*******************************************************************************
  function: meyshan_search_king_go(query,scripturl,siteurl,coop);
  use: This function is attached to the search button in meyshan-search-king.php
       by meyshan_search_king_head function.
  returns: n/a
*******************************************************************************/
function meyshan_search_king_go(query,scripturl,siteurl,coop) {

         var yahoo_api_key = '7F5ZDfnV34HfYKJDjEMxvXLwgQOlAQkmYiv3Ez.Tap62E7lSnL0SHxL2mJuNCK.KS6Rs';
         var domain = siteurl.split('/');
         domain = domain[2];
         document.getElementById('meyshan-search-king-autocomplete').innerHTML = '<i>Loading...</i>';
         
         
         // Blog search & comment search tab
         meyshan_search_king_attachJSON(scripturl+'searchJSON.php?s='+encodeURIComponent(query)+'&callback=meyshan_search_king_callback');
         meyshan_search_king_attachJSON(scripturl+'searchJSON.php?s='+encodeURIComponent(query)+'&comments&callback=meyshan_search_king_comments');
         // msn blog search
         meyshan_search_king_attachJSON(scripturl+'msn.php?s=site%3A+'+encodeURIComponent(msk_blog_url)+'+'+encodeURIComponent(query)+'&callback=meyshan_search_king_msn_blog');
         
         
         // yahoo search tab
         if (show_yahoo){
             meyshan_search_king_attachJSON('http://search.yahooapis.com/ImageSearchService/V1/imageSearch?appid='+yahoo_api_key+'&query='+encodeURIComponent(query)+'&output=json&callback=meyshan_search_king_images&site='+encodeURIComponent(domain));
             meyshan_search_king_attachJSON('http://search.yahooapis.com/WebSearchService/V1/webSearch?appid='+yahoo_api_key+'&query='+encodeURIComponent(query)+'&output=json&callback=meyshan_search_king_yahoo_search_blog&site='+encodeURIComponent(domain));
             meyshan_search_king_attachJSON('http://search.yahooapis.com/WebSearchService/V1/webSearch?appid='+yahoo_api_key+'&query='+encodeURIComponent(query)+'&output=json&callback=meyshan_search_king_yahoo_search');
             meyshan_search_king_attachJSON('http://search.yahooapis.com/VideoSearchService/V1/videoSearch?appid='+yahoo_api_key+'&query='+encodeURIComponent(query)+'&output=json&callback=meyshan_search_king_yahoo_video');
             meyshan_search_king_attachJSON('http://search.yahooapis.com/NewsSearchService/V1/newsSearch?appid='+yahoo_api_key+'&query='+encodeURIComponent(query)+'&output=json&callback=meyshan_search_king_yahoo_news');
             meyshan_search_king_attachJSON('http://search.yahooapis.com/ImageSearchService/V1/imageSearch?appid='+yahoo_api_key+'&query='+encodeURIComponent(query)+'&output=json&callback=meyshan_search_king_yahoo_images');
         }
         // msn search tab
         if (show_msn){
             meyshan_search_king_attachJSON(scripturl+'msn.php?s='+encodeURIComponent(query)+'&callback=meyshan_search_king_msn');
             meyshan_search_king_attachJSON(scripturl+'msn_news.php?s='+encodeURIComponent(query)+'&callback=meyshan_search_king_msn_news');
             meyshan_search_king_attachJSON(scripturl+'msn_images.php?s='+encodeURIComponent(query)+'&callback=meyshan_search_king_msn_images');
             GetMap();
         }
         
         meyshan_search_king_query = query;
         meyshan_search_king_scripturl = scripturl;
         meyshan_search_king_siteurl = siteurl;
         meyshan_search_king_coop = unescape(coop).split('/').reverse()[0].split('?').reverse()[0].split('=')[1];
         bubbleImagePath = scripturl + 'bg.png';
}//end function meyshan_search_king_go

/*******************************************************************************
function: meyshan_search_king_yahoo_super(ajson)
use: used inside yahoo json search request callbacks
returns: result string of links.
*******************************************************************************/

function meyshan_search_king_yahoo_super(ajson) {
   var txt = '';
 if(ajson && ajson.ResultSet && ajson.ResultSet.Result.length > 0) {
  txt += '<ul>';
  for(var i in ajson.ResultSet.Result) {
     if(typeof(ajson.ResultSet.Result[i].Title) == 'undefined') continue;
     txt += ' <li><a class="previewlink" target="meyshan-search-king-yahoo-result" href="'+ajson.ResultSet.Result[i].Url+'" title="'+ajson.ResultSet.Result[i].Title+'">'+ajson.ResultSet.Result[i].Title+'<\/a> <br\/> '+ajson.ResultSet.Result[i].Summary+' <\/li> ';
  }//end for ... in
  if(!ajson || ajson.ResultSet.Result.length < 1)
     txt += '<li>No Results<\/li>';
  txt += '<\/ul>';
 } else txt += 'No Results';
 return txt;
}//end function meyshan_search_king_super

/*******************************************************************************
function: meyshan_search_king_images_super(ajson)
use: used inside json image search callbacks
returns: result string of links.
*******************************************************************************/

function meyshan_search_king_images_super(ajson,theid) {
  var txt = '<h2>Images</h2>';
 if(ajson && ajson.ResultSet) {
  txt += '<ul style="list-style-type:none;">';
  for(var i in ajson.ResultSet.Result){
     if (ajson.ResultSet.Result[i].Thumbnail){  // missing thumbnail urls were causing errors.
        if (typeof(ajson.ResultSet.Result[i].Thumbnail.Url)) continue;
        txt += ' <li style="display:inline;padding:5px;"><a target="meyshan-search-king-iframe" href="'+ajson.ResultSet.Result[i].Url+'" title="'+ajson.ResultSet.Result[i].Title+'"><img src="'+ajson.ResultSet.Result[i].Thumbnail.Url+'" alt="'+ajson.ResultSet.Result[i].Title+'" /><\/a><\/li> ';
     }
  }
  if(!ajson || ajson.ResultSet.Result < 1)
     txt += '<li>No Results<\/li>';
  txt += '<\/ul>';
 } else txt += 'No Results';
  document.getElementById(theid).innerHTML = txt;
}//end function meyshan_search_king_images_super

/*******************************************************************************

function: meyshan_search_king_process() 
use: calls google ajax search function and applies autocomplete to google's 
     search box.

*******************************************************************************/
function meyshan_search_king_process() {
   var gfrm = document.getElementsByClassName('gsc-input','input');
   var div = document.createElement('div');
   div.id = 'meyshan-search-king-google-autocomplete';
   div.className = 'meyshan-search-king-autocomplete';
   gfrm[0].parentNode.appendChild(div);
   gfrm[0].id = 'meyshan-search-king-google-s';
   gfrm[0].autocomplete = 'on';
   gfrm[0].setAttribute('autocomplete','on');
   var myDataSource = new YAHOO.widget.DS_XHR(meyshan_search_king_scripturl+'searchJSON.php', ["items","d"]);
   var myAutoComplete = new YAHOO.widget.AutoComplete("meyshan-search-king-google-s","meyshan-search-king-google-autocomplete", myDataSource);
   myAutoComplete.formatResult = function(oResultItem, sQuery) { return oResultItem[0]; };
   var links = document.getElementsByClassName('gs-title','a');
   for(var i in links) {
      links[i].target = 'meyshan-search-king-iframe';
      links[i].onclick = meyshan_search_king_iframe;
      links[i].className += ' previewlink';
   }//end for var i in links
   var links = document.getElementsByClassName('gsc-trailing-more-results','a');
   for(var i in links) {
      links[i].target = 'meyshan-search-king-iframe';
      links[i].onclick = meyshan_search_king_iframe;
      links[i].className += ' previewlink';
   }//end for var i in links
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = meyshan_search_king_scripturl + '/previewbubble.js';
   document.body.appendChild(script);
   document.getElementById('meyshan-search-king-autocomplete').innerHTML = '';
}//end function meyshan_search_king_process



// this function is now deprecated
function meyshan_search_king_iframe() {
   if(typeof(innerWidth) == 'undefined') var innerWidth = '900';
   if(typeof(innerHeight) == 'undefined') var innerHeight = '550';
   document.getElementById('meyshan-search-king-iframe').style.width = (innerWidth-135)+'px';
   document.getElementById('meyshan-search-king-iframe').style.height = (innerHeight-150)+'px';
   if(!meyshan_search_king_dialog_iframe)
      meyshan_search_king_dialog_iframe = new YAHOO.ext.BasicDialog( 'meyshan-search-king-iframe-dialog', {modal: true,  width: innerWidth - 100,  height: innerHeight - 100,  shadow: true, autoScroll: false} );
   meyshan_search_king_dialog_iframe.show();
}//end function meyshan_search_king_iframe

/*******************************************************************************
        
        The functions below are callbacks for ajax search requests
        found in meyshan_search_king_go()                                                                        

*******************************************************************************/

function meyshan_search_king_yahoo_search(ajson) {
   var txt = '<h2>Web Search</h2>';
   txt += meyshan_search_king_yahoo_super(ajson);
   document.getElementById('meyshan-search-king-yahoo').innerHTML = txt;
}//end function meyshan_search_king_yahoo_search

function meyshan_search_king_yahoo_search_blog(ajson) {
   var txt = '<h2>With Yahoo</h2>';
   txt += meyshan_search_king_yahoo_super(ajson);
   document.getElementById('meyshan-search-king-yahoo-blog').innerHTML = txt;
}//end function meyshan_search_king_yahoo_search_blog

function meyshan_search_king_yahoo_video(ajson) {
   var txt = '<h2>Videos</h2>';
   txt += meyshan_search_king_yahoo_super(ajson);
   document.getElementById('meyshan-search-king-yahoo-video').innerHTML = txt;
}//end function meyshan_search_king_yahoo_video

function meyshan_search_king_yahoo_news(ajson) {
   var txt = '<h2>News</h2>';
   txt += meyshan_search_king_yahoo_super(ajson);
   document.getElementById('meyshan-search-king-yahoo-news').innerHTML = txt;
}//end function meyshan_search_king_yahoo_news

function meyshan_search_king_yahoo_local(ajson) {
   var txt = '<h2>Local</h2>';
   txt += meyshan_search_king_yahoo_super(ajson);
   document.getElementById('meyshan-search-king-yahoo-local').innerHTML = txt;
}//end function meyshan_search_king_yahoo_local

function meyshan_search_king_yahoo_images(ajson) {
   var txt = '<form onsubmit="return meyshan_search_king_requery(getElementById(\'meyshan-search-king-dialog-s2\').value);">'+'<input type="text" value="'+meyshan_search_king_query+'" id="meyshan-search-king-dialog-s2" name="s" \/> <div id="meyshan-search-king-dialog-autocomplete2" class="meyshan-search-king-autocomplete"><\/div> '+'<input type="submit" value="Search" \/>'+'<\/form><br \/>';
   txt += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-yahoo\').style.display = 'block'; document.getElementById(\'meyshan-search-king-yahoo-video\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-news\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-local\').style.display = 'none'; return false;\">Web</a> | ";
   txt += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-yahoo\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-video\').style.display = 'block'; document.getElementById(\'meyshan-search-king-yahoo-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-news\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-local\').style.display = 'none'; return false;\">Video</a> | ";
   txt += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-yahoo\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-video\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-news\').style.display = 'block'; document.getElementById(\'meyshan-search-king-yahoo-local\').style.display = 'none'; return false;\">News</a> | ";
   txt += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-yahoo\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-video\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-images\').style.display = 'block'; document.getElementById(\'meyshan-search-king-yahoo-news\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-local\').style.display = 'none'; return false;\">Images</a> ";
   document.getElementById('meyshan-search-king-yahoo-menu').innerHTML = txt;
   meyshan_search_king_images_super(ajson,'meyshan-search-king-yahoo-images');
   var myDataSource = new YAHOO.widget.DS_XHR(meyshan_search_king_scripturl+'searchJSON.php', ["items","d"]);
   var myAutoComplete = new YAHOO.widget.AutoComplete("meyshan-search-king-dialog-s2","meyshan-search-king-dialog-autocomplete2", myDataSource);
   myAutoComplete.formatResult = function(oResultItem, sQuery) { return oResultItem[0]; };
}//end function meyshan_search_king_yahoo_images

function meyshan_search_king_images(ajson) {
   meyshan_search_king_images_super(ajson,'meyshan-search-king-images');
}//end function meyshan_search_king_images

function meyshan_search_king_comments(ajson) {
  var txt = '<h2>Comments</h2>';
  txt += '<ul>';
 if(ajson && ajson.items && ajson.items.length > 0) {
  for(var i in ajson.items) {
   if(ajson.items[i].u)
     txt += '<li><a class="previewlink" href="'+ajson.items[i].u+'" title="'+ajson.items[i].n+'">'+ajson.items[i].d+'<\/a><br \/>'+ajson.items[i].n+'<\/li>';
  }
 }//end if ajson
  if(!ajson || ajson.items.length < 1)
     txt += '<li>No Results<\/li>';
  txt += '<\/ul>';
  document.getElementById('meyshan-search-king-comments').innerHTML = txt;
}//end function meyshan_search_king_comments

function meyshan_search_king_callback(ajson) {
  var txt = '<form>'+'<input type="text" value="'+meyshan_search_king_query+'" id="meyshan-search-king-dialog-s" name="s" \/> <div id="meyshan-search-king-dialog-autocomplete" class="meyshan-search-king-autocomplete"><\/div> '+'<input type="submit" value="Search" onclick="return meyshan_search_king_requery(getElementById(\'meyshan-search-king-dialog-s\').value);"\/>'+'<\/form><br \/>';
  txt += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-blog\').style.display = 'block'; document.getElementById(\'meyshan-search-king-comments\').style.display = 'none'; document.getElementById(\'meyshan-search-king-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-google-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-blog\').style.display = 'none'; return false;\">Posts</a> | ";
  txt += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-comments\').style.display = 'block'; document.getElementById(\'meyshan-search-king-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-google-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-blog\').style.display = 'none'; return false;\">Comments</a> | ";
  txt += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-comments\').style.display = 'none'; document.getElementById(\'meyshan-search-king-images\').style.display = 'block'; document.getElementById(\'meyshan-search-king-google-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-blog\').style.display = 'none'; return false;\">Images</a> | ";
  txt += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-comments\').style.display = 'none'; document.getElementById(\'meyshan-search-king-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-google-blog\').style.display = 'block'; document.getElementById(\'meyshan-search-king-yahoo-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-blog\').style.display = 'none'; return false;\">With Google</a> | ";
  txt += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-comments\').style.display = 'none'; document.getElementById(\'meyshan-search-king-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-google-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-blog\').style.display = 'block'; document.getElementById(\'meyshan-search-king-msn-blog\').style.display = 'none'; return false;\">With Yahoo</a> | ";
  txt += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-comments\').style.display = 'none'; document.getElementById(\'meyshan-search-king-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-google-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-yahoo-blog\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-blog\').style.display = 'block'; return false;\">With MSN</a><br /> ";
  
  
  document.getElementById('meyshan-search-king-blog-menu').innerHTML = txt;
 
  
  txt = '<h2>Posts</h2>';

  txt += '<ul>';
 if(ajson && ajson.items && ajson.items.length > 0) {
  for(var i in ajson.items) {
   if(ajson.items[i].u)
     txt += '<li><a class="previewlink" href="'+ajson.items[i].u+'" title="'+ajson.items[i].n+'">'+ajson.items[i].d+'<\/a><br \/>'+ajson.items[i].n+'<\/li>';
  }//end for i in ajson.items
 }//end if ajson
  if(!ajson || ajson.items.length < 1)
     txt += '<li>No Results<\/li>';
  txt += '<\/ul>';
  document.getElementById('meyshan-search-king-blog').innerHTML = txt;

   var myDataSource = new YAHOO.widget.DS_XHR(meyshan_search_king_scripturl+'searchJSON.php', ["items","d"]);
   var myAutoComplete = new YAHOO.widget.AutoComplete("meyshan-search-king-dialog-s","meyshan-search-king-dialog-autocomplete", myDataSource);
   myAutoComplete.formatResult = function(oResultItem, sQuery) { return oResultItem[0]; };

   var options = new GsearcherOptions();
   options.setExpandMode(GSearchControl.EXPAND_MODE_OPEN);

   var drawOptions = new GdrawOptions();
   drawOptions.setDrawMode(GSearchControl.DRAW_MODE_TABBED);

   var searchControl = new GSearchControl();
   var siteSearch = new GwebSearch();
   searchControl.addSearcher(new GwebSearch(), options);
   if(typeof(meyshan_search_king_coop) != 'undefined' && meyshan_search_king_coop != '') {siteSearch.setSiteRestriction(meyshan_search_king_coop);
                                 siteSearch.setUserDefinedLabel("Custom Search");
                                 searchControl.addSearcher(siteSearch, options);}
   searchControl.addSearcher(new GblogSearch(), options);
   searchControl.addSearcher(new GvideoSearch(), options);
   searchControl.addSearcher(new GnewsSearch(), options);
   searchControl.addSearcher(new GlocalSearch());
   searchControl.draw(document.getElementById('meyshan-search-king-web'), drawOptions);
   searchControl.execute(meyshan_search_king_query);

   searchControl = new GSearchControl();
   siteSearch = new GwebSearch();
   siteSearch.setSiteRestriction(meyshan_search_king_siteurl);
   searchControl.addSearcher(siteSearch, options);
   searchControl.draw(document.getElementById('meyshan-search-king-google-blog'));
   searchControl.execute(meyshan_search_king_query);
   

   if(typeof(innerWidth) == 'undefined') var innerWidth = '900';
   if(typeof(innerHeight) == 'undefined') var innerHeight = '550';
   if(!meyshan_search_king_dialog)
      meyshan_search_king_dialog = new YAHOO.ext.BasicDialog( 'meyshan-search-king-dialog', {modal: true,  width: innerWidth - 100,  height: innerHeight - 100,  shadow: true, autoTabs: true} );
   meyshan_search_king_dialog.show(document.getElementById('s'));

   setTimeout("meyshan_search_king_process();",1500);

}//end function meyshan_search_king_callback
function msnForm(arg){
         var msn_form = '<div><form action="#" mehtod="GET">'
         msn_form += '<input id="msn-q" name="q" type="text" value="'+meyshan_search_king_query+'" size="20">';
         msn_form += '<input type="submit" name="submit" value="Search" onclick="return meyshan_search_king_requery(getElementById(\'msn-q\').value);"></form>';
         
         msn_form += "<br/><a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-msn\').style.display = 'block'; document.getElementById(\'meyshan-search-king-msn-news\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-map\').style.display = 'none';  return false;\">Web</a> | ";
         msn_form += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-msn\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-news\').style.display = 'block'; document.getElementById(\'meyshan-search-king-msn-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-map\').style.display = 'none';  return false;\">News</a> | ";
         msn_form += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-msn\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-news\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-images\').style.display = 'block'; document.getElementById(\'meyshan-search-king-msn-map\').style.display = 'none';  return false;\">Images</a> | ";
         msn_form += "<a href=\"#\" onclick=\"document.getElementById(\'meyshan-search-king-msn\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-news\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-images\').style.display = 'none'; document.getElementById(\'meyshan-search-king-msn-map\').style.display = 'block';  return false;\">Map</a>  </div>";
         
         document.getElementById(arg).innerHTML = msn_form;
}

function meyshan_search_king_msn(ajson){
         msnForm('meyshan-search-king-msn-menu');

         var txt = '<h2><a href="http://search.msn.com/developer">Powered by MSN Search</a></h2>';
         txt += '<ul>';
         if(ajson && ajson.items && ajson.items.length > 0) {
                  for(var i in ajson.items) {
                          if(ajson.items[i].u)
                          txt += '<li><a class="previewlink" href="'+ajson.items[i].u+'" title="'+ajson.items[i].n+'">'+ajson.items[i].p+'<\/a><br \/>'+ajson.items[i].n+'<\/li>';
                  }
         }else{
               txt += '<li>No Results<\/li>';
               txt += '<\/ul>';
         }
         document.getElementById('meyshan-search-king-msn').innerHTML = txt;
}

function meyshan_search_king_msn_news(ajson){

         var txt = '<h2>MSN News Results</h2>';
         txt += '<ul>';
         if(ajson && ajson.items && ajson.items.length > 0) {
                  for(var i in ajson.items) {
                          if(ajson.items[i].u)
                          txt += '<li><a class="previewlink" href="'+ajson.items[i].u+'" title="'+ajson.items[i].n+'">'+ajson.items[i].p+'<\/a><br \/>'+ajson.items[i].n+'<\/li>';
                  }
         }else{
               txt += '<li>No Results<\/li>';
               txt += '<\/ul>';
         }
         document.getElementById('meyshan-search-king-msn-news').innerHTML = txt;
}

function meyshan_search_king_msn_images(ajson){


         var txt = '<h2>MSN Image Results</h2>';
         txt += '<ul>';
         if(ajson && ajson.items && ajson.items.length > 0) {
                  for(var i in ajson.items) {
                          if(ajson.items[i].u)
                          txt += '<li><a class="previewlink" href="'+ajson.items[i].u+'" title="'+ajson.items[i].n+'">'+ajson.items[i].p+'<\/a><br \/>'+ajson.items[i].n+'<\/li>';
                  }
         }else{
               txt += '<li>No Results<\/li>';
               txt += '<\/ul>';
         }
         document.getElementById('meyshan-search-king-msn-images').innerHTML = txt;
}

function meyshan_search_king_msn_blog(ajson){
         msnForm('meyshan-search-king-msn-menu');

         var txt = '<h2>Blog Results <a href="http://search.msn.com/developer">Powered by MSN Search</a></h2>';
         txt += '<ul>';
         if(ajson && ajson.items && ajson.items.length > 0) {
                  for(var i in ajson.items) {
                          if(ajson.items[i].u)
                          txt += '<li><a class="previewlink" href="'+ajson.items[i].u+'" title="'+ajson.items[i].n+'">'+ajson.items[i].p+'<\/a><br \/>'+ajson.items[i].n+'<\/li>';
                  }
         }else{
               txt += '<li>No Results<\/li>';
               txt += '<\/ul>';
         }
         document.getElementById('meyshan-search-king-msn-blog').innerHTML = txt;
}

function meyshan_search_king_msn_map(ajson){

// if you must do something with the map when called, here's the place.

}
// function meyshan_search_king_go(query,scripturl,siteurl,coop) {
function meyshan_search_king_requery(query){
         meyshan_search_king_query = query;
         meyshan_search_king_go(meyshan_search_king_query,meyshan_search_king_scripturl,meyshan_search_king_siteurl,meyshan_search_king_coop);
         return false;     
}
