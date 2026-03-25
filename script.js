/**
 * --- 1. INITIALIZATION & MOBILE NAVIGATION ---
 */
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('nav-active');
            menuToggle.classList.toggle('toggle-active');
            body.style.overflow = isActive ? 'hidden' : 'auto';
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                menuToggle.classList.remove('toggle-active');
                body.style.overflow = 'auto';
            });
        });
    }

    /**
     * --- 2. PREMIUM CURSOR ENGINE ---
     */
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    if (window.matchMedia("(pointer: fine)").matches && dot && outline) {
        window.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
            
            outline.animate({
                left: `${x}px`,
                top: `${y}px`
            }, { duration: 500, fill: "forwards", easing: "ease-out" });
        });

        const clickables = document.querySelectorAll('a, button, .vouch-clickable, .accordion-header, .method-tile');
        const formFields = document.querySelectorAll('input, textarea, select');

        clickables.forEach(item => {
            item.addEventListener('mouseenter', () => outline.classList.add('cursor-active-outline'));
            item.addEventListener('mouseleave', () => outline.classList.remove('cursor-active-outline'));
        });

        formFields.forEach(field => {
            field.addEventListener('mouseenter', () => {
                outline.style.transform = 'translate(-50%, -50%) scale(0.7)';
                outline.style.borderColor = 'var(--accent-antique)';
            });
            field.addEventListener('mouseleave', () => {
                outline.style.transform = 'translate(-50%, -50%) scale(1)';
                outline.style.borderColor = '';
            });
        });
    }

    // Call secondary functions
    initScrollReveal();
    initAccordion();
    initFormSubmission();
    initVouchOverlay();

});

/**
 * --- 3. SCROLL REVEAL ENGINE ---
 */
const initScrollReveal = () => {
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);
    reveals.forEach(el => revealObserver.observe(el));
};

/**
 * --- 4. ACCORDION MECHANICS ---
 */
const initAccordion = () => {
    const accHeader = document.getElementById('guidelineToggle');
    const accContent = document.getElementById('guidelineContent');
    if (accHeader && accContent) {
        accHeader.addEventListener('click', () => {
            const isOpen = accContent.classList.toggle('open');
            const icon = accHeader.querySelector('.icon');
            if (icon) icon.innerText = isOpen ? '−' : '+';
            accContent.style.maxHeight = isOpen ? (accContent.scrollHeight + 40) + "px" : "0";
            accContent.style.opacity = isOpen ? "1" : "0";
        });
    }
};

/**
 * --- 5. AJAX SUBMISSION ENGINE ---
 */
const initFormSubmission = () => {
    const inquiryForm = document.querySelector('form[action*="formspree"]');
    const formStatus = document.getElementById('form-status');
    const formContainer = document.querySelector('.form-container');

    if (!inquiryForm) return;

    inquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = inquiryForm.querySelector('button[type="submit"]');
        const formData = new FormData(inquiryForm);

        submitBtn.disabled = true;
        submitBtn.innerHTML = "TRANSMITTING...";
        submitBtn.style.letterSpacing = "6px";

        try {
            const response = await fetch(inquiryForm.action, {
                method: inquiryForm.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if (formContainer) {
                    formContainer.style.opacity = "0";
                    formContainer.style.transform = "translateY(-20px)";
                    setTimeout(() => formContainer.style.display = "none", 600);
                }
                setTimeout(() => {
                    if (formStatus) {
                        formStatus.style.display = "flex";
                        setTimeout(() => formStatus.classList.add('active'), 50);
                    }
                }, 650);
            } else { throw new Error(); }
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "RETRY SUBMISSION";
            alert("Submission error. Please try again.");
        }
    });
};

/**
 /* --- 6. MASTER OVERLAY ENGINE (Vouches & Commissions) --- */
const initGlobalOverlay = () => {
    // Selects both your old vouch cards and new commission cards
    const clickables = document.querySelectorAll('.vouch-clickable, .comm-card');
    const overlay = document.getElementById('artOverlay'); // Ensure your HTML ID matches this
    const overlayImg = document.getElementById('fullArtImage');
    const overlayWrapper = document.querySelector('.overlay-wrapper');
    const captionText = document.getElementById('artCaption');

    if (!overlay) return;

    clickables.forEach(card => {
        card.addEventListener('click', () => {
            // 1. Get data from the card
            const imgPath = card.getAttribute('data-img') || card.querySelector('img')?.src;
            const title = card.getAttribute('data-title') || card.querySelector('.card-title')?.innerText || "";
            const isPrivate = card.getAttribute('data-privacy');

            // 2. Clean up old privacy notes
            const oldNote = overlayWrapper.querySelector('.privacy-note');
            if (oldNote) oldNote.remove();

            // 3. Logic for Privacy vs. Regular Art
            if (isPrivate === "true") {
                overlayImg.style.display = "none";
                const note = document.createElement('div');
                note.className = 'privacy-note';
                note.innerHTML = `
                    <i style="display:block; margin-bottom:15px; opacity:0.5; letter-spacing:3px;">[ ACCESS RESTRICTED ]</i>
                    <p style="font-family:'Playfair Display'; font-style:italic;">Client anonymity active.</p>
                `;
                overlayWrapper.appendChild(note);
                if(captionText) captionText.innerText = "Restricted Record";
            } else {
                overlayImg.src = imgPath;
                overlayImg.style.display = "block";
                if(captionText) captionText.innerText = title;
            }

            // 4. Show the Overlay
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

// Define the close function
    const closeOverlay = () => {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // FIX: Attach the listener directly to the X button
    const closeBtn = overlay.querySelector('.overlay-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents conflict
            closeOverlay();
        });
    }

    // Close when clicking the blurred background
    overlay.addEventListener('click', closeOverlay);

    // Keep the box open when clicking the art/content
    if (overlayWrapper) {
        overlayWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

// Start the engine
document.addEventListener('DOMContentLoaded', initGlobalOverlay);

/**
 * --- 7. CINEMATIC PRELOADER & QUOTES ---
 * Displays a randomized artistic quote while the page assets load.
 */

window.addEventListener('load', () => {
    const quoteElement = document.getElementById('quote-text');
    const preloader = document.getElementById('preloader');
    
    const quotes = [
        "“Art isn't a release; it's a reckoning.”",
        "“If your art doesn't scare you, you aren't looking deep enough.”",
        "“The canvas is the only place where you are allowed to be dangerous.”",
        "“Every masterpiece began as a mess someone refused to give up on.”",
        "“Do not ask for permission to exist. Just create.”",
        "“Paint the truth, even if your hands shake while doing it.”",
        "“Vulnerability is the sharpest tool in your kit. Use it.”"
        // ... feel free to add the rest of yours back in here
    ];
    
    // Pick a random quote from the array
    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    if (quoteElement) {
        // Injects the quote with the signature on a new line
        quoteElement.innerHTML = `${selectedQuote}<br><span class="quote-sig">— Vollarae</span>`;
    }

    // Give the user enough time to actually read the quote (3.5s)
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('loaded'); // This triggers the CSS fade-out
        }
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        document.body.classList.remove('loading');
    }, 3500);
});
