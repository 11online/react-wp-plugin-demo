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
		// get our post id for the api
		$id = get_the_ID();

		// add our content, a div with id of root for our react script
		$content .= "<div id='root'></div><script>var postId = $id;</script>";

		// enqueue our build script with the wp-api dependency
		wp_enqueue_script( 'react_script', plugin_dir_url( __FILE__ ) . 'wp-plugin/build/static/js/main.fc69b3e1.js' );

	}

	return $content;
}


// add our api add review action
add_action( 'rest_api_init', function () {
	register_rest_route( 'reviews/v1', '/add-review', array(
		'methods' => 'POST',
		'callback' => 'add_review_route'
	) );
} );

function add_review_route($request) {
	if (isset($request['data'])) {
		$user_id = $request['data']['user_id'];
		$post_id = $request['data']['post_id'];
		$review = $request['data']['review'];
		$key = 'review_of_post_' . $post_id;
		update_user_meta($user_id, $key, $review);
	}
	return get_reviews_by_post($post_id);
}

// add our api get reviews action
add_action( 'rest_api_init', function () {
	register_rest_route( 'reviews/v1', '/get-reviews/(?P<id>\d+)', array(
		'methods' => 'GET',
		'callback' => 'get_reviews_by_post_route'
	) );
} );

function get_reviews_by_post_route($data) {
	return get_reviews_by_post($data['id']);
}

// this is our get reviews helper function
function get_reviews_by_post($post_id) {

	$meta_key = 'review_of_post_' . $post_id;

	$users = get_users(
		[
			'meta_key' => $meta_key, 
			'fields' => ['ID', 'user_nicename']
		]
	);

	$userArray = [];
	// I know this isn't efficient, but for our demo it will suffice. In production, you'd want to write a join to get all the data at once.
	foreach($users as $user) {
		$user_meta = get_user_meta ( $user->ID, $meta_key, true);
		$image = get_avatar_url($user->ID, ['size' => 36]);
		$userArray[$user->user_nicename] = ['review' => $user_meta, 'image' => $image];
	}

	return $userArray;
}