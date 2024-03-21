/* content-script.js */

var GSearchGMap = { map: null };

GSearchGMap.getQuery = function(map) {
  var context = null !== map ? map.closest('[data-async-context]') : null;
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

GSearchGMap.addMapsLink = function() {
  var nav = document.querySelector('div[role="navigation"]:has(div[jsslot])');
  if (null === nav || typeof nav === 'undefined') {
    nav = document.querySelector('div[role="navigation"]:has(div[jscontroller])');
  }  
  if (null !== nav && !nav.classList.contains('with-maps-button')) {
    var container = nav.querySelector('div[jsslot]');
    if (null === container || typeof nav === 'container') {
      container = nav.querySelector('div[jscontroller]');
    }  
    if (null !== container) {
      var buttons = container.querySelectorAll('div[data-hveid] > a[role=link]');
      if (buttons.length === 0) {
        buttons = container.querySelectorAll('div:has(a[role=link])');
      }
      if (buttons.length > 0) {
        var firstButton = buttons[0].hasAttribute('href') ? buttons[0].parentNode : buttons[0];
        var mapButton = firstButton.cloneNode(true);
        var link = mapButton.querySelector('a[role=link]');
        var query = GSearchGMap.getQuery(null);
        if (null !== link && null !== query) {
          link.setAttribute('href', 'https://www.google.com/maps/search/' + query);
          link.setAttribute('target', '_blank');
          var text = link.querySelector('span');
          if (null === text || typeof text === 'undefined') {
            text = link.querySelector('div');
          }
          if (null !== text) {
            text.innerText = 'Maps';
          }
          if (null !== firstButton.nextSibling) {
            firstButton.parentNode.insertBefore(mapButton, buttons[0].hasAttribute('href') ? firstButton : firstButton.nextSibling);
          } else {
            firstButton.parentNode.appendChild(mapButton);
          }
          nav.classList.add('with-maps-button');
        }
      }
    }
  }
}

GSearchGMap.makeMapClickable = function() {
  GSearchGMap.map = document.getElementById('lu_map');
  if (null !== GSearchGMap.map && typeof GSearchGMap.map !== 'undefined') {
    if (!GSearchGMap.map.classList.contains('map-clickable')) {
      
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
  var mapClickable = document.querySelector('.map-clickable');
  if (null !== mapClickable && typeof mapClickable !== 'undefined') {
    var parent = mapClickable.closest('.kp-wholepage');
    if (null == parent || typeof parent === 'undefined') {
      parent = mapClickable.closest('[role="complementary"]');
    }
    if (null !== parent && typeof parent !== 'undefined') {
      var address = parent.querySelector('a[href^="/maps/place"]');
      if (null !== address && typeof address !== 'undefined') {
        mapClickable.parentNode.setAttribute('href', address.getAttribute('href'));
      }    
    }  
  }
}

window.addEventListener('load', function() {
  GSearchGMap.addMapsLink();
  GSearchGMap.makeMapClickable();
});

window.addEventListener('DOMContentLoaded', function() {
  GSearchGMap.addMapsLink();
  GSearchGMap.makeMapClickable();
});

window.addEventListener('DOMContentModified', function() {
  GSearchGMap.addMapsLink();
  GSearchGMap.makeMapClickable();
});
