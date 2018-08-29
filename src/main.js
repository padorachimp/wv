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
			return new Promise(function(res, rej) {
				$.ajax({
					type: 'POST',
					url: 'https://glib-flyingfish.glitch.me/actions',
					dataType: 'jsonp',
					data: JSON.stringify(data),
					success: function(m) {
						res(m);
					},
					error: function(jqXHR, textStatus, errorThrown ){
						rej({jqXHR, textStatus, errorThrown});
					}
				});
			});
		}

		console.log('sending data to server', paramObj);
		sendDataToserver(paramObj)
			.then(function() {
				console.log('Data successfully sent', paramObj);
				sendlogs('Data successfully sent', paramObj);
				res(true);
			})
			.catch(function(e) {
				console.log('Error sending data', e)
				sendlogs('Error sending data', e);
				rej(false);
			});
	});
}

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
											.addEventListener('click', function(e) {
												e.preventDefault();
												getparams()
													.then(function done(result) {
														console.log('trying to close the browser', result);
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
													})
													.catch(function err(ex) {
														console.log('error', ex);
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
