<?php
// if not called from WordPress exit
if ( !defined( 'WP_UNINSTALL_PLUGIN' ) ) 
    exit();

// Remove all the settings from WordPress
delete_option( 'schedule_posts_calendar' );
?>
