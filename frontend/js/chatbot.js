/* ============================================
   CHATBOT WIDGET — chatbot.js
   AI Resume Analyzer
   ============================================ */

(function () {
  'use strict';

  /* ── DOM refs ── */
  const bubble    = document.getElementById('chat-bubble');
  const chatWin   = document.getElementById('chat-window');
  const badge     = document.getElementById('chat-badge');
  const messages  = document.getElementById('chat-messages');
  const input     = document.getElementById('chat-input');
  const sendBtn   = document.getElementById('chat-send-btn');
  const quickReps = document.getElementById('chat-quickreplies');
  const typingRow = document.getElementById('cb-typing-row');

  let isOpen = false;

  /* ══════════════════════════════════════
     RESPONSES — tailored to AI Resume Analyzer
  ══════════════════════════════════════ */
  const exactReplies = {
    'how to upload my resume': `To upload your resume:\n1. Scroll to the "Upload Your Resume" section.\n2. Click the file input and select your PDF or DOCX.\n3. Hit "Analyze Resume" and wait a few seconds.\nOur AI will extract skills, roles, salary info, and more! 📄`,

    'what skills are detected': `Our AI scans your resume for:\n• Technical skills (e.g. Python, React, SQL)\n• Soft skills (e.g. leadership, communication)\n• Tools & frameworks\n• Industry-specific keywords\n\nAll shown in your Skills card after analysis. 🧠`,

    'salary insights': `After analysis, the Salary card shows:\n• Estimated salary range for your profile\n• A chart comparing roles by pay\n• Location-based salary differences\n\nGreat for negotiating your next offer! 💰`,

    'how to improve my resume': `The "Improvements" card gives you AI-generated tips like:\n• Add missing keywords for your target role\n• Quantify your achievements\n• Improve formatting for ATS systems\n• Highlight top skills earlier\n\nApply these tweaks to boost interview chances! 📈`,

    'best cities for my career': `The Best Cities card shows top locations hiring for your skills. It considers:\n• Job demand per city\n• Average salaries\n• Cost of living vs. earning potential\n\nPerfect for planning a career move! 🌍`,

    'view previous analyses': `Your past resume analyses are saved in the "Previous Analyses" section on the homepage. Just scroll down after logging in — you'll see a history list with timestamps. 📜`,

    'login or signup help': `To get started:\n• Click "Login" if you already have an account.\n• Click "Signup" to create a new one — just name, email & password.\n\nForgot password? Use the reset link on the login screen. 🔐`,

    'what file types are supported': `We currently support:\n• PDF (.pdf) — recommended\n• Word Documents (.docx)\n\nMake sure your file is under 5MB for best results. 📁`,

    'contact support': `Need more help? You can reach our support team at:\n📧 support@airesumematcher.com\n\nOr describe your issue here and I'll do my best to help! 🙋`,
  };

  /* Keyword-based fuzzy match */
  const keywordReplies = [
    { keys: ['upload', 'file', 'attach', 'submit'],            reply: exactReplies['how to upload my resume'] },
    { keys: ['skill', 'detect', 'extract', 'found'],           reply: exactReplies['what skills are detected'] },
    { keys: ['salary', 'pay', 'wage', 'earn', 'money'],        reply: exactReplies['salary insights'] },
    { keys: ['improv', 'tip', 'suggest', 'better', 'fix'],     reply: exactReplies['how to improve my resume'] },
    { keys: ['city', 'cities', 'location', 'where', 'move'],   reply: exactReplies['best cities for my career'] },
    { keys: ['history', 'previous', 'past', 'old', 'saved'],   reply: exactReplies['view previous analyses'] },
    { keys: ['login', 'signup', 'sign up', 'register', 'password', 'account'], reply: exactReplies['login or signup help'] },
    { keys: ['pdf', 'docx', 'format', 'type', 'extension'],    reply: exactReplies['what file types are supported'] },
    { keys: ['support', 'help', 'contact', 'email', 'issue'],  reply: exactReplies['contact support'] },
    { keys: ['job', 'role', 'position', 'career', 'work'],     reply: `After analysis, the Job Roles card lists positions that match your resume — like "Frontend Developer", "Data Analyst", etc. These are ranked by how well your skills align. 💼` },
    { keys: ['chart', 'graph', 'visual', 'compare'],           reply: `The salary chart at the bottom of your results compares pay across different job roles that match your profile. Hover over bars to see exact figures! 📊` },
    { keys: ['logout', 'log out', 'sign out'],                 reply: `To log out, click the "Logout" button in the top-right profile section. Your analyses are saved and will be there when you return. 👋` },
    { keys: ['how', 'work', 'what is', 'explain'],             reply: `AI Resume Analyzer works in 3 steps:\n1️⃣ Upload your resume (PDF/DOCX)\n2️⃣ Our AI reads and extracts key info\n3️⃣ You get skills, job roles, salary ranges, city suggestions & improvement tips — all in one dashboard!` },
  ];

  const fallbacks = [
    `I'm here to help with resume uploads, skill detection, salary insights, and more. Could you rephrase that so I can assist better? 😊`,
    `Hmm, I didn't quite catch that. Try asking about uploading, salary, skills, or job roles!`,
    `I'm still learning! For complex issues, try contacting support at support@airesumematcher.com 🙂`,
  ];
  let fallbackIdx = 0;

  /* ══════════════════════════════════════
     HELPERS
  ══════════════════════════════════════ */
  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addBotMessage(text) {
    const row = document.createElement('div');
    row.className = 'cb-row';
    row.innerHTML = `
      <div class="cb-msg-av">🤖</div>
      <div class="cb-bubble cb-bot">${escHtml(text)}</div>
    `;
    messages.appendChild(row);
    scrollBottom();
  }

  function addUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'cb-row cb-user';
    row.innerHTML = `<div class="cb-bubble cb-user">${escHtml(text)}</div>`;
    messages.appendChild(row);
    scrollBottom();
  }

  function escHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  function showTyping() {
    typingRow.style.display = 'flex';
    scrollBottom();
  }

  function hideTyping() {
    typingRow.style.display = 'none';
  }

  function getReply(text) {
    const lower = text.toLowerCase().trim();

    // Exact match first
    if (exactReplies[lower]) return exactReplies[lower];

    // Keyword match
    for (const { keys, reply } of keywordReplies) {
      if (keys.some(k => lower.includes(k))) return reply;
    }

    // Fallback
    return fallbacks[fallbackIdx++ % fallbacks.length];
  }

  function botReply(userText) {
    showTyping();
    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      hideTyping();
      addBotMessage(getReply(userText));
      if (!isOpen) showBadge();
    }, delay);
  }

  function showBadge() {
    badge.textContent = '1';
    badge.classList.remove('cb-hidden');
  }

  function hideBadge() {
    badge.classList.add('cb-hidden');
  }

  /* ══════════════════════════════════════
     TOGGLE
  ══════════════════════════════════════ */
  function toggleChat() {
    isOpen = !isOpen;
    chatWin.classList.toggle('cb-open', isOpen);
    bubble.classList.toggle('cb-active', isOpen);
    if (isOpen) {
      hideBadge();
      setTimeout(() => input.focus(), 300);
    }
  }

  bubble.addEventListener('click', toggleChat);

  /* ══════════════════════════════════════
     SEND
  ══════════════════════════════════════ */
  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';
    hideQuickReplies();
    botReply(text);
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  /* ══════════════════════════════════════
     QUICK REPLIES
  ══════════════════════════════════════ */
  function hideQuickReplies() {
    quickReps.style.display = 'none';
  }

  // Attach click to all quick-reply buttons
  document.querySelectorAll('.cb-qr').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim();
      addUserMessage(text);
      hideQuickReplies();
      botReply(text);
    });
  });

  /* ══════════════════════════════════════
     BOOT — greeting after short delay
  ══════════════════════════════════════ */
  setTimeout(() => {
    addBotMessage("👋 Hi! I'm ResumeBot — your AI assistant. I can help you upload your resume, understand your results, or answer anything about the analyzer. How can I help?");
  }, 600);

  // Show badge after 3s to draw attention
  setTimeout(() => {
    if (!isOpen) showBadge();
  }, 3000);

})();
