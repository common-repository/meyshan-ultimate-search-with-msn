<?php
/*
Plugin Name: Meyshans Ultimate Search King 
Version: 1.2
Plugin URI: http://www.spicyexpress.net/wordpress-plugin-2/
Description: <a href="http://www.meyshan.com">Meyshan</a>  Meyshan's search King, built with Yahoo! UI, Google Suggest-style result display while you type, Google multi search, Yahoo! multi search including images, MSN search, adsense, and google custom search engine,  Snapr link preview, Yahoo! exit result and more and more...
Author: P Dayaparan 
Version: 1.2
Author URI: http://www.spicyexpress.net
*/
// 
/*
******************************************
function: meyshan_search_king_page()

Displays the options in the admin interface of WordPress
******************************************
*/


function meyshan_search_king_page() {

		$options = get_option('meyshan_search_king');
		if ( !is_array($options) ){
			$options = array(
                 'google-api-key' => '',
                 'bubble-link' => '',
                 'coop' => '',
                 'adsense' => '',
                 'adsense-top' => false,
                 'show-bubblevideo' => false,
                 'show-google' => true,
                 'show-yahoo' => true,
                 'show-msn' => true,
                 );}
                 
		if ( $_POST['meyshan-search-king-submit'] ) {
        $options['bubble-link'] = stripslashes($_POST['meyshan-search-king-bubble-link']);
        $options['google-api-key'] = strip_tags(stripslashes($_POST['meyshan-search-king-google-api-key']));
			$options['coop'] = strip_tags(stripslashes($_POST['meyshan-search-king-coop']));
			$options['adsense'] = stripslashes($_POST['meyshan-search-king-adsense']);
			$options['adsense-top'] = $_POST['meyshan-search-king-adsense-top']?true:false;
        $options['show-bubblevideo'] = $_POST['meyshan-search-king-show-bubblevideo']?true:false;
        $options['show-google'] = $_POST['meyshan-search-king-show-google']?true:false;
        $options['show-msn'] = $_POST['meyshan-search-king-show-msn']?true:false;
        $options['show-yahoo'] = $_POST['meyshan-search-king-show-yahoo']?true:false;

			update_option('meyshan_search_king', $options);
                        echo '<div style="background-color: rgb(207, 235, 247);" id="message" class="updated fade"><p><strong>Settings Updated</strong></p></div>';
		}
      ?>
      
<form method="post" style="width:300px;margin:0 auto;">

      <!--
      <p style="text-align:right;"><label for="meyshan-search-king-show-bubblevideo">Show Bubbleguru</label><input id="meyshan-search-king-show-bubblevideo" name="meyshan-search-king-show-bubblevideo" type="checkbox"<?php echo ($options['show-bubblevideo']?' checked="checked"' :'');?>" /><br/>
      <label for="meyshan-search-king-bubble-link">Bubbleguru code</label><br /> <textarea style="width: 200px;" id="meyshan-search-king-bubble-link" name="meyshan-search-king-bubble-link"><?php echo htmlentities($options['bubble-link']);?></textarea>
      </p>
      -->
      <p style="text-align:right;">
         <label for="meyshan-search-king-google-api-key">Google API Key <a href="http://code.google.com/apis/ajaxsearch/signup.html">(?)</a>:</label><br />
         <input style="width: 200px;" id="meyshan-search-king-google-api-key" name="meyshan-search-king-google-api-key" type="text" value="<?php echo $options['google-api-key']; ?>" />
      </p>
      <p style="text-align:right;">
       <label for="meyshan-search-king-show-google">Show Google Tab</label><input id="meyshan-search-king-show-google" name="meyshan-search-king-show-google" type="checkbox"<?php echo ($options['show-google']?' checked="checked"' :'');?>" />
      </p>
      <p style="text-align:right;">
         <label for="meyshan-search-king-show-yahoo">Show Yahoo Tab</label><input id="meyshan-search-king-show-yahoo" name="meyshan-search-king-show-yahoo" type="checkbox"<?php echo ($options['show-yahoo']?' checked="checked"' :'');?>" />
         
      </p>
      <p style="text-align:right;">
         <label for="meyshan-search-king-show-msn">Show MSN Tab</label><input id="meyshan-search-king-show-msn" name="meyshan-search-king-show-msn" type="checkbox"<?php echo ($options['show-msn']?' checked="checked"' :'');?>" />
      </p>
      <p style="text-align:right;">
         <label for="meyshan-search-king-coop">Custom Search Engine URL (optional) <a href="http://google.com/coop/cse/overview">(?)</a>:</label><br />
         <input style="width: 200px;" id="meyshan-search-king-coop" name="meyshan-search-king-coop" type="text" value="<?php echo $options['coop'];?>" />
      </p>
		<p style="text-align:right;">
         <label for="meyshan-search-king-adsense-top">Adsense across top?</label><br />
         <input id="meyshan-search-king-adsense-top" name="meyshan-search-king-adsense-top" type="checkbox"<?php echo ($options['adsense-top']?' checked="checked"' :'');?>" />
      </p>
		    <p style="text-align:right;">
          <label for="meyshan-search-king-adsense">Adsense code (optional) <a href="http://google.com/adsense/">(?)</a>:</label><br /> <textarea style="width: 200px;" id="meyshan-search-king-adsense" name="meyshan-search-king-adsense"><?php echo htmlentities($options['adsense']);?></textarea>
      </p>
		<p style="text-align:right;">
         <input type="submit" id="meyshan-search-king-submit" name="meyshan-search-king-submit" value="Submit" />
      </p>
</form>
      
      <?php

}//end function meyshan_search_king_page

/*
******************************************
function: meyshan_search_king_tab()

Adds the Meyshan Search King to WordPress admin options menu
******************************************
*/


function meyshan_search_king_tab($s) {
   add_submenu_page('options-general.php', 'Meyshan Search', 'Meyshan Search', 1, __FILE__, 'meyshan_search_king_page');
   return $s;
}//end function meyshan_search_king_tab

add_action('admin_menu', 'meyshan_search_king_tab');

/*
******************************************
function: meyshan_search_king_form()

Inner content of the floating search dialog.
******************************************
*/


function meyshan_search_king_form() {
   $options = get_option('meyshan_search_king');
   //code for the outer frame;

   echo '<div id="meyshan-search-king-dialog" style="visibility:hidden;position:absolute;top:0px;"> <div class="ydlg-hd">Search Results</div>';
   echo '<div class="ydlg-bd">';
   
   // the adsense box.
   
   echo '<div class="meyshan-search-king-adsense"><div>'.$options['adsense'].'</div></div>';
   
   // Code for the "this blog" tab

   echo '<div class="ydlg-tab" title="This Blog">';
   echo '<div class="inner-tab">';
   //echo '<div class="meyshan-search-king-adsense">'.$options['adsense'].'</div>';
   echo '<div id="meyshan-search-king-blog-menu"></div>';
   echo '<div id="meyshan-search-king-blog"></div>';
   echo '<div id="meyshan-search-king-comments" style="display:none;"></div>';
   echo '<div id="meyshan-search-king-images" style="display:none;"><h2>Images</h2></div>';
   echo '<div id="meyshan-search-king-google-blog" style="display:none;"><h2>With Google</h2></div>';
   echo '<div id="meyshan-search-king-yahoo-blog" style="display:none;"><h2>With Yahoo</h2></div>';
   echo '<div id="meyshan-search-king-msn-blog" style="display:none;"><h2>With Yahoo</h2></div>';
   echo '</div></div>';

   // Code for the "Google Search" tab
   if ($options['show-google']){
   echo '<div class="ydlg-tab" title="Google">';
   echo '<div class="inner-tab">';
   // echo '<div class="meyshan-search-king-adsense">'.$options['adsense'].'</div>';
   echo '<div id="meyshan-search-king-web"></div>';
   echo '</div></div>';
   }
   // Code for the "Yahoo! Search" tab
   if ($options['show-yahoo']){
   echo '<div class="ydlg-tab" title="Yahoo">';
   echo '<div class="inner-tab">';
   
   echo '<div id="meyshan-search-king-yahoo-menu"><i>Loading...</i></div>';
   echo '<div id="meyshan-search-king-yahoo" style=""></div>';
   echo '<div id="meyshan-search-king-yahoo-video" style="display:none;"></div>';
   echo '<div id="meyshan-search-king-yahoo-news" style="display:none;"></div>';
   echo '<div id="meyshan-search-king-yahoo-local" style="display:none;"></div>';
   echo '<div id="meyshan-search-king-yahoo-images" style="display:none;"></div>';
   
   echo '</div></div>';
   }
   
   //msn search tab
   if ($options['show-msn']){
   echo '<div class="ydlg-tab" title="MSN">';
   echo '<div class="inner-tab">';
   // echo '<div class="meyshan-search-king-adsense" style="display:block; border:1px #f00 solid;">I\'m telling you where is this stuff? It\'s like it\'s disappeared into the abyss!!'.$options['adsense'].'</div>';
   echo '<div id="meyshan-search-king-msn-menu"><i>Loading...</i></div>';
   
   echo '<div id="meyshan-search-king-msn" style="float: left;"></div>';
   echo '<div id="meyshan-search-king-msn-news" style="float: left;display:none;"></div>';
   echo '<div id="meyshan-search-king-msn-images" style="float: left;display:none;"></div>';
   echo '<div id="meyshan-search-king-msn-map" style="float: left;display:none;"><div id="mskMap" style="position:relative; width:500px; height:300px;"></div></div>';
   
   echo '</div></div>';
   }
   // end the outer frame

   echo '</div>';
   echo '</div>';

   echo $form;
}//end function meyshan_search_king_form
add_action('get_footer','meyshan_search_king_form');

/*
******************************************
function: meyshan_search_king_head()

use: outputs Header information for Meyshan Search King wordpress plugin
command after function hooks to wordpress.
******************************************
*/

function meyshan_search_king_head() {
   $options = get_option('meyshan_search_king');
   $wpurl = get_bloginfo('wpurl'); // get once to reduce requests
   
   
?>
    <!-- YUI includes -->
 	<script type="text/javascript" src="http://yui.yahooapis.com/2.2.0/build/yahoo-dom-event/yahoo-dom-event.js"></script>
	<script type="text/javascript" src="http://yui.yahooapis.com/2.2.0/build/connection/connection-min.js"></script>
    <script type="text/javascript" src="http://yui.yahooapis.com/2.2.0/build/animation/animation-min.js"></script>
	<script type="text/javascript" src="http://yui.yahooapis.com/2.2.0/build/autocomplete/autocomplete-min.js"></script>
    <script type="text/javascript" src="<?php echo $wpurl;  ?>/wp-content/plugins/meyshan-search-king/yui-ext.js"></script>
    <!-- YUI styles -->
    <link href="<?php echo $wpurl; ?>/wp-content/plugins/meyshan-search-king/styles.css" type="text/css" rel="stylesheet"/>
    <!-- meyshan script & styles-->
    <link href="<?php echo $wpurl; ?>/wp-content/plugins/meyshan-search-king/meyshan-search-king.css" type="text/css" rel="stylesheet"/>
    <script type="text/javascript" src="<?php echo $wpurl;  ?>/wp-content/plugins/meyshan-search-king/form.js"></script>
    <script type="text/javascript" src="<?php echo $wpurl;  ?>/wp-content/plugins/meyshan-search-king/yui-ext.js"></script>
    <!-- google css & js -->
    <link href="http://www.google.com/uds/css/gsearch.css" type="text/css" rel="stylesheet"/>
    <script src="http://www.google.com/uds/api?file=uds.js&amp;v=1.0&amp;key=<?php echo $options['google-api-key']; ?>" type="text/javascript"></script>
    <?php if($options['show-msn'])   {  ?>
    <!-- live maps -->
         <script src="http://dev.virtualearth.net/mapcontrol/v4/mapcontrol.js" type="text/javascript"></script>
     
       <script language="JavaScript" type="text/javascript">
         var mskmap = null;
         
         function GetMap()
         {
            mskmap = new VEMap('mskMap');
            mskmap.LoadMap();
            mskmap.AttachEvent('onclick', onMapClick);
         }   
         function onMapClick(e)
         {
            mskmap.SetCenter(e.view.LatLong);
         }
      </script>
     <?php } ?>
<?php
     // script adds autocomplete function
   echo '<script type="text/javascript">'."\n";
   // these variables turn on and off the code to fill in the optional search tabs
   echo 'var yahoo_api_key = \''.$options['yahoo-api-key']."';\n";
   echo 'var show_yahoo = \''.$options['show-yahoo']."';\n";
   echo 'var show_google = \''.$options['show-google']."';\n";
   echo 'var show_msn = \''.$options['show-msn']."';\n";
   echo 'var msk_blog_url = \''.get_bloginfo('wpurl')."';\n";
   
   
   echo 'var meyshan_search_king_loaded = false;'."\n";
   echo ' function meyshan_search_king_autocomplete_activate() {'."\n";
   echo ' meyshan_search_king_loaded = true;'."\n";
   echo ' var adiv = document.createElement("div");'."\n";
   echo ' adiv.id = "meyshan-search-king-autocomplete";'."\n";
   echo ' adiv.className = "meyshan-search-king-autocomplete";'."\n";
   echo ' document.getElementById("s").parentNode.appendChild(adiv);'."\n";
   echo ' document.getElementById("s").form.onsubmit = function() {meyshan_search_king_go(this.s.value,'."'".htmlentities($wpurl)."/wp-content/plugins/meyshan-search-king/', '".htmlentities(get_bloginfo('home'))."','".$options['coop']."');return false;};\n";
   echo ' var myDataSource = new YAHOO.widget.DS_XHR("'.$wpurl.'/wp-content/plugins/meyshan-search-king/searchJSON.php", ["items","d"]);'."\n";
   echo ' var myAutoComplete = new YAHOO.widget.AutoComplete("s","meyshan-search-king-autocomplete", myDataSource);'."\n";
   echo ' myAutoComplete.formatResult = function(oResultItem, sQuery) { return oResultItem[0]; };'."\n";
   echo ' }'."\n";
   echo ' function meyshan_search_king_autocomplete() {} addLoadEvent(meyshan_search_king_autocomplete_activate);'."\n";
   echo "</script>\n";

}//end function meyshan_search_king_head

add_action('wp_head','meyshan_search_king_head');

$meyshan_search_king_ie7done = false;

function meyshan_search_king_ie7hack($content) {
   global $meyshan_search_king_ie7done;
   if($meyshan_search_king_ie7done) return $content;
   $meyshan_search_king_ie7done = true;
   echo '<script type="text/javascript"> ';
   echo ' addLoadEvent(meyshan_search_king_autocomplete_activate); ';
   echo ' </script>';
   return $content;
}//end function meyshan_search_king_ie7hack
add_filter('the_content','meyshan_search_king_ie7hack');


?>
