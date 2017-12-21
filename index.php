<?php
/*
Plugin Name: React Reviews
Plugin URI: http://www.11online.us
Description: Review Plugin using React and the WP API
Version: 1.0
Revision Date: December 21, 2017
License: GNU General Public License 3.0 (GPL) http://www.gnu.org/licenses/gpl.html
Author: Eric Debelak
Author URI: http://www.11online.us
*/

// add our content filter
add_filter('the_content','add_react_reviews_to_posts');

function add_react_reviews_to_posts($content) {

	// if this is a post, but not the blog page
	if(is_single() && !is_home()) {
		// add our content, a div with id of root for our react script
		$content .= "<div id='root'></div>";

		// enqueue our build script
		wp_enqueue_script( 'react_script', plugin_dir_url( __FILE__ ) . 'wp-plugin/build/static/js/main.313d7fd1.js' );
	}

	return $content;
}