function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.id = 'chatgpt-sidebar';
  sidebar.innerHTML = `<iframe src="${chrome.runtime.getURL('sidebar.html')}" style="width:100%;height:100%;border:none;"></iframe>`;
  sidebar.style = 'position:fixed; right:0; top:0; width:300px; height:100vh; background:#f4f4f4; z-index:1000;';
  document.body.appendChild(sidebar);
}

function getEmailThread() {
  const emails = [...document.querySelectorAll('div[role="listitem"]')];
  return emails.map(email => email.innerText).join('\n\n');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSidebar') {
    createSidebar();
    sendResponse({ success: true });
  } else if (request.action === 'getEmailThread') {
    sendResponse({ thread: getEmailThread() });
  }
});
