(function () {
  document.addEventListener('DOMContentLoaded', init);

  function formatFromInfo(info) {
    if (info === undefined || info === null || info === '') {
      return null;
    }
    return typeof info === 'object' ? JSON.stringify(info) : String(info);
  }

  function formatNameEmail(r) {
    const parts = [r.name, r.email].filter(Boolean);
    if (parts.length) {
      return parts.join(' · ');
    }
    if (r.id !== undefined && r.id !== null) {
      return String(r.id);
    }
    return '—';
  }

  function resolveRequester(ticketRes, requesterRes) {
    const ticket = ticketRes && ticketRes.ticket;
    const embedded = ticket && ticket.requester;
    const standalone = requesterRes && requesterRes.requester;
    return embedded || standalone;
  }

  function pickRequesterInfo(ticketRes, requesterRes) {
    const r = resolveRequester(ticketRes, requesterRes);
    if (!r) {
      return '—';
    }
    const fromInfo = formatFromInfo(r.info);
    if (fromInfo !== null) {
      return fromInfo;
    }
    return formatNameEmail(r);
  }

  function init() {
    app.initialized().then(function (client) {
      const hello = document.getElementById('hello');
      return Promise.all([
        client.data.get('ticket'),
        client.data.get('requester').catch(function () {
          return {};
        })
      ]).then(function (results) {
        const line = pickRequesterInfo(results[0], results[1]);
        hello.textContent = 'Hello — ' + line;
      }).catch(function (err) {
        hello.textContent = 'Hello — (could not load ticket)';
        console.error(err);
      });
    }).catch(function (err) {
      document.getElementById('hello').textContent = 'App failed to start.';
      console.error(err);
    });
  }
})();
