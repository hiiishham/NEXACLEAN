function getCategoryIcon(category) {
    const cat = category.toLowerCase();
    if (cat.includes('health') || cat.includes('deep')) {
        // Shield-check icon
        return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bs-badge-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;
    }
    if (cat.includes('kitchen') || cat.includes('food')) {
        // Utensils icon
        return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bs-badge-icon"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;
    }
    if (cat.includes('eco') || cat.includes('green') || cat.includes('natural')) {
        // Leaf icon
        return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bs-badge-icon"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C10.9 14.19 13.11 12.22 15 9"/></svg>`;
    }
    if (cat.includes('tips') || cat.includes('tricks') || cat.includes('guide')) {
        // Lightbulb icon
        return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bs-badge-icon"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;
    }
    if (cat.includes('office') || cat.includes('workspace') || cat.includes('commercial')) {
        // Briefcase icon
        return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bs-badge-icon"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
    }
    if (cat.includes('bathroom') || cat.includes('toilet') || cat.includes('water')) {
        // Droplet icon
        return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bs-badge-icon"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>`;
    }
    if (cat.includes('seasonal') || cat.includes('spring') || cat.includes('summer')) {
        // Calendar icon
        return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bs-badge-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
    }
    // Tag icon (default fallback)
    return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bs-badge-icon"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`;
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof articles === 'undefined') {
        console.error('articles.js not loaded');
        return;
    }

    const indexBlogGrid = document.getElementById('indexBlogGrid');
    if (indexBlogGrid && articles.length > 3) {
        const featured = articles[0]; // Article 1
        const featuredIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bs-badge-icon"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`;

        let sideCardsHTML = '';
        for (let i = 1; i <= 3; i++) { // Articles 2, 3, 4
            const article = articles[i];
            const badgeIcon = getCategoryIcon(article.category);
            
            sideCardsHTML += `
                <!-- Card ${i} -->
                <a href="blog-details.html?id=${article.id}" class="bs-side-card">
                    <img src="${article.coverImage}" alt="${article.category}" class="bss-img">
                    <div class="bss-content">
                        <span class="bss-badge">${badgeIcon} ${article.category.toUpperCase()}</span>
                        <h4 class="bss-title">${article.title}</h4>
                        <span class="bss-read">Read Article <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></span>
                    </div>
                </a>
            `;
        }

        indexBlogGrid.innerHTML = `
            <!-- Left: Featured Card -->
            <a href="blog-details.html?id=${featured.id}" class="bs-featured-card">
                <img src="${featured.coverImage}" alt="${featured.title}" class="bsf-bg">
                <div class="bsf-overlay"></div>
                <div class="bsf-content">
                    <span class="bsf-badge">${featuredIcon} FEATURED</span>
                    <h3 class="bsf-title">${featured.title}</h3>
                    <p class="bsf-desc">${featured.introduction.substring(0, 120)}...</p>

                    <div class="bsf-footer">
                        <div class="bsf-author">
                            <img src="${featured.author.image}" alt="${featured.author.name}">
                            <div class="bsf-author-info">
                                <span class="bsf-author-name">By ${featured.author.name}</span>
                                <span class="bsf-author-date">${featured.date} • ${featured.readTime}</span>
                            </div>
                        </div>
                        <div class="bsf-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </div>
                    </div>
                </div>
            </a>

            <!-- Right: Side Cards -->
            <div class="bs-side-cards">
                ${sideCardsHTML}
            </div>
        `;
    }
});
