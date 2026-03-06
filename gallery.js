(function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  var titleEl = document.getElementById('gallery-title');
  var subtitleEl = document.getElementById('gallery-subtitle');
  var gridEl = document.getElementById('gallery-grid');
  var emptyEl = document.getElementById('gallery-empty');
  var errorEl = document.getElementById('gallery-error');

  function hideAll() {
    gridEl.style.display = 'none';
    emptyEl.style.display = 'none';
    errorEl.style.display = 'none';
  }

  function isVideo(filename) {
    if (!filename) return false;
    var ext = filename.split('.').pop().toLowerCase();
    return ext === 'mp4' || ext === 'webm' || ext === 'mov' || ext === 'ogg';
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  if (!id) {
    hideAll();
    errorEl.style.display = 'block';
    errorEl.textContent = 'No listing selected. Use the Photos / Videos link from a listing.';
    return;
  }

  fetch('listings.json')
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load listings');
      return res.json();
    })
    .then(function (list) {
      var listing = null;
      for (var i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(id)) {
          listing = list[i];
          break;
        }
      }
      if (!listing) {
        hideAll();
        errorEl.style.display = 'block';
        errorEl.textContent = 'Listing not found.';
        return;
      }

      titleEl.textContent = listing.title || 'Photos & Videos';
      subtitleEl.textContent = listing.location || '';

      var photosStr = listing.photos || '';
      var names = photosStr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);

      if (names.length === 0) {
        hideAll();
        emptyEl.style.display = 'block';
        return;
      }

      gridEl.style.display = 'grid';
      gridEl.innerHTML = '';

      names.forEach(function (name) {
        var card = document.createElement('figure');
        card.className = 'gallery-card';
        if (isVideo(name)) {
          var video = document.createElement('video');
          video.src = name;
          video.controls = true;
          video.preload = 'metadata';
          card.appendChild(video);
        } else {
          var img = document.createElement('img');
          img.src = name;
          img.alt = name;
          img.loading = 'lazy';
          card.appendChild(img);
        }
        var cap = document.createElement('figcaption');
        cap.textContent = name;
        card.appendChild(cap);
        gridEl.appendChild(card);
      });
    })
    .catch(function () {
      hideAll();
      errorEl.style.display = 'block';
      errorEl.textContent = 'Could not load listing.';
    });
})();
