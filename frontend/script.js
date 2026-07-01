// ==========================================
// BACKEND HEALTH CHECK
// ==========================================
fetch(API.HEALTH_URL)
    .then(res => res.json())
    .then(data => {
        if (data.status === "OK" || data.success) {
            console.log("Backend Connected");
        } else {
            console.error("Backend Offline");
        }
    })
    .catch(() => console.error("Backend Offline"));


// ==========================================
// 1. NAVBAR SCROLL & MOBILE MENU LOGIC
// ==========================================
const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

// Sticky Navbar on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Force header background to white if menu opens at top of page
    if (hamburger.classList.contains('active')) {
        header.style.backgroundColor = '#ffffff';
    } else if (window.scrollY <= 50) {
        header.style.backgroundColor = '#ffffff';
    }
});

// Close Mobile Menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');

        // Reset background inline style if closing at top
        if (window.scrollY <= 50) {
            header.style.backgroundColor = '#ffffff';
        }
    });
});

// ==========================================
// 2. HERO SLIDER LOGIC (Dots & Auto Only)
// ==========================================
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
let slideInterval;
const intervalTime = 5000; // Auto slide every 5 seconds

function showSlide(index) {
    if (!slides || slides.length === 0) return;

    if (index >= slides.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = slides.length - 1;
    } else {
        currentIndex = index;
    }

    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current slide and dot
    if (slides[currentIndex]) slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
}

// Next Slide Function for Auto Slider
function nextSlide() {
    if (!slides || slides.length === 0) return;
    showSlide(currentIndex + 1);
}

// Function triggered by clicking dots directly
function currentSlide(index) {
    if (!slides || slides.length === 0) return;
    showSlide(index);
    resetInterval(); // Reset timer when user clicks a dot manually
}

// Start Auto Slider
function startSlide() {
    if (!slides || slides.length === 0) return;
    slideInterval = setInterval(nextSlide, intervalTime);
}

// Reset Interval
function resetInterval() {
    if (!slides || slides.length === 0) return;
    clearInterval(slideInterval);
    startSlide();
}

// Initialize the slider on load
if (slides && slides.length > 0) {
    startSlide();
}





// Function to handle the animated number counter
const counters = document.querySelectorAll('.counter');
const speed = 200; // The lower the slower

// Set up Intersection Observer to trigger animation ONLY when visible on screen
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Trigger when 50% of the section is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Element is in view, start counting
            const target = entry.target;
            let currentCount = 0; // Track precise float value
            const updateCount = () => {
                const targetValue = +target.getAttribute('data-target');

                // Set total frames to 100, at 20ms each = 2 seconds total duration
                const totalFrames = 100;
                const inc = targetValue / totalFrames;

                if (currentCount < targetValue) {
                    currentCount += inc;
                    if (currentCount > targetValue) {
                        currentCount = targetValue;
                    }
                    // Math.floor ensures we don't prematurely skip numbers
                    target.innerText = Math.floor(currentCount);
                    setTimeout(updateCount, 20);
                } else {
                    target.innerText = targetValue;
                }
            };

            updateCount();

            // Unobserve after animation runs once so it doesn't repeat backwards
            observer.unobserve(target);
        }
    });
}, observerOptions);

// Attach observer to all counter elements
counters.forEach(counter => {
    observer.observe(counter);
});




document.addEventListener("DOMContentLoaded", () => {
    // 1. Target the exact IDs from the HTML
    const carousel = document.getElementById('nws-carousel');
    const prevBtn = document.getElementById('nws-prev-btn');
    const nextBtn = document.getElementById('nws-next-btn');

    // 2. Ensure elements exist before adding click events
    if (carousel && prevBtn && nextBtn) {

        // Function to calculate exact scroll distance
        const getScrollAmount = () => {
            const firstCard = carousel.querySelector('.nws-card');
            if (firstCard) {
                // Return the exact width of the card + the 20px gap
                return firstCard.offsetWidth + 20;
            }
            return 300; // Fallback distance if card isn't found
        };

        // 3. Scroll Right Action
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });

        // 4. Scroll Left Action
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

    } else {
        // This will print in the console if the IDs in HTML don't match the IDs in this JS file.
        console.error("Slider setup failed: Buttons or Carousel missing IDs.");
    }
});



document.addEventListener("DOMContentLoaded", () => {
    // Select the elements to animate in the About section
    const aboutElements = document.querySelectorAll('.abt-hidden');

    const aboutObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a slight delay between the left text and right image loading
                setTimeout(() => {
                    entry.target.classList.add('abt-show');
                }, index * 200);

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    aboutElements.forEach((el) => aboutObserver.observe(el));
});






document.addEventListener("DOMContentLoaded", () => {
    // Select elements to animate
    const tstElements = document.querySelectorAll('.tst-hidden');

    const tstObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index for the cards to cascade in
                setTimeout(() => {
                    entry.target.classList.add('tst-show');
                }, index * 150);

                // Unobserve after showing
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% visible
        rootMargin: "0px 0px -50px 0px"
    });

    // Attach observer
    tstElements.forEach((el) => tstObserver.observe(el));
});


// ==========================================
// TESTIMONIALS MODAL LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById('openReviewsBtn');
    const closeBtn = document.getElementById('closeReviewsBtn');
    const modal = document.getElementById('reviewsModal');

    if (openBtn && closeBtn && modal) {
        // Open Modal
        openBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default if it's an anchor tag
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        // Close Modal via Button
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });

        // Close Modal by clicking outside the content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close Modal via Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ==========================================
    // WHATSAPP CONTACT FORM LOGIC
    // ==========================================
    const whatsappContactForm = document.getElementById('whatsappContactForm');
    if (whatsappContactForm) {
        whatsappContactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('c_name').value.trim();
            const phone = document.getElementById('c_phone').value.trim();
            const service = document.getElementById('c_service').value;
            const message = document.getElementById('c_message').value.trim();

            if (!name || !phone) {
                alert('Please enter your name and phone number.');
                return;
            }

            // Add a simple button animation
            const btn = document.getElementById('sendWhatsappBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>Opening WhatsApp...</span>';
            btn.style.opacity = '0.8';

            setTimeout(() => {
                const whatsappNumber = '919876543210';

                const text = `Hi, I want to book a cleaning service.\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message || 'No message provided'}`;
                const encodedText = encodeURIComponent(text);
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

                window.open(whatsappUrl, '_blank');

                // Reset button and form
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                whatsappContactForm.reset();
            }, 800);
        });
    }
});

// ==========================================
// ADVANCED PRICING CALCULATOR LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const calcProperty = document.getElementById('calcProperty');
    const calcSize = document.getElementById('calcSize');
    const calcService = document.getElementById('calcService');
    const calcTotal = document.getElementById('calcTotal');
    const calcDuration = document.getElementById('calcDuration');
    const calcTeam = document.getElementById('calcTeam');
    const calcIncludes = document.getElementById('calcIncludes');
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox');

    if (calcProperty && calcSize && calcService && calcTotal) {

        // 1. Dynamic Size Options based on Property Type
        const sizeOptions = {
            apartment: [
                { value: 'studio', label: 'Studio' },
                { value: '1bhk', label: '1 BHK' },
                { value: '2bhk', label: '2 BHK', selected: true },
                { value: '3bhk', label: '3 BHK' },
                { value: '4bhk', label: '4 BHK' },
                { value: '5bhk', label: '5+ BHK' }
            ],
            villa: [
                { value: 'small_villa', label: 'Small Villa' },
                { value: 'medium_villa', label: 'Medium Villa', selected: true },
                { value: 'large_villa', label: 'Large Villa' },
                { value: 'luxury_villa', label: 'Luxury Villa' }
            ],
            office: [
                { value: 'up_to_1000', label: 'Up to 1000 sq ft', selected: true },
                { value: '1000_2500', label: '1000–2500 sq ft' },
                { value: '2500_5000', label: '2500–5000 sq ft' },
                { value: '5000_plus', label: '5000+ sq ft' }
            ],
            commercial: [
                { value: 'up_to_2500', label: 'Up to 2500 sq ft', selected: true },
                { value: '2500_5000', label: '2500–5000 sq ft' },
                { value: '5000_10000', label: '5000–10,000 sq ft' },
                { value: '10000_plus', label: '10,000+ sq ft' }
            ],
            retail: [
                { value: 'small_shop', label: 'Small Shop', selected: true },
                { value: 'medium_store', label: 'Medium Store' },
                { value: 'large_retail', label: 'Large Retail Space' }
            ],
            restaurant: [
                { value: 'cafe', label: 'Cafe / Small Outlet', selected: true },
                { value: 'mid_restaurant', label: 'Mid-size Restaurant' },
                { value: 'large_dining', label: 'Large Dining / Banquet' }
            ],
            warehouse: [
                { value: 'small_warehouse', label: 'Up to 5000 sq ft', selected: true },
                { value: 'medium_warehouse', label: '5000–15,000 sq ft' },
                { value: 'large_warehouse', label: '15,000+ sq ft' }
            ],
            complex: [
                { value: 'small_complex', label: 'Small Complex (Up to 50 units)', selected: true },
                { value: 'medium_complex', label: 'Medium Complex (50-200 units)' },
                { value: 'large_complex', label: 'Large Complex (200+ units)' }
            ]
        };

        // Populate Size Dropdown based on Property Type
        function updateSizeDropdown() {
            const propType = calcProperty.value;
            const options = sizeOptions[propType] || sizeOptions['apartment'];

            calcSize.innerHTML = '';
            options.forEach(opt => {
                const el = document.createElement('option');
                el.value = opt.value;
                el.textContent = opt.label;
                if (opt.selected) el.selected = true;
                calcSize.appendChild(el);
            });

            calculatePrice();
        }

        // Services Included Matrix
        const servicesMatrix = {
            home: ['Dusting', 'Floor Sweeping & Mopping', 'Basic Kitchen Cleaning', 'Basic Bathroom Wash', 'Trash Removal'],
            deep: ['Intensive Dusting', 'Floor Scrubbing', 'Kitchen Deep Clean & Degrease', 'Bathroom Hard Water Stains', 'Cobweb Removal', 'Window Glass (Inside)'],
            kitchen_deep: ['Appliance Exterior Wiping', 'Cabinet Exterior Cleaning', 'Degreasing Stovetop & Chimney', 'Sink & Tile Scrubbing', 'Exhaust Fan Cleaning'],
            bathroom_deep: ['Tile & Grout Scrubbing', 'Toilet Bowl Deep Stain Removal', 'Shower Enclosure Descaling', 'Mirror Polish', 'Exhaust Fan Cleaning'],
            office: ['Workspace Dusting', 'Trash Removal', 'Pantry Basic Cleaning', 'Restroom Sanitization', 'Floor Maintenance'],
            move_in: ['Empty Cabinet Inside Cleaning', 'Floor Deep Cleaning', 'Bathroom Deep Wash', 'Kitchen Complete Clean', 'Window Wiping'],
            move_out: ['Empty Cabinet Inside Cleaning', 'Floor Deep Cleaning', 'Bathroom Deep Wash', 'Kitchen Complete Clean', 'Window Wiping'],
            post_construction: ['Paint Drop Removal', 'Heavy Dust Vacuuming', 'Floor Scrubbing', 'Window Frame Cleaning', 'Bathroom Sanitization'],
            default: ['Customized Cleaning based on service selected', 'Professional Equipment Used', 'Quality Assured']
        };

        function calculatePrice() {
            const serviceType = calcService.value;
            const propertyType = calcProperty.value;
            const size = calcSize.value;

            let minPrice = 0;
            let maxPrice = 0;
            let duration = '4–6 Hours';
            let team = '2-3 Professionals';

            // 1. Explicit Pricing Rules from user
            if (serviceType === 'home' && propertyType === 'apartment') {
                if (size === 'studio') { minPrice = 699; maxPrice = 999; duration = '2-3 Hours'; team = '1-2 Professionals'; }
                else if (size === '1bhk') { minPrice = 999; maxPrice = 1499; duration = '3-4 Hours'; team = '2 Professionals'; }
                else if (size === '2bhk') { minPrice = 1499; maxPrice = 1999; duration = '4-5 Hours'; team = '2 Professionals'; }
                else if (size === '3bhk') { minPrice = 1999; maxPrice = 2999; duration = '5-6 Hours'; team = '2-3 Professionals'; }
                else if (size === '4bhk') { minPrice = 2999; maxPrice = 3999; duration = '6-8 Hours'; team = '3 Professionals'; }
                else { minPrice = 3999; maxPrice = 5499; duration = '1 Full Day'; team = '3-4 Professionals'; }
            }
            else if (serviceType === 'deep' && propertyType === 'apartment') {
                if (size === 'studio') { minPrice = 1499; maxPrice = 1999; duration = '4-5 Hours'; team = '2 Professionals'; }
                else if (size === '1bhk') { minPrice = 1999; maxPrice = 2999; duration = '5-6 Hours'; team = '2-3 Professionals'; }
                else if (size === '2bhk') { minPrice = 2999; maxPrice = 4499; duration = '6-8 Hours'; team = '3 Professionals'; }
                else if (size === '3bhk') { minPrice = 4499; maxPrice = 6499; duration = '8-10 Hours'; team = '3-4 Professionals'; }
                else if (size === '4bhk') { minPrice = 6499; maxPrice = 8999; duration = '1 Full Day'; team = '4-5 Professionals'; }
                else { minPrice = 8999; maxPrice = 12999; duration = '1-2 Days'; team = '5+ Professionals'; }
            }
            // Fallback general logic for other types
            else {
                // Base cost by service
                const baseCosts = {
                    home: 1200, deep: 2500, kitchen_deep: 1499, bathroom_deep: 999,
                    sofa: 499, mattress: 499, carpet: 999, window: 999,
                    office: 2499, move_in: 3499, move_out: 3499, post_construction: 4999,
                    glass: 1499, floor_polishing: 2999, disinfection: 1999, monthly: 4999
                };
                let base = baseCosts[serviceType] || 1500;

                // Multiplier by size
                let sizeMult = 1.0;
                if (size.includes('medium') || size.includes('1000_2500') || size.includes('2500_5000') && propertyType === 'commercial') sizeMult = 1.5;
                if (size.includes('large') || size.includes('2500_5000') || size.includes('5000_10000')) sizeMult = 2.5;
                if (size.includes('luxury') || size.includes('plus') || size.includes('10000_plus')) sizeMult = 4.0;

                let exact = base * sizeMult;
                minPrice = Math.floor(exact * 0.9);
                maxPrice = Math.floor(exact * 1.2);

                if (sizeMult >= 2.5) { duration = '1 Full Day'; team = '3-5 Professionals'; }
                else if (sizeMult >= 1.5) { duration = '6-8 Hours'; team = '2-3 Professionals'; }
                else { duration = '4-6 Hours'; team = '2 Professionals'; }
            }

            // 2. Add-ons Calculation
            let addonTotal = 0;
            addonCheckboxes.forEach(cb => {
                if (cb.checked) {
                    addonTotal += parseInt(cb.value);
                }
            });

            minPrice += addonTotal;
            maxPrice += addonTotal;

            // Update Price Text
            calcTotal.textContent = `₹${minPrice.toLocaleString('en-IN')} – ₹${maxPrice.toLocaleString('en-IN')}`;

            // Update Stats
            if (calcDuration) calcDuration.textContent = duration;
            if (calcTeam) calcTeam.textContent = team;

            // Update Includes List
            if (calcIncludes) {
                const includes = servicesMatrix[serviceType] || servicesMatrix['default'];
                calcIncludes.innerHTML = '';
                includes.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> ${item}`;
                    calcIncludes.appendChild(li);
                });
            }

            // Animate
            calcTotal.style.transform = 'scale(1.05)';
            calcTotal.style.color = '#15803d';
            setTimeout(() => {
                calcTotal.style.transform = 'scale(1)';
                calcTotal.style.color = '#16a34a';
            }, 200);
        }

        // Event Listeners
        calcProperty.addEventListener('change', updateSizeDropdown);
        calcSize.addEventListener('change', calculatePrice);
        calcService.addEventListener('change', calculatePrice);

        addonCheckboxes.forEach(cb => {
            cb.addEventListener('change', calculatePrice);
        });

        // Initialize
        updateSizeDropdown(); // This will also call calculatePrice()
    }
});
/* =====================================
   COMPACT PRICING CALCULATOR LOGIC
====================================== */
document.addEventListener('DOMContentLoaded', function () {
    const calcContainer = document.getElementById('quote-calculator');
    if (!calcContainer) return;

    const propertyBtns = document.querySelectorAll('#compact-property-select .seg-btn');
    const sizeSelect = document.getElementById('compact-size-select');
    const serviceSelect = document.getElementById('compact-service-select');
    const priceDisplay = document.getElementById('live-price-val');

    let state = {
        propertyTypeMultiplier: 1.0,
        sizeMultiplier: 1.0,
        basePrice: 999,
        currentTotal: 999
    };

    function updatePropertyMultiplier(val) {
        switch (val) {
            case 'apartment': state.propertyTypeMultiplier = 1.0; break;
            case 'villa': state.propertyTypeMultiplier = 1.2; break;
            case 'office': state.propertyTypeMultiplier = 1.1; break;
            default: state.propertyTypeMultiplier = 1.0;
        }
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString('en-IN');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function calculateTotal(animate) {
        state.sizeMultiplier = parseFloat(sizeSelect.value);
        state.basePrice = parseFloat(serviceSelect.value);

        let rawTotal = state.basePrice * state.sizeMultiplier * state.propertyTypeMultiplier;
        let newTotal = Math.round(rawTotal);

        if (animate) {
            animateValue(priceDisplay, state.currentTotal, newTotal, 400);
        } else {
            priceDisplay.innerHTML = newTotal.toLocaleString('en-IN');
        }
        state.currentTotal = newTotal;
    }

    // Property segmented control clicks
    propertyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            propertyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updatePropertyMultiplier(btn.dataset.val);
            calculateTotal(true);
        });
    });

    // Select dropdown changes
    sizeSelect.addEventListener('change', () => calculateTotal(true));
    serviceSelect.addEventListener('change', () => calculateTotal(true));

    // Initial calc
    calculateTotal(false);
});

// ==========================================
// CUSTOM SERVICE DROPDOWN LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const customSelect = document.getElementById("customServiceSelect");
    const hiddenInput = document.getElementById("b_service");

    const serviceMeta = {
        home: { duration: "2–3 Hours", team: "1–2 Professionals" },
        deep: { duration: "4–6 Hours", team: "2–3 Professionals" },
        office: { duration: "4–6 Hours", team: "2–4 Professionals" },
        move: { duration: "6–8 Hours", team: "3–4 Professionals" },
        sofa: { duration: "1–2 Hours", team: "1 Professional" },
        window: { duration: "1–2 Hours", team: "1 Professional" },
        bathroom: { duration: "1.5–3 Hours", team: "1–2 Professionals" },
        kitchen: { duration: "2–3 Hours", team: "1–2 Professionals" },
        custom: { duration: "Flexible", team: "Custom Team" }
    };

    if (customSelect && hiddenInput) {
        const trigger = customSelect.querySelector(".custom-select-trigger");
        const triggerText = trigger.querySelector("span");
        const options = customSelect.querySelectorAll(".custom-option");

        // Toggle open class on trigger click
        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            customSelect.classList.toggle("open");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove("open");
            }
        });

        // Handle option selection
        options.forEach(option => {
            option.addEventListener("click", () => {
                const val = option.getAttribute("data-value");
                const price = option.getAttribute("data-price");
                const text = option.textContent.trim();

                // Update trigger text and style
                triggerText.textContent = text;
                triggerText.style.color = "#0f172a"; // Keep text dark

                // Update hidden input
                hiddenInput.value = val;

                // Remove active class from other options
                options.forEach(opt => opt.classList.remove("selected"));
                option.classList.add("selected");

                // Close dropdown
                customSelect.classList.remove("open");

                // Toggle cards & Update estimated price + specs
                const placeholderCard = document.getElementById("b_placeholder_card");
                const estimateCard = document.getElementById("b_estimate_card");
                const dynamicPrice = document.getElementById("b_dynamic_price");
                const dynamicDuration = document.getElementById("b_dynamic_duration");
                const dynamicTeam = document.getElementById("b_dynamic_team");

                if (placeholderCard && estimateCard) {
                    placeholderCard.style.display = "none";
                    estimateCard.style.display = "block";

                    if (dynamicPrice) {
                        if (parseInt(price) > 0) {
                            dynamicPrice.textContent = `₹${price}`;
                        } else {
                            dynamicPrice.textContent = "Custom Quote";
                        }
                    }

                    // Update spec fields
                    const meta = serviceMeta[val] || { duration: "--", team: "--" };
                    if (dynamicDuration) dynamicDuration.textContent = meta.duration;
                    if (dynamicTeam) dynamicTeam.textContent = meta.team;

                    // Micro-animation on price and spec cards
                    estimateCard.style.transform = "scale(1.02)";
                    estimateCard.style.transition = "transform 0.15s ease";
                    setTimeout(() => {
                        estimateCard.style.transform = "scale(1)";
                    }, 150);
                }
            });
        });
    }
});

// ==========================================
// INTERACTIVE IMAGE SLIDER LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelectorAll('.ts-before-after');

    sliders.forEach(slider => {
        const input = slider.querySelector('.ts-slider');
        if (!input) return;

        // Update the CSS variable based on the range input value
        input.addEventListener('input', (e) => {
            slider.style.setProperty('--position', `${e.target.value}%`);
        });
    });
});

// ==========================================
// FEATURED SERVICES SHOWCASE SLIDER LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector('.sv-slider-track');
    const slides = document.querySelectorAll('.sv-slide');
    const dots = document.querySelectorAll('.sv-slider-dot');
    const prevBtn = document.querySelector('.sv-slider-arrow.prev');
    const nextBtn = document.querySelector('.sv-slider-arrow.next');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;
    const intervalTime = 8000; // 8 seconds

    function goToSlide(index) {
        // Handle wrap around
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentIndex = index;

        // Update classes
        slides.forEach((slide, i) => {
            if (i === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Event Listeners
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoPlay();
        });
    });

    // Auto Play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, intervalTime);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Pause on Hover
    const wrapper = document.querySelector('.sv-slider-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoPlay);
        wrapper.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const minSwipeDistance = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance > minSwipeDistance) {
            // Swiped right (previous slide)
            prevSlide();
            resetAutoPlay();
        } else if (swipeDistance < -minSwipeDistance) {
            // Swiped left (next slide)
            nextSlide();
            resetAutoPlay();
        }
    }

    // Initialize
    goToSlide(0);
    startAutoPlay();
});

// ==========================================
// SERVICE PACKAGES SLIDER LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const pkgSlides = document.querySelectorAll('.sv-pkg-slide');
    if (pkgSlides.length === 0) return;

    const pkgDots = document.querySelectorAll('.sv-pkg-dot');
    let pkgCurrentIndex = 0;
    let pkgInterval;
    const pkgIntervalTime = 8000; // 8 seconds

    function showPkgSlide(index) {
        if (index >= pkgSlides.length) {
            pkgCurrentIndex = 0;
        } else if (index < 0) {
            pkgCurrentIndex = pkgSlides.length - 1;
        } else {
            pkgCurrentIndex = index;
        }

        // Remove active from all
        pkgSlides.forEach(slide => slide.classList.remove('active'));
        pkgDots.forEach(dot => dot.classList.remove('active'));

        // Add active
        pkgSlides[pkgCurrentIndex].classList.add('active');
        pkgDots[pkgCurrentIndex].classList.add('active');
    }

    function pkgNextSlide() {
        showPkgSlide(pkgCurrentIndex + 1);
    }

    function resetPkgInterval() {
        clearInterval(pkgInterval);
        startPkgSlide();
    }

    function startPkgSlide() {
        pkgInterval = setInterval(pkgNextSlide, pkgIntervalTime);
    }

    // Event Listeners
    pkgDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showPkgSlide(index);
            resetPkgInterval();
        });
    });

    // Start auto slide
    startPkgSlide();
});




// SMTP Email Form Submission Logic
document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("bookingForm");

    // Only attach booking form logic if the form exists on this page
    if (bookingForm) {
        // Booking Success Modal DOM Logic (defined first so showSuccessModal is available)
        const successModal = document.getElementById("bookingSuccessModal");
        const modalCloseBtn = document.getElementById("modalCloseBtn");
        const modalActionBtn = document.getElementById("modalActionBtn");
        const modalBackdrop = document.getElementById("modalBackdrop");

        const showSuccessModal = () => {
            if (successModal) {
                successModal.classList.add("show");
                document.body.style.overflow = "hidden";
            }
        };

        const hideSuccessModal = () => {
            if (successModal) {
                successModal.classList.remove("show");
                document.body.style.overflow = "";
            }
        };

        if (modalCloseBtn) modalCloseBtn.addEventListener("click", hideSuccessModal);
        if (modalActionBtn) modalActionBtn.addEventListener("click", hideSuccessModal);
        if (modalBackdrop) modalBackdrop.addEventListener("click", hideSuccessModal);

        bookingForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('button[type="submit"]') || bookingForm.querySelector(".btn-book-submit");
            const originalBtnText = submitBtn ? submitBtn.textContent : "Book Service Now";

            const formEntries = Object.fromEntries(new FormData(bookingForm).entries());
            const formData = {
                full_name: formEntries.full_name?.trim() || "",
                phone_number: formEntries.phone_number?.trim() || "",
                service_type: formEntries.service_type || "",
                booking_date: formEntries.booking_date || "",
                booking_time: formEntries.booking_time || "",
                address: formEntries.address?.trim() || "",
                message: formEntries.message?.trim() || "",
            };

            console.log("Booking submission started");
            console.log("Form values collected:", formData);

            // Client-side empty field validation
            if (!formData.full_name || !formData.phone_number || !formData.service_type || !formData.booking_date || !formData.booking_time || !formData.address) {
                console.warn("Validation failed: Some required fields are empty.");
                console.log("Booking failed");
                alert("Please complete all required booking fields, including selecting a service.");
                return;
            }

            console.log("Validation passed. Initializing API booking request...");

            try {
                // Set loading state
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = "Sending...";
                }

                console.log("Sending request to backend");
                console.log(`Sending POST request to: ${API.BASE_URL}/book-service`);
                const response = await fetch(`${API.BASE_URL}/book-service`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                    signal: AbortSignal.timeout(15000)
                });

                console.log("Backend response received");
                console.log("HTTP Response Status:", response.status, response.statusText);
                const data = await response.json();
                console.log("API Response Data Received:", data);

                if (response.ok && data.success) {
                    console.log("Booking successful");
                    console.log("Booking successfully submitted. Displaying popup and resetting form.");
                    showSuccessModal();
                    bookingForm.reset();

                    // Reset custom select UI
                    const selectTrigger = document.querySelector(".custom-select-trigger span");
                    if (selectTrigger) {
                        selectTrigger.textContent = "Select a service...";
                        selectTrigger.style.color = "";
                    }
                    const customOptions = document.querySelectorAll(".custom-option");
                    customOptions.forEach(opt => opt.classList.remove("selected"));

                    const estimateCard = document.getElementById("b_estimate_card");
                    const placeholderCard = document.getElementById("b_placeholder_card");
                    if (estimateCard && placeholderCard) {
                        estimateCard.style.display = "none";
                        placeholderCard.style.display = "block";
                    }
                } else {
                    console.log("Booking failed");
                    console.error("Booking API Error:", data.message || response.statusText);
                    alert(data.message || "Failed to send booking request.");
                }
            } catch (error) {
                console.log("Booking failed");
                console.error("Fetch request crashed with error:", error);
                alert("Unable to connect to the server. Please try again later.");
            } finally {
                console.log("Restoring submit button state.");
                // Restore loading state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    } // End of bookingForm block

    // ==========================================
    // FAQ ACCORDION LOGIC
    // ==========================================
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".faq-item");
            const answer = item.querySelector(".faq-answer");
            const isActive = item.classList.contains("active");

            // Close all other open FAQ items
            document.querySelectorAll(".faq-item.active").forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                    const otherBtn = otherItem.querySelector(".faq-question");
                    if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");

                    const otherAnswer = otherItem.querySelector(".faq-answer");
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = "0px";
                        otherAnswer.style.paddingBottom = "0px";
                    }
                }
            });

            // Toggle current FAQ item
            if (isActive) {
                item.classList.remove("active");
                btn.setAttribute("aria-expanded", "false");
                if (answer) {
                    answer.style.maxHeight = "0px";
                    answer.style.paddingBottom = "0px";
                }
            } else {
                item.classList.add("active");
                btn.setAttribute("aria-expanded", "true");
                if (answer) {
                    // Smoothly set maxHeight to scrollHeight and add padding-bottom
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    answer.style.paddingBottom = "20px";
                }
            }
        });
    });

    // ==========================================
    // NEWSLETTER SUBSCRIBE LOGIC (Custom Modal)
    // ==========================================
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterBtn = document.getElementById("newsletterBtn");

    // Modal & Toast DOM elements
    const nlOverlay = document.getElementById("nlSuccessOverlay");
    const nlModalClose = document.getElementById("nlModalClose");
    const nlModalBtn = document.getElementById("nlModalBtn");
    const nlErrorToast = document.getElementById("nlErrorToast");
    const nlErrorMsg = document.getElementById("nlErrorMsg");
    const nlErrorClose = document.getElementById("nlErrorClose");

    // Auto-close timer reference
    let nlAutoCloseTimer = null;
    let nlErrorTimer = null;

    // --- Helper: Validate email format ---
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // --- Helper: Show success modal ---
    const showNlSuccessModal = () => {
        if (!nlOverlay) return;
        nlOverlay.classList.add("show");
        document.body.style.overflow = "hidden";

        // Auto-close after 4 seconds
        nlAutoCloseTimer = setTimeout(() => {
            hideNlSuccessModal();
        }, 4000);
    };

    // --- Helper: Hide success modal ---
    const hideNlSuccessModal = () => {
        if (!nlOverlay) return;
        nlOverlay.classList.remove("show");
        document.body.style.overflow = "";
        if (nlAutoCloseTimer) {
            clearTimeout(nlAutoCloseTimer);
            nlAutoCloseTimer = null;
        }
    };

    // --- Helper: Show error toast ---
    const showNlErrorToast = (msg) => {
        if (!nlErrorToast) return;
        if (nlErrorMsg) nlErrorMsg.textContent = msg || "Something went wrong. Please try again.";
        nlErrorToast.classList.add("show");

        // Auto-dismiss after 4 seconds
        if (nlErrorTimer) clearTimeout(nlErrorTimer);
        nlErrorTimer = setTimeout(() => {
            hideNlErrorToast();
        }, 4000);
    };

    // --- Helper: Hide error toast ---
    const hideNlErrorToast = () => {
        if (!nlErrorToast) return;
        nlErrorToast.classList.remove("show");
        if (nlErrorTimer) {
            clearTimeout(nlErrorTimer);
            nlErrorTimer = null;
        }
    };

    // --- Helper: Show inline shake + error on input ---
    const shakeInput = (input) => {
        if (!input) return;
        input.classList.add("nl-input-shake");
        setTimeout(() => input.classList.remove("nl-input-shake"), 400);
    };

    // Modal close event listeners
    if (nlModalClose) nlModalClose.addEventListener("click", hideNlSuccessModal);
    if (nlModalBtn) nlModalBtn.addEventListener("click", hideNlSuccessModal);
    if (nlOverlay) {
        nlOverlay.addEventListener("click", (e) => {
            if (e.target === nlOverlay) hideNlSuccessModal();
        });
    }
    if (nlErrorClose) nlErrorClose.addEventListener("click", hideNlErrorToast);

    // Close modal via Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (nlOverlay && nlOverlay.classList.contains("show")) hideNlSuccessModal();
            if (nlErrorToast && nlErrorToast.classList.contains("show")) hideNlErrorToast();
        }
    });

    // --- Main form submission handler ---
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = newsletterEmail?.value?.trim();

            // Validation: Empty field
            if (!email) {
                shakeInput(newsletterEmail);
                showNlErrorToast("Please enter your email address.");
                return;
            }

            // Validation: Invalid format
            if (!isValidEmail(email)) {
                shakeInput(newsletterEmail);
                showNlErrorToast("Please enter a valid email address.");
                return;
            }

            // Prevent duplicate submissions
            const originalHTML = newsletterBtn.innerHTML;
            newsletterBtn.disabled = true;
            newsletterBtn.innerHTML = "Sending...";

            try {
                const response = await fetch(`${API.BASE_URL}/subscribe`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                    signal: AbortSignal.timeout(15000)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Success: Show custom modal, clear input
                    newsletterEmail.value = "";
                    showNlSuccessModal();
                } else {
                    // Server returned an error
                    showNlErrorToast(data.message || "Subscription failed. Please try again.");
                }
            } catch (error) {
                console.error("Newsletter subscription error:", error);
                showNlErrorToast("Could not connect to the server. Please try again.");
            } finally {
                // Restore button state
                newsletterBtn.innerHTML = originalHTML;
                newsletterBtn.disabled = false;
            }
        });
    }
});