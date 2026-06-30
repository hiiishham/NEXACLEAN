document.addEventListener('DOMContentLoaded', () => {
    // ── 1. Get article ID from URL ──────────────────────
    const params = new URLSearchParams(window.location.search);
    const articleId = parseInt(params.get('id'));

    if (!articleId || typeof articles === 'undefined') {
        document.getElementById('bdHero').innerHTML = '<p style="text-align:center;padding:100px 20px;font-size:20px;color:#64748b;">Article not found. <a href="blog.html" style="color:#00b359;">Return to Blog</a></p>';
        return;
    }

    const article = articles.find(a => a.id === articleId);
    if (!article) {
        document.getElementById('bdHero').innerHTML = '<p style="text-align:center;padding:100px 20px;font-size:20px;color:#64748b;">Article not found. <a href="blog.html" style="color:#00b359;">Return to Blog</a></p>';
        return;
    }

    // ── 2. Update page title ────────────────────────────
    document.title = article.title + ' - NexaClean Blog';

    // ── 3. Render Hero Section ──────────────────────────
    document.getElementById('bdHero').innerHTML = `
        <div class="bd-cover-wrap">
            <img src="${article.coverImage}" alt="${article.title}" class="bd-cover-img">
            <div class="bd-cover-overlay">
                <span class="bd-category-badge">${article.category}</span>
                <h1 class="bd-hero-title">${article.title}</h1>
                <div class="bd-hero-meta">
                    <div class="bd-author-chip">
                        <img src="${article.author.image}" alt="${article.author.name}" class="bd-author-avatar">
                        <div class="bd-author-info">
                            <span class="bd-author-name">${article.author.name}</span>
                            <span class="bd-author-role">${article.author.role}</span>
                        </div>
                    </div>
                    <div class="bd-meta-divider"></div>
                    <div class="bd-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        ${article.date}
                    </div>
                    <div class="bd-meta-divider"></div>
                    <div class="bd-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${article.readTime}
                    </div>
                </div>
            </div>
        </div>
    `;

    // ── 4. Render Introduction ──────────────────────────
    document.getElementById('bdIntro').innerHTML = article.introduction;

    // ── 5. Render Quote ─────────────────────────────────
    document.getElementById('bdQuote').innerHTML = `
        <div class="bd-quote-block">
            <div class="bd-quote-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
            </div>
            <p class="bd-quote-text">${article.quote.text}</p>
            <span class="bd-quote-author">— ${article.quote.author}</span>
        </div>
    `;

    // ── 6. Render Content Sections ──────────────────────
    let sectionsHTML = '';
    let tocHTML = '';

    article.sections.forEach((section, index) => {
        sectionsHTML += `
            <div class="bd-section">
                <h2 class="bd-section-title" id="${section.id}">${section.title}</h2>
                <div class="bd-section-text">${section.content}</div>
                ${section.image ? `
                    <div class="bd-section-img-wrap">
                        <img src="${section.image}" alt="${section.imageCaption || section.title}" class="bd-section-img">
                        ${section.imageCaption ? `<div class="bd-img-caption">${section.imageCaption}</div>` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        tocHTML += `<li><a href="#${section.id}" class="bd-toc-link">${section.title}</a></li>`;
    });

    // Add TOC entries for other sections
    tocHTML += `<li><a href="#bd-tips-anchor" class="bd-toc-link">Pro Tips</a></li>`;
    tocHTML += `<li><a href="#bd-checklist-anchor" class="bd-toc-link">Checklist</a></li>`;
    tocHTML += `<li><a href="#bd-faq-anchor" class="bd-toc-link">FAQs</a></li>`;

    document.getElementById('bdSections').innerHTML = sectionsHTML;
    document.getElementById('bdTocList').innerHTML = tocHTML;

    // ── 7. Render Tips ──────────────────────────────────
    const tipIcons = {
        lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
        star: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        shield: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
        zap: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        leaf: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
        sparkle: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>'
    };

    let tipsHTML = `
        <div class="bd-tips-section" id="bd-tips-anchor">
            <h3 class="bd-tips-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00b359" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
                Pro Tips
            </h3>
            <div class="bd-tips-grid">
    `;

    article.tips.forEach(tip => {
        const icon = tipIcons[tip.icon] || tipIcons.lightbulb;
        tipsHTML += `
            <div class="bd-tip-card">
                <div class="bd-tip-icon-wrap">${icon}</div>
                <div class="bd-tip-content">
                    <h4>${tip.title}</h4>
                    <p>${tip.content}</p>
                </div>
            </div>
        `;
    });

    tipsHTML += '</div></div>';
    document.getElementById('bdTips').innerHTML = tipsHTML;

    // ── 8. Render Checklist ─────────────────────────────
    let checklistHTML = `
        <div class="bd-checklist-section" id="bd-checklist-anchor">
            <h3 class="bd-checklist-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00b359" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Quick Checklist
            </h3>
            <ul class="bd-checklist-items">
    `;

    article.checklist.forEach(item => {
        checklistHTML += `
            <li class="bd-checklist-item">
                <span class="bd-check-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                ${item}
            </li>
        `;
    });

    checklistHTML += '</ul></div>';
    document.getElementById('bdChecklist').innerHTML = checklistHTML;

    // ── 9. Render FAQs ──────────────────────────────────
    let faqHTML = `
        <div class="bd-faq-section" id="bd-faq-anchor">
            <h3 class="bd-faq-section-title">Frequently Asked Questions</h3>
    `;

    article.faqs.forEach((faq, i) => {
        faqHTML += `
            <div class="bd-faq-item" data-faq="${i}">
                <div class="bd-faq-question">
                    <span>${faq.question}</span>
                    <svg class="bd-faq-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <div class="bd-faq-answer">
                    <div class="bd-faq-answer-inner">${faq.answer}</div>
                </div>
            </div>
        `;
    });

    faqHTML += '</div>';
    document.getElementById('bdFaqs').innerHTML = faqHTML;

    // ── 10. Render Author Card ──────────────────────────
    document.getElementById('bdAuthorCard').innerHTML = `
        <div class="bd-author-card">
            <img src="${article.author.image}" alt="${article.author.name}" class="bd-author-card-img">
            <div class="bd-author-card-info">
                <h4>${article.author.name}</h4>
                <span class="bd-ac-role">${article.author.role}</span>
                <p>${article.author.bio}</p>
            </div>
        </div>
    `;

    // ── 11. Render Related Articles ─────────────────────
    let relatedHTML = '';
    article.relatedArticles.forEach(relId => {
        const rel = articles.find(a => a.id === relId);
        if (rel) {
            relatedHTML += `
                <a href="blog-details.html?id=${rel.id}" class="bd-related-card">
                    <img src="${rel.coverImage}" alt="${rel.title}" class="bd-related-card-img">
                    <div class="bd-related-card-body">
                        <div class="bd-related-card-cat">${rel.category}</div>
                        <h3 class="bd-related-card-title">${rel.title}</h3>
                    </div>
                </a>
            `;
        }
    });
    document.getElementById('bdRelatedGrid').innerHTML = relatedHTML;

    // ═══════════════════════════════════════════════════
    // INTERACTIVE LOGIC
    // ═══════════════════════════════════════════════════

    // FAQ Accordion
    document.querySelectorAll('.bd-faq-question').forEach(q => {
        q.addEventListener('click', function () {
            const item = this.closest('.bd-faq-item');
            const wasActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.bd-faq-item').forEach(i => i.classList.remove('active'));

            // Toggle clicked
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });

    // Reading Progress Bar
    const progressBar = document.getElementById('bdProgressBar');
    const allSections = document.querySelectorAll('.bd-section-title, #bd-tips-anchor, #bd-checklist-anchor, #bd-faq-anchor');
    const allTocLinks = document.querySelectorAll('.bd-toc-link');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';

        // TOC Active State
        let currentId = '';
        allSections.forEach(sec => {
            if (scrollTop >= sec.offsetTop - 160) {
                currentId = sec.getAttribute('id');
            }
        });

        allTocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for TOC links
    document.querySelectorAll('.bd-toc-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Share Buttons
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(article.title);

    document.getElementById('bdShareTwitter').addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`, '_blank');
    });

    document.getElementById('bdShareFacebook').addEventListener('click', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, '_blank');
    });

    document.getElementById('bdShareLinkedin').addEventListener('click', () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`, '_blank');
    });

    document.getElementById('bdShareCopy').addEventListener('click', function () {
        navigator.clipboard.writeText(window.location.href);
        this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00b359" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => {
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
        }, 2000);
    });
});
