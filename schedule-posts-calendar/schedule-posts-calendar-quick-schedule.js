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
	This function adds the JavaScript calendar to the html elements in the quick edit area.
*/
function AddCalendar(sDay, sMon, sYear, sHour, sMin, id)
{
	// Find the timesteampdiv <div> in the current page.
	var parent = document.getElementById('calendarHere-' + id);
	
	// If we didn't find the parent, don't bother doing anything else.
	if( parent )
		{
		// Retrieve the script options from the URI
		var GSI = GetScriptIndex('schedule-posts-calendar-quick-schedule.js');
		var startOfWeek = GetScriptVariable(GSI, 'startofweek', 7);
		var themenumber = GetScriptVariable(GSI, 'theme', 'omega');
		var popupCalendar = GetScriptVariable(GSI, 'popupcalendar', 0);
		var theme = '';

		switch( themenumber )
			{
			case '4':
				theme = 'dhx_terrace';
				parent.style.height = '250px';
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

		// Setup a date object to use to set the initial calendar date to display from the values in the WordPress controls.
		var startingDate = new Date();
		startingDate.setDate(sDay);
		startingDate.setMonth(sMon);
		startingDate.setFullYear(sYear);
		startingDate.setHours(sHour);
		startingDate.setMinutes(sMin);


		// Finally create the calendar and replace the <div>/<input> we inserted earlier with the proper calendar control.  Also, set the calendar display properties and then finally show the control.
		SchedulePostsCalendar = new dhtmlXCalendarObject("calendarHere-" + id);

		// In the header we let PHP write out a function that uses WordPress' translation function do some work translating the calendar for us, go run the function now so we localize the calendar.
		SchedulePostsCalenderLang();

		// We ALWAYS use the same language and let PHP/WordPress do the work translating the calendar for us above.
		// Note: loadUserLangauge needs to be loaded before the rest of the options are set otherwise it can
		// overwrite some of them.
		SchedulePostsCalendar.loadUserLanguage("wordpress");

		SchedulePostsCalendar.setWeekStartDay(startOfWeek);
		SchedulePostsCalendar.setDate(startingDate);
		SchedulePostsCalendar.setSkin(theme);
		SchedulePostsCalendar.setDateFormat('%d/%m/%Y %H:%i');

		SchedulePostsCalendar.show();
				
		// We have to attach two events to the calendar to catch when the user clicks on a new date or time.  They both do the exactly same thing, but the first catches the date change and the second the time change.
		var myEvent = SchedulePostsCalendar.attachEvent("onClick", function (selectedDate){
				document.getElementById('eis_date_value_' + id).value = eis_format_date( selectedDate.getDate(), selectedDate.getMonth()+1, selectedDate.getFullYear(), selectedDate.getHours(), selectedDate.getMinutes() );
				})
		var myEvent = SchedulePostsCalendar.attachEvent("onChange", function (selectedDate){
				document.getElementById('eis_date_value_' + id).value = eis_format_date( selectedDate.getDate(), selectedDate.getMonth()+1, selectedDate.getFullYear(), selectedDate.getHours(), selectedDate.getMinutes() );
				})
	}
}

/*
	This function creates a zero padded date string.
*/
function eis_format_date(sDay, sMon, sYear, sHour, sMin)
	{
	// Format a date to match the calendar format
	var dateString = '';
	if( sDay.toString().length < 2 ) { dateString += '0'; }
	dateString += sDay + '/';
	if( sMon.toString().length < 2 ) { dateString += '0'; }
	dateString += sMon + '/' + sYear + ' ';
	if( sHour.toString().length < 2 ) { dateString += '0'; }
	dateString += sHour + ':';
	if( sMin.toString().length < 2 ) { dateString += '0'; }
	dateString += sMin;
	
	return dateString;
	}
	
/*
	This function handles updating the scheduled date for a given post/page in the list.
	
	id = the WordPress post/page id to update
*/
function schedule_posts_calendar_quick_schedule_update(id)
	{
	// Commit a schedule change to WordPress
	
	// Get our hidden date string and trim it, just in case.
	var new_date_string = document.getElementById('eis_date_value_' + id).value.trim();
	// Split the date from the time.
	var new_date_split = new_date_string.split(' ');
	// Split the date in to its parts.
	var new_date_parts = new_date_split[0].split('/');
	// Split the time in to its parts.
	var new_time_parts = new_date_split[1].split(':');
	
	// Using the id's we assigned to the hidden values that WordPress uses for the quick edit mode
	// assign the new date to the WordPress variables so if the user now clicks on quick edit, the
	// new date will be displayed instead of the old one.
	document.getElementById('eis_month_' + id).innerHTML = new_date_parts[1].trim();
	document.getElementById('eis_day_' + id).innerHTML = new_date_parts[0].trim();
	document.getElementById('eis_year_' + id).innerHTML =  new_date_parts[2].trim();
	document.getElementById('eis_hour_' + id).innerHTML = new_time_parts[0].trim();
	document.getElementById('eis_minute_' + id).innerHTML = new_time_parts[1].trim();

	// jQuery conflicts with the calendar control, so use it in noConflict mode.
	var $jq = jQuery.noConflict();
	
	// Most of the remaining code in this function is pulled straight from WordPress's quick 
	// edit functions
	
	// Setup some variables to use later.
	var seed_params, params, fields, page = $jq('.post_status_page').val() || '';

	if ( typeof(id) == 'object' )
		id = this.getId(id);

	// Show the spinning save icon.  I don't think this works at the moment.
	$jq('table.widefat .inline-edit-save .waiting').show();

	// setup the initial params we're going to pass in to the ajax call.
	seed_params = {
		action: 'inline-save',
		post_type: typenow,
		post_ID: id,
		edit_date: 'true',
		post_status: page
	};

	// build the rest of the params, including the date/time (mm, aa, jj, mn, hh), the inline 
	// edit value and the post id.
	fields = "mm=" + new_date_parts[1].trim() + "&aa=" + new_date_parts[2].trim() + "&jj=" + new_date_parts[0].trim() + "&mn=" + new_time_parts[1].trim() + "&hh=" + new_time_parts[0].trim() + "&_inline_edit=" + document.getElementById('_inline_edit').value + "&post_ID=" + id;
		
	// Combine the seed params and the fields param.	
	params = fields + '&' + $jq.param(seed_params);

	// make ajax request
	$jq.post('admin-ajax.php', params,
		function(r) {
			// Hide the spinning save icon
			$jq('table.widefat .inline-edit-save .waiting').hide();

			if (r) {
				if ( -1 != r.indexOf('<tr') ) {
					// If we succeeded, update the date column, close the schedule edit row and show the item again.
					var edit_row = document.getElementById('post-' + id);
					for(i=0; i<edit_row.children.length; i++ )
						{
						if(edit_row.children[i].className=="date column-date")
							{
							edit_row.children[i].children[0].innerHTML=new_date_parts[2].trim() + "/" + new_date_parts[1].trim() + "/" + new_date_parts[0].trim();
							}
						}

					schedule_posts_calendar_quick_schedule_cancel(id);
				}
			}
		}
	, 'html');

	}
	
/*
	This function handles when the user click's cancel to the schedule action.

	id = the WordPress post/page id to cancel
*/
function schedule_posts_calendar_quick_schedule_cancel(id)
	{
	// Find the table row we're editing.
	var show_row = document.getElementById('post-' + id);
	
	// Show the post/page row again.
	show_row.style.display = "";

	// Find the parent of the row.
	var table = show_row.parentElement;	

	// Loop through all the rows in the table until we find the one we added.
	for(i=0; i<table.rows.length; i++ )
		{
		if( table.rows[i].id == "editinlineschedule-" + id )
			{
			// Delete the row we added
			table.deleteRow(i);
			// Bail out of the loop, we're done.
			i=table.rows.length;
			}
		}
	}

/*
	This function will reset the calendar to today.

	id = the WordPress post/page id to cancel
*/
function schedule_posts_calendar_quick_schedule_today(id)
	{
	var currentDate = new Date();

	SchedulePostsCalendar.setDate(currentDate);
	
	document.getElementById('eis_date_value_' + id).value = eis_format_date( currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear(), currentDate.getHours(), currentDate.getMinutes() );
	}
	
/*
	This function will display the schedule quick edit for a given page/post.

	id = the WordPress post/page id to cancel
*/
function schedule_posts_calendar_quick_schedule_edit(id)
	{
	// In the header we let PHP write out a function that uses WordPress' translation function do some work translating the calendar for us, go run the function now so we localize the calendar.
	var langs = SchedulePostsCalenderLang();

	// Find the table row and table we're editing.
	var edit_row = document.getElementById('post-' + id);
	var edit_table = edit_row.parentElement;
	
	// Create a new row to add and create a cell in it.
	var new_row = edit_table.insertRow( edit_row.rowIndex - 1 );
	var new_cell = new_row.insertCell(0);
	
	// Assign an id to the new row.
	new_row.id = "editinlineschedule-" + id;
	
	// Assign the classes to the new row.
	new_row.className = "inline-edit-row inline-edit-row-post inline-edit-post quick-edit-row quick-edit-row-post inline-edit-post";
	
	// Set our new cell to span all the columns in the table.
	new_cell.colSpan = edit_row.children.length;
		
	// Get the hidden data div WordPress uses.
	var row_data = document.getElementById('inline_' + id).children;
	
	// Setup some variables to use.
	var month, day, year, hour, minute, title;

	// Loop through all the hidden fields.
	for( i=0; i < row_data.length; i++ )
	{
		// We're looking for the date/time and the title, when we find them, save
		// them in a variable and for the date/time, add an id to reference later
		// when we update the values when the user clicks update.
		switch( row_data[i].className )
		{
		case "mm":
			month = row_data[i].innerHTML;
			row_data[i].id = 'eis_month_' + id
			break;
		case "aa":
			year = row_data[i].innerHTML;
			row_data[i].id = 'eis_year_' + id
			break;
		case "jj":
			day = row_data[i].innerHTML;
			row_data[i].id = 'eis_day_' + id
			break;
		case "mn":
			minute = row_data[i].innerHTML;
			row_data[i].id = 'eis_minute_' + id
			break;
		case "hh":
			hour = row_data[i].innerHTML;
			row_data[i].id = 'eis_hour_' + id
			break;
		case "post_title":
			title = row_data[i].innerHTML;
			break;
		}
	}
	
	// Now build some new HTML to place in the new cell we've created.  All fields in the
	// controls need to be uniquely identified so multiple edits can happen at the same time.
	// Start with a heading line, which includes the post title.
	new_cell.innerHTML = "<h4>Quick Schedule - " + title + "</h4>";
	// Add a hidden input field to store the date/time from the calendar control.
	new_cell.innerHTML += "<input style='display:none' id='eis_date_value_" + id + "' value='" + day + "/" + month + "/" + year + " " + hour + ":" + minute + "'></input>";
	// Create a div to create the calendar in.
	new_cell.innerHTML += "<div id='calendarHere-" + id + "' style='position:relative;height:230px;'></div>";
	// Create the cancel button.
	new_cell.innerHTML += '<a accesskey="c" href="#" title="' + langs["Cancel"] + '" class="button-secondary cancel alignleft" onclick="schedule_posts_calendar_quick_schedule_cancel(' + id + ')">' + langs["Cancel"] + '</a>';
	// Create the today button.
	new_cell.innerHTML += '<a accesskey="t" href="#" title="' + langs["Today"] + '" class="button-secondary alignleft" onclick="schedule_posts_calendar_quick_schedule_today()" style="margin-left:20px">' + langs["Today"] + '</a>';
	// Create the update button.
	new_cell.innerHTML += '<a accesskey="s" href="#" title="' + langs["Update"] + '" class="button-primary save alignleft" onclick="schedule_posts_calendar_quick_schedule_update(' + id + ')" style="margin-left:20px">' + langs["Update"] + '</a>';
	// Add a space at the end to give some buffer between the bottom of the buttons and the
	// next row.
	new_cell.innerHTML += "<BR>&nbsp;";
	
	// Now create the calendar.
	AddCalendar(day, month-1, year, hour, minute, id);
	
	// Hide the WordPress post row.
	edit_row.style.display = "none";
	}
