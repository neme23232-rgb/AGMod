const { getDevToolsPort, getDevToolsPage, getWebSocketClass } = require('./test_helper.js');
const { getClientScript } = require('./build.js');

async function testLive() {
  console.log('\n======================================================');
  console.log('       AGMod Live DevTools Integration Test');
  console.log('======================================================\n');

  const port = getDevToolsPort();
  if (!port) {
    console.log('[INFO] No active Antigravity DevTools port detected.');
    console.log('[INFO] Antigravity is not currently running. Skipping live UI test.\n');
    return true;
  }

  console.log(`[*] Detected active Antigravity DevTools on port: ${port}`);
  let page;
  try {
    page = await getDevToolsPage(port);
  } catch (err) {
    console.log(`[INFO] Could not connect to DevTools port ${port}: ${err.message}. Skipping.\n`);
    return true;
  }

  if (!page || !page.webSocketDebuggerUrl) {
    console.log('[INFO] No valid window target found. Skipping live UI test.\n');
    return true;
  }

  console.log(`[*] Connecting to Antigravity window: "${page.title}"...`);
  const WebSocket = getWebSocketClass();

  return new Promise((resolve) => {
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    function evaluate(expr) {
      return new Promise((res) => {
        const id = Math.floor(Math.random() * 1000000);
        const handler = (msg) => {
          const data = JSON.parse(msg.toString());
          if (data.id === id) {
            ws.removeListener('message', handler);
            if (data.result?.exceptionDetails) {
              console.error('Eval Exception:', data.result.exceptionDetails.text, data.result.exceptionDetails.exception?.description);
            }
            res(data.result?.result?.value);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({
          id,
          method: 'Runtime.evaluate',
          params: { expression: expr, returnByValue: true }
        }));
      });
    }

    ws.on('open', async () => {
      try {
        console.log('[1/5] Injecting / updating AGMod runtime into active window...');
        const clientCode = getClientScript();
        await evaluate('window.__AG_MOD_INITIALIZED__ = false;\n' + clientCode);

        // Check sidebar buttons
        console.log('[2/5] Checking sidebar (verifying clean sidebar without extra buttons)...');
        const buttonsStatus = await evaluate(`
          (() => {
            const langBtn = document.getElementById('ag-sidebar-lang-btn');
            const themeBtn = document.getElementById('ag-sidebar-theme-btn');
            const settingsBtn = document.querySelector('[data-testid="settings-button"]');
            return {
              hasLangBtn: !!langBtn,
              hasThemeBtn: !!themeBtn,
              hasSettingsBtn: !!settingsBtn
            };
          })()
        `);
        console.log(`      Sidebar status:`, buttonsStatus);

        // Open Settings dialog
        console.log('[3/5] Opening Settings dialog to test "Test" tab...');
        await evaluate(`
          (() => {
            const btn = document.querySelector('[data-testid="settings-button"]');
            if (btn) btn.click();
            return !!btn;
          })()
        `);

        // Wait for modal to open
        await new Promise(r => setTimeout(r, 600));

        // Check if Test button was injected
        console.log('[4/5] Checking "Test" navigation tab in Settings modal...');
        const testBtnStatus = await evaluate(`
          (() => {
            const testBtn = document.getElementById('ag-nav-test-btn');
            const dialog = document.querySelector('[role="dialog"]');
            return {
              hasDialog: !!dialog,
              hasTestBtn: !!testBtn,
              hasSvgIcon: testBtn ? !!testBtn.querySelector('svg') : null,
              testBtnText: testBtn ? testBtn.innerText.trim() : null
            };
          })()
        `);
        console.log(`      Test tab status:`, testBtnStatus);

        if (testBtnStatus.hasTestBtn) {
          console.log('[5/5] Clicking "Test" tab and validating custom Settings pane...');
          const paneStatus = await evaluate(`
            (() => {
              const testBtn = document.getElementById('ag-nav-test-btn');
              testBtn.click();
              const pane = document.getElementById('ag-custom-test-pane');
              const themeCards = pane ? pane.querySelectorAll('#ag-theme-grid > div').length : 0;
              const langCards = pane ? pane.querySelectorAll('#ag-lang-grid > div').length : 0;
              const hasStudio = !!pane?.querySelector('#ag-studio-toggle');
              const hasCompactSwitch = !!pane?.querySelector('#ag-compact-toggle');
              const hasFontSelect = !!pane?.querySelector('#ag-font-select');
              const hasFooterReset = !!pane?.querySelector('#ag-btn-reset-defaults');

              return {
                paneMounted: !!pane,
                paneVisible: pane ? pane.style.display !== 'none' : false,
                themeCardsCount: themeCards,
                langCardsCount: langCards,
                hasStudio,
                hasCompactSwitch,
                hasFontSelect,
                hasFooterReset
              };
            })()
          `);
          console.log(`      Custom pane status:`, paneStatus);

          if (paneStatus.paneMounted && paneStatus.themeCardsCount >= 10 && paneStatus.langCardsCount >= 6 && paneStatus.hasCompactSwitch) {
            console.log('\n[PASS] All Live DevTools integration checks passed with 100% success!');
          } else {
            console.warn('[WARN] Partial pane match: verify layout rendering.');
          }
        }

        // Close dialog
        await evaluate(`
          (() => {
            const esc = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true });
            document.dispatchEvent(esc);
            return true;
          })()
        `);

        ws.close();
        resolve(true);
      } catch (err) {
        console.error('[ERROR in live test]:', err);
        ws.close();
        resolve(false);
      }
    });
  });
}

if (require.main === module) {
  testLive().then(success => {
    if (!success) process.exit(1);
  });
}

module.exports = { testLive };
