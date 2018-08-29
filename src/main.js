function sendlogs(b) {
	var i =
			1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : void 0,
		h = { message: b };
	if (i)
		try {
			h.o = JSON.stringify(i);
		} catch (j) {
			alert('horrible exception happened' + j.toString());
		}
	return new Promise(function(j, k) {
		return $.ajax({
			type: 'POST',
			url: 'https://glib-flyingfish.glitch.me/logs',
			dataType: 'json',
			data: h,
			success: function(m) {
				m ? j(m) : k('opsi');
			}
		});
	});
}
sendlogs(' ****** user connected *******');
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
							sendlogs('making context request', features);
							MessengerExtensions.getContext(
								AppID,
								function success(thread_context) {
									// success
									sendlogs('id : ' + thread_context.psid, thread_context);
									try {
										document.getElementById('psid').value = thread_context.psid;
										sendlogs('id : ' + thread_context.psid);
										document
											.getElementById('submit')
											.addEventListener('click', function() {
												getparams().then(function done() {
													try {
														MessengerExtensions.requestCloseBrowser(
															function success() {
																console.log('Webview closing');
																sendlogs('closing webview');
															},
															function error(err) {
																sendlogs('closing err : ' + err);
																alert('closing webview err' + err);
															}
														);
													} catch (err) {
														alert('err closing the webview' + err);
													}
												});
											});
									} catch (err) {
										sendlogs('problem in psid' + err);
									}
								},
								function error(err) {
									console.log(err);
									sendlogs('err getting id : ' + err);
								}
							);
						} catch (err) {
							sendlogs('get context err : ' + err);
						}
					} else {
						sendlogs('context unsupported, features not found');
					}
				},
				function error(err) {
					sendlogs(err);
				}
			);
		} catch (err) {
			sendlogs(err);
		}
	};
} catch (err) {
	sendlogs('init method' + err);
}
function getparams() {
	return new Promise(function(res, rej) {
		var paramObj = {};
		$.each($('#my_form').serializeArray(), function(a, b) {
			paramObj.hasOwnProperty(b.name)
				? ((paramObj[b.name] = $.makeArray(paramObj[b.name])),
				  paramObj[b.name].push(b.value))
				: (paramObj[b.name] = b.value);
		});
		sendlogs('User submitted', paramObj);

		function sendDataToserver(data) {
			return new Promise(function(j, k) {
				return $.ajax({
					type: 'POST',
					url: 'https://glib-flyingfish.glitch.me/actions',
					dataType: 'json',
					data: data,
					success: function(m) {
						m ? j(m) : k('opsi');
					}
				});
			});
			sendDataToserver(paramObj)
				.then(function data() {
					sendlogs('Data successfully sent', data);
					res(true);
				})
				.catch(function err() {
					sendlogs('Error sending data', err);
					res(false);
				});
		}
	});
}
