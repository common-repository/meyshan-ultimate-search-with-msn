<?php
/*******************************************************************************
           Meyshan Search King BubbleGuru ajax helper 
           
           Copyright: P. Dayaparan
           Author: Samuel Thurston
           License:  GPL

This file simply spits out the bubbleguru code pasted to the options interface.
It should be called by a transaction in function meyshan_search_king_go() from
the file form.js
*******************************************************************************/
require(dirname(__FILE__).'/../../../wp-blog-header.php'); 
$options = get_option('meyshan_search_king');
echo $options['bubble-link'];
?>
