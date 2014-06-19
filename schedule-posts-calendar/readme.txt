=== Schedule Posts Calendar ===
Contributors: GregRoss
Plugin URI: http://toolstack.com/schedulepostscalendar
Author URI: http://toolstack.com
Tags: admin posts calendar
Requires at least: 3.0.0
Tested up to: 3.8.0
Stable tag: 4.3

Adds a JavaScript calendar to the scheduled publish widget to allow you to select a date and time graphically instead of via the text entry boxes.

== Description ==

Adds a JavaScript calendar to the scheduled publish widget to allow you to select a date and time graphically instead of via the text entry boxes.

This plugin uses the gpl'd dhtmlxcalendar (http://dhtmlx.com/docs/products/dhtmlxCalendar/index.shtml) for the calendar control.

This code is released under the GPL v2, see license.txt for details.

== Installation ==

1. Extract the archive file into your plugins directory in the schedule-posts-calendar folder.
2. Activate the plugin in the Plugin options.

== Frequently Asked Questions ==

= What browsers are supported? =

Try it and find out, the JavaScript to insert the calendar is pretty standard and has been tested on:

	* IE9 (note, do NOT use compatibility mode)
	* Opera 11.6+
	* FireFox 10+

= Why is the calendar overlapping the other areas? =

If you are using IE in compatibility mode the calendar will overlap other areas, disable compatibility mode.

== Screenshots ==

1. The publish panel with the schedule menu expanded showing the calendar.
2. The publish panel with the schedule menu expanded with the default WordPress date/time fields hidden.
3. The publish panel with the default WP fields hidden and a popup calendar field.
4. The publish panel with the default WP fields hidden and a popup calendar visible.
5. The control panel options.
6. The schedule menu item in the posts/pages list.
7. The schedule mode in the posts/pages list.

== Changelog ==
= 4.3 =
* Fixed bug with the start of week setting that was being overwritten.

= 4.2 =
* Fixed issue with Tuesday/Thursday translations in the calendar

= 4.1 =
* Fixed bug in translation code, enable/disable logic was inverted
* Fixed bug in preferences code, would not allow you to disable translations

= 4.0 =
* Added language support.

= 3.6 =
* Add 'Today' button to reset the calendar to the current date.

= 3.5 =
* Updated to new dhtmlxcalendar calendar code (version 3.6 build 131108).
* Support new dhtmlxcalendar theme 'Terrace' (now the default for new installs).
* Re-styled Cancel link in the post/page edit, it is now a button aligned to the right.
* Added uninstall routine.
* Tested with WordPress 3.8.

= 3.4 =
* Bug fix on the quick edit theme selection code.

= 3.3 =
* Bug fix on the theme selection code, thanks JochenT.
* Code update to resolve deprecated use of role/responsibilities when adding the admin page, thanks JochenT.

= 3.2 =
* Minor update, in previous versions if you use the quick edit mode and make a change to the scheduled date it would not update the scheduled date in the list. 
* Test up to WordPress 3.4.1.

= 3.1 =
* Minor bug fix, when using the new quick edit mode in the posts/pages changing the date/time would incorrectly set the hour to be the same as the minute.

= 3.0 =
* Major update to include support for a schedule calendar in the posts/pages list.

= 2.1 =
* Minor bug fix that caused the in-line calendar to start one month in the future.

= 2.0 = 
* Created settings page.
* Added options to set the start of the week.
* Added theme option.
* Added option to hide default WordPress date/time fields.
* Added popup option to the calendar instead of the default in-line.

= 1.1 =
* Minor update to reduce the size of the calendar div from 250px to 230px.
* Added FAQ's.

= 1.0 =
* Initial release.

== Upgrade Notice ==
= 4.3 =
None.

== Roadmap ==
* None at this time.

