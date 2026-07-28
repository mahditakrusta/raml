/**
 * Raml Theme JavaScript
 */

(function() {
    'use strict';

    // Mobile Menu Toggle
    window.toggleMobileMenu = function() {
        const menu = document.getElementById('mobile-menu');
        if (menu) {
            menu.classList.toggle('active');
        }
    };

    // Add to Cart AJAX
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            e.preventDefault();
            const button = e.target.closest('.add-to-cart');
            const productId = button.dataset.productId;

            if (!productId) return;

            // Add loading state
            button.classList.add('loading');
            button.innerHTML = '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="width: 1rem; height: 1rem;"><circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

            // AJAX request
            const formData = new FormData();
            formData.append('action', 'raml_add_to_cart');
            formData.append('product_id', productId);
            formData.append('quantity', 1);
            formData.append('nonce', raml_ajax.nonce);

            fetch(raml_ajax.ajax_url, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                if (data.fragments) {
                    // Update cart count
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        // Extract count from fragments or increment
                        const currentCount = parseInt(cartCount.textContent) || 0;
                        cartCount.textContent = currentCount + 1;
                    } else {
                        // Create cart count if doesn't exist
                        const cartButton = document.querySelector('.cart-button');
                        if (cartButton) {
                            const countSpan = document.createElement('span');
                            countSpan.className = 'cart-count';
                            countSpan.textContent = '1';
                            cartButton.appendChild(countSpan);
                        }
                    }

                    // Success animation
                    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 1rem; height: 1rem;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>';
                    button.style.backgroundColor = '#22c55e';
                    button.style.color = 'white';

                    setTimeout(() => {
                        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>';
                        button.style.backgroundColor = '';
                        button.style.color = '';
                        button.classList.remove('loading');
                    }, 2000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>';
                button.classList.remove('loading');
            });
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.site-header');
    if (header) {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            } else {
                header.style.boxShadow = '';
            }

            lastScroll = currentScroll;
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.product-card, .category-card, .badge-item').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Product image gallery (for single product)
    const thumbnails = document.querySelectorAll('.product-thumbnails img');
    const mainImage = document.querySelector('.woocommerce-product-gallery__image img');

    if (thumbnails.length && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.dataset.large || this.src;
                
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Quantity buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-btn')) {
            const input = e.target.parentElement.querySelector('.qty');
            const currentVal = parseInt(input.value) || 1;
            const max = parseInt(input.max) || 999;
            const min = parseInt(input.min) || 1;

            if (e.target.classList.contains('qty-plus')) {
                if (currentVal < max) {
                    input.value = currentVal + 1;
                }
            } else if (e.target.classList.contains('qty-minus')) {
                if (currentVal > min) {
                    input.value = currentVal - 1;
                }
            }

            // Trigger change event
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('button');
            
            // Simple validation
            if (!email || !email.includes('@')) {
                alert('لطفاً یک ایمیل معتبر وارد کنید.');
                return;
            }

            // Simulate subscription
            button.textContent = 'در حال ثبت...';
            button.disabled = true;

            setTimeout(() => {
                button.textContent = 'ثبت شد ✓';
                button.style.backgroundColor = '#22c55e';
                this.querySelector('input').value = '';

                setTimeout(() => {
                    button.textContent = 'عضویت';
                    button.style.backgroundColor = '';
                    button.disabled = false;
                }, 3000);
            }, 1000);
        });
    }

    // Lazy loading images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
        script.onload = function() {
            const observer = lozad();
            observer.observe();
        };
        document.body.appendChild(script);
    }

    // Console welcome message
    console.log('%c رَمل - سفال و سرامیک دست‌ساز ', 
        'background: linear-gradient(to right, #a66149, #8a4e3e); color: white; padding: 10px 20px; font-size: 16px; font-family: Vazirmatn, sans-serif;');

})();

// CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    .add-to-cart.loading {
        pointer-events: none;
    }
`;
document.head.appendChild(style);
