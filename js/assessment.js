/* ============================================
   ApexStack Cloud Readiness Assessment
   Scoring, Navigation, Email Capture & Results
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ===== CONFIG =====
  var TOTAL_QUESTIONS = 12;
  var WEB3FORMS_KEY = 'mojnqjdk';
  var RECIPIENT_EMAIL = 'info@apexstackcloud.com';

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
    var role = document.getElementById('capture-role').value;

    if (!name || !email || !company || !role) return;

    // Disable submit button
    var submitBtn = captureForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Generating Report...';
    }

    // Calculate scores
    var result = calculateScores();

    // Send to Web3Forms
    sendToWeb3Forms(name, email, company, role, result);

    // Show results
    showResults(result);
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

  // ===== WEB3FORMS =====
  function sendToWeb3Forms(name, email, company, role, result) {
    var categoryBreakdown = '';
    categoryBreakdown += 'Architecture: ' + result.categoryScores.architecture + '/' + CATEGORY_MAX.architecture + ' (' + result.categoryPct.architecture + '%)\n';
    categoryBreakdown += 'Security: ' + result.categoryScores.security + '/' + CATEGORY_MAX.security + ' (' + result.categoryPct.security + '%)\n';
    categoryBreakdown += 'Deployment & DevOps: ' + result.categoryScores.deployment + '/' + CATEGORY_MAX.deployment + ' (' + result.categoryPct.deployment + '%)\n';
    categoryBreakdown += 'Monitoring & Reliability: ' + result.categoryScores.monitoring + '/' + CATEGORY_MAX.monitoring + ' (' + result.categoryPct.monitoring + '%)\n';
    categoryBreakdown += 'Cost Optimization: ' + result.categoryScores.cost + '/' + CATEGORY_MAX.cost + ' (' + result.categoryPct.cost + '%)';

    var risksText = result.risks.map(function (r, idx) { return (idx + 1) + '. ' + r; }).join('\n');
    var recsText = result.recs.map(function (r, idx) { return (idx + 1) + '. ' + r; }).join('\n');

    var answersDetail = '';
    for (var q = 1; q <= TOTAL_QUESTIONS; q++) {
      var questionEl = document.querySelector('[data-question="' + q + '"] h2');
      var selectedOption = document.querySelector('input[name="q' + q + '"]:checked');
      if (questionEl && selectedOption) {
        var optionLabel = selectedOption.closest('.assessment-option');
        var spans = optionLabel.querySelectorAll('.assessment-option-inner > span');
        var optionText = spans.length > 1 ? spans[spans.length - 1].textContent.trim() : 'N/A';
        answersDetail += 'Q' + q + ': ' + questionEl.textContent + '\nAnswer: ' + optionText + ' (Score: ' + answers[q] + ')\n\n';
      }
    }

    var message = '=== CLOUD READINESS ASSESSMENT RESULT ===\n\n';
    message += 'OVERALL SCORE: ' + result.score + '/100 — ' + result.level.label + '\n\n';
    message += '--- CATEGORY BREAKDOWN ---\n' + categoryBreakdown + '\n\n';
    message += '--- TOP RISKS ---\n' + risksText + '\n\n';
    message += '--- TOP RECOMMENDATIONS ---\n' + recsText + '\n\n';
    message += '--- DETAILED ANSWERS ---\n' + answersDetail;

    var formData = new FormData();
    formData.append('access_key', WEB3FORMS_KEY);
    formData.append('subject', 'Cloud Readiness Assessment: ' + company + ' — Score: ' + result.score + '/100 (' + result.level.label + ')');
    formData.append('from_name', 'ApexStack Cloud Readiness Assessment');
    formData.append('to', RECIPIENT_EMAIL);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('company', company);
    formData.append('role', role);
    formData.append('score', result.score + '/100');
    formData.append('readiness_level', result.level.label);
    formData.append('message', message);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (data.success) {
        console.log('Assessment submitted successfully');
      } else {
        console.log('Web3Forms submission error:', data);
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

  // Init
  showQuestion(1);

});
