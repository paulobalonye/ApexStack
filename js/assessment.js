/* ============================================
   ApexStack Cloud Readiness Assessment
   Scoring, Navigation, Email Capture & Results
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ===== CONFIG =====
  var TOTAL_QUESTIONS = 12;
  var API_ENDPOINT = 'https://apexstack-api.noreplyhitchafrica.workers.dev/api/assessment';

  // Store last result for PDF generation
  var lastResult = null;
  var lastCapture = null;

  // Max scores per category (sum of max option values)
  var CATEGORY_MAX = {
    architecture: 18,
    security: 28,
    deployment: 17,
    monitoring: 26,
    cost: 17
  };

  var TOTAL_MAX = 106;

  // Risk/Recommendation mapping per category
  var INSIGHTS = {
    architecture: {
      risk: 'Infrastructure is manually managed, increasing risk of configuration drift, human error, and slow disaster recovery.',
      rec: 'Adopt Infrastructure as Code (Terraform or Pulumi) with version control and peer-reviewed changes for all environments.'
    },
    security: {
      risk: 'Security gaps in secrets management, vulnerability scanning, or compliance posture expose you to breaches and regulatory penalties.',
      rec: 'Implement a centralized secrets vault with rotation, automated DevSecOps scanning in CI/CD, and pursue SOC 2 or PCI-DSS certification.'
    },
    deployment: {
      risk: 'Slow or manual deployment processes create bottlenecks, increase time-to-market, and raise the risk of failed releases.',
      rec: 'Build automated CI/CD pipelines with staging environments, canary deployments, and automatic rollback capabilities.'
    },
    monitoring: {
      risk: 'Limited observability and no disaster recovery plan mean outages go undetected and recovery is slow and unpredictable.',
      rec: 'Deploy a full observability stack (metrics, logs, traces) with SLOs, automated alerting, and a tested disaster recovery plan.'
    },
    cost: {
      risk: 'Without active cost management and auto-scaling, cloud spend grows faster than revenue and resources are wasted during low-traffic periods.',
      rec: 'Establish a FinOps practice with real-time cost dashboards, rightsizing automation, reserved instances, and predictive auto-scaling.'
    }
  };

  // Score level definitions
  function getLevel(score) {
    if (score <= 30) return {
      label: 'High Risk',
      cls: 'score-high-risk',
      summary: 'Your cloud infrastructure has significant gaps that put your platform at risk. Manual processes, limited security, and no cost optimization are common at this stage. The good news: targeted improvements can dramatically improve your posture in weeks, not months.'
    };
    if (score <= 60) return {
      label: 'Needs Improvement',
      cls: 'score-needs-improvement',
      summary: 'You have some foundations in place, but critical gaps remain in security, deployment automation, or observability. Addressing the top risks below will significantly reduce your exposure and improve engineering velocity.'
    };
    if (score <= 80) return {
      label: 'Production-Ready',
      cls: 'score-production-ready',
      summary: 'Your infrastructure is solid with good practices across most categories. Focus on the remaining gaps to move from good to exceptional and unlock enterprise-grade reliability and efficiency.'
    };
    return {
      label: 'Enterprise-Grade',
      cls: 'score-enterprise-grade',
      summary: 'Your cloud infrastructure follows industry best practices across the board. You are well-positioned for scale, compliance audits, and operational excellence. Consider ongoing optimization and chaos engineering to stay ahead.'
    };
  }

  // ===== STATE =====
  var currentQuestion = 1;
  var answers = {};

  // ===== DOM REFS =====
  var questions = document.querySelectorAll('.assessment-question');
  var progressBar = document.getElementById('progress-bar');
  var progressCurrent = document.getElementById('progress-current');
  var btnPrev = document.getElementById('btn-prev');
  var btnNext = document.getElementById('btn-next');
  var captureSection = document.getElementById('assessment-capture');
  var captureForm = document.getElementById('capture-form');
  var resultsSection = document.getElementById('assessment-results');
  var assessmentQuestions = document.getElementById('assessment-questions');
  var assessmentNav = document.querySelector('.assessment-nav');
  var progressText = document.querySelector('.assessment-progress-text');
  var progressContainer = document.querySelector('.assessment-progress');

  // Safety check
  if (!btnNext || !btnPrev || !progressBar || !assessmentQuestions) {
    console.error('Assessment: Required DOM elements not found');
    return;
  }

  // ===== NAVIGATION =====
  function showQuestion(num) {
    questions.forEach(function (q) {
      q.classList.remove('active');
    });
    var target = document.querySelector('[data-question="' + num + '"]');
    if (target) target.classList.add('active');

    progressCurrent.textContent = num;
    progressBar.style.width = ((num / TOTAL_QUESTIONS) * 100) + '%';

    btnPrev.disabled = (num === 1);

    // Check if current question has an answer
    var radio = document.querySelector('input[name="q' + num + '"]:checked');
    if (num <= TOTAL_QUESTIONS) {
      btnNext.disabled = !radio;
      btnNext.textContent = (num === TOTAL_QUESTIONS) ? 'See My Score' : 'Next';
    }
  }

  // Listen for radio selections
  var allRadios = document.querySelectorAll('.assessment-options input[type="radio"]');
  for (var i = 0; i < allRadios.length; i++) {
    allRadios[i].addEventListener('change', function () {
      var qNum = parseInt(this.name.replace('q', ''));
      answers[qNum] = parseInt(this.value);
      btnNext.disabled = false;
    });
  }

  btnNext.addEventListener('click', function () {
    if (currentQuestion < TOTAL_QUESTIONS) {
      currentQuestion++;
      showQuestion(currentQuestion);
    } else {
      showCapture();
    }
  });

  btnPrev.addEventListener('click', function () {
    if (currentQuestion > 1) {
      currentQuestion--;
      showQuestion(currentQuestion);
    }
  });

  // ===== EMAIL CAPTURE =====
  function showCapture() {
    assessmentQuestions.style.display = 'none';
    assessmentNav.style.display = 'none';
    progressContainer.style.display = 'none';
    progressText.style.display = 'none';
    captureSection.style.display = 'block';
    window.scrollTo({ top: captureSection.offsetTop - 120, behavior: 'smooth' });
  }

  captureForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('capture-name').value.trim();
    var email = document.getElementById('capture-email').value.trim();
    var company = document.getElementById('capture-company').value.trim();
    var phone = document.getElementById('capture-phone').value.trim();
    var role = document.getElementById('capture-role').value;

    if (!name || !email || !company || !phone || !role) return;

    // Disable submit button
    var submitBtn = captureForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Generating Report...';
    }

    // Calculate scores
    var result = calculateScores();

    // Build detailed answers string for backend
    var answersDetail = buildAnswersDetail();

    // Store result data for PDF generation
    lastResult = result;
    lastCapture = { name: name, email: email, company: company };

    // Send to Worker API (Resend emails + HubSpot CRM + Web3Forms + D1)
    sendToWorker(name, email, company, phone, role, result, answersDetail);

    // Show results immediately (don't wait for API)
    showResults(result);

    // GA4 event tracking
    if (typeof gtag === 'function') {
      gtag('event', 'assessment_complete', {
        event_category: 'assessment',
        event_label: result.level.label,
        value: result.score,
      });
    }
    // Meta Pixel tracking
    if (typeof fbq === 'function') {
      fbq('track', 'CompleteRegistration', { value: result.score, currency: 'USD' });
    }
  });

  // ===== SCORING =====
  function calculateScores() {
    var categoryScores = {
      architecture: 0,
      security: 0,
      deployment: 0,
      monitoring: 0,
      cost: 0
    };

    var qMap = {
      1: 'architecture', 2: 'architecture',
      3: 'security', 4: 'security', 12: 'security',
      5: 'deployment', 6: 'deployment',
      7: 'monitoring', 8: 'monitoring', 9: 'monitoring',
      10: 'cost', 11: 'cost'
    };

    var totalRaw = 0;
    for (var q = 1; q <= TOTAL_QUESTIONS; q++) {
      var val = answers[q] || 0;
      var cat = qMap[q];
      categoryScores[cat] += val;
      totalRaw += val;
    }

    var normalizedScore = Math.round((totalRaw / TOTAL_MAX) * 100);

    var categoryPct = {};
    for (var c in categoryScores) {
      categoryPct[c] = Math.round((categoryScores[c] / CATEGORY_MAX[c]) * 100);
    }

    var sorted = Object.keys(categoryPct).sort(function (a, b) {
      return categoryPct[a] - categoryPct[b];
    });

    var risks = [];
    var recs = [];
    for (var j = 0; j < Math.min(3, sorted.length); j++) {
      var sortedCat = sorted[j];
      if (categoryPct[sortedCat] < 80) {
        risks.push(INSIGHTS[sortedCat].risk);
        recs.push(INSIGHTS[sortedCat].rec);
      }
    }

    if (risks.length === 0) {
      risks.push('Your infrastructure is strong across all categories. Continue regular reviews to maintain your posture.');
      recs.push('Consider chaos engineering and game-day exercises to validate resilience under real failure conditions.');
    }

    return {
      score: normalizedScore,
      level: getLevel(normalizedScore),
      categoryScores: categoryScores,
      categoryPct: categoryPct,
      risks: risks,
      recs: recs
    };
  }

  // ===== BUILD ANSWERS DETAIL =====
  function buildAnswersDetail() {
    var detail = '';
    for (var q = 1; q <= TOTAL_QUESTIONS; q++) {
      var questionEl = document.querySelector('[data-question="' + q + '"] h2');
      var selectedOption = document.querySelector('input[name="q' + q + '"]:checked');
      if (questionEl && selectedOption) {
        var optionLabel = selectedOption.closest('.assessment-option');
        var spans = optionLabel.querySelectorAll('.assessment-option-inner > span');
        var optionText = spans.length > 1 ? spans[spans.length - 1].textContent.trim() : 'N/A';
        detail += 'Q' + q + ': ' + questionEl.textContent + '\nAnswer: ' + optionText + ' (Score: ' + answers[q] + ')\n\n';
      }
    }
    return detail;
  }

  // ===== SEND TO WORKER API =====
  function sendToWorker(name, email, company, phone, role, result, answersDetail) {
    var payload = {
      name: name,
      email: email,
      company: company,
      phone: phone,
      role: role,
      score: result.score,
      level: result.level.label,
      categoryScores: result.categoryScores,
      categoryPct: result.categoryPct,
      risks: result.risks,
      recs: result.recs,
      answers: answersDetail
    };

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (data.success) {
        console.log('Assessment submitted successfully:', data);
      } else {
        console.log('API submission error:', data);
      }
    }).catch(function (err) {
      console.log('Submission network error:', err);
    });
  }

  // ===== RESULTS DISPLAY =====
  function showResults(result) {
    captureSection.style.display = 'none';
    resultsSection.style.display = 'block';

    window.scrollTo({ top: resultsSection.offsetTop - 120, behavior: 'smooth' });

    // Animate score circle
    var ring = document.getElementById('score-ring');
    var circumference = 2 * Math.PI * 90;
    var offset = circumference - (result.score / 100) * circumference;

    setTimeout(function () {
      ring.style.transition = 'stroke-dashoffset 1.5s ease';
      ring.style.strokeDashoffset = offset;

      if (result.score <= 30) ring.style.stroke = '#dc2626';
      else if (result.score <= 60) ring.style.stroke = '#f59e0b';
      else if (result.score <= 80) ring.style.stroke = '#4a7a00';
      else ring.style.stroke = '#059669';
    }, 200);

    // Animate number
    animateNumber(document.getElementById('score-number'), 0, result.score, 1500);

    // Level label
    var levelEl = document.getElementById('score-level');
    levelEl.textContent = result.level.label;
    levelEl.className = result.level.cls;

    document.getElementById('score-summary').textContent = result.level.summary;

    // Category bars
    var categories = ['architecture', 'security', 'deployment', 'monitoring', 'cost'];
    categories.forEach(function (cat) {
      document.getElementById('cat-' + cat + '-score').textContent = result.categoryScores[cat] + '/' + CATEGORY_MAX[cat];
      setTimeout(function () {
        var bar = document.getElementById('cat-' + cat + '-bar');
        bar.style.width = result.categoryPct[cat] + '%';

        if (result.categoryPct[cat] <= 30) bar.style.background = '#dc2626';
        else if (result.categoryPct[cat] <= 60) bar.style.background = '#f59e0b';
        else if (result.categoryPct[cat] <= 80) bar.style.background = '#4a7a00';
        else bar.style.background = '#059669';
      }, 400);
    });

    // Risks
    var risksList = document.getElementById('risks-list');
    risksList.innerHTML = '';
    result.risks.forEach(function (risk) {
      var li = document.createElement('li');
      li.textContent = risk;
      risksList.appendChild(li);
    });

    // Recommendations
    var recsList = document.getElementById('recs-list');
    recsList.innerHTML = '';
    result.recs.forEach(function (rec) {
      var li = document.createElement('li');
      li.textContent = rec;
      recsList.appendChild(li);
    });
  }

  // Number animation
  function animateNumber(el, start, end, duration) {
    var startTime = null;
    function frame(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ===== PDF REPORT GENERATION =====
  var pdfBtn = document.getElementById('btn-download-pdf');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', function () {
      if (!lastResult || !lastCapture) return;

      // GA4 event
      if (typeof gtag === 'function') {
        gtag('event', 'pdf_download', {
          event_category: 'assessment',
          event_label: 'cloud_readiness_report',
          value: lastResult.score,
        });
      }

      generatePDFReport(lastResult, lastCapture);
    });
  }

  function generatePDFReport(result, capture) {
    if (typeof window.jspdf === 'undefined') {
      alert('PDF library is loading. Please try again in a moment.');
      return;
    }

    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    var W = 210;
    var y = 0;

    // Colors
    var black = [0, 0, 0];
    var white = [255, 255, 255];
    var lime = [184, 230, 0];
    var gray = [156, 163, 175];
    var darkGray = [107, 114, 128];
    var cardBg = [17, 17, 17];

    function getScoreColor(s) {
      if (s <= 30) return [220, 38, 38];
      if (s <= 60) return [245, 158, 11];
      if (s <= 80) return [74, 122, 0];
      return [5, 150, 105];
    }

    // Background
    doc.setFillColor.apply(doc, black);
    doc.rect(0, 0, W, 297, 'F');

    // Logo area
    y = 20;
    doc.setFillColor.apply(doc, lime);
    doc.roundedRect(20, y, 10, 10, 2, 2, 'F');
    doc.setTextColor.apply(doc, black);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('A', 25, y + 7.5, { align: 'center' });
    doc.setTextColor.apply(doc, white);
    doc.setFontSize(16);
    doc.text('ApexStack Cloud', 34, y + 7);

    // Date
    var today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setTextColor.apply(doc, darkGray);
    doc.setFontSize(9);
    doc.text(today, W - 20, y + 7, { align: 'right' });

    // Title
    y += 25;
    doc.setTextColor.apply(doc, white);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Cloud Readiness Report', 20, y);

    // Name & Company
    y += 10;
    doc.setTextColor.apply(doc, gray);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Prepared for: ' + capture.name + (capture.company ? ' (' + capture.company + ')' : ''), 20, y);

    // Score circle area
    y += 18;
    var scoreColor = getScoreColor(result.score);
    doc.setFillColor(17, 17, 17);
    doc.roundedRect(20, y, W - 40, 45, 4, 4, 'F');
    doc.setDrawColor(34, 34, 34);
    doc.roundedRect(20, y, W - 40, 45, 4, 4, 'S');

    // Score number
    doc.setTextColor.apply(doc, scoreColor);
    doc.setFontSize(42);
    doc.setFont('helvetica', 'bold');
    doc.text(String(result.score), W / 2, y + 22, { align: 'center' });
    doc.setTextColor.apply(doc, darkGray);
    doc.setFontSize(16);
    doc.text('/100', W / 2, y + 32, { align: 'center' });

    // Level badge
    doc.setFontSize(10);
    doc.setTextColor.apply(doc, scoreColor);
    doc.text(result.level.label, W / 2, y + 40, { align: 'center' });

    // Category breakdown
    y += 55;
    doc.setFillColor(17, 17, 17);
    doc.roundedRect(20, y, W - 40, 75, 4, 4, 'F');
    doc.setDrawColor(34, 34, 34);
    doc.roundedRect(20, y, W - 40, 75, 4, 4, 'S');

    doc.setTextColor.apply(doc, white);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Category Breakdown', 28, y + 10);

    var catLabels = {
      architecture: 'Architecture & IaC',
      security: 'Security & Compliance',
      deployment: 'Deployment & DevOps',
      monitoring: 'Monitoring & Reliability',
      cost: 'Cost Optimization'
    };

    var cy = y + 20;
    var barWidth = W - 80;
    var cats = Object.keys(result.categoryPct);
    for (var i = 0; i < cats.length; i++) {
      var cat = cats[i];
      var pct = result.categoryPct[cat];
      var catColor = getScoreColor(pct);

      doc.setTextColor.apply(doc, gray);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(catLabels[cat] || cat, 28, cy);
      doc.setTextColor.apply(doc, catColor);
      doc.text(pct + '%', W - 28, cy, { align: 'right' });

      // Bar background
      doc.setFillColor(26, 26, 26);
      doc.roundedRect(28, cy + 1, barWidth, 3, 1.5, 1.5, 'F');
      // Bar fill
      var fillWidth = (pct / 100) * barWidth;
      if (fillWidth > 0) {
        doc.setFillColor.apply(doc, catColor);
        doc.roundedRect(28, cy + 1, Math.max(fillWidth, 3), 3, 1.5, 1.5, 'F');
      }

      cy += 11;
    }

    // Risks section
    y = cy + 8;
    if (result.risks && result.risks.length > 0) {
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('TOP RISKS IDENTIFIED', 20, y);
      y += 6;
      doc.setTextColor.apply(doc, gray);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      for (var r = 0; r < Math.min(result.risks.length, 3); r++) {
        var riskLines = doc.splitTextToSize('• ' + result.risks[r], W - 45);
        doc.text(riskLines, 24, y);
        y += riskLines.length * 4.5;
      }
      y += 4;
    }

    // Recommendations section
    if (result.recs && result.recs.length > 0) {
      doc.setTextColor.apply(doc, lime);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('OUR RECOMMENDATIONS', 20, y);
      y += 6;
      doc.setTextColor.apply(doc, gray);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      for (var rc = 0; rc < Math.min(result.recs.length, 3); rc++) {
        var recLines = doc.splitTextToSize('• ' + result.recs[rc], W - 45);
        doc.text(recLines, 24, y);
        y += recLines.length * 4.5;
      }
    }

    // Footer
    y = 280;
    doc.setDrawColor(34, 34, 34);
    doc.line(20, y, W - 20, y);
    doc.setTextColor.apply(doc, darkGray);
    doc.setFontSize(8);
    doc.text('Generated by ApexStack Cloud | apexstackcloud.com', W / 2, y + 6, { align: 'center' });
    doc.text('Book a strategy session: meetings-na2.hubspot.com/apexstack', W / 2, y + 11, { align: 'center' });

    // Save
    var filename = 'Cloud-Readiness-Report-' + capture.company.replace(/[^a-zA-Z0-9]/g, '-') + '.pdf';
    doc.save(filename);
  }

  // Init
  showQuestion(1);

});
