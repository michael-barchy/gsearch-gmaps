/* content-script.js */

var GSearchGMap = { map: null };

GSearchGMap.getQuery = function(map) {
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
  return query;
}

GSearchGMap.makeMapClickable = function() {
  GSearchGMap.map = document.getElementById('lu_map');
  if (null !== GSearchGMap.map && typeof GSearchGMap.map !== 'undefined') {
    if (!GSearchGMap.map.classList.contains('map-clicable')) {
      var query = GSearchGMap.getQuery(GSearchGMap.map);
      if (null !== query) {
          var img = GSearchGMap.map.querySelector('img');
          var w = (null !== img) ? img.width : GSearchGMap.map.getBoundingClientRect().width;
          var h = (null !== img) ? img.height : GSearchGMap.map.getBoundingClientRect().height;
          var iframe = document.createElement('iframe');
          iframe.setAttribute('src', 'https://maps.google.com/maps?width=' + w + '&height=' + h + '&iwloc=B&output=embed&q=' + query);
          iframe.setAttribute('width', w);
          iframe.setAttribute('height', h);
          iframe.setAttribute('style', 'border: 0;');
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          iframe.addEventListener('load', function(event) {
            if (null === iframe.contentDocument) {
              iframe.style.display = 'none';
              img.style.display = 'block';
              
              return;
            }

            img.style.display = 'none';
            iframe.style.display = 'block';
          });
          if (null !== img) {
            img.addEventListener('click', function() {
              var query = GSearchGMap.getQuery(GSearchGMap.map);
              if (null !== query) {
                window.open('https://www.google.com/maps/place/' + query);
              }
            });      
          }
          GSearchGMap.map.appendChild(iframe);
      }
      GSearchGMap.map.classList.add('map-clickable');
    }
  }
}

window.addEventListener('load', function() {
  GSearchGMap.makeMapClickable();
});

window.addEventListener('DOMContentLoaded', function() {
  GSearchGMap.makeMapClickable();
});

window.addEventListener('DOMContentModified', function() {
  GSearchGMap.makeMapClickable();
});
