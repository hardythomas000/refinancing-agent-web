// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Language Switcher Logic
    initLanguageSwitcher();


    // Initialize checklists
    initChecklists();

    // Initialize Metric Explanations
    initMetricModals();

    // Initialize Timeline Countdown
    initTimelineCountdown();

    // Initialize Bottom Navigation
    initBottomNav();
});

// Bottom Navigation Injection & Logic
function initBottomNav() {
    if (document.querySelector('.bottom-nav')) return;

    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';

    // Get current filename to highlight active link
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    // SVG Icons
    const icons = {
        dashboard: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
        timeline: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
        checklist: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        visa: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
        more: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>`
    };

    nav.innerHTML = `
        <a href="index.html" class="bottom-nav-item ${page === 'index.html' || page === '' ? 'active' : ''}">
            ${icons.dashboard}
            <span class="bottom-nav-label" data-i18n="nav-dashboard">Dashboard</span>
        </a>
        <a href="timeline.html" class="bottom-nav-item ${page === 'timeline.html' ? 'active' : ''}">
            ${icons.timeline}
            <span class="bottom-nav-label" data-i18n="nav-timeline">Timeline</span>
        </a>
        <a href="bank-checklist.html" class="bottom-nav-item ${page === 'bank-checklist.html' ? 'active' : ''}">
            ${icons.checklist}
            <span class="bottom-nav-label" data-i18n="nav-checklist">Checklist</span>
        </a>
        <a href="visa-checklist.html" class="bottom-nav-item ${page === 'visa-checklist.html' ? 'active' : ''}">
            ${icons.visa}
            <span class="bottom-nav-label" data-i18n="nav-visa-checklist">Visa</span>
        </a>
        <button class="bottom-nav-item" id="bottomNavMore">
            ${icons.more}
            <span class="bottom-nav-label" data-i18n="nav-more">More</span>
        </button>
    `;

    document.body.appendChild(nav);

    // Initial translation for injected items
    const currentLang = localStorage.getItem('expatFinanceLang') || 'en';
    const translationElements = nav.querySelectorAll('[data-i18n]');
    translationElements.forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    // Add event listener for "More" button
    const bottomNavMore = document.getElementById('bottomNavMore');
    if (bottomNavMore) {
        bottomNavMore.addEventListener('click', function () {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu && navToggle) {
                navMenu.classList.add('active');
                navToggle.classList.add('active');
            }
        });
    }

    // Initialize Reset Button if on a checklist page
    const resetBtn = document.getElementById('resetChecklist');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetChecklist);
    }
}


// Metric Explanations Modal Logic
function initMetricModals() {
    const cards = document.querySelectorAll('.metric-card');
    const modal = document.getElementById('metricModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.modal-close');

    if (!cards.length || !modal) return;

    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function () {
            const metric = this.dataset.metric;
            const lang = document.documentElement.lang || 'en';
            const translationKey = `metric-${metric}-exp`;

            if (translations[lang] && translations[lang][translationKey]) {
                modalBody.innerHTML = translations[lang][translationKey];
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Checklist Persistence with localStorage
function initChecklists() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const storageKey = 'expatFinanceChecklist';

    // Load saved state
    const savedState = JSON.parse(localStorage.getItem(storageKey) || '{}');

    checkboxes.forEach((checkbox, index) => {
        const id = checkbox.dataset.id || `item-${index}`;

        // Restore saved state
        if (savedState[id]) {
            checkbox.classList.add('checked');
            checkbox.closest('.checklist-item')?.classList.add('completed');
        }

        // Handle click
        checkbox.addEventListener('click', function () {
            this.classList.toggle('checked');
            this.closest('.checklist-item')?.classList.toggle('completed');

            // Save state
            const currentState = JSON.parse(localStorage.getItem(storageKey) || '{}');
            currentState[id] = this.classList.contains('checked');
            localStorage.setItem(storageKey, JSON.stringify(currentState));

            // Update progress if counter exists
            updateProgress();
        });
    });

    // Initial progress update
    updateProgress();
}

function resetChecklist() {
    if (confirm('Are you sure you want to reset all checklist progress?')) {
        localStorage.removeItem('expatFinanceChecklist');
        document.querySelectorAll('.checklist-checkbox').forEach(cb => {
            cb.classList.remove('checked');
            cb.closest('.checklist-item')?.classList.remove('completed');
        });
        updateProgress();
    }
}

function updateProgress() {
    const total = document.querySelectorAll('.checklist-checkbox').length;
    const completed = document.querySelectorAll('.checklist-checkbox.checked').length;

    const progressEl = document.getElementById('checklistProgress');
    if (progressEl) {
        const lang = localStorage.getItem('expatFinanceLang') || 'en';
        const template = translations[lang]['progress-template'] || '{completed} of {total} completed';
        progressEl.textContent = template.replace('{completed}', completed).replace('{total}', total);
    }

    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${(completed / total) * 100}%`;
    }
}

// Timeline Countdown Logic
function initTimelineCountdown() {
    const todayDisplay = document.getElementById('currentDateDisplay');
    const moveDate = new Date('2026-05-01');

    if (todayDisplay) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        todayDisplay.textContent = now.toLocaleDateString('en-AU', options);

        // Define targets
        const targets = [
            { id: 'overallCountdown', date: moveDate, label: 'to Move' },
            { id: 'countdown-3m', date: new Date('2026-02-01'), label: 'to Target' },
            { id: 'countdown-2m', date: new Date('2026-03-01'), label: 'to Target' },
            { id: 'countdown-1m', date: new Date('2026-04-01'), label: 'to Target' }
        ];
        function updateCountdowns() {
            const currentTime = new Date();

            targets.forEach(target => {
                const element = document.getElementById(target.id);
                if (!element) return;

                const diff = target.date - currentTime;

                if (diff <= 0) {
                    element.textContent = "Time's up! 🚩";
                    element.className = "countdown-badge urgent";
                    return;
                }

                // Calculate weeks, days, hours, minutes
                const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
                const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                let timeString = "";
                if (weeks > 0) timeString += `${weeks}w `;
                timeString += `${days}d ${hours}h ${mins}m remaining ${target.label}`;

                element.textContent = timeString;

                // Add urgent/upcoming classes
                const totalDays = weeks * 7 + days;
                if (totalDays < 7) {
                    element.classList.add('urgent');
                    element.classList.remove('upcoming');
                } else if (totalDays < 30) {
                    element.classList.remove('upcoming', 'urgent');
                } else {
                    element.classList.add('upcoming');
                    element.classList.remove('urgent');
                }
            });
        }

        // Run immediately and then every minute
        updateCountdowns();
        setInterval(updateCountdowns, 60000);
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Language Switcher
function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');
    const storageKey = 'expatFinanceLang';

    // Set initial language
    const currentLang = localStorage.getItem(storageKey) || 'en';
    setLanguage(currentLang);

    langBtns.forEach(btn => {
        const lang = btn.dataset.lang;
        if (lang === currentLang) btn.classList.add('active');

        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setLanguage(lang);
            localStorage.setItem(storageKey, lang);
        });
    });
}

function setLanguage(lang) {
    document.documentElement.lang = lang;
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Update dynamic elements that need re-translation
    updateProgress();

    // Update bottom nav translations
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        bottomNav.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
    }
}

const translations = {
    en: {
        'nav-dashboard': 'Dashboard',
        'nav-timeline': 'Timeline',
        'nav-lenders': 'Lenders',
        'nav-checklist': 'Bank Checklist',
        'nav-tax': 'Tax Treaty',
        'nav-visa': 'Visa Options',
        'nav-property': 'Property Managers',
        'nav-indo-guide': 'Indo Guide',
        'nav-more': 'More',
        'hero-badge': 'May 2026 Departure',
        'hero-badge-lenders': 'Investment Loans',
        'hero-badge-checklist': 'Preparation Guide',
        'hero-badge-tax': 'Tax Strategy',
        'timeline-badge': 'Master Plan',
        'timeline-title': 'The Move<br><span class="gradient-text">Timeline</span>',
        'timeline-subtitle': 'Every step from now until landing in Bali. Visa approvals, bank refinancing, and packing boxes.',
        'hero-title': 'Family Relocation<br><span class="gradient-text">Command Center</span>',
        'hero-subtitle': 'The master plan for Hardy & Noor\'s move. Tracking visas, finances, and logistics in one place.',
        'metric-ltv': 'Loan-to-Value Ratio',
        'metric-ltv-status': 'Excellent Position',
        'metric-rent': 'Expected Net Rent/Week',
        'metric-rent-status': 'After PM Fees',
        'metric-net': 'Weekly Net Position',
        'metric-net-status': 'With Westpac 5.39%',
        'metric-cash': 'Cash-Out Available',
        'metric-cash-status': 'For Relocation',
        'metric-ltv-exp': '<strong>Loan-to-Value Ratio.</strong> This is the ratio of your loan to the property\'s value. 42.4% is very strong (below the 80% threshold), meaning you have high equity and don\'t need Lenders Mortgage Insurance (LMI).',
        'metric-rent-exp': '<strong>Expected net rent.</strong> Based on $670/wk gross rent minus 7% management fees (~$47/wk). This is the actual cash flow you\'ll receive from your property manager.',
        'metric-net-exp': '<strong>Weekly "Passive Income".</strong> This is the surplus cash remaining each week after paying your new investment loan (Westpac 5.39%) from your net rental income.',
        'metric-cash-exp': '<strong>Relocation Capital.</strong> Extra funds pulled from your property equity during refinance to cover your move, bond, and initial living costs in Indonesia.',
        'section-resources': 'Resources',
        'card-lenders-title': 'Expat-Friendly Lenders',
        'card-lenders-desc': 'Compare investment loan rates from Westpac, Macquarie, ANZ and more. Find lenders who work with overseas landlords.',
        'card-checklist-title': 'Bank Prep Checklist',
        'card-checklist-desc': 'What to say (and not say) to banks. Required documents, key questions, and optimal timing for your refinance.',
        'card-tax-title': 'Australia-Indonesia Tax Treaty',
        'card-tax-desc': 'Understand the Double Tax Agreement, resident vs non-resident rates, and how to avoid paying tax twice.',
        'alert-title': 'Critical: Refinance BEFORE You Leave',
        'alert-desc': 'Apply for your investment loan conversion while you still have Australian employment. It becomes significantly harder once you\'re overseas with no local income. Aim to complete refinancing <strong>3 months before departure</strong>.',
        'section-compare': 'Investment Loan Quick Compare',
        'table-lender': 'Lender',
        'table-rate': 'Rate',
        'table-amount': 'Loan Amount',
        'table-payment': 'Weekly Payment',
        'table-net': 'Net Position*',
        'table-note': '*Net Position = Weekly rent ($670) − Weekly payment − Management fees (~$47/wk)',
        'table-note-lenders': '*Net Position = Weekly rent ($670) − Weekly payment − Management fees (~$47/wk). Estimates based on 26.5 year term.',
        'section-numbers': '💡 Understanding the Numbers',
        'exp-title': 'Why is the new payment LOWER even with $15k added?',
        'exp-intro': 'The lower interest rate (5.39% vs 5.69%) saves more than enough to offset the extra borrowing. Here\'s the full breakdown:',
        'loan-current': '🔴 Current Loan',
        'loan-new': '🟢 Refinanced + $15k',
        'label-principal': 'Principal',
        'label-new-principal': 'New Principal',
        'label-rate': 'Interest Rate',
        'label-new-rate': 'New Interest Rate',
        'label-monthly': 'Minimum Monthly',
        'label-new-monthly': 'New Monthly',
        'label-weekly': '= Weekly Equivalent',
        'label-actual': 'What you actually pay',
        'label-savings': 'Savings vs current',
        'note-paying-extra': 'You\'re paying ~$31/wk extra (great for paying off faster!)',
        'note-lower-payment': 'Lower payment + $15,000 cash in your pocket!',
        'calc-title': '📊 Your Weekly Cash Flow After Refinancing',
        'calc-rent': 'Rent from tenant',
        'calc-loan': 'New loan payment (Westpac 5.39%)',
        'calc-pm': 'Property management (7%)',
        'calc-total': '<strong>Weekly Net Position</strong>',
        'calc-note': '≈ <strong>$1,000/month</strong> in your pocket while living in Indonesia',
        'insight-title': 'Key Insight:',
        'insight-text': 'You get $15,000 upfront for your move, your minimum weekly payment drops by ~$19/wk, AND you pocket ~$244/wk from rental income. The 0.30% rate reduction pays for the extra borrowing.',
        'section-tax': 'Your Tax Strategy at a Glance',
        'tax-resident-title': 'Stay Australian Resident (Recommended)',
        'tax-resident-list': '<li><strong>$18,200 Tax-Free Threshold</strong></li><li>Lower 19% marginal rate</li><li>No 2-year job = Resident (Lower Tax)</li><li>After 2 years with a job, tax increases</li>',
        'tax-threshold-alert': '<strong>Golden Rule:</strong> If your taxable Australian income is under <strong>$18,200</strong>, you pay <strong>$0 tax</strong> in Australia. Since your expected rental profit is ~$12k, you effectively pay no tax while staying an AU resident.',
        'tax-annual-title': 'Estimated Annual Tax',
        'tax-annual-list': '<li>Taxable rental income: ~$12,014</li><li>Tax at resident rates: ~$2,283</li><li>Net annual profit: ~$8,400</li><li>Still cash positive! ✓</li>',
        'footer': 'Last updated: January 2026 | For personal reference only—consult professionals for advice',
        // Lenders Page
        'lenders-title': 'Expat-Friendly<br><span class="gradient-text">Lenders</span>',
        'lenders-subtitle': 'Compare investment loan rates from lenders who work with overseas landlords.',
        'pos-title': 'Your Strong Position',
        'pos-desc': '<strong>LVR: 42.4%</strong> — You\'re well under the 80% threshold, meaning no Lenders Mortgage Insurance required. With this equity position, you have excellent negotiating power for competitive rates.',
        'scenarios-title': 'Investment Loan Scenarios (With $15k Cash-Out)',
        'table-type': 'Type',
        'table-vs': 'vs Current',
        'top-lenders-title': 'Top Lenders for Your Situation',
        'westpac-title': '🥇 Westpac — Best Overall for Expats',
        'westpac-details': '<h4>Key Details</h4><ul><li>Investment Variable: 5.39%</li><li>Good for overseas landlords</li><li>Weekly payment: $372</li><li>Net position: +$250/wk</li></ul>',
        'westpac-why': '<h4>Why Choose Westpac</h4><ul><li>Competitive investment rates</li><li>Large branch network</li><li>Online-only Flexi First option</li><li>Experienced with expat applications</li></ul>',
        'macquarie-title': '🥈 Macquarie Bank — Best Non-Major',
        'macquarie-details': '<h4>Key Details</h4><ul><li>Variable Rate: 5.34% (LVR ≤70%)</li><li>Investment Rate: ~5.99%</li><li>Strong customer service</li><li>No monthly fees on some products</li></ul>',
        'macquarie-why': '<h4>Why Choose Macquarie</h4><ul><li>Excellent digital banking</li><li>Known for service quality</li><li>Competitive rates for low LVR</li><li>Good offset account options</li></ul>',
        'gc-title': '🥉 G&C Mutual Bank — Best Fixed Rate',
        'gc-details': '<h4>Key Details</h4><ul><li>3 Year Fixed: 4.85%</li><li>Variable: 4.99% (essential workers)</li><li>Lowest rates in market</li><li>Customer-owned bank</li></ul>',
        'gc-why': '<h4>Why Choose G&C</h4><ul><li>Lowest fixed rates available</li><li>Lock in before rate rises</li><li>Community-focused bank</li><li>Special ends Feb 15, 2026</li></ul>',
        'gc-note': '<strong>⚠️ Note:</strong> Fixed rate means you can\'t make extra repayments without fees. Less flexible but predictable.',
        // Checklist Page
        'checklist-title': 'Bank Prep Checklist',
        'checklist-subtitle': 'What to say, what documents to gather, and questions to ask lenders.',
        'progress-label': 'Your Progress:',
        'reset-btn': 'Reset All',
        'bank-talk-title': '💬 What To Tell Banks',
        'strategic-title': 'Be Honest But Strategic',
        'strategic-desc': 'When talking to lenders, be upfront about your situation. Honesty protects you legally, and rental income can actually <strong>boost your serviceability</strong>.',
        'points-title': 'Key Talking Points',
        'point-1': '"I\'m moving overseas temporarily (1-2 years) and converting my home to a rental property."',
        'point-2': '"I want to include a $15k relocation cash-out in my refinancing application."',
        'point-3': '"My current LVR is 42%—I have excellent equity in the property."',
        'point-4': '"I have a rental appraisal showing expected weekly rent of $670/week ($2,900/month)."',
        'why-helps-title': 'Why This Helps',
        'why-helps-list': '<li><strong>Rental income counts:</strong> Banks typically use 80% of expected rental income for serviceability</li><li><strong>Your wife not working:</strong> Less impactful when rental income is factored in</li><li><strong>Low LVR:</strong> 42% puts you in a strong negotiating position</li><li><strong>Temporary move:</strong> Shows you intend to return (better than permanent emigration)</li>',
        // Tax Page
        'tax-title': 'Australia-Indonesia<br><span class="gradient-text">Tax Treaty</span>',
        'tax-subtitle': 'Understanding the Double Tax Agreement and avoiding paying tax twice on your rental income.',
        'rec-title': 'Recommended: Stay Australian Tax Resident (Year 1)',
        'rec-desc': 'Without a 2+ year employment contract in Indonesia, you will stay an Australian tax resident. This is <strong>good news</strong>—it keeps your tax much lower. Under the 2026 rules, only a 2+ year contract makes you a "non-resident" (who pays 30% tax from dollar one).',
        'progress-template': '{completed} of {total} completed',
        'rates-title': 'Resident vs Non-Resident Tax Rates',
        'table-income': 'Taxable Income',
        'table-resident': 'Resident Rate',
        'table-non-resident': 'Non-Resident Rate',
        'tax-rate-0': '0% (Tax Free)',
        'tax-rate-19': '19%',
        'tax-rate-32': '32.5%',
        'tax-rate-37': '37%',
        'tax-rate-45': '45%',
        'tax-rate-30': '30%',
        'tax-rate-30-range': '30% (first $135k)',
        // Document Checklist Statuses
        'status-partial': 'Partial (2/3)',
        'status-missing': 'Missing',
        'status-review': 'Review Required',
        'status-done': 'Verified',
        'doc-payslips-text': 'Recent payslips (last 3 months)',
        'doc-payslips-note': 'Oct 2025 to Jan 2026 found. Complete.',
        'doc-taxreturns-text': 'Tax returns & NOA (last 2 years)',
        'doc-taxreturns-note': 'Get from: myGov > ATO > Tax return history & NOAs',
        'doc-loanstatements-text': 'Current loan statements',
        'doc-loanstatements-note': 'Download recent statements from St George internet banking',
        'doc-id-text': 'ID documents (driver\'s license + passport)',
        'doc-id-note': 'Found 2019 copies for Hardy & Noor. Verify if still current.',
        'doc-rental-text': 'Rental appraisals (from 2-3 managers)',
        'doc-rental-note': 'Folder 03 contains contracts only; need to contact property managers for appraisals.',
        'doc-bankstatements-text': 'Bank statements (last 3-6 months)',
        'doc-bankstatements-note': 'Download from St George internet banking > Export statements.',
        'doc-property-text': 'Property details (Rates, Water, Strata)',
        'doc-property-note': '10+ Council Rates (Gold Coast) & Strata docs (Oceanic Lodge) found.',
        'doc-insurance-text': 'Building Insurance (Certificate of Currency)',
        'doc-insurance-note': '14 PDFs found (Budget Direct). Policies for Landlord & Contents.',
        'doc-valuation-text': 'Property Valuation',
        'doc-valuation-note': 'Property Report for 12/43 North St found (Domain/RPData).',
        'doc-utilities-text': 'Utility Bills (Proof of Address)',
        'doc-utilities-note': 'Recent Energy billing details found (Proof of Address).',
        // Visa Options Page (EN)
        'visa-hero-badge': 'Relocation Strategy',
        'visa-hero-title': 'Indonesian Visa<br><span class="gradient-text">Options 2026</span>',
        'visa-hero-subtitle': 'Comparing the best pathways for your move to Indonesia as a remote worker or expat investor.',
        'visa-section-compare': 'Visa Comparison Table',
        'visa-table-type': 'Visa Type',
        'visa-table-duration': 'Validity',
        'visa-table-income': 'Income/Fund Req.',
        'visa-table-benefit': 'Key Benefit',
        'visa-e33g-name': 'E33G Remote Worker',
        'visa-e33g-duration': '1 Year (Renewable)',
        'visa-e33g-income': '$60,000 USD / Year',
        'visa-e33g-benefit': 'Legal work status, local bank, drivers license',
        'visa-b211a-name': 'B211A Visit Visa',
        'visa-b211a-duration': '60 - 180 Days',
        'visa-b211a-income': '$10,000 USD Savings',
        'visa-b211a-benefit': 'Quick setup, trial living period',
        'visa-dtype-name': 'D-Type Multi-Entry',
        'visa-dtype-duration': '1 - 2 Years',
        'visa-dtype-income': '$2,000 USD Savings',
        'visa-dtype-benefit': 'Frequent travel flexibility',
        'visa-table-note': '*Requirements are based on early 2026 regulations and may change.',
        'visa-section-details': 'Visa Deep Dive',
        'visa-e33g-title': 'E33G Remote Worker (KITAS)',
        'visa-e33g-desc': 'The primary choice for long-term nomads. It grants a temporary stay permit (KITAS) and allows you to reside in Indonesia while working for a foreign employer.',
        'visa-e33g-list': '<li>Legal standing for remote work</li><li>Can open local bank accounts (BCA/Mandiri)</li><li>Option to sponsor family members</li>',
        'visa-b211a-title': 'B211A Visit Visa',
        'visa-b211a-desc': 'Best for those not yet ready for a 1-year commitment. It allows you to stay for 60 days, with 2 additional 60-day extensions possible.',
        'visa-b211a-list': '<li>Single entry only</li><li>Convertible to KITAS while onshore</li><li>Financial requirement is purely savings-based</li>',
        'visa-dtype-title': 'D-Type Multiple Entry',
        'visa-dtype-desc': 'Perfect if you plan to fly back to Australia or travel frequently. Valid for 1 or 2 years, with each entry allowing 60 days.',
        'visa-dtype-list': '<li>Unlimited entries</li><li>Maximum 60 days per stay</li><li>Low threshold for financial proof</li>',
        'visa-spouse-name': 'E317 Spouse KITAS',
        'visa-spouse-duration': '1 Year (Path to Permanent)',
        'visa-spouse-income': 'Wife\'s Sponsorship',
        'visa-spouse-benefit': 'Cheapest, Path to KITAP (5yr), Citizenship',
        'visa-golden-name': 'Golden Visa',
        'visa-golden-duration': '5 - 10 Years',
        'visa-golden-income': '$350k - $700k Deposit',
        'visa-golden-benefit': 'Longest stay, seamless entry',
        'visa-spouse-title': 'E317 Spouse KITAS (The "Game Changer")',
        'visa-spouse-desc': 'Since your wife is Indonesian, this is your <strong>Golden Ticket</strong>. It is the only visa that leads to a Permanent Stay Permit (KITAP) after 2 years.',
        'visa-spouse-list': '<li><strong>Low Cost:</strong> Fraction of the price of Golden Visa</li><li><strong>Stability:</strong> 1 year renewable → 5 year Permanent → Citizenship</li><li><strong>Family:</strong> Kids can hold Dual Citizenship (limited time)</li>',
        'visa-golden-title': 'Golden Visa (Investor)',
        'visa-golden-desc': 'A luxury option for those wanting 5-10 years of residency immediately without yearly renewals. Requires significant capital deposit in government bonds or property.',
        'visa-golden-list': '<li><strong>Expensive:</strong> Requires $350k+ USD blocked funds</li><li><strong>Perk:</strong> Fast-track airport lanes</li><li><strong>Verdict:</strong> Likely unnecessary given your marriage status</li>',
        'visa-insight-title': 'New Recommendation (Family Path):',
        'visa-insight-text': 'Being married to an Indonesian citizen (WNI) makes the **E317 Spouse KITAS** your clear winner. It offers the **lowest cost** and **highest stability**. Use E317 for living/residency, and keep your AU job as your income source. Your kids may be eligible for **Dual Citizenship** (Affidavit) until age 21.',
        'visa-section-strategy': 'Why This Is The Winner',
        'visa-section-timeline': 'Application Timeline',
        'visa-section-checklist': 'Spouse KITAS Checklist',
        // Visa Checklist Page
        'nav-visa-checklist': 'Visa Checklist',
        'visa-check-hero-badge': 'Application Guide',
        'visa-check-title': 'Visa Application<br><span class="gradient-text">Checklist</span>',
        'visa-check-subtitle': 'Everything you need for the E317 Spouse KITAS, from documents to biometrics.',
        'visa-talk-title': '💬 Strategic Preparation',
        'visa-strategy-title': 'The Spouse advantage',
        'visa-strategy-desc': 'Since you are married to a WNI, you are <strong>exempt</strong> from most employment-based visa hurdles. Your wife is your anchor.',
        'visa-action-wife-title': 'Action Items for Noor',
        'visa-action-wife-1': 'Register as a "Personal Sponsor" on evisa.imigrasi.go.id.',
        'visa-action-wife-2': 'Ensure KTP and KK addresses match perfectly.',
        'visa-action-wife-3': 'Verify bank statement shows at least $2,000 USD (IDR 30jt+).',
        'visa-action-hardy-title': 'Action Items for Hardy',
        'visa-action-hardy-1': 'Verify passport has at least 18 months validity remaining.',
        'visa-action-hardy-2': 'Get digital copies of Marriage Certificate (legalized).',
        'visa-action-hardy-3': 'Prepare the kids\' passports and birth certificates.',
        'visa-docs-title': '📄 Required Documents',
        'vdoc-marriage-text': 'Marriage Certificate (Buku Nikah)',
        'vdoc-marriage-note': 'If married in AU, must be reported to KBRI/Immigration in Indo.',
        'vdoc-ktp-text': 'Wife\'s KTP & KK',
        'vdoc-ktp-note': 'High-resolution color scans of front/back.',
        'vdoc-passports-text': 'Passports (Family)',
        'vdoc-passports-note': 'Minimum 18 months remaining for Hardy; kids also need valid docs.',
        'vdoc-funds-text': 'Proof of Funds (Sponsor\'s Bank)',
        'vdoc-funds-note': 'Last 3 months statements showing >$2,000 USD equivalent.',
        'vdoc-photos-text': 'Digital Passport Photos',
        'vdoc-photos-note': 'White or Red background (Check latest portal requirements).',
        'visa-steps-title': '🚀 Application Process',
        'vstep-sponsor-text': 'Noor registers as Personal Sponsor',
        'vstep-sponsor-note': 'Must be done first on the evisa portal.',
        'vstep-apply-text': 'Lodge E317 Application',
        'vstep-apply-note': 'Submit all documents and pay the fee online.',
        'vstep-evisa-text': 'Receive E-Visa (PDF)',
        'vstep-evisa-note': 'Wait 5-10 working days for processing.',
        'vstep-arrival-text': 'Arrive in Indonesia',
        'vstep-arrival-note': 'Enter on the E-Visa at Immigration.',
        'vstep-biometrics-text': 'Biometrics at Local Imigrasi',
        'vstep-biometrics-note': 'Within 30 days of arrival to get physical KITAS.',
        'post-arrival-title': '🏠 Post-Arrival Essentials',
        'post-1': '<strong>Lapor Diri:</strong> Report to local police/community head (RT/RW).',
        'post-2': '<strong>Bank Account:</strong> Open BCA/Mandiri account using KITAS.',
        'post-3': '<strong>Driving License:</strong> Convert or apply for SIM A (Car) / SIM C (Motor).',
        'post-4': '<strong>SKTT:</strong> Get your Certificate of Residence from Civil Registry (Disdukcapil).',
        // Property Managers Page
        'pm-hero-badge': 'Management Guide',
        'pm-title': 'Property Management<br><span class="gradient-text">for Expats</span>',
        'pm-subtitle': 'Top agencies in Southport for managing your 2-bed apartment while you are overseas.',
        'pm-comparison-title': 'Agency Comparison',
        'pm-col-agency': 'Agency',
        'pm-col-rating': 'Rating',
        'pm-col-fee': 'Fee (est)',
        'pm-col-best': 'Best For',
        'pm-rent360-best': 'Remote management, excellent technology',
        'pm-pacific-best': '"Hands-free" P5 Protocol for overseas landlords',
        'pm-kollosche-best': 'Premium service, luxury property focus',
        'pm-ljhooker-best': 'Local expertise, family-run business',
        'pm-selection-title': 'Final Selection Logic',
        'pm-southport-subtitle': 'Why Rent360 Is Currently #1',
        'pm-questions-title': 'Questions for Property Managers',
        'pm-q1': 'Do you have experience with overseas landlords?',
        'pm-q2': 'How do you handle emergency repairs when I\'m overseas?',
        'pm-q3': 'What\'s your vacancy rate for 2-bed apartments in Southport?',
        'pm-q4': 'Can I set an auto-approval limit for repairs (e.g., under $500)?',
        'pm-q5': 'How are rent payments sent—direct deposit or through trust account?',
        'pm-footer': 'Last updated: January 2026 | For personal reference only—consult professionals for advice',
        // Indo Guide Page
        'indo-hero-badge': 'Expat Life',
        'indo-title': 'Bali & Jakarta<br><span class="gradient-text">Living Guide</span>',
        'indo-subtitle': 'Estimated costs, lifestyle notes, and essential services for your first 12 months in Indonesia.',
        'indo-living-title': 'Cost of Living 2026',
        'indo-cost-title': 'Estimated Monthly Budget (Family of 4)',
        'indo-cost-intro': 'Based on modern expat standards in Bali or South Jakarta.',
        'indo-col-item': 'Item',
        'indo-col-cost': 'Cost (Monthly)',
        'indo-col-notes': 'Notes',
        'indo-rent-item': 'Villa/Apartment Rent',
        'indo-rent-cost': '$1,500 - $2,500',
        'indo-rent-notes': '3-bed villa in Berawa or 2-bed in Kemang',
        'indo-nanny-item': 'Nanny / Housekeeper',
        'indo-nanny-cost': '$400 - $600',
        'indo-nanny-notes': 'Full-time, including insurance/social security',
        'indo-edu-item': 'International School',
        'indo-edu-cost': '$1,000 - $2,000',
        'indo-edu-notes': 'Per child; excludes enrollment fees',
        'indo-food-item': 'Food & Groceries',
        'indo-food-cost': '$800 - $1,200',
        'indo-food-notes': 'Mix of local markets and premium supermarkets',
        'indo-lifestyle-title': 'Lifestyle & Essentials',
        'indo-lang-title': 'Language (Bahasa Indonesia)',
        'indo-lang-desc': 'Essential for daily life. Learn "Terima kasih", "Berapa harganya?", and basic numbers first.',
        'indo-banking-title': 'Banking & Payments',
        'indo-banking-desc': 'BCA and Mandiri are the top choices. Use QRIS for almost everything—it\'s accepted everywhere from malls to warungs.',
        'indo-health-title': 'Healthcare',
        'indo-health-desc': 'International hospitals (Siloam, BIMC) are excellent. Ensure you have expat health insurance.',
        'indo-transport-title': 'Getting Around',
        'indo-transport-desc': 'Download Gojek and Grab immediately. It\'s the "everything app" for transport, food, and delivery.',
        'indo-footer': 'Last updated: January 2026 | For personal reference only—consult professionals for advice',
        // Timeline Page Addition
        'timeline-q1-title': 'Phase 1: Preparation',
        'timeline-q1-date': 'Jan - Feb 2026',
        'timeline-q2-title': 'Phase 2: Execution',
        'timeline-q2-date': 'Mar - Apr 2026',
        'timeline-q3-title': 'Phase 3: Relocation',
        'timeline-q3-date': 'May 2026',
        'timeline-today': 'TODAY',
        'timeline-indo-footer': 'Last updated: January 2026 | For personal reference only—consult professionals for advice',
        // Tax Treaty Page Addition
        'tax-calc-title': 'Your Estimated Tax Position',
        'tax-dta-title': 'The Double Tax Agreement (DTA)',
        'tax-rules-2026-title': '2026 Tax Residency Rules',
        'tax-id-title': 'Indonesian Tax Obligations',
        'tax-cgt-title': 'Capital Gains Tax Warning',
        'tax-resources-title': 'Useful Resources',
        'tax-filing-title': 'Filing Deadlines',
        'tax-resources-list': '<li><strong>ATO Website:</strong> Search for "Tax Residency for Individuals"</li><li><strong>Treasury.gov.au:</strong> Indonesia-Australia DTA PDF</li><li><strong>Taxation Determination TD 2023/1:</strong> Latest residency guidance</li>',
        // Bank Checklist Page Addition
        'apply-before-title': 'Apply BEFORE You Leave',
        'apply-before-desc': 'Refinance while you still have Australian employment. Once overseas with no local income, applications become much harder. Aim to complete refinancing <strong>3 months before departure</strong>.',
        'docs-checklist-title': '📄 Required Documents',
        'questions-title': '❓ Questions To Ask Lenders',
        'q-rate-text': '"What\'s your investment variable rate for my LVR (42%)?"',
        'q-rate-note': 'Push for discount—your low LVR is strong leverage',
        'q-cashout-text': '"Include the $15k relocation cash-out in my application"',
        'q-cashout-note': 'Confirm maximum cash-out available',
        'q-fees-text': '"What fees apply to convert/refinance?"',
        'q-fees-note': 'Application fee, valuation, settlement, discharge',
        'q-overseas-text': '"Will my overseas move affect loan approval?"',
        'q-overseas-note': 'Some lenders more expat-friendly than others',
        'q-offset-text': '"Does the investment loan include an offset account?"',
        'q-offset-note': 'Rent payments can sit here to reduce interest daily',
        'q-timeline-text': '"What\'s the typical approval timeline?"',
        'q-timeline-note': 'Plan for 2-4 weeks; some are faster',
        'q-cashback-text': '"Are there any cashback offers currently available?"',
        'q-cashback-note': 'Some lenders offer up to $5k for refinancing',
        'refi-timeline-title': '📅 Refinancing Timeline',
        'today-display': 'Today is',
        'move-scheduled': 'Your move is scheduled for <strong>May 2026</strong>',
        'calculating': 'Calculating time...',
        'timeline-3m-title': '3 Months Before Moving',
        'timeline-3m-target': 'Target: February 2026',
        't-research-text': 'Research and compare lenders',
        't-research-note': 'Use Canstar, Finder, or mortgage broker',
        't-currentlender-text': 'Call current lender first',
        't-currentlender-note': 'Ask about converting to investment loan with cash-out',
        't-quotes-text': 'Get quotes from 3-5 lenders',
        't-quotes-note': 'Compare rates, fees, features, approval times',
        'timeline-2m-title': '2 Months Before Moving',
        'timeline-2m-target': 'Target: March 2026',
        't-apply-text': 'Submit loan application',
        't-apply-note': 'While you still have Australian employment!',
        't-valuation-text': 'Property valuation arranged by lender',
        't-valuation-note': 'Usually $200-300; some lenders cover this',
        't-approval-text': 'Receive formal loan approval',
        't-approval-note': 'Review all terms and conditions carefully',
        'timeline-1m-title': '1 Month Before Moving',
        'timeline-1m-target': 'Target: April 2026',
        't-settlement-text': 'Complete loan settlement',
        't-settlement-note': 'Old loan discharged, new loan starts',
        't-cashout-text': 'Receive $15k cash-out funds',
        't-cashout-note': 'Usually deposited to nominated account',
        't-autopay-text': 'Set up automatic loan payments',
        't-autopay-note': 'From Australian account where rent will be deposited',
        'checklist-footer': 'Last updated: January 2026 | For personal reference only—consult professionals for advice',
        // Expat Lenders Page Addition
        'current-loan-label': 'Current (Owner-Occ)',
        'loan-type-var': 'Variable',
        'lender-westpac': 'Westpac',
        'badge-best': 'BEST',
        'loan-type-inv-var': 'Investment Variable',
        'lender-cba': 'CBA',
        'lender-macquarie': 'Macquarie',
        'lender-gc': 'G&C Mutual Bank',
        'loan-type-fixed-3': 'Fixed 3yr',
        'lender-anz-nab': 'ANZ / NAB',
        'loan-type-fixed-2': 'Fixed 2yr Package',
        'key-insights-title': 'Key Insights for Refinancers',
        'insight-negotiation-title': '💡 Rate Negotiation',
        'insight-negotiation-desc': 'New customers typically get the best rates. With LVR <70%, expect to negotiate 10-15 basis points off advertised rates.',
        'insight-cashback-title': '💰 Cashback Offers',
        'insight-cashback-desc': 'Some lenders are offering cashbacks up to $5,000 to attract new customers. Ask about current promotions.',
        'insight-timing-title': '⏰ Timing',
        'insight-timing-desc': 'RBA rate hikes expected Feb 2026. Locking in current rates (especially fixed) may be advantageous.',
        'insight-fv-title': '📊 Fixed vs Variable',
        'insight-fv-desc': 'Fixed rates are currently slightly cheaper than variable but this gap is narrowing as lenders anticipate increases.',
        'quick-links-title': 'Lender Application Links',
        'col-lender': 'Lender',
        'col-link': 'Link',
        'lenders-footer': 'Last updated: January 2026 | For personal reference only—consult professionals for advice',
    },
    id: {
        'nav-dashboard': 'Dashboard',
        'nav-timeline': 'Jadwal',
        'nav-lenders': 'Pemberi Pinjaman',
        'nav-checklist': 'Daftar Periksa Bank',
        'nav-tax': 'Perjanjian Pajak',
        'nav-visa': 'Opsi Visa',
        'nav-property': 'Pengelola Properti',
        'nav-indo-guide': 'Panduan RI',
        'nav-more': 'Lainnya',
        'hero-badge': 'Keberangkatan Mei 2026',
        'hero-badge-lenders': 'Pinjaman Investasi',
        'hero-badge-checklist': 'Panduan Persiapan',
        'hero-badge-tax': 'Strategi Pajak',
        'timeline-badge': 'Rencana Induk',
        'timeline-title': 'Jadwal<br><span class="gradient-text">Kepindahan</span>',
        'timeline-subtitle': 'Setiap langkah dari sekarang hingga mendarat di Bali. Persetujuan visa, refinancing bank, dan pengepakan barang.',
        'hero-title': 'Pusat Kendali<br><span class="gradient-text">Relokasi Keluarga</span>',
        'hero-subtitle': 'Rencana induk untuk kepindahan Hardy & Noor. Melacak visa, keuangan, dan logistik di satu tempat.',
        'metric-ltv': 'Rasio Pinjaman terhadap Nilai',
        'metric-ltv-status': 'Posisi Sangat Baik',
        'metric-rent': 'Perkiraan Sewa Bersih/Minggu',
        'metric-rent-status': 'Setelah Biaya Pengelola Properti',
        'metric-net': 'Posisi Bersih Mingguan',
        'metric-net-status': 'Dengan Westpac 5.39%',
        'metric-cash': 'Tersedia Penarikan Tunai',
        'metric-cash-status': 'Untuk Relokasi',
        'metric-ltv-exp': '<strong>Rasio Pinjaman terhadap Nilai.</strong> Ini adalah perbandingan utang Anda dengan nilai properti. 42,4% sangat kuat (di bawah ambang 80%), artinya ekuitas Anda tinggi dan tidak butuh Asuransi Hipotek (LMI).',
        'metric-rent-exp': '<strong>Sewa bersih mingguan.</strong> Berdasarkan sewa kotor $670/mgg dikurangi biaya agen 7% (~$47/mgg). Inilah uang tunai yang akan dikirim oleh pengelola properti ke rekening Anda.',
        'metric-net-exp': '<strong>"Pendapatan Pasif" Mingguan.</strong> Ini adalah sisa uang setiap minggu setelah membayar cicilan bank investasi yang baru (Westpac 5,39%) dari uang sewa bersih.',
        'metric-cash-exp': '<strong>Modal Relokasi.</strong> Uang tunai tambahan yang diambil dari ekuitas rumah saat refinancing untuk biaya pindah, uang jaminan, dan biaya hidup awal di Indonesia.',
        'section-resources': 'Sumber Daya',
        'card-lenders-title': 'Pemberi Pinjaman Ramah Ekspat',
        'card-lenders-desc': 'Bandingkan suku bunga pinjaman investasi dari Westpac, Macquarie, ANZ, dan lainnya. Temukan pemberi pinjaman yang bekerja dengan pemilik luar negeri.',
        'card-checklist-title': 'Daftar Persiapan Bank',
        'card-checklist-desc': 'Apa yang harus dikatakan (dan tidak dikatakan) kepada bank. Dokumen yang diperlukan, pertanyaan kunci, dan waktu optimal untuk refinancing Anda.',
        'card-tax-title': 'Perjanjian Pajak Australia-Indonesia',
        'card-tax-desc': 'Pahami Perjanjian Pajak Berganda (DTA), tarif penduduk vs non-penduduk, dan cara menghindari pembayaran pajak dua kali.',
        'alert-title': 'Kritis: Lakukan Refinancing SEBELUM Anda Pergi',
        'alert-desc': 'Ajukan konversi pinjaman investasi saat Anda masih memiliki pekerjaan di Australia. Ini menjadi jauh lebih sulit setelah Anda di luar negeri tanpa pendapatan lokal. Targetkan penyelesaian refinancing <strong>3 bulan sebelum keberangkatan</strong>.',
        'section-compare': 'Perbandingan Cepat Pinjaman Investasi',
        'table-lender': 'Bank',
        'table-rate': 'Bunga',
        'table-amount': 'Jumlah Pinjaman',
        'table-payment': 'Cicilan Mingguan',
        'table-net': 'Posisi Bersih*',
        'table-note': '*Posisi Bersih = Sewa mingguan ($670) − Cicilan mingguan − Biaya pengelolaan (~$47/mgg)',
        'table-note-lenders': '*Posisi Bersih = Sewa mingguan ($670) − Cicilan mingguan − Biaya pengelolaan (~$47/mgg). Estimasi berdasarkan jangka waktu 26,5 tahun.',
        'section-numbers': '💡 Memahami Angka',
        'exp-title': 'Mengapa cicilan baru lebih RENDAH meskipun ditambah $15rb?',
        'exp-intro': 'Suku bunga yang lebih rendah (5,39% vs 5,69%) menghemat lebih dari cukup untuk menutupi pinjaman tambahan. Berikut rincian lengkapnya:',
        'loan-current': '🔴 Pinjaman Saat Ini',
        'loan-new': '🟢 Refinancing + $15rb',
        'label-principal': 'Pokok Pinjaman',
        'label-new-principal': 'Pokok Pinjaman Baru',
        'label-rate': 'Suku Bunga',
        'label-new-rate': 'Suku Bunga Baru',
        'label-monthly': 'Cicilan Bulanan Minimum',
        'label-new-monthly': 'Cicilan Bulanan Baru',
        'label-weekly': '= Setara Mingguan',
        'label-actual': 'Yang sebenarnya Anda bayar',
        'label-savings': 'Penghematan vs saat ini',
        'note-paying-extra': 'Anda membayar ~$31/mgg ekstra (bagus untuk pelunasan lebih cepat!)',
        'note-lower-payment': 'Cicilan lebih rendah + uang tunai $15.000 di saku Anda!',
        'calc-title': '📊 Arus Kas Mingguan Anda Setelah Refinancing',
        'calc-rent': 'Sewa dari penyewa',
        'calc-loan': 'Cicilan pinjaman baru (Westpac 5.39%)',
        'calc-pm': 'Pengelolaan properti (7%)',
        'calc-total': '<strong>Posisi Bersih Mingguan</strong>',
        'calc-note': '≈ <strong>$1.000/bulan</strong> di saku Anda saat tinggal di Indonesia',
        'insight-title': 'Wawasan Utama:',
        'insight-text': 'Anda mendapatkan $15.000 di muka untuk kepindahan Anda, cicilan mingguan minimum Anda turun sebesar ~$19/mgg, DAN Anda mengantongi ~$244/mgg dari pendapatan sewa. Pengurangan bunga 0,30% menutupi pinjaman tambahan.',
        'section-tax': 'Sekilas Strategi Pajak Anda',
        'tax-resident-title': 'Tetap Menjadi Penduduk Australia (Direkomendasikan)',
        'tax-resident-list': '<li><strong>Ambang Bebas Pajak $18.200</strong></li><li>Tarif 19% (Lebih murah dari 30%)</li><li>Tanpa kontrak 2 thn = Tetap Penduduk</li><li>Setelah 2 thn kerja, pajak bisa naik</li>',
        'tax-threshold-alert': '<strong>Aturan Emas:</strong> Jika pendapatan kena pajak Australia Anda di bawah <strong>$18.200</strong>, Anda membayar <strong>$0 pajak</strong> di Australia. Karena laba sewa Anda ~$12rb, Anda bebas pajak selama tetap menjadi penduduk AU.',
        'tax-annual-title': 'Estimasi Pajak Tahunan',
        'tax-annual-list': '<li>Pendapatan sewa kena pajak: ~$12.014</li><li>Pajak dengan tarif penduduk: ~$2,283</li><li>Laba tahunan bersih: ~$8,400</li><li>Masih untung tunai! ✓</li>',
        'footer': 'Terakhir diperbarui: Januari 2026 | Hanya untuk referensi pribadi—konsultasikan dengan profesional untuk saran',
        // Lenders Page (ID)
        'lenders-title': 'Pemberi Pinjaman<br><span class="gradient-text">Ramah Ekspat</span>',
        'lenders-subtitle': 'Bandingkan suku bunga pinjaman investasi dari pemberi pinjaman yang bekerja dengan pemilik luar negeri.',
        'pos-title': 'Posisi Kuat Anda',
        'pos-desc': '<strong>LVR: 42,4%</strong> — Anda berada jauh di bawah ambang batas 80%, artinya tidak diperlukan Asuransi Hipotek Pemberi Pinjaman (LMI). Dengan posisi ekuitas ini, Anda memiliki kekuatan negosiasi yang sangat baik untuk suku bunga yang kompetitif.',
        'scenarios-title': 'Skenario Pinjaman Investasi (Dengan Penarikan Tunai $15rb)',
        'table-type': 'Jenis',
        'table-vs': 'vs Saat Ini',
        'top-lenders-title': 'Pemberi Pinjaman Teratas untuk Situasi Anda',
        'westpac-title': '🥇 Westpac — Terbaik untuk Ekspat',
        'westpac-details': '<h4>Detail Kunci</h4><ul><li>Variabel Investasi: 5,39%</li><li>Bagus untuk pemilik luar negeri</li><li>Cicilan mingguan: $372</li><li>Posisi bersih: +$250/mgg</li></ul>',
        'westpac-why': '<h4>Mengapa Memilih Westpac</h4><ul><li>Suku bunga investasi yang kompetitif</li><li>Jaringan cabang yang luas</li><li>Opsi Flexi First khusus online</li><li>Berpengalaman dengan aplikasi ekspat</li></ul>',
        'macquarie-title': '🥈 Macquarie Bank — Bank Menengah Terbaik',
        'macquarie-details': '<h4>Detail Kunci</h4><ul><li>Tingkat Variabel: 5,34% (LVR ≤70%)</li><li>Tingkat Investasi: ~5,99%</li><li>Layanan pelanggan yang kuat</li><li>Tanpa biaya bulanan pada beberapa produk</li></ul>',
        'macquarie-why': '<h4>Mengapa Memilih Macquarie</h4><ul><li>Perbankan digital yang sangat baik</li><li>Dikenal karena kualitas layanan</li><li>Suku bunga kompetitif untuk LVR rendah</li><li>Opsi akun offset yang baik</li></ul>',
        'gc-title': '🥉 G&C Mutual Bank — Bunga Tetap Terbaik',
        'gc-details': '<h4>Detail Kunci</h4><ul><li>Bunga Tetap 3 Tahun: 4,85%</li><li>Variabel: 4,99% (pekerja esensial)</li><li>Suku bunga terendah di pasar</li><li>Bank milik pelanggan</li></ul>',
        'gc-why': '<h4>Mengapa Memilih G&C</h4><ul><li>Suku bunga tetap terendah yang tersedia</li><li>Kunci sebelum suku bunga naik</li><li>Bank yang berfokus pada komunitas</li><li>Spesial berakhir 15 Feb 2026</li></ul>',
        'gc-note': '<strong>⚠️ Catatan:</strong> Suku bunga tetap berarti Anda tidak dapat melakukan pembayaran ekstra tanpa biaya. Kurang fleksibel tetapi dapat diprediksi.',
        // Checklist Page (ID)
        'checklist-title': 'Daftar Periksa Bank',
        'checklist-subtitle': 'Apa yang harus dikatakan, dokumen apa yang harus dikumpulkan, dan pertanyaan untuk diajukan ke bank.',
        'progress-label': 'Kemajuan Anda:',
        'reset-btn': 'Atur Ulang Semua',
        'bank-talk-title': '💬 Apa Yang Harus Dikatakan Ke Bank',
        'strategic-title': 'Jujur Tapi Strategis',
        'strategic-desc': 'Saat berbicara dengan pemberi pinjaman, jujurlah tentang situasi Anda. Kejujuran melindungi Anda secara hukum, dan pendapatan sewa sebenarnya dapat <strong>meningkatkan kemampuan melayani pinjaman Anda</strong>.',
        'points-title': 'Poin Pembicaraan Utama',
        'point-1': '"Saya pindah ke luar negeri untuk sementara (1-2 tahun) dan mengubah rumah saya menjadi properti sewaan."',
        'point-2': '"Saya ingin menyertakan penarikan tunai $15rb untuk relokasi dalam aplikasi refinancing saya."',
        'point-3': '"LVR saya saat ini adalah 42%—saya memiliki ekuitas yang sangat baik di properti ini."',
        'point-4': '"Saya memiliki penilaian sewa yang menunjukkan perkiraan sewa mingguan sebesar $670/minggu ($2.900/bulan)."',
        'why-helps-title': 'Mengapa Ini Membantu',
        'why-helps-list': '<li><strong>Pendapatan sewa dihitung:</strong> Bank biasanya menggunakan 80% dari perkiraan pendapatan sewa untuk serviceability</li><li><strong>Istri tidak bekerja:</strong> Kurang berdampak saat pendapatan sewa diperhitungkan</li><li><strong>LVR Rendah:</strong> 42% menempatkan Anda dalam posisi negosiasi yang kuat</li><li><strong>Pindah sementara:</strong> Menunjukkan Anda berniat untuk kembali (lebih baik daripada emigrasi permanen)</li>',
        // Tax Page (ID)
        'tax-title': 'Perjanjian Pajak<br><span class="gradient-text">Australia-Indonesia</span>',
        'tax-subtitle': 'Memahami Perjanjian Pajak Berganda dan menghindari pembayaran pajak dua kali atas pendapatan sewa Anda.',
        'rec-title': 'Direkomendasikan: Tetap Menjadi Penduduk Pajak Australia (Tahun 1)',
        'rec-desc': 'Tanpa kontrak kerja 2+ tahun di Indonesia, Anda tetap menjadi penduduk pajak Australia. Ini <strong>kabar baik</strong>—artinya Anda tetap mendapatkan ambang batas bebas pajak. Jika Anda punya kontrak 2+ tahun, Anda jadi non-penduduk dan bayar pajak 30% dari dollar pertama.',
        'progress-template': '{completed} dari {total} selesai',
        'rates-title': 'Tarif Pajak Penduduk vs Non-Penduduk',
        'table-income': 'Pendapatan Kena Pajak',
        'table-resident': 'Tarif Penduduk',
        'table-non-resident': 'Tarif Non-Penduduk',
        'tax-rate-0': '0% (Bebas Pajak)',
        'tax-rate-19': '19%',
        'tax-rate-32': '32,5%',
        'tax-rate-37': '37%',
        'tax-rate-45': '45%',
        'tax-rate-30': '30%',
        'tax-rate-30-range': '30% ($135rb pertama)',
        // Document Checklist Statuses (ID)
        'status-partial': 'Sebagian (2/3)',
        'status-missing': 'Belum Ada',
        'status-review': 'Perlu Tinjauan',
        'status-done': 'Terverifikasi',
        'doc-payslips-text': 'Slip gaji terbaru (3 bulan terakhir)',
        'doc-payslips-note': 'Okt 2025 sampai Jan 2026 ditemukan. Lengkap.',
        'doc-taxreturns-text': 'SPT & NOA (2 tahun terakhir)',
        'doc-taxreturns-note': 'Ambil dari: myGov > ATO > Riwayat SPT & NOA',
        'doc-loanstatements-text': 'Laporan pinjaman saat ini',
        'doc-loanstatements-note': 'Unduh laporan terbaru dari perbankan internet St George',
        'doc-id-text': 'Dokumen ID (SIM + paspor)',
        'doc-id-note': 'Ditemukan salinan 2019 untuk Hardy & Noor. Verifikasi masa berlaku.',
        'doc-rental-text': 'Penilaian sewa (dari 2-3 manajer)',
        'doc-rental-note': 'Folder 03 hanya berisi kontrak; perlu hubungi manajer properti untuk penilaian.',
        'doc-bankstatements-text': 'Laporan bank (3-6 bulan terakhir)',
        'doc-bankstatements-note': 'Unduh dari perbankan internet St George > Ekspor laporan.',
        'doc-property-text': 'Detail properti (Tarif, Air, Strata)',
        'doc-property-note': '10+ Tarif Dewan (Gold Coast) & Dokumen Strata (Oceanic Lodge) ditemukan.',
        'doc-insurance-text': 'Asuransi Bangunan (Sertifikat Mata Uang)',
        'doc-insurance-note': '14 PDF ditemukan (Budget Direct). Polis untuk Tuan Rumah & Isi Rumah.',
        'doc-valuation-text': 'Penilaian Properti',
        'doc-valuation-note': 'Laporan Properti untuk 12/43 North St ditemukan (Domain/RPData).',
        'doc-utilities-text': 'Tagihan Utilitas (Bukti Alamat)',
        'doc-utilities-note': 'Rincian tagihan energi terbaru ditemukan (Bukti Alamat).',
        // Visa Options Page (ID)
        'visa-hero-badge': 'Strategi Relokasi',
        'visa-hero-title': 'Opsi Visa<br><span class="gradient-text">Indonesia 2026</span>',
        'visa-hero-subtitle': 'Membandingkan jalur terbaik untuk kepindahan Anda ke Indonesia sebagai pekerja jarak jauh atau investor ekspat.',
        'visa-section-compare': 'Tabel Perbandingan Visa',
        'visa-table-type': 'Jenis Visa',
        'visa-table-duration': 'Masa Berlaku',
        'visa-table-income': 'Syarat Pendapatan/Dana',
        'visa-table-benefit': 'Manfaat Utama',
        'visa-e33g-name': 'E33G Pekerja Jarak Jauh',
        'visa-e33g-duration': '1 Tahun (Dapat Diperpanjang)',
        'visa-e33g-income': '$60.000 USD / Tahun',
        'visa-e33g-benefit': 'Status kerja legal, bank lokal, SIM lokal',
        'visa-section-strategy': 'Mengapa Ini Pemenangnya',
        'visa-section-timeline': 'Jadwal Aplikasi',
        'visa-section-checklist': 'Daftar Periksa KITAS Pasangan',
        'visa-b211a-name': 'B211A Visa Kunjungan',
        'visa-b211a-duration': '60 - 180 Hari',
        'visa-b211a-income': 'Tabungan $10.000 USD',
        'visa-b211a-benefit': 'Pengaturan cepat, masa percobaan tinggal',
        'visa-dtype-name': 'D-Type Multi-Entry',
        'visa-dtype-duration': '1 - 2 Tahun',
        'visa-dtype-income': 'Tabungan $2.000 USD',
        'visa-dtype-benefit': 'Fleksibilitas perjalanan sering',
        'visa-table-note': '*Persyaratan didasarkan pada peraturan awal 2026 dan dapat berubah.',
        'visa-section-details': 'Penjelasan Mendalam Visa',
        'visa-e33g-title': 'E33G Pekerja Jarak Jauh (KITAS)',
        'visa-e33g-desc': 'Pilihan utama bagi nomad jangka panjang. Memberikan izin tinggal terbatas (KITAS) dan memungkinkan Anda tinggal di Indonesia sambil bekerja untuk pemberi kerja luar negeri.',
        'visa-e33g-list': '<li>Payung hukum untuk kerja jarak jauh</li><li>Dapat membuka rekening bank lokal (BCA/Mandiri)</li><li>Opsi untuk mensponsori anggota keluarga</li>',
        'visa-b211a-title': 'B211A Visa Kunjungan',
        'visa-b211a-desc': 'Terbaik bagi mereka yang belum siap untuk komitmen 1 tahun. Memungkinkan Anda tinggal selama 60 hari, dengan 2 perpanjangan tambahan 60 hari.',
        'visa-b211a-list': '<li>Hanya untuk satu kali masuk</li><li>Dapat dikonversi ke KITAS saat berada di Indonesia</li><li>Persyaratan keuangan murni berdasarkan tabungan</li>',
        'visa-dtype-title': 'D-Type Multiple Entry',
        'visa-dtype-desc': 'Sempurna jika Anda berencana sering terbang kembali ke Australia atau bepergian. Berlaku selama 1 atau 2 tahun, dengan setiap masuk berlaku 60 hari.',
        'visa-dtype-list': '<li>Entri tidak terbatas</li><li>Maksimal 60 hari per kunjungan</li><li>Ambang batas rendah untuk bukti keuangan</li>',
        'visa-spouse-name': 'E317 KITAS Penyatuan Keluarga',
        'visa-spouse-duration': '1 Tahun (Jalur ke Tetap)',
        'visa-spouse-income': 'Sponsor Istri',
        'visa-spouse-benefit': 'Termurah, Jalur ke KITAP (5th), Kewarganegaraan',
        'visa-golden-name': 'Golden Visa',
        'visa-golden-duration': '5 - 10 Tahun',
        'visa-golden-income': 'Deposit $350rb - $700rb',
        'visa-golden-benefit': 'Tinggal terlama, masuk tanpa hambatan',
        'visa-spouse-title': 'E317 KITAS Pasangan (Penyatuan Keluarga)',
        'visa-spouse-desc': 'Karena istri Anda orang Indonesia, ini adalah <strong>Tiket Emas</strong> Anda. Satu-satunya visa yang menuju Izin Tinggal Tetap (KITAP) setelah 2 tahun.',
        'visa-spouse-list': '<li><strong>Biaya Rendah:</strong> Sebagian kecil dari harga Golden Visa</li><li><strong>Stabilitas:</strong> 1 tahun (diperbarui) → 5 tahun Tetap → WNI</li><li><strong>Keluarga:</strong> Anak bisa Kewarganegaraan Ganda (waktu terbatas)</li>',
        'visa-golden-title': 'Golden Visa (Investor)',
        'visa-golden-desc': 'Opsi mewah bagi yang menginginkan 5-10 tahun residensi segera. Membutuhkan deposit modal besar dalam obligasi pemerintah atau properti.',
        'visa-golden-list': '<li><strong>Mahal:</strong> Membutuhkan dana tersimpan $350rb+ USD</li><li><strong>Keuntungan:</strong> Jalur cepat bandara</li><li><strong>Putusan:</strong> Kemungkinan tidak perlu mengingat status pernikahan Anda</li>',
        'visa-insight-title': 'Rekomendasi Baru (Jalur Keluarga):',
        'visa-insight-text': 'Menikah dengan WNI membuat **E317 Spouse KITAS** menjadi pemenang jelas. Menawarkan **biaya terendah** dan **stabilitas tertinggi**. Gunakan E317 untuk tinggal, dan pertahankan pekerjaan AU Anda. Anak-anak Anda mungkin memenuhi syarat untuk **Kewarganegaraan Ganda** (Affidavit) hingga usia 21.',
        // Visa Checklist Page (ID)
        'nav-visa-checklist': 'Daftar Periksa Visa',
        'visa-check-hero-badge': 'Panduan Aplikasi',
        'visa-check-title': 'Daftar Periksa<br><span class="gradient-text">Aplikasi Visa</span>',
        'visa-check-subtitle': 'Semua yang Anda butuhkan untuk KITAS Pasangan E317, dari dokumen hingga biometrik.',
        'visa-talk-title': '💬 Persiapan Strategis',
        'visa-strategy-title': 'Keuntungan Pasangan',
        'visa-strategy-desc': 'Karena Anda menikah dengan WNI, Anda <strong>bebas</strong> dari sebagian besar hambatan visa berbasis pekerjaan. Istri Anda adalah penjamin Anda.',
        'visa-action-wife-title': 'Tugas untuk Noor',
        'visa-action-wife-1': 'Daftar sebagai "Penjamin Perorangan" di evisa.imigrasi.go.id.',
        'visa-action-wife-2': 'Pastikan alamat KTP dan KK sama persis.',
        'visa-action-wife-3': 'Verifikasi rekening bank menunjukkan minimal $2.000 USD (IDR 30jt+).',
        'visa-action-hardy-title': 'Tugas untuk Hardy',
        'visa-action-hardy-1': 'Verifikasi paspor memiliki masa berlaku minimal 18 bulan.',
        'visa-action-hardy-2': 'Dapatkan salinan digital Buku Nikah (dilegalisir).',
        'visa-action-hardy-3': 'Siapkan paspor dan akta kelahiran anak-anak.',
        'visa-docs-title': '📄 Dokumen yang Diperlukan',
        'vdoc-marriage-text': 'Buku Nikah / Akta Perkawinan',
        'vdoc-marriage-note': 'Jika menikah di AU, harus dilaporkan ke KBRI/Imigrasi di Indo.',
        'vdoc-ktp-text': 'KTP & KK Istri',
        'vdoc-ktp-note': 'Pemindaian warna resolusi tinggi depan/belakang.',
        'vdoc-passports-text': 'Paspor (Keluarga)',
        'vdoc-passports-note': 'Minimal 18 bulan tersisa untuk Hardy; anak-anak juga butuh dokumen valid.',
        'vdoc-funds-text': 'Bukti Dana (Bank Penjamin)',
        'vdoc-funds-note': 'Rekening koran 3 bulan terakhir menunjukkan >$2.000 USD equivalent.',
        'vdoc-photos-text': 'Foto Paspor Digital',
        'vdoc-photos-note': 'Latar belakang putih atau merah (Cek persyaratan portal terbaru).',
        'visa-steps-title': '🚀 Proses Aplikasi',
        'vstep-sponsor-text': 'Noor mendaftar sebagai Penjamin Perorangan',
        'vstep-sponsor-note': 'Harus dilakukan pertama kali di portal evisa.',
        'vstep-apply-text': 'Ajukan Aplikasi E317',
        'vstep-apply-note': 'Kirim semua dokumen dan bayar biaya secara online.',
        'vstep-evisa-text': 'Terima E-Visa (PDF)',
        'vstep-evisa-note': 'Tunggu 5-10 hari kerja untuk pemrosesan.',
        'vstep-arrival-text': 'Tiba di Indonesia',
        'vstep-arrival-note': 'Masuk menggunakan E-Visa di Imigrasi.',
        'vstep-biometrics-text': 'Biometrik di Kantor Imigrasi Lokal',
        'vstep-biometrics-note': 'Dalam 30 hari setelah tiba untuk mendapatkan kartu KITAS fisik.',
        'post-arrival-title': '🏠 Hal Penting Setelah Tiba',
        'post-1': '<strong>Lapor Diri:</strong> Lapor ke polisi setempat/ketua RT/RW.',
        'post-2': '<strong>Rekening Bank:</strong> Buka rekening BCA/Mandiri menggunakan KITAS.',
        'post-3': '<strong>SIM:</strong> Konversi atau ajukan SIM A (Mobil) / SIM C (Motor).',
        'post-4': '<strong>SKTT:</strong> Dapatkan Surat Keterangan Tempat Tinggal dari Disdukcapil.',
        // Property Managers Page (ID)
        'pm-hero-badge': 'Panduan Pengelolaan',
        'pm-title': 'Pengelolaan Properti<br><span class="gradient-text">untuk Ekspat</span>',
        'pm-subtitle': 'Agen terbaik di Southport untuk mengelola apartemen 2 kamar Anda saat Anda di luar negeri.',
        'pm-comparison-title': 'Perbandingan Agen',
        'pm-col-agency': 'Agen',
        'pm-col-rating': 'Peringkat',
        'pm-col-fee': 'Biaya (est)',
        'pm-col-best': 'Terbaik Untuk',
        'pm-rent360-best': 'Pengelolaan jarak jauh, teknologi luar biasa',
        'pm-pacific-best': 'Protokol P5 "Tanpa Repot" untuk pemilik luar negeri',
        'pm-kollosche-best': 'Layanan premium, fokus properti mewah',
        'pm-ljhooker-best': 'Keahlian lokal, bisnis keluarga',
        'pm-selection-title': 'Logika Pemilihan Akhir',
        'pm-southport-subtitle': 'Mengapa Rent360 Saat Ini No. 1',
        'pm-questions-title': 'Pertanyaan untuk Manajer Properti',
        'pm-q1': 'Apakah Anda memiliki pengalaman dengan pemilik luar negeri?',
        'pm-q2': 'Bagaimana Anda menangani perbaikan darurat saat saya di luar negeri?',
        'pm-q3': 'Berapa tingkat kekosongan Anda untuk apartemen 2 kamar di Southport?',
        'pm-q4': 'Bisakah saya menetapkan batas persetujuan otomatis untuk perbaikan (misal, di bawah $500)?',
        'pm-q5': 'Bagaimana pembayaran sewa dikirim—setoran langsung atau melalui rekening wali amanat?',
        'pm-footer': 'Terakhir diperbarui: Januari 2026 | Hanya untuk referensi pribadi—konsultasikan dengan profesional untuk saran',
        // Indo Guide Page (ID)
        'indo-hero-badge': 'Kehidupan Ekspat',
        'indo-title': 'Panduan Hidup<br><span class="gradient-text">Bali & Jakarta</span>',
        'indo-subtitle': 'Estimasi biaya, catatan gaya hidup, dan layanan esensial untuk 12 bulan pertama Anda di Indonesia.',
        'indo-living-title': 'Biaya Hidup 2026',
        'indo-cost-title': 'Estimasi Anggaran Bulanan (Keluarga isi 4)',
        'indo-cost-intro': 'Berdasarkan standar ekspat modern di Bali atau Jakarta Selatan.',
        'indo-col-item': 'Item',
        'indo-col-cost': 'Biaya (Bulanan)',
        'indo-col-notes': 'Catatan',
        'indo-rent-item': 'Sewa Villa/Apartemen',
        'indo-rent-cost': '$1.500 - $2.500',
        'indo-rent-notes': 'Villa 3 kamar di Berawa atau 2 kamar di Kemang',
        'indo-nanny-item': 'Pengasuh / Asisten RT',
        'indo-nanny-cost': '$400 - $600',
        'indo-nanny-notes': 'Penuh waktu, termasuk asuransi/BPJS',
        'indo-edu-item': 'Sekolah Internasional',
        'indo-edu-cost': '$1.000 - $2.000',
        'indo-edu-notes': 'Per anak; tidak termasuk biaya pendaftaran',
        'indo-food-item': 'Makanan & Sembako',
        'indo-food-cost': '$800 - $1.200',
        'indo-food-notes': 'Campuran pasar lokal dan supermarket premium',
        'indo-lifestyle-title': 'Gaya Hidup & Esensial',
        'indo-lang-title': 'Bahasa Indonesia',
        'indo-lang-desc': 'Penting untuk kehidupan sehari-hari. Pelajari "Terima kasih", "Berapa harganya?", dan angka dasar terlebih dahulu.',
        'indo-banking-title': 'Perbankan & Pembayaran',
        'indo-banking-desc': 'BCA dan Mandiri adalah pilihan utama. Gunakan QRIS untuk hampir semua hal—diterima di mana saja dari mal hingga warung.',
        'indo-health-title': 'Layanan Kesehatan',
        'indo-health-desc': 'Rumah sakit internasional (Siloam, BIMC) sangat baik. Pastikan Anda memiliki asuransi kesehatan ekspat.',
        'indo-transport-title': 'Transportasi',
        'indo-transport-desc': 'Unduh Gojek dan Grab segera. Ini adalah "aplikasi segalanya" untuk transportasi, makanan, dan pengiriman.',
        'indo-footer': 'Terakhir diperbarui: Januari 2026 | Hanya untuk referensi pribadi—konsultasikan dengan profesional untuk saran',
        // Timeline Page Addition (ID)
        'timeline-q1-title': 'Fase 1: Persiapan',
        'timeline-q1-date': 'Jan - Feb 2026',
        'timeline-q2-title': 'Fase 2: Eksekusi',
        'timeline-q2-date': 'Mar - Apr 2026',
        'timeline-q3-title': 'Fase 3: Relokasi',
        'timeline-q3-date': 'Mei 2026',
        'timeline-today': 'HARI INI',
        'timeline-indo-footer': 'Terakhir diperbarui: Januari 2026 | Hanya untuk referensi pribadi—konsultasikan dengan profesional untuk saran',
        // Tax Treaty Page Addition (ID)
        'tax-calc-title': 'Estimasi Posisi Pajak Anda',
        'tax-dta-title': 'Perjanjian Pajak Berganda (DTA)',
        'tax-rules-2026-title': 'Aturan Penduduk Pajak 2026',
        'tax-id-title': 'Kewajiban Pajak Indonesia',
        'tax-cgt-title': 'Peringatan Pajak Keuntungan Modal (CGT)',
        'tax-resources-title': 'Sumber Daya Berguna',
        'tax-filing-title': 'Batas Waktu Pelaporan',
        'tax-resources-list': '<li><strong>Situs ATO:</strong> Cari "Tax Residency for Individuals"</li><li><strong>Treasury.gov.au:</strong> PDF DTA Indonesia-Australia</li><li><strong>Taxation Determination TD 2023/1:</strong> Panduan residensi terbaru</li>',
        // Bank Checklist Page Addition (ID)
        'apply-before-title': 'Ajukan SEBELUM Anda Pergi',
        'apply-before-desc': 'Lakukan refinancing saat Anda masih memiliki pekerjaan di Australia. Begitu berada di luar negeri tanpa pendapatan lokal, aplikasi menjadi jauh lebih sulit. Targetkan penyelesaian dalam <strong>3 bulan sebelum keberangkatan</strong>.',
        'docs-checklist-title': '📄 Dokumen yang Diperlukan',
        'questions-title': '❓ Pertanyaan untuk Bank',
        'q-rate-text': '"Berapa bunga investasi variabel untuk LVR saya (42%)?"',
        'q-rate-note': 'Minta diskon—LVR rendah Anda adalah nilai tawar yang kuat',
        'q-cashout-text': '"Masukkan penarikan tunai relokasi $15rb dalam aplikasi saya"',
        'q-cashout-note': 'Konfirmasi penarikan tunai maksimal yang tersedia',
        'q-fees-text': '"Biaya apa yang berlaku untuk konversi/refinancing?"',
        'q-fees-note': 'Biaya aplikasi, penilaian, penyelesaian, pengeluaran',
        'q-overseas-text': '"Apakah kepindahan saya ke luar negeri akan memengaruhi persetujuan pinjaman?"',
        'q-overseas-note': 'Beberapa bank lebih ramah ekspat daripada yang lain',
        'q-offset-text': '"Apakah pinjaman investasi menyertakan akun offset?"',
        'q-offset-note': 'Pembayaran sewa dapat disimpan di sini untuk mengurangi bunga harian',
        'q-timeline-text': '"Berapa lama waktu persetujuan biasanya?"',
        'q-timeline-note': 'Rencanakan 2-4 minggu; beberapa bisa lebih cepat',
        'q-cashback-text': '"Apakah ada penawaran cashback yang tersedia saat ini?"',
        'q-cashback-note': 'Beberapa bank menawarkan hingga $5rb untuk refinancing',
        'refi-timeline-title': '📅 Jadwal Refinancing',
        'today-display': 'Hari ini adalah',
        'move-scheduled': 'Kepindahan Anda dijadwalkan pada <strong>Mei 2026</strong>',
        'calculating': 'Menghitung waktu...',
        'timeline-3m-title': '3 Bulan Sebelum Pindah',
        'timeline-3m-target': 'Target: Februari 2026',
        't-research-text': 'Riset dan bandingkan bank',
        't-research-note': 'Gunakan Canstar, Finder, atau broker hipotek',
        't-currentlender-text': 'Hubungi bank saat ini terlebih dahulu',
        't-currentlender-note': 'Tanya tentang konversi ke pinjaman investasi dengan penarikan tunai',
        't-quotes-text': 'Dapatkan penawaran dari 3-5 bank',
        't-quotes-note': 'Bandingkan bunga, biaya, fitur, waktu persetujuan',
        'timeline-2m-title': '2 Bulan Sebelum Pindah',
        'timeline-2m-target': 'Target: Maret 2026',
        't-apply-text': 'Ajukan aplikasi pinjaman',
        't-apply-note': 'Selama Anda masih memiliki pekerjaan di Australia!',
        't-valuation-text': 'Penilaian properti diatur oleh bank',
        't-valuation-note': 'Biasanya $200-300; beberapa bank menanggung ini',
        't-approval-text': 'Terima persetujuan pinjaman formal',
        't-approval-note': 'Tinjau semua syarat dan ketentuan dengan cermat',
        'timeline-1m-title': '1 Bulan Sebelum Pindah',
        'timeline-1m-target': 'Target: April 2026',
        't-settlement-text': 'Selesaikan penyelesaian pinjaman',
        't-settlement-note': 'Pinjaman lama dilunasi, pinjaman baru dimulai',
        't-cashout-text': 'Terima dana penarikan tunai $15rb',
        't-cashout-note': 'Biasanya disetor ke rekening yang ditunjuk',
        't-autopay-text': 'Atur pembayaran pinjaman otomatis',
        't-autopay-note': 'Dari rekening Australia tempat sewa akan disetor',
        'checklist-footer': 'Terakhir diperbarui: Januari 2026 | Hanya untuk referensi pribadi—konsultasikan dengan profesional untuk saran',
        // Expat Lenders Page Addition (ID)
        'current-loan-label': 'Pinjaman Saat Ini (Pemilik)',
        'loan-type-var': 'Variabel',
        'lender-westpac': 'Westpac',
        'badge-best': 'TERBAIK',
        'loan-type-inv-var': 'Variabel Investasi',
        'lender-cba': 'CBA',
        'lender-macquarie': 'Macquarie',
        'lender-gc': 'G&C Mutual Bank',
        'loan-type-fixed-3': 'Tetap 3th',
        'lender-anz-nab': 'ANZ / NAB',
        'loan-type-fixed-2': 'Paket Tetap 2th',
        'key-insights-title': 'Wawasan Utama untuk Refinancing',
        'insight-negotiation-title': '💡 Negosiasi Bunga',
        'insight-negotiation-desc': 'Nasabah baru biasanya mendapatkan bunga terbaik. Dengan LVR <70%, harapkan negosiasi 10-15 basis poin dari bunga iklan.',
        'insight-cashback-title': '💰 Penawaran Cashback',
        'insight-cashback-desc': 'Beberapa bank menawarkan cashback hingga $5.000 untuk menarik nasabah baru. Tanya tentang promosi saat ini.',
        'insight-timing-title': '⏰ Waktu',
        'insight-timing-desc': 'Kenaikan bunga RBA diperkirakan Feb 2026. Mengunci bunga saat ini (terutama tetap) mungkin menguntungkan.',
        'insight-fv-title': '📊 Tetap vs Variabel',
        'insight-fv-desc': 'Bunga tetap saat ini sedikit lebih murah daripada variabel tetapi selisih ini menyempit karena bank mengantisipasi kenaikan.',
        'quick-links-title': 'Tautan Aplikasi Bank',
        'col-lender': 'Bank',
        'col-link': 'Tautan',
        'lenders-footer': 'Terakhir diperbarui: Januari 2026 | Hanya untuk referensi pribadi—konsultasikan dengan profesional untuk saran',
    }
};

