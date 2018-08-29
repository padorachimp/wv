'use strict';

try {
	(function(d, s, id) {
		var js,
			fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = 'https://connect.facebook.com/en_US/messenger.Extensions.js';
		fjs.parentNode.insertBefore(js, fjs);
	})(document, 'script', 'Messenger');
} catch (err) {
	alert('did not charge' + err);
}
try {
	window.extAsyncInit = function() {
		var AppID = '582708698746933';
		// SDK loaded, code to follow
		try {
			MessengerExtensions.getSupportedFeatures(
				function success(result) {
					var features = result.supported_features;
					if (features.indexOf('context') != -1) {
						try {
							MessengerExtensions.getContext(
								AppID,
								function success(thread_context) {
									// success
									try {
										document.getElementById('psid').value = thread_context.psid;
										alert('your id is :' + thread_context.psid);
										document.getElementById('demo').value =
											'your id is :' + thread_context.psid;
										document
											.getElementById('submit')
											.addEventListener('click', function() {
												try {
													MessengerExtensions.requestCloseBrowser(
														function success() {
															console.log('Webview closing');
															alert('webview closing');
														},
														function error(err) {
															console.log(err);
															document.getElementById('demo').value =
																'closing webview err' + err;
															alert('closing webview err' + err);
														}
													);
												} catch (err) {
													alert('err closing the webview' + err);
												}
											});
									} catch (err) {
										alert(err);
									}
								},
								function error(err) {
									console.log(err);
									alert('no id' + err);
								}
							);
						} catch (err) {
							alert('getcontext err' + err);
						}
					} else {
						alert('cant find your id');
						document.getElementById('demo').value = 'id problems';
					}
				},
				function error(err) {
					console.log(err);
					alert('supported features err ' + err);
					document.getElementById('demo').value = 'err' + err;
					document.getElementById('demo').value =
						'supported features err ' + err;
				}
			);
		} catch (err) {
			alert('supported features err' + err);
			document.getElementById('demo').value = 'err' + err;
			document.getElementById('demo').value = 'supported features err ' + err;
		}
	};
} catch (err) {
	alert('err2:' + err);
}
