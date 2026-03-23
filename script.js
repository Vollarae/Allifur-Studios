/**
 * ALLIFUR ART - MASTER SCRIPT 2026
 * Unified Digital Gallery Engine
 */

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
                accContent.style.maxHeight = accContent.scrollHeight + "px";
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