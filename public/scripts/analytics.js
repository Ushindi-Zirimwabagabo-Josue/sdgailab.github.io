(function () {
  var script = document.currentScript;
  var measurementId = script && script.dataset ? script.dataset.gaMeasurementId : '';
  if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId);

  document.addEventListener('click', function (event) {
    var target = event.target;
    var link = target && target.closest ? target.closest('[data-analytics-event]') : null;
    if (!link) return;

    gtag('event', link.getAttribute('data-analytics-event'), {
      event_category: link.getAttribute('data-analytics-category') || 'engagement',
      event_label: link.getAttribute('data-analytics-label') || link.textContent.trim(),
      link_url: link.href || undefined,
    });
  });
})();
