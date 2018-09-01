"use strict";

function getparams() {
  return new Promise(function(a, f) {
    var o = {};
    $.each($("#my_form").serializeArray(), function(p, q) {
      o.hasOwnProperty(q.name)
        ? ((o[q.name] = $.makeArray(o[q.name])), o[q.name].push(q.value))
        : (o[q.name] = q.value);
    }),
      sendlogs("User submitted", o),
      console.log("sending data to server", o),
      (function(p) {
        return new Promise(function(q, r) {
          $.ajax({
            type: "POST",
            url: "https://"+window.location.hostname+"/actions",
            dataType: "json",
            data: p,
            success: function(t) {
              q(t);
            },
            error: function(t, u, v) {
              r({ jqXHR: t, textStatus: u, errorThrown: v });
            }
          });
        });
      })(o)
        .then(function() {
          console.log("Data successfully sent", o),
            sendlogs("Data successfully sent", o),
            a(!0);
        })
        .catch(function(p) {
          console.log("Error sending data", p),
            sendlogs("Error sending data", p),
            f(!1);
        });
  });
}
function sendlogs(a) {
  var f =
      1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : void 0,
    o = { message: a };
  if (f)
    try {
      o.o = JSON.stringify(f);
    } catch (p) {
      alert("horrible exception happened" + p.toString());
    }
  return new Promise(function(p, q) {
    return $.ajax({
      type: "POST",
      url: "https://"+window.location.hostname+"/logs",
      dataType: "json",
      data: o,
      success: function success(r) {
        r ? p(r) : q("opsi");
      }
    });
  });
}
sendlogs(" ****** user connected *******");
try {
  window.extAsyncInit = function() {
    try {
      MessengerExtensions.getSupportedFeatures(
        function(o) {
          var p = o.supported_features;
          if (-1 != p.indexOf("context"))
            try {
              sendlogs("making context request", p),
                MessengerExtensions.getContext(
                  "582708698746933",
                  function(r) {
                    sendlogs("id : " + r.psid, r);
                    try {
                      (document.getElementById("psid").value = r.psid),
                        sendlogs("id : " + r.psid),
                        document
                          .getElementById("submit")
                          .addEventListener("click", function(s) {
                            s.preventDefault(),
                              getparams()
                                .then(function(u) {
                                  console.log("trying to close the browser", u);
                                  try {
                                    MessengerExtensions.requestCloseBrowser(
                                      function() {
                                        console.log("Webview closing"),
                                          sendlogs("closing webview");
                                      },
                                      function(w) {
                                        sendlogs("closing err : " + w),
                                          alert("closing webview err" + w);
                                      }
                                    );
                                  } catch (v) {
                                    alert("err closing the webview" + v);
                                  }
                                })
                                .catch(function(u) {
                                  console.log("error", u);
                                });
                          });
                    } catch (s) {
                      sendlogs("problem in psid" + s);
                    }
                  },
                  function(r, s) {
                    console.log(r),
                      sendlogs("err getting id : " + r + " " + s, {
                        code: r,
                        message: s
                      });
                  }
                );
            } catch (q) {
              sendlogs("get context err : " + q);
            }
          else sendlogs("context unsupported, features not found");
        },
        function(o) {
          sendlogs(o);
        }
      );
    } catch (f) {
      sendlogs(f);
    }
  };
} catch (a) {
  sendlogs("init method" + a);
}
