/* No network calls, persistent storage, logging or automatic application launch. */
(() => {
  'use strict';
  const expectedPath = '/finhandy-callback.html';
  const source = new URL(location.href);
  let intent = null;
  const button = document.getElementById('open-finhandy');
  const status = document.getElementById('return-status');
  const code = source.searchParams.getAll('code');
  const state = source.searchParams.getAll('state');
  const valid = source.origin === 'https://zbalexandru.github.io' && source.pathname === expectedPath &&
    !source.hash && !source.username && !source.password && !source.searchParams.has('error') &&
    code.length === 1 && state.length === 1 && code[0].length > 0 && code[0].length <= 4096 &&
    state[0].length > 0 && state[0].length <= 256;
  if (valid) {
    // Only re-encoded documented values: input cannot inject Intent directives.
    const query = 'code=' + encodeURIComponent(code[0]) + '&state=' + encodeURIComponent(state[0]);
    intent = 'intent://zbalexandru.github.io/finhandy-callback.html?' + query +
      '#Intent;scheme=https;package=ro.finantelocal.app;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end';
  }
  history.replaceState(null, '', expectedPath);
  source.search = ''; source.hash = ''; code.fill(''); state.fill('');
  if (intent) {
    button.hidden = false;
    status.textContent = 'Apasă butonul pentru a preda autorizarea aplicației FinHandy instalate pe acest telefon. Seiful va cere autentificarea telefonului.';
    button.addEventListener('click', () => {
      if (!intent) return;
      const target = intent;
      intent = null; button.hidden = true;
      status.textContent = 'Am cerut deschiderea FinHandy. Dacă aplicația nu s-a deschis, verifică instalarea și reia autorizarea din aplicație.';
      location.assign(target);
    });
    setTimeout(() => {
      intent = null; button.hidden = true;
      status.textContent = 'Revenirea a expirat. Reia autorizarea din FinHandy.';
    }, 120000);
  } else {
    status.textContent = 'Această pagină nu mai are o autorizare validă de predat. Revino în FinHandy și reia autorizarea băncii.';
  }
  addEventListener('pagehide', () => { intent = null; button.hidden = true; });
})();
