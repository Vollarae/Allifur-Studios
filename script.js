document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- 1. MOBILE MENU SYSTEM ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('nav-active');
            menuToggle.classList.toggle('toggle-active');
            body.style.overflow = isActive ? 'hidden' : 'auto';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                menuToggle.classList.remove('toggle-active');
                body.style.overflow = 'auto';
            });
        });
    }

    // --- 2. PREMIUM CURSOR ENGINE (PC ONLY) ---
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
    }

    // --- 3. SCROLL REVEAL ENGINE ---
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

    // --- 4. ACCORDION (GUIDELINES) ---
    const accHeader = document.getElementById('guidelineToggle');
    const accContent = document.getElementById('guidelineContent');

    if (accHeader && accContent) {
        accHeader.addEventListener('click', () => {
            const isOpen = accContent.classList.toggle('open');
            const icon = accHeader.querySelector('.icon');
            if (icon) icon.innerText = isOpen ? '−' : '+';
            
            if (isOpen) {
                accContent.style.maxHeight = (accContent.scrollHeight + 40) + "px";
            } else {
                accContent.style.maxHeight = "0";
            }
        });
    }

    // --- 5. ELEGANT AJAX SUBMISSION ENGINE ---
    const inquiryForm = document.querySelector('form[action*="formspree"]');
    const formStatus = document.getElementById('form-status');
    const formContainer = document.querySelector('.form-container');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = inquiryForm.querySelector('button[type="submit"]');
            const formData = new FormData(inquiryForm);

            submitBtn.disabled = true;
            submitBtn.innerHTML = "TRANSMITTING...";
            submitBtn.style.letterSpacing = "6px";
            submitBtn.style.opacity = "0.5";

            try {
                const response = await fetch(inquiryForm.action, {
                    method: inquiryForm.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (formContainer) {
                        formContainer.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                        formContainer.style.opacity = "0";
                        formContainer.style.transform = "translateY(-20px)";
                    }
                    
                    setTimeout(() => {
                        if (formContainer) formContainer.style.display = "none";
                        if (formStatus) {
                            formStatus.style.display = "block";
                            setTimeout(() => {
                                formStatus.classList.add('reveal', 'active');
                                formStatus.style.opacity = "1";
                            }, 50);
                            window.scrollTo({ top: formStatus.offsetTop - 150, behavior: 'smooth' });
                        }
                    }, 600);
                } else {
                    throw new Error();
                }
            } catch (error) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = "RETRY SUBMISSION";
                submitBtn.style.opacity = "1";
                alert("Submission error. Please check your connection.");
            }
        });
    }

    // --- 6. VOUCH OVERLAY ENGINE (REFINED) ---
    const vouchCards = document.querySelectorAll('.vouch-clickable');
    const overlay = document.getElementById('vouch-overlay');
    const overlayImg = document.getElementById('overlay-img');
    const overlayWrapper = document.querySelector('.overlay-wrapper');
    const closeOverlayBtn = document.querySelector('.overlay-close');

    if (overlay && vouchCards.length > 0) {
        vouchCards.forEach(card => {
            card.addEventListener('click', () => {
                const proofSrc = card.getAttribute('data-img');
                const isPrivate = card.getAttribute('data-privacy');

                // Clear any existing privacy notes
                const oldNote = document.querySelector('.privacy-note');
                if (oldNote) oldNote.remove();

                if (isPrivate === "true") {
                    // VOLLARAE SETTINGS
                    overlayImg.style.display = "none";
                    const note = document.createElement('div');
                    note.className = 'privacy-note';
                    note.innerHTML = `<i style="display:block; margin-bottom:10px; opacity:0.5;">[ ACCESS RESTRICTED ]</i>
                                      The user does not wish to reveal their socials.`;
                    overlayWrapper.appendChild(note);
                } else {
                    // REGULAR SETTINGS
                    overlayImg.src = proofSrc;
                    overlayImg.style.display = "block";
                }

                overlay.style.display = 'flex';
                body.style.overflow = 'hidden';
            });
        });

        const hideOverlay = () => {
            overlay.style.display = 'none';
            body.style.overflow = 'auto';
        };

        // Close when clicking the X
        if (closeOverlayBtn) {
            closeOverlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                hideOverlay();
            });
        }

        // Close when clicking the background (the blur)
        overlay.addEventListener('click', hideOverlay);

        // PREVENT closing when clicking the actual image box
        if (overlayWrapper) {
            overlayWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

});

window.addEventListener('load', () => {
    const quoteElement = document.getElementById('quote-text');
    const preloader = document.getElementById('preloader');
    
    const quotes = [
        "“Art isn't a release; it's a reckoning. Leave the pretty things for the amateurs.”",
        "“If your art doesn't scare you a little, you aren't looking deep enough.”",
        "“Creation is a slow burn. Don't let the world put out the fire.”",
        "“They want a mirror; give them a window instead.”",
        "“Paint the truth, even if your hands shake while doing it.”",
        "“The canvas is the only place where you are truly allowed to be dangerous.”",
        "“Silence is loud, but a stroke of ink is louder.”",
        "“Perfection is a ghost. Stop chasing things that don't breathe.”",
        "“Every masterpiece began as a mess someone refused to give up on.”",
        "“Do not ask for permission to exist. Just create.”",
        "“Art is the blood of the soul spilled onto the page.”",
        "“Comfort is the enemy of growth. Stay uncomfortable.”",
        "“We don't draw to see; we draw to understand.”",
        "“Style is just the shadow your character casts on your work.”",
        "“The world is heavy; let your art be the gravity that holds it together.”",
        "“Burn your ego before you pick up the brush.”",
        "“Obsession is just another word for dedication that people don't understand yet.”",
        "“A blank page is not a void; it is a dare.”",
        "“Don't paint what you see. Paint what it feels like to stand there.”",
        "“Vulnerability is the sharpest tool in your kit. Use it.”"
    ];
    
    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    if (quoteElement) {
        // This adds the quote and the signature on a new line
        quoteElement.innerHTML = `${selectedQuote}<br><span class="quote-sig">— Vollarae</span>`;
    }

    setTimeout(() => {
        if (preloader) preloader.classList.add('loaded');
        document.body.style.overflow = 'auto';
        document.body.classList.remove('loading');
    }, 3500);
});

const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    
    outline.style.left = e.clientX + 'px';
    outline.style.top = e.clientY + 'px';
});

const allClickables = document.querySelectorAll('a, button, .clickable');

allClickables.forEach(item => {
    item.addEventListener('mouseenter', () => {
        outline.classList.add('cursor-active-outline');
    });
    item.addEventListener('mouseleave', () => {
        outline.classList.remove('cursor-active-outline');
    });
});

const formInputs = document.querySelectorAll('input, textarea, select');

formInputs.forEach(input => {
    input.addEventListener('mouseenter', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(0.8)'; // Shrinks to show focus
        outline.style.borderColor = '#C5A059';
    });
    input.addEventListener('mouseleave', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

const selectBox = document.querySelector('select');

if (selectBox) {
    // When the user clicks the dropdown, keep the custom cursor active
    selectBox.addEventListener('mousedown', () => {
        dot.style.opacity = "1";
        outline.style.opacity = "1";
    });

    // If the mouse gets "stuck," force it to wake up on move
    selectBox.addEventListener('change', () => {
        document.body.dispatchEvent(new MouseEvent('mousemove'));
    });
}
