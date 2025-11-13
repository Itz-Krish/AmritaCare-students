const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const diagnostics = { logs: [], errors: [], network: [], firebaseInit: null, chatMessages: null };

  page.on('console', msg => {
    const text = msg.text();
    diagnostics.logs.push(text);
    if (text.includes('[DEBUG]') || text.includes('Firestore') || text.includes('chat')) {
      console.log('📋', text);
    }
  });

  page.on('pageerror', err => {
    diagnostics.errors.push(String(err));
    console.error('❌ Page error:', String(err));
  });

  page.on('requestfailed', req => {
    if (req.url().includes('firebase') || req.url().includes('firestore')) {
      diagnostics.network.push({ type: 'failed', url: req.url(), error: req.failure().errorText });
      console.error('❌ Network failed:', req.url(), req.failure().errorText);
    }
  });

  page.on('response', res => {
    if (res.url().includes('firebase') || res.url().includes('/api/firebase-config')) {
      const status = res.status();
      if (status !== 200) {
        diagnostics.network.push({ type: 'response', url: res.url(), status });
        console.warn('⚠️ Firebase API response:', res.url(), status);
      }
    }
  });

  try {
    console.log('🔍 Loading page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('✅ Page loaded');

    // Hard refresh to clear any cached Firestore rules
    await page.reload({ waitUntil: 'networkidle2' });
    console.log('✅ Page reloaded');

    // Wait longer for listeners to initialize and fire
    await new Promise(r => setTimeout(r, 10000));

    // Check Firebase initialization
    diagnostics.firebaseInit = await page.evaluate(() => {
      try {
        return {
          windowFirebase: !!window._firebase,
          hasAuth: !!(window._firebase && window._firebase.auth),
          hasDb: !!(window._firebase && window._firebase.db),
          authInitialized: window._firebase && window._firebase.auth ? true : false,
          dbInitialized: window._firebase && window._firebase.db ? true : false,
          useFirebaseAuth: window._useFirebaseAuth,
          chatMessagesCount: window.chatMessages ? window.chatMessages.length : 0
        };
      } catch (e) {
        return { error: String(e) };
      }
    });

    console.log('🔥 Firebase state:', diagnostics.firebaseInit);

    // Wait for chat listener to initialize
    await new Promise(r => setTimeout(r, 3000));

    // Check if messages are loaded
    diagnostics.chatMessages = await page.evaluate(() => {
      return {
        count: window.chatMessages ? window.chatMessages.length : 0,
        messages: window.chatMessages ? window.chatMessages.slice(0, 3) : [],
        chatWindowHTML: document.getElementById('chatWindow') ? document.getElementById('chatWindow').innerHTML.substring(0, 200) : ''
      };
    });

    console.log('💬 Chat state:', diagnostics.chatMessages);

    // Test signed-in send
    console.log('🧪 Testing signed-in message send...');
    await page.evaluate(() => {
      sessionStorage.setItem('mh_current', JSON.stringify({ email: 'test@bl.students.amrita.edu', name: 'Test User', uid: 'test_uid_123' }));
      if (typeof window.updateAuthGates === 'function') try { window.updateAuthGates(); } catch (e) { }
    });

    await page.waitForSelector('#messageInput', { timeout: 10000 });
    const isDisabled = await page.$eval('#messageInput', el => el.disabled);
    console.log('📝 Message input disabled?', isDisabled);

    await page.type('#messageInput', 'Firebase diagnostic test message');
    await page.click('#sendBtn');

    await new Promise(r => setTimeout(r, 3000));

    // Check final chat state
    const finalChat = await page.evaluate(() => ({
      messages: window.chatMessages ? window.chatMessages.length : 0,
      html: document.getElementById('chatWindow') ? document.getElementById('chatWindow').innerHTML.substring(0, 300) : ''
    }));

    diagnostics.chatMessages = { ...diagnostics.chatMessages, afterSend: finalChat };
    console.log('✅ Final chat state:', finalChat);

  } catch (err) {
    diagnostics.errors.push(String(err));
    console.error('❌ Test error:', String(err));
  }

  fs.writeFileSync('tests/firebase_diagnostics.json', JSON.stringify(diagnostics, null, 2));
  console.log('\n📊 Diagnostics written to tests/firebase_diagnostics.json');
  await browser.close();
})();
