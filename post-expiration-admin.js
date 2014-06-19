jQuery(function ($) {
	

	$('#enable_expire').change(function () {
		if ($(this).is(':checked')) {
			$('.post-expiration-timestamp input, .post-expiration-timestamp select').removeAttr('disabled')
			$("#timestampdiv_expire .dhtmlxcalendar_container").fadeIn(250);
		} else {
			$('.post-expiration-timestamp input, .post-expiration-timestamp select').attr('disabled', 'disabled');
			$("#timestampdiv_expire .dhtmlxcalendar_container").fadeOut(250);
		}

	});

	/* based on /wp-admin/js/post.js?ver=3.9.1:815-841 */
	$timestampdiv_expire = $('#timestampdiv_expire');

	$timestampdiv_expire.siblings('a.edit-timestamp').click( function( event ) {
		if (!$('#enable_expire').is(':checked')) {
			$("#timestampdiv_expire .dhtmlxcalendar_container").hide();
		}
		if ( $timestampdiv_expire.is( ':hidden' ) ) {
			$timestampdiv_expire.slideDown('fast');
			$('#mm_expire').focus();
			$(this).hide();
		}
		event.preventDefault();
	});

	$timestampdiv_expire.find('.cancel-timestamp').click( function( event ) {
		$timestampdiv_expire.slideUp('fast').siblings('a.edit-timestamp').show().focus();
		$('#mm_expire').val($('#hidden_mm_expire').val());
		$('#jj_expire').val($('#hidden_jj_expire').val());
		$('#aa_expire').val($('#hidden_aa_expire').val());
		$('#hh_expire').val($('#hidden_hh_expire').val());
		$('#mn_expire').val($('#hidden_mn_expire').val());
		updateText();
		event.preventDefault();
	});

	$timestampdiv_expire.find('.save-timestamp').click( function( event ) { // crazyhorse - multiple ok cancels
		if ( updateText() ) {
			$timestampdiv_expire.slideUp('fast');
			$timestampdiv_expire.siblings('a.edit-timestamp').show();
		}
		event.preventDefault();
	});

	// A wimpy version of wordpress's updateText()
	function updateText() {
		$text = $('#timestamp_expire b');

		if (!$('#enable_expire').is(':checked')) {
			$text.text('never');
		} else {
			$text.text($('#aa_expire').val() + '-' + $('#mm_expire').val() + '-' + $('#jj_expire').val() + ' ' + $('#hh_expire').val() + ':' + $('#mn_expire').val());
		}
		$timestampdiv_expire.slideUp();
		$timestampdiv_expire.siblings('a.edit-timestamp').show()
	}

	$('.apm_changer').change(function () {
		var $this = $(this);
		var $target = $($this.attr('data-target'))
		if ('am' == $this.val()) {
			$target.val(parseInt($target.val()) % 12) 
		} else {
			$target.val((parseInt($target.val()) % 12) + 12) 
		}
	})
})
