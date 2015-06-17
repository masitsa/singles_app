/* Base url for external connection */
var base_url = 'https://www.nairobisingles.com/mobile/';

/* Style alert popups */
document.addEventListener('deviceready', function () {
  if (navigator.notification) { // Override default HTML alert with native dialog
      window.alert = function (message) {
          navigator.notification.alert(
              message,    // message
              null,       // callback
              "Nairobisingles", // title
              'Ok'        // buttonName
          );
      };
  }
}, false);