<?php
// original line:
// if ($_GET['query']) $_GET['s'] = $_GET['query']; 
if(isset($_GET['query'])){$_GET['s'] = $_GET['query'];}

$posts_per_page = 10; 
global $table_prefix;
require(dirname(__FILE__).'/../../../wp-blog-header.php');
header('Content-type: text/javascript;');


if(isset($_REQUEST['comments']))
   $posts = $wpdb->get_results("SELECT * FROM ".$wpdb->comments." WHERE (comment_content LIKE '%".addslashes($_GET['s'])."%')");
if(count($posts) <= 0)
   $posts = $wpdb->get_results("SELECT * FROM ".$wpdb->posts." WHERE (post_content LIKE '%".addslashes($_GET['s'])."%')");

	if (count($posts) > 0) {
		echo $_REQUEST['callback'].'({"items":[';
		foreach ($posts as $post) { 
                   if($post->comment_post_ID) $post->ID = $post->comment_post_ID;
                   if($post->comment_author) $post->post_title = $post->comment_author;
                   if($post->comment_content) $post->post_content = $post->comment_content;
			start_wp(); ?>
{"u":"<?php echo get_permalink(); if($post->comment_ID) echo '#comment-'.$post->comment_ID; ?>","d":"<?php echo addslashes(get_the_title()); ?>","n":"<?php echo str_replace("\n",'\n',str_replace("\r",'',addslashes(substr(strip_tags(get_the_content()),0,200)))); ?>..."}, <?php 
		} 
		echo ']})';
	} else {
		echo $_REQUEST['callback'].'({"items":[]})';
	}
?>