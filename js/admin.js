/**
 * ApexStack Admin Dashboard — Single Page Application
 * Vanilla JS, no frameworks. Communicates with Cloudflare Worker API.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8787/api/admin'
    : '/api/admin';

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  let token = localStorage.getItem('admin_token');
  let currentTemplateKey = null;
  let editorView = null;
  let previewDebounceTimer = null;
  let currentSampleData = null;

  // ---------------------------------------------------------------------------
  // Category Labels
  // ---------------------------------------------------------------------------

  const CATEGORY_LABELS = {
    assessment: 'Assessment Drip',
    contact: 'Contact Nurture',
    meeting: 'Meeting & Sales',
    hiring: 'Hiring Pipeline',
    internal: 'Internal Alerts',
    lifecycle: 'Client Lifecycle',
  };

  function getCategoryLabel(category) {
    return CATEGORY_LABELS[category] || category || 'Uncategorized';
  }

  // ---------------------------------------------------------------------------
  // Inline SVG Icons
  // ---------------------------------------------------------------------------

  const RECIPIENT_ICONS = {
    lead: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    applicant: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    team: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    client: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 21V9h6v12"/><path d="M3 9h18"/></svg>',
    contact: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  };

  function getRecipientIcon(recipientType) {
    if (!recipientType) return RECIPIENT_ICONS.lead;
    var key = recipientType.toLowerCase();
    return RECIPIENT_ICONS[key] || RECIPIENT_ICONS.lead;
  }

  // ---------------------------------------------------------------------------
  // Utility: Debounce
  // ---------------------------------------------------------------------------

  function debounce(fn, ms) {
    let timer;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, ms);
    };
  }

  // ---------------------------------------------------------------------------
  // Utility: Escape HTML
  // ---------------------------------------------------------------------------

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // View Management
  // ---------------------------------------------------------------------------

  function showView(viewId) {
    var views = document.querySelectorAll('.view');
    views.forEach(function (v) {
      v.classList.remove('active');
    });
    var target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
    }
  }

  // ---------------------------------------------------------------------------
  // API Helper
  // ---------------------------------------------------------------------------

  async function api(path, options) {
    if (!options) options = {};
    var headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    var mergedHeaders = Object.assign({}, headers, options.headers || {});
    var fetchOptions = Object.assign({}, options, { headers: mergedHeaders });

    try {
      var res = await fetch(API_BASE + path, fetchOptions);
      if (res.status === 401) {
        logout();
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error('API error:', err);
      showToast('Network error. Please try again.', 'error');
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Toast Notifications
  // ---------------------------------------------------------------------------

  function showToast(message, type) {
    if (!type) type = 'success';
    var container = document.getElementById('toast-container');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('toast-exit');
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // ---------------------------------------------------------------------------
  // Confirm Dialog
  // ---------------------------------------------------------------------------

  function showConfirm(title, message) {
    return new Promise(function (resolve) {
      document.getElementById('confirm-title').textContent = title;
      document.getElementById('confirm-message').textContent = message;
      document.getElementById('confirm-overlay').classList.add('visible');

      var onOk = function () { cleanup(); resolve(true); };
      var onCancel = function () { cleanup(); resolve(false); };
      var cleanup = function () {
        document.getElementById('confirm-overlay').classList.remove('visible');
        document.getElementById('confirm-ok').removeEventListener('click', onOk);
        document.getElementById('confirm-cancel').removeEventListener('click', onCancel);
      };

      document.getElementById('confirm-ok').addEventListener('click', onOk);
      document.getElementById('confirm-cancel').addEventListener('click', onCancel);
    });
  }

  // ---------------------------------------------------------------------------
  // Counter Animation
  // ---------------------------------------------------------------------------

  function animateCounter(element, target) {
    if (!element) return;
    var current = 0;
    var increment = Math.ceil(target / 30);
    if (increment < 1) increment = 1;
    var timer = setInterval(function () {
      current = Math.min(current + increment, target);
      element.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 30);
  }

  // ---------------------------------------------------------------------------
  // Login Flow
  // ---------------------------------------------------------------------------

  function initLogin() {
    var form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var username = document.getElementById('username').value.trim();
      var password = document.getElementById('password').value;
      var btn = form.querySelector('button[type="submit"]');
      var btnText = btn.querySelector('.btn-text');
      var btnLoader = btn.querySelector('.btn-loader');
      var errorEl = document.getElementById('login-error');

      // Hide previous errors
      if (errorEl) errorEl.classList.add('hidden');

      // Show loading state
      if (btnText) btnText.classList.add('hidden');
      if (btnLoader) btnLoader.classList.remove('hidden');
      btn.disabled = true;

      try {
        var data = await api('/login', {
          method: 'POST',
          body: JSON.stringify({ username: username, password: password }),
        });

        if (data && data.success) {
          token = data.token;
          localStorage.setItem('admin_token', token);
          await loadDashboard();
          showView('dashboard-view');
        } else {
          var msg = (data && data.error) ? data.error : 'Invalid credentials. Please try again.';
          if (errorEl) {
            errorEl.textContent = msg;
            errorEl.classList.remove('hidden');
          }
        }
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = 'An error occurred. Please try again.';
          errorEl.classList.remove('hidden');
        }
      } finally {
        // Restore button state
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoader) btnLoader.classList.add('hidden');
        btn.disabled = false;
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  function logout() {
    token = null;
    localStorage.removeItem('admin_token');
    currentTemplateKey = null;
    currentSampleData = null;
    if (editorView) {
      editorView.destroy();
      editorView = null;
    }
    showView('login-view');
  }

  // ---------------------------------------------------------------------------
  // Dashboard: Load Stats & Templates
  // ---------------------------------------------------------------------------

  async function loadDashboard() {
    var [statsData, templatesData] = await Promise.all([
      api('/stats'),
      api('/templates'),
    ]);

    // Populate stats
    if (statsData && statsData.success) {
      var stats = statsData.stats;
      animateCounter(document.getElementById('stat-total'), stats.total || 0);
      animateCounter(document.getElementById('stat-customized'), stats.customized || 0);
      animateCounter(document.getElementById('stat-default'), stats.default || 0);
    }

    // Populate template grid
    if (templatesData && templatesData.success) {
      renderTemplateGrid(templatesData.templates || []);
    }

    // Reset category tabs
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.classList.remove('active');
    });
    var allTab = document.querySelector('.tab[data-category=""]');
    if (allTab) allTab.classList.add('active');

    // Reset search
    var searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
  }

  // ---------------------------------------------------------------------------
  // Dashboard: Render Template Grid
  // ---------------------------------------------------------------------------

  function renderTemplateGrid(templates) {
    var grid = document.getElementById('template-grid');
    var emptyState = document.getElementById('empty-state');

    if (!grid) return;

    if (!templates || templates.length === 0) {
      grid.innerHTML = '';
      grid.style.display = 'none';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    grid.style.display = '';

    grid.innerHTML = templates.map(function (t, index) {
      var customizedClass = t.is_customized ? 'customized' : '';
      var dotClass = t.is_customized ? 'dot-customized' : 'dot-default';
      var dotTitle = t.is_customized ? 'Customized' : 'Default';
      var editedHtml = t.last_edited_at
        ? '<div class="card-edited">Edited ' + new Date(t.last_edited_at).toLocaleDateString() + '</div>'
        : '';
      var recipientIcon = getRecipientIcon(t.recipient_type);

      return '<div class="template-card ' + customizedClass + '" data-key="' + escapeHtml(t.template_key) + '" style="animation-delay: ' + (index * 0.05) + 's">'
        + '<div class="card-header">'
        +   '<span class="card-category-badge badge-' + escapeHtml(t.category) + '">' + escapeHtml(getCategoryLabel(t.category)) + '</span>'
        +   '<span class="card-status-dot ' + dotClass + '" title="' + dotTitle + '"></span>'
        + '</div>'
        + '<h3 class="card-title">' + escapeHtml(t.name) + '</h3>'
        + '<p class="card-subject">' + escapeHtml(t.subject || '') + '</p>'
        + '<div class="card-footer">'
        +   '<span class="card-recipient">' + recipientIcon + ' ' + escapeHtml(t.recipient_type || 'N/A') + '</span>'
        +   '<span class="card-trigger">' + escapeHtml(t.trigger_description || '') + '</span>'
        + '</div>'
        + editedHtml
        + '</div>';
    }).join('');

    // Attach click handlers to cards
    var cards = grid.querySelectorAll('.template-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var key = card.getAttribute('data-key');
        if (key) openEditor(key);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Dashboard: Load Templates (with optional filter/search)
  // ---------------------------------------------------------------------------

  async function loadTemplates(category, search) {
    var params = [];
    if (category && category !== 'all') {
      params.push('category=' + encodeURIComponent(category));
    }
    if (search) {
      params.push('search=' + encodeURIComponent(search));
    }
    var queryString = params.length > 0 ? '?' + params.join('&') : '';

    var data = await api('/templates' + queryString);
    if (data && data.success) {
      renderTemplateGrid(data.templates || []);
    }
  }

  // ---------------------------------------------------------------------------
  // Dashboard: Category Tabs
  // ---------------------------------------------------------------------------

  function initCategoryTabs() {
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Toggle active state
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var category = tab.getAttribute('data-category') || 'all';
        var searchInput = document.getElementById('search-input');
        var search = searchInput ? searchInput.value.trim() : '';
        loadTemplates(category, search);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Dashboard: Search
  // ---------------------------------------------------------------------------

  function initSearch() {
    var searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    var debouncedSearch = debounce(function () {
      var search = searchInput.value.trim();
      var activeTab = document.querySelector('.tab.active');
      var category = activeTab ? (activeTab.getAttribute('data-category') || 'all') : 'all';
      loadTemplates(category, search);
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);
  }

  // ---------------------------------------------------------------------------
  // Editor: Open
  // ---------------------------------------------------------------------------

  async function openEditor(templateKey) {
    currentTemplateKey = templateKey;

    var data = await api('/templates/' + encodeURIComponent(templateKey));
    if (!data || !data.success) {
      showToast('Failed to load template.', 'error');
      return;
    }

    var template = data.template;
    currentSampleData = template.sample_data || {};

    // Set title and metadata
    var titleEl = document.getElementById('editor-title');
    if (titleEl) titleEl.textContent = template.name || templateKey;

    // Build editor badges (category + status)
    var badgesEl = document.getElementById('editor-badges');
    if (badgesEl) {
      var statusLabel = template.is_customized ? 'Customized' : 'Default';
      var statusClass = template.is_customized ? 'status-customized' : 'status-default';
      badgesEl.innerHTML = '<span class="card-category-badge badge-' + escapeHtml(template.category || '') + '">'
        + escapeHtml(getCategoryLabel(template.category)) + '</span>'
        + '<span class="editor-status-badge ' + statusClass + '">' + statusLabel + '</span>';
    }

    // Set subject input
    var subjectInput = document.getElementById('subject-input');
    if (subjectInput) subjectInput.value = template.subject || '';

    // Render variable chips
    renderVariableChips(template.variables || []);

    // Init CodeMirror
    await initCodeMirror(template.html_content || '');

    // Trigger initial preview
    updatePreview();

    // Show editor view
    showView('editor-view');
  }

  // ---------------------------------------------------------------------------
  // Editor: Variable Chips
  // ---------------------------------------------------------------------------

  function renderVariableChips(variables) {
    var container = document.getElementById('variable-chips');
    if (!container) return;

    if (!variables || variables.length === 0) {
      container.innerHTML = '<span class="no-variables">No variables</span>';
      return;
    }

    container.innerHTML = variables.map(function (varName) {
      return '<button class="variable-chip" data-var="' + escapeHtml(varName) + '">{{' + escapeHtml(varName) + '}}</button>';
    }).join('');

    // Attach click handlers
    var chips = container.querySelectorAll('.variable-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var varName = chip.getAttribute('data-var');
        if (editorView && varName) {
          var cursor = editorView.state.selection.main.head;
          editorView.dispatch({
            changes: { from: cursor, insert: '{{' + varName + '}}' },
          });
          editorView.focus();
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Editor: CodeMirror Initialization
  // ---------------------------------------------------------------------------

  async function initCodeMirror(content) {
    // Destroy existing instance
    if (editorView) {
      editorView.destroy();
      editorView = null;
    }

    var editorContainer = document.getElementById('codemirror-container');
    if (!editorContainer) return;
    editorContainer.innerHTML = '';

    // Wait for CM modules to be available
    if (!window.CM) {
      await new Promise(function (resolve) {
        window.addEventListener('cm-ready', resolve, { once: true });
        // Safety timeout: if CM never loads, resolve after 10s
        setTimeout(resolve, 10000);
      });
    }

    if (!window.CM) {
      editorContainer.textContent = 'Code editor failed to load. Please refresh the page.';
      return;
    }

    var CM = window.CM;

    var debouncedPreview = debounce(function () {
      updatePreview();
    }, 500);

    var updateListener = CM.EditorView.updateListener.of(function (update) {
      if (update.docChanged) {
        debouncedPreview();
      }
    });

    var themeOverride = CM.EditorView.theme({
      '&': { height: '100%' },
      '.cm-scroller': { overflow: 'auto' },
    });

    editorView = new CM.EditorView({
      doc: content,
      extensions: [
        CM.basicSetup,
        CM.html(),
        CM.oneDark,
        updateListener,
        themeOverride,
      ],
      parent: editorContainer,
    });
  }

  // ---------------------------------------------------------------------------
  // Editor: Get Current Content
  // ---------------------------------------------------------------------------

  function getEditorContent() {
    if (editorView) {
      return editorView.state.doc.toString();
    }
    return '';
  }

  // ---------------------------------------------------------------------------
  // Editor: Live Preview
  // ---------------------------------------------------------------------------

  async function updatePreview() {
    if (!currentTemplateKey) return;

    var htmlContent = getEditorContent();
    if (!htmlContent) return;

    var data = await api('/templates/' + encodeURIComponent(currentTemplateKey) + '/preview', {
      method: 'POST',
      body: JSON.stringify({
        html_content: htmlContent,
        sample_data: currentSampleData || {},
      }),
    });

    if (data && data.success) {
      var previewFrame = document.getElementById('preview-frame');
      if (previewFrame) {
        previewFrame.srcdoc = data.html;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Editor: Preview Device Toggle
  // ---------------------------------------------------------------------------

  function initPreviewToggle() {
    var desktopBtn = document.getElementById('preview-desktop');
    var mobileBtn = document.getElementById('preview-mobile');
    var previewFrame = document.getElementById('preview-frame');

    if (desktopBtn) {
      desktopBtn.addEventListener('click', function () {
        desktopBtn.classList.add('active');
        if (mobileBtn) mobileBtn.classList.remove('active');
        if (previewFrame) {
          previewFrame.style.width = '100%';
          previewFrame.style.margin = '0';
        }
      });
    }

    if (mobileBtn) {
      mobileBtn.addEventListener('click', function () {
        mobileBtn.classList.add('active');
        if (desktopBtn) desktopBtn.classList.remove('active');
        if (previewFrame) {
          previewFrame.style.width = '375px';
          previewFrame.style.margin = '0 auto';
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Editor: Save
  // ---------------------------------------------------------------------------

  function initSave() {
    var saveBtn = document.getElementById('save-btn');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', async function () {
      if (!currentTemplateKey) return;

      var htmlContent = getEditorContent();
      var subjectInput = document.getElementById('subject-input');
      var subject = subjectInput ? subjectInput.value.trim() : '';

      saveBtn.disabled = true;
      var originalHtml = saveBtn.innerHTML;
      saveBtn.textContent = 'Saving...';

      var data = await api('/templates/' + encodeURIComponent(currentTemplateKey), {
        method: 'PUT',
        body: JSON.stringify({
          html_content: htmlContent,
          subject: subject,
        }),
      });

      saveBtn.disabled = false;
      saveBtn.innerHTML = originalHtml;

      if (data && data.success) {
        showToast('Template saved successfully.');
      } else {
        showToast('Failed to save template.', 'error');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Editor: Reset to Default
  // ---------------------------------------------------------------------------

  function initReset() {
    var resetBtn = document.getElementById('reset-btn');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', async function () {
      if (!currentTemplateKey) return;

      var confirmed = await showConfirm(
        'Reset Template',
        'Are you sure you want to reset this template to its default? Any customizations will be lost.'
      );

      if (!confirmed) return;

      resetBtn.disabled = true;

      var data = await api('/templates/' + encodeURIComponent(currentTemplateKey) + '/reset', {
        method: 'POST',
      });

      resetBtn.disabled = false;

      if (data && data.success) {
        // Update editor with default content
        if (editorView && data.html) {
          editorView.dispatch({
            changes: {
              from: 0,
              to: editorView.state.doc.length,
              insert: data.html,
            },
          });
        }

        // Update subject if returned
        if (data.subject) {
          var subjectInput = document.getElementById('subject-input');
          if (subjectInput) subjectInput.value = data.subject;
        }

        // Update status badge in editor header
        var badgesEl = document.getElementById('editor-badges');
        if (badgesEl) {
          var statusBadge = badgesEl.querySelector('.editor-status-badge');
          if (statusBadge) {
            statusBadge.textContent = 'Default';
            statusBadge.className = 'editor-status-badge status-default';
          }
        }

        showToast('Template reset to default.');
      } else {
        showToast('Failed to reset template.', 'error');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Editor: Send Test Email
  // ---------------------------------------------------------------------------

  function initSendTest() {
    var sendTestBtn = document.getElementById('send-test-btn');
    if (!sendTestBtn) return;

    sendTestBtn.addEventListener('click', async function () {
      if (!currentTemplateKey) return;

      sendTestBtn.disabled = true;
      var originalHtml = sendTestBtn.innerHTML;
      sendTestBtn.textContent = 'Sending...';

      var data = await api('/templates/' + encodeURIComponent(currentTemplateKey) + '/send-test', {
        method: 'POST',
      });

      sendTestBtn.disabled = false;
      sendTestBtn.innerHTML = originalHtml;

      if (data && data.success) {
        showToast('Test email sent to ' + (data.sent_to || 'your email') + '.');
      } else {
        showToast('Failed to send test email.', 'error');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Editor: Back to Dashboard
  // ---------------------------------------------------------------------------

  function initBack() {
    var backBtn = document.getElementById('back-btn');
    if (!backBtn) return;

    backBtn.addEventListener('click', async function () {
      currentTemplateKey = null;
      currentSampleData = null;
      await loadDashboard();
      showView('dashboard-view');
    });
  }

  // ---------------------------------------------------------------------------
  // Logout Button
  // ---------------------------------------------------------------------------

  function initLogout() {
    var logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', function () {
      logout();
    });
  }

  // ---------------------------------------------------------------------------
  // Split Handle Drag Resize
  // ---------------------------------------------------------------------------

  function initSplitHandle() {
    var handle = document.getElementById('split-handle');
    if (!handle) return;

    var isDragging = false;
    var editorPane = document.getElementById('editor-pane');
    var previewPane = document.getElementById('preview-pane');
    var editorContainer = handle.parentElement;

    handle.addEventListener('mousedown', function (e) {
      isDragging = true;
      e.preventDefault();
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      if (!editorPane || !previewPane || !editorContainer) return;

      var containerRect = editorContainer.getBoundingClientRect();
      var offsetX = e.clientX - containerRect.left;
      var containerWidth = containerRect.width;

      // Clamp between 20% and 80%
      var minWidth = containerWidth * 0.2;
      var maxWidth = containerWidth * 0.8;
      var clampedX = Math.max(minWidth, Math.min(maxWidth, offsetX));

      var leftPercent = (clampedX / containerWidth) * 100;
      var rightPercent = 100 - leftPercent;

      editorPane.style.flex = '0 0 ' + leftPercent + '%';
      previewPane.style.flex = '0 0 ' + rightPercent + '%';
    });

    document.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Seed Templates (Admin Utility)
  // ---------------------------------------------------------------------------

  function initSeed() {
    var seedBtn = document.getElementById('seed-btn');
    if (!seedBtn) return;

    seedBtn.addEventListener('click', async function () {
      var confirmed = await showConfirm(
        'Seed Templates',
        'This will seed default templates into the database. Existing defaults will be overwritten. Continue?'
      );

      if (!confirmed) return;

      seedBtn.disabled = true;
      var data = await api('/seed', { method: 'POST' });
      seedBtn.disabled = false;

      if (data && data.success) {
        showToast('Templates seeded successfully (' + (data.seeded || 0) + ' templates).');
        await loadDashboard();
      } else {
        showToast('Failed to seed templates.', 'error');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  async function init() {
    // Bind all event handlers
    initLogin();
    initCategoryTabs();
    initSearch();
    initPreviewToggle();
    initSave();
    initReset();
    initSendTest();
    initBack();
    initLogout();
    initSplitHandle();
    initSeed();

    // Check if already authenticated
    if (token) {
      // Try to load dashboard; if token is expired, the 401 handler will redirect to login
      var data = await api('/stats');
      if (data && data.success) {
        await loadDashboard();
        showView('dashboard-view');
      } else {
        // Token is invalid or expired
        showView('login-view');
      }
    } else {
      showView('login-view');
    }
  }

  // ---------------------------------------------------------------------------
  // DOM Ready
  // ---------------------------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
