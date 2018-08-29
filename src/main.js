"use strict";
function getparams() {
  return new Promise(function(c, d) {
    var g = {};
    $.each($("#my_form").serializeArray(), function(h, i) {
      g.hasOwnProperty(i.name)
        ? ((g[i.name] = $.makeArray(g[i.name])), g[i.name].push(i.value))
        : (g[i.name] = i.value);
    }),
      sendlogs("User submitted", g),
      console.log("sending data to server", g),
      (function(h) {
        return new Promise(function(i, j) {
          $.ajax({
            type: "POST",
            url: "https://glib-flyingfish.glitch.me/actions",
            dataType: "json",
            data: h,
            success: function success(k) {
              i(k);
            },
            error: function error(k, l, n) {
              j({ jqXHR: k, textStatus: l, errorThrown: n });
            }
          });
        });
      })(g)
        .then(function() {
          console.log("Data successfully sent", g),
            sendlogs("Data successfully sent", g),
            c(!0);
        })
        .catch(function(h) {
          console.log("Error sending data", h),
            sendlogs("Error sending data", h),
            d(!1);
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
