document.addEventListener('DOMContentLoaded', () => {
    if (typeof articles === 'undefined') {
        console.error('articles.js not loaded');
        return;
    }

    // 1. Render Featured Article dynamically without modifying UI structure
    const featuredCard = document.querySelector('.bp-editorial-card');
    if (featuredCard && articles.length > 0) {
        // Use article 28 or fallback to the first article
        const featuredData = articles.find(a => a.id === 28) || articles[0];
        
        const titleEl = document.querySelector('.bp-editorial-title');
        if (titleEl) titleEl.textContent = featuredData.title;
        
        const descEl = document.querySelector('.bp-editorial-desc');
        if (descEl) descEl.textContent = featuredData.introduction;
        
        const authorNameEl = document.querySelector('.bp-author-name');
        if (authorNameEl) authorNameEl.textContent = featuredData.author.name;
        
        const authorImgEl = document.querySelector('.bp-author-avatar-icon img');
        if (authorImgEl) authorImgEl.src = featuredData.author.image;
        
        const metaChips = document.querySelectorAll('.bp-editorial-meta-chips .bp-glass-chip');
        if (metaChips.length >= 3) {
            metaChips[0].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6DFF7A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${featuredData.readTime}`;
            metaChips[1].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6DFF7A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> ${featuredData.category}`;
            metaChips[2].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6DFF7A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${featuredData.date}`;
        }
        
        const imgEl = document.querySelector('.bp-editorial-img');
        if (imgEl) imgEl.src = featuredData.coverImage;
        
        const ctaBtn = document.querySelector('.bp-editorial-cta');
        if (ctaBtn) ctaBtn.href = `blog-details.html?id=${featuredData.id}`;
        
        // Make the entire card clickable
        featuredCard.style.cursor = 'pointer';
        featuredCard.addEventListener('click', (e) => {
            if (e.target !== ctaBtn) {
                window.location.href = `blog-details.html?id=${featuredData.id}`;
            }
        });
    }

    // 2. Render Latest Articles Grid and Filters
    const gridContainer = document.getElementById('bpGrid');
    const filterBar = document.getElementById('bpFilterBar');
    const searchInput = document.getElementById('bpSearchInput');
    
    if (gridContainer) {
        // Calculate category counts
        const categories = { 'All Articles': articles.length };
        
        // Define exact order from requirements
        const order = ['All Articles', 'Cleaning Tips', 'Home Care', 'Office Cleaning', 'Eco-Friendly', 'Deep Cleaning', 'Kitchen & Bathroom', 'Move-In / Move-Out', 'Company News'];
        
        articles.forEach(article => {
            if (!categories[article.category]) categories[article.category] = 0;
            categories[article.category]++;
        });

        // Generate Filter Buttons in order
        if (filterBar) {
            let filterHTML = '';
            order.forEach(cat => {
                if (categories[cat] !== undefined) {
                    const isActive = cat === 'All Articles' ? 'active' : '';
                    filterHTML += `<button class="bp-filter-btn ${isActive}" data-filter="${cat}">
                        ${cat} <span class="bp-filter-count">${categories[cat]}</span>
                    </button>`;
                }
            });
            filterBar.innerHTML = filterHTML;
        }

        // Update explore cards with real counts
        const exploreCards = document.querySelectorAll('.bp-explore-card');
        exploreCards.forEach(card => {
            const titleEl = card.querySelector('.bp-explore-card-title');
            const countEl = card.querySelector('.bp-explore-count');
            if (titleEl && countEl) {
                const catName = titleEl.textContent.trim();
                const realCount = categories[catName] || 0;
                countEl.innerHTML = `${realCount} Articles &rarr;`;
            }
        });

        // Generate Grid Cards
        let gridHTML = '';
        articles.forEach(article => {
            gridHTML += `
                <a href="blog-details.html?id=${article.id}" class="bp-card" data-category="${article.category}" data-title="${article.title.toLowerCase()}">
                    <div class="bp-card-img-wrap">
                        <span class="bp-card-badge">${article.category}</span>
                        <img src="${article.coverImage}" alt="${article.title}">
                    </div>
                    <div class="bp-card-content">
                        <h4 class="bp-card-title">${article.title}</h4>
                        <p class="bp-card-excerpt">${article.introduction.substring(0, 100)}...</p>
                        <div class="bp-card-footer">
                            <div class="bp-card-meta">
                                <img src="${article.author.image}" alt="${article.author.name}">
                                <span>${article.author.name} • ${article.readTime}</span>
                            </div>
                            <div class="bp-card-read">&rarr;</div>
                        </div>
                    </div>
                </a>
            `;
        });
        gridContainer.innerHTML = gridHTML;

        // Filtering Logic
        const filterBtns = document.querySelectorAll('.bp-filter-btn');
        const cards = document.querySelectorAll('.bp-card');
        
        function filterArticles() {
            const activeBtn = document.querySelector('.bp-filter-btn.active');
            const activeFilter = activeBtn ? activeBtn.dataset.filter : 'All Articles';
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            
            let visibleCount = 0;

            cards.forEach(card => {
                const cardCat = card.dataset.category;
                const cardTitle = card.dataset.title;
                const matchCategory = activeFilter === 'All Articles' || activeFilter === cardCat;
                
                // Allow search to match either the article title OR its category
                const matchSearch = cardTitle.includes(searchTerm) || cardCat.toLowerCase().includes(searchTerm);
                
                if (matchCategory && matchSearch) {
                    visibleCount++;
                    if (card.style.display === 'none' || card.classList.contains('filtering-out')) {
                        card.style.display = '';
                        card.classList.remove('filtering-out');
                        void card.offsetWidth; // Force reflow
                        card.classList.add('filtering-in');
                    }
                } else {
                    if (!card.classList.contains('filtering-out')) {
                        card.classList.remove('filtering-in');
                        card.classList.add('filtering-out');
                        setTimeout(() => { 
                            if (card.classList.contains('filtering-out')) {
                                card.style.display = 'none'; 
                            }
                        }, 400);
                    }
                }
            });

            // Handle "No Results" state
            let noResultsMsg = document.getElementById('bpNoResults');
            if (visibleCount === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.id = 'bpNoResults';
                    noResultsMsg.style.width = '100%';
                    noResultsMsg.style.textAlign = 'center';
                    noResultsMsg.style.padding = '60px 20px';
                    noResultsMsg.style.color = '#6b7280';
                    noResultsMsg.style.fontSize = '18px';
                    noResultsMsg.style.gridColumn = '1 / -1'; // Span full grid
                    noResultsMsg.innerHTML = '<svg style="margin: 0 auto 15px auto; display: block; color: #9ca3af;" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> No articles found matching your search.';
                    gridContainer.appendChild(noResultsMsg);
                }
                noResultsMsg.style.display = 'block';
            } else {
                if (noResultsMsg) noResultsMsg.style.display = 'none';
            }
        }

        if (filterBtns) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    filterArticles();
                    
                    // Close dropdown after selection
                    const dropdown = document.getElementById('bpFilterDropdown');
                    if (dropdown) dropdown.classList.remove('open');
                });
            });
        }
        
        // Dropdown Toggle Logic
        const filterTrigger = document.getElementById('bpFilterTrigger');
        const filterDropdown = document.getElementById('bpFilterDropdown');
        
        if (filterTrigger && filterDropdown) {
            filterTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                filterDropdown.classList.toggle('open');
            });
            
            document.addEventListener('click', (e) => {
                if (!filterDropdown.contains(e.target) && !filterTrigger.contains(e.target)) {
                    filterDropdown.classList.remove('open');
                }
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', filterArticles);
        }
    }

    // 3. Render Trending Section (Premium Sidebar Layout)
    const trendingContainer = document.getElementById('bpTrendingGrid');
    if (trendingContainer && articles.length > 5) {
        // Left Featured Trending Article
        const featuredArticle = articles[0]; // Let's use the first one as featured
        const featuredViews = '15.2K';
        
        let trendingHTML = `
            <div class="bp-trending-featured">
                <a href="blog-details.html?id=${featuredArticle.id}" class="bp-trend-featured-card">
                    <div class="bp-trend-featured-img-wrap">
                        <img src="${featuredArticle.coverImage}" alt="${featuredArticle.title}">
                        <div class="bp-trend-featured-overlay"></div>
                        <span class="bp-trend-fire-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            #01 Trending
                        </span>
                    </div>
                    <div class="bp-trend-featured-content">
                        <div class="bp-article-meta" style="color: #6b7280; margin-bottom: 12px; font-size: 13px;">
                            <span class="bp-meta-item" style="margin-right: 15px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> June 20, 2026
                            </span>
                            <span class="bp-meta-item" style="margin-right: 15px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${featuredArticle.readTime}
                            </span>
                            <span class="bp-meta-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> ${featuredViews} Views
                            </span>
                        </div>
                        <h3 class="bp-trend-featured-title">${featuredArticle.title}</h3>
                        <p class="bp-trend-featured-excerpt">${featuredArticle.introduction.substring(0, 120)}...</p>
                        <div class="bp-article-read-more" style="margin-top: 20px;">Read Article <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 5px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
                    </div>
                </a>
            </div>
            <div class="bp-trending-list">
        `;
        
        const views = ['12.4K', '10.2K', '8.7K', '7.1K', '6.5K'];
        for (let i = 1; i <= 4; i++) {
            const article = articles[i];
            const rank = (i + 1).toString().padStart(2, '0');
            trendingHTML += `
                <a href="blog-details.html?id=${article.id}" class="bp-trend-list-card">
                    <span class="bp-trend-rank">#${rank}</span>
                    <div class="bp-trend-list-img">
                        <img src="${article.coverImage}" alt="${article.title}">
                    </div>
                    <div class="bp-trend-list-info">
                        <span class="bp-trend-list-cat">${article.category}</span>
                        <h4 class="bp-trend-list-title">${article.title}</h4>
                        <div class="bp-trend-list-meta">
                            <span style="display:inline-flex;align-items:center;margin-right:12px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:3px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${article.readTime}</span>
                            <span style="display:inline-flex;align-items:center;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:3px;"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> ${views[i-1]}</span>
                        </div>
                    </div>
                </a>
            `;
        }
        trendingHTML += `</div>`;
        trendingContainer.innerHTML = trendingHTML;
    }
});
