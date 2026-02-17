/* ============================================
   Unsubscribe Confirmation Page
   Returns branded HTML page confirming
   successful or failed unsubscription
   ============================================ */

export function buildUnsubPage(message, success) {
  const statusColor = success ? '#b8e600' : '#dc2626';
  const statusIcon = success ? '&#10003;' : '&#10007;';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${success ? 'Unsubscribed' : 'Unsubscribe Error'} – ApexStack Cloud</title>
  <meta name="robots" content="noindex, nofollow">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 3rem;
      text-decoration: none;
      color: #fff;
    }
    .logo-icon {
      background: #b8e600;
      color: #000;
      font-weight: 800;
      font-size: 16px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
    }
    .logo-text { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
    .card {
      background: #111;
      border: 1px solid #222;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      max-width: 480px;
      width: 100%;
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: ${statusColor}20;
      color: ${statusColor};
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      border: 2px solid ${statusColor}40;
    }
    .card h1 { font-size: 1.5rem; margin-bottom: 0.75rem; }
    .card p { color: #9ca3af; font-size: 0.95rem; line-height: 1.6; }
    .home-link {
      display: inline-block;
      margin-top: 2rem;
      padding: 12px 28px;
      background: #b8e600;
      color: #000;
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      border-radius: 8px;
    }
    .footer {
      margin-top: 3rem;
      color: #4b5563;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <a href="https://apexstackcloud.com" class="logo">
    <span class="logo-icon">A</span>
    <span class="logo-text">ApexStack Cloud</span>
  </a>

  <div class="card">
    <div class="icon">${statusIcon}</div>
    <h1>${success ? 'Successfully Unsubscribed' : 'Unsubscribe Failed'}</h1>
    <p>${message}</p>
    <a href="https://apexstackcloud.com" class="home-link">Visit ApexStack Cloud</a>
  </div>

  <p class="footer">ApexStack Cloud Technologies Limited</p>
</body>
</html>`;
}
