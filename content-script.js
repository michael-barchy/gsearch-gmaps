/* content-script.js */

window.addEventListener('load', function() {
  makeMapClickable();
});

window.addEventListener('DOMContentLoaded', function() {
  makeMapClickable();
});

window.addEventListener('DOMContentModified', function() {
  makeMapClickable();
});

function makeMapClickable() {
  var map = document.getElementById('lu_map');
  if (null !== map && typeof map !== 'undefined') {
    if (!map.classList.contains('map-clicable')) {
      map.addEventListener('click', function() {
        var context = map.closest('[data-async-context]');
        var query = null;
        if (null !== context) {
          query = context.dataset.asyncContext.replace('query:', '');
        } else {
          var form = document.querySelector('form[role="search"]');
          if (null !== form) {
            var q = form.querySelector('textarea[name="q"]');
            if (null !== q) {
              query = encodeURIComponent(q.value);
            }
          }
        }
        if (null !== query) {
          window.open('https://www.google.com/maps/place/' + query);
        }
      });
      map.classList.add('map-clickable');
    }
  }
}