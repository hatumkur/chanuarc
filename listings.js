(function () {
  var grid = document.getElementById('listings-grid');
  if (!grid) return;

  function renderListing(item) {
    var card = document.createElement('article');
    card.className = 'listing-card';
    var facilitiesHtml = (item.facilities || [])
      .map(function (f) {
        return '<span class="listing-card-facility">' + escapeHtml(f) + '</span>';
      })
      .join('');
    var metaParts = [];
    if (item.area) metaParts.push(escapeHtml(item.area));
    if (item.facing) metaParts.push(escapeHtml(item.facing) + ' facing');
    if (item.occupancy) metaParts.push('Occupancy: ' + escapeHtml(item.occupancy));
    var metaHtml = metaParts.length ? '<div class="listing-card-meta">' + metaParts.join(' · ') + '</div>' : '';
    var extraParts = [];
    if (item.maintenance) extraParts.push('Maintenance: ' + escapeHtml(item.maintenance));
    if (item.securityDeposit) extraParts.push('Deposit: ' + escapeHtml(item.securityDeposit));
    if (item.noticePeriod) extraParts.push('Notice: ' + escapeHtml(item.noticePeriod));
    if (item.electricity) extraParts.push('Electricity: ' + escapeHtml(item.electricity));
    var extraHtml = extraParts.length ? '<div class="listing-card-extra">' + extraParts.join(' · ') + '</div>' : '';
    var desc = item.description ? escapeHtml(item.description) : '';
    var descHtml = desc ? '<p class="listing-card-description">' + desc + '</p>' : '';
    var firstNumber = item.contact ? item.contact.split(/\s*\/\s*/)[0].replace(/\D/g, '') : '';
    var contactHtml = item.contact
      ? '<div class="listing-card-contact"><a href="tel:' + escapeHtml(firstNumber) + '">' + escapeHtml(item.contact) + '</a></div>'
      : '';
    var galleryUrl = 'gallery.html?id=' + encodeURIComponent(item.id || '');
    var mediaHtml = '<div class="listing-card-media"><a href="' + escapeHtml(galleryUrl) + '">Photos / Videos</a></div>';
    card.innerHTML =
      '<img class="listing-card-image" src="' +
      escapeHtml(item.image) +
      '" alt="' +
      escapeHtml(item.title) +
      '" loading="lazy">' +
      '<div class="listing-card-body">' +
      '<h2 class="listing-card-title">' +
      escapeHtml(item.title) +
      '</h2>' +
      '<div class="listing-card-price">' +
      escapeHtml(item.price || '') +
      '<span class="listing-card-price-period">' +
      escapeHtml(item.pricePeriod || '') +
      '</span></div>' +
      '<div class="listing-card-location">' +
      escapeHtml(item.location || '') +
      '</div>' +
      contactHtml +
      metaHtml +
      extraHtml +
      descHtml +
      '<div class="listing-card-facilities">' +
      facilitiesHtml +
      '</div>' +
      mediaHtml +
      '</div>';
    return card;
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  grid.innerHTML = '<p class="listings-loading">Loading listings…</p>';

  fetch('listings.json')
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load listings');
      return res.json();
    })
    .then(function (data) {
      grid.innerHTML = '';
      var list = Array.isArray(data) ? data : [];
      list.forEach(function (item) {
        grid.appendChild(renderListing(item));
      });
      if (list.length === 0) {
        grid.innerHTML = '<p class="listings-loading">No listings yet.</p>';
      }
    })
    .catch(function () {
      grid.innerHTML = '<p class="listings-error">Could not load listings. Check listings.json.</p>';
    });
})();
