/*
	Set the globals, we'll need this for later if we need to access the calendar
*/
var SchedulePostsCalendar = null;

/*
	This function returns the index of specific JavaScript file we're looking for.
	
	name = the file name of the script to look for
*/
function GetScriptIndex(name)
{
	// Loop through all the scripts in the current document to find the one we want.
	for( i = 0; i < document.scripts.length; i++) 
		{
		// Make a temporary copy of the URI and find out where the query string starts.
		var tmp_src = String(document.scripts[i].src);
		var qs_index = tmp_src.indexOf('?');

		// Check if the script is the script we are looking for and if it has a QS, if so return the current index.
		if( tmp_src.indexOf(name) >= 0 && qs_index >= 0)
			{
			return i;
			}
		}
		
	return -1;
}

/*
	This function returns the value of a variable passed on the URI of a JavaScript file.
*/
function GetScriptVariable(index, name, vardef)
{
	// If a negative index has been passed in it's because we didn't find any matching script with a query
	// string, so just return the default value.
	if( index < 0 )
		{
		return vardef;
		}

	// Make a temporary copy of the URI and find out where the query string starts.
	var tmp_src = String(document.scripts[index].src);
	var qs_index = tmp_src.indexOf('?');

	// Split the query string in to var/value pairs.  ie: 'var1=value1', 'var2=value2', ...
	var params_raw = tmp_src.substr(qs_index + 1).split('&');

	// Now look for the one we want.
	for( j = 0; j < params_raw.length; j++)
		{
		// Split names from the values.
		var pp_raw = params_raw[j].split('=');

		// If this is the one we're looking for, simply return it.
		if( pp_raw[0] == name )
			{
			// Check to make sure a value was actually passed in, otherwise we should return the default later on.
			if( typeof(pp_raw[1]) != 'undefined' )
				{
				return pp_raw[1];
				}
			}
		}

	// If we fell through the loop and didn't find ANY matching variable, simply return the default value.
	return vardef;
}

/*
	This function will reset the calendar to today.

	id = the WordPress post/page id to cancel
*/
function schedule_posts_calendar_today()
	{
	var currentDate = new Date();

	SchedulePostsCalendar.setDate(currentDate);

	var sDay = new String(currentDate.getDate());
	var sMon = new String(currentDate.getMonth());
	var sYear = new String(currentDate.getFullYear());
	var sHour = new String(currentDate.getHours());
	var sMin = new String(currentDate.getMinutes());

	var dateString = '';
	if( sDay.length < 2 ) { sDay = '0' + sDay; }
	dateString += sDay + '/';
	if( sMon.length < 2 ) { sMon = '0' + sMon; }
	dateString += sMon + '/' + sYear + ' ';
	if( sHour.length < 2 ) { sHour = '0' + sHour; }
	dateString += sHour + ':';
	if( sMin.length < 2 ) { sMin = '0' + sMin; }
	dateString += sMin;
	
	document.getElementById('mm').selectedIndex = sMon;
	document.getElementById('jj').value = sDay;
	document.getElementById('aa').value = sYear;
	document.getElementById('hh').value = sHour;
	document.getElementById('mn').value = sMin;
	
	document.getElementById('calendarHere').value = dateString;
	}
	
/*
	This function adds the JavaScript calendar to the html elements on the post/pages page.
*/
function AddCalendar()
{
	// In the header we let PHP write out a function that uses WordPress' translation function do some work translating the calendar for us, go run the function now so we localize the calendar.
	var langs = SchedulePostsCalenderLang();

	var parent_id;
	var indx;
	// Find the timestampdiv <div> in the current page.
	var parents = [ 'timestampdiv_expire', 'timestampdiv' ];
	
	for (indx in parents) {
		parent_id = parents[indx];
		parent = document.getElementById(parent_id);

		// Clean up the Cancel "button", make it a real button and align it to the right .
		jQuery('.cancel-timestamp').addClass('button').css('margin-left','30px');

		jQuery('.save-timestamp').css('float','left');
		
		// Create the today button.
		todayButton = '<a accesskey="t" href="#" title="' + langs["Today"] + '" class="button-secondary alignleft" onclick="schedule_posts_calendar_today()" style="margin-left:30px">' + langs["Today"] + '</a>';
		
		if (jQuery('[onclick="schedule_posts_calendar_today()"]').length == 0)
			jQuery( todayButton ).insertBefore('.cancel-timestamp');
		
		// If we didn't find the parent, don't bother doing anything else.
		if( parent )
			{
			// Retrive the script options from the URI
			var GSI = GetScriptIndex('schedule-posts-calendar.js');
			var startOfWeek = GetScriptVariable(GSI, 'startofweek', 7);
			var themenumber = GetScriptVariable(GSI, 'theme', '1');
			var popupCalendar = GetScriptVariable(GSI, 'popupcalendar', 0);
			var theme = '';
			var calheight = '230px';
			
			switch( themenumber )
				{
				case '4':
					theme = 'dhx_terrace';
					calheight = '250px';
					break;
				case '3':
					theme = 'dhx_web';
					break;
				case '2':
					theme = 'dhx_skyblue';
					break;
				default:
					theme = 'omega';
					break;
				}

			// Create a new div element and setup it's style and id to be inserted.
			if( popupCalendar == 0 )
				{
				// If we're using the inline calendar, make a div.
				var elmnt = document.createElement("div");
				elmnt.setAttribute('id', 'calendarHere');
				elmnt.setAttribute('style', 'position:relative;height:' + calheight + ';');
				}
			else
				{
				// If we're using a popup calendar, make an input field.
				var elmnt = document.createElement("input");
				elmnt.setAttribute('id', 'calendarHere');
				elmnt.setAttribute('type', 'text');
				}
			
			// Insert the div we just created in to the current page as the first child under 'timestampdiv'. 
			parent.insertBefore(elmnt,parent.firstChild);

			// Get the current date/time from the form.
			if (parent_id == 'timestampdiv') {
			var sDay = new String(document.getElementById('jj').value);
			var sMon = new String(document.getElementById('mm').selectedIndex);
			var sYear = new String(document.getElementById('aa').value);
			var sHour = new String(document.getElementById('hh').value);
			var sMin = new String(document.getElementById('mn').value);
			} else {
				var sDay = new String(document.getElementById('jj_expire').value);
				var sMon = new String(document.getElementById('mm_expire').selectedIndex);
				var sYear = new String(document.getElementById('aa_expire').value);
				var sHour = new String(document.getElementById('hh_expire').value);
				var sMin = new String(document.getElementById('mn_expire').value);
			}
			// Setup a date object to use to set the initial calendar date to display from the values in the WordPress controls.
			var startingDate = new Date();
			startingDate.setDate(sDay);
			startingDate.setMonth(sMon);
			startingDate.setFullYear(sYear);
			startingDate.setHours(sHour);
			startingDate.setMinutes(sMin);

			// If we're replacing the stock WP fields, set the new field's starting date.  Make sure the formatting looks right with 0 padded day/mon/hour/minute fields.
			if( popupCalendar == 1 )
				{
				// The index returned is 0 based but we need it to be 1 based to create the string.
				if (parent_id == 'timestampdiv') {
				sMon = new String(document.getElementById('mm').selectedIndex + 1);
			} else {
				sMon = new String(document.getElementById('mm_expire').selectedIndex + 1);
			}
				
				var dateString = '';
				if( sDay.length < 2 ) { dateString += '0'; }
				dateString += sDay + '/';
				if( sMon.length < 2 ) { dateString += '0'; }
				dateString += sMon + '/' + sYear + ' ';
				if( sHour.length < 2 ) { dateString += '0'; }
				dateString += sHour + ':';
				if( sMin.length < 2 ) { dateString += '0'; }
				dateString += sMin;

				document.getElementById('calendarHere').value = dateString;
				}

			// Finally create the calendar and replace the <div>/<input> we inserted earlier with the proper calendar control.  Also, set the calendar display properties and then finally show the control.
			SchedulePostsCalendar = new dhtmlXCalendarObject("calendarHere");

			// We ALWAYS use the same language and let PHP/WordPress do the work translating the calendar for us above.
			// Note: loadUserLangauge needs to be loaded before the rest of the options are set otherwise it can
			// overwrite some of them.
			SchedulePostsCalendar.loadUserLanguage("wordpress");

			SchedulePostsCalendar.setWeekStartDay(startOfWeek);
			SchedulePostsCalendar.setDate(startingDate);
			SchedulePostsCalendar.setSkin(theme);
			SchedulePostsCalendar.setDateFormat('%d/%m/%Y %H:%i');

			// Only show the calendar if its inline
			if( popupCalendar == 0 ) { SchedulePostsCalendar.show(); }
			
			// We have to attach two events to the calendar to catch when the user clicks on a new date or time.  They both do the exactly same thing, but the first catches the date change and the second the time change.
			if (parent_id == 'timestampdiv') {

				var myEvent = SchedulePostsCalendar.attachEvent("onClick", function (selectedDate){
						document.getElementById('mm').selectedIndex = selectedDate.getMonth();
						document.getElementById('jj').value = selectedDate.getDate();
						document.getElementById('aa').value = selectedDate.getFullYear();
						document.getElementById('hh').value = selectedDate.getHours();
						document.getElementById('mn').value = selectedDate.getMinutes();})
				var myEvent = SchedulePostsCalendar.attachEvent("onChange", function (selectedDate){
						document.getElementById('mm').selectedIndex = selectedDate.getMonth();
						document.getElementById('jj').value = selectedDate.getDate();
						document.getElementById('aa').value = selectedDate.getFullYear();
						document.getElementById('hh').value = selectedDate.getHours();
						document.getElementById('mn').value = selectedDate.getMinutes();})
			} else {
					var myEvent = SchedulePostsCalendar.attachEvent("onClick", function (selectedDate){
						document.getElementById('mm_expire').selectedIndex = selectedDate.getMonth();
						document.getElementById('jj_expire').value = selectedDate.getDate();
						document.getElementById('aa_expire').value = selectedDate.getFullYear();
						document.getElementById('hh_expire').value = selectedDate.getHours();
						document.getElementById('mn_expire').value = selectedDate.getMinutes();})
				var myEvent = SchedulePostsCalendar.attachEvent("onChange", function (selectedDate){
						document.getElementById('mm_expire').selectedIndex = selectedDate.getMonth();
						document.getElementById('jj_expire').value = selectedDate.getDate();
						document.getElementById('aa_expire').value = selectedDate.getFullYear();
						document.getElementById('hh_expire').value = selectedDate.getHours();
						document.getElementById('mn_expire').value = selectedDate.getMinutes();})
			}
		}
	}
}

// Use an event listerner to add the calendar on a page load instead of .OnLoad as we might otherwise get overwritten by another plugin.
window.addEventListener ? window.addEventListener("load",AddCalendar,false) : window.attachEvent && window.attachEvent("onload",AddCalendar);