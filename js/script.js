// DOM Elements
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');
const volunteerForm = document.getElementById('volunteer-form');

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Initialize Mobile Menu
if (mobileMenu) {
    mobileMenu.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Form validation and submission
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

function showFormMessage(form, message, type = 'success') {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        font-weight: 500;
        ${type === 'success' 
            ? 'background-color: #D1FAE5; color: #065F46; border: 1px solid #10B981;' 
            : 'background-color: #FEE2E2; color: #991B1B; border: 1px solid #EF4444;'
        }
    `;
    messageDiv.textContent = message;
    form.insertBefore(messageDiv, form.firstChild);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Contact Form Handler
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const nome = formData.get('nome');
        const email = formData.get('email');
        const telefono = formData.get('telefono');
        const messaggio = formData.get('messaggio');

        // Validation
        if (!nome || nome.trim().length < 2) {
            showFormMessage(this, 'Inserisci un nome valido (almeno 2 caratteri)', 'error');
            return;
        }

        if (!email || !validateEmail(email)) {
            showFormMessage(this, 'Inserisci un indirizzo email valido', 'error');
            return;
        }

        if (telefono && !validatePhone(telefono)) {
            showFormMessage(this, 'Inserisci un numero di telefono valido', 'error');
            return;
        }

        if (!messaggio || messaggio.trim().length < 10) {
            showFormMessage(this, 'Il messaggio deve contenere almeno 10 caratteri', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Invio in corso...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showFormMessage(this, 'Messaggio inviato con successo! Ti risponderemo il prima possibile.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Volunteer Form Handler
if (volunteerForm) {
    volunteerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const nome = formData.get('nome');
        const email = formData.get('email');
        const telefono = formData.get('telefono');
        const eta = formData.get('eta');
        const motivazione = formData.get('motivazione');
        const privacy = formData.get('privacy');

        // Validation
        if (!nome || nome.trim().length < 2) {
            showFormMessage(this, 'Inserisci un nome valido (almeno 2 caratteri)', 'error');
            return;
        }

        if (!email || !validateEmail(email)) {
            showFormMessage(this, 'Inserisci un indirizzo email valido', 'error');
            return;
        }

        if (!telefono || !validatePhone(telefono)) {
            showFormMessage(this, 'Inserisci un numero di telefono valido', 'error');
            return;
        }

        if (eta && (eta < 18 || eta > 80)) {
            showFormMessage(this, 'L\'età deve essere compresa tra 18 e 80 anni', 'error');
            return;
        }

        if (!motivazione || motivazione.trim().length < 20) {
            showFormMessage(this, 'La motivazione deve contenere almeno 20 caratteri', 'error');
            return;
        }

        if (!privacy) {
            showFormMessage(this, 'Devi accettare il trattamento dei dati personali', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Invio in corso...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showFormMessage(this, 'Candidatura inviata con successo! Ti contatteremo presto per un colloquio conoscitivo.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Scroll to top button
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Torna su');
    document.body.appendChild(scrollBtn);

    // Show/hide button based on scroll position
    function toggleScrollButton() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }

    // Scroll to top functionality
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', toggleScrollButton);
}

// Initialize scroll to top button
createScrollToTopButton();

// Intersection Observer for animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.2s';
                entry.target.style.animationFillMode = 'both';
                entry.target.style.animationName = 'fadeInUp';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe sections and cards
    document.querySelectorAll('.section, .service-card, .divisa-item, .giulio-item').forEach(el => {
        observer.observe(el);
    });
}

// Image lazy loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Gallery functionality for divise and Giulio images
function initializeGalleries() {
    const galleryImages = document.querySelectorAll('.divisa-img, .giulio-img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            createImageModal(this.src, this.alt);
        });
    });
}

function createImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    `;

    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    });

    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);

    // Trigger animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    observeElements();
    lazyLoadImages();
    initializeGalleries();
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!this.disabled && this.type !== 'submit') {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });

    // Console message
    console.log('🧡 Volontari del Cuore Bolognetta - Sito web inizializzato con successo!');
    console.log('📧 Per informazioni: info@volontaridelcuore.it');
});

// Handle page refresh and back button
window.addEventListener('beforeunload', function() {
    // Save scroll position
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', function() {
    // Restore scroll position
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem('scrollPosition');
    }
});

// Performance optimization - debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedNavbarScroll = debounce(handleNavbarScroll, 10);
window.removeEventListener('scroll', handleNavbarScroll);
window.addEventListener('scroll', debouncedNavbarScroll);

// Error handling
window.addEventListener('error', function(e) {
    console.error('Si è verificato un errore:', e.error);
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Tab navigation for mobile menu
    if (e.key === 'Tab' && navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll('a, button');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }
});

// Service Worker for basic caching (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want to add service worker for caching
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// =====================================
// SEZIONE ASTRONOMIA - API HUBBLE
// =====================================

class HubbleGallery {
    constructor() {
        this.gallery = document.getElementById('hubble-gallery');
        this.filters = document.querySelectorAll('.filter-btn');
        this.lastUpdateElement = document.getElementById('last-update');
        this.currentFilter = 'all';
        this.updateInterval = null;
        this.images = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadHubbleImages();
        this.startAutoUpdate();
    }

    setupEventListeners() {
        // Filtri delle immagini
        this.filters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Rimuovi active da tutti i bottoni
                this.filters.forEach(b => b.classList.remove('active'));
                // Aggiungi active al bottone cliccato
                e.target.classList.add('active');
                // Imposta il filtro
                this.currentFilter = e.target.dataset.filter;
                // Filtra le immagini
                this.filterImages();
            });
        });
    }

    async loadHubbleImages() {
        try {
            this.showLoading();
            
            // Prova prima con l'API locale, poi fallback su immagini statiche
            let hubbleData;
            
            try {
                // Tentativo di connessione all'API locale
                const response = await fetch(`/api/hubble/images?category=${this.currentFilter}&t=${Date.now()}`);
                
                if (response.ok) {
                    hubbleData = await response.json();
                    if (hubbleData.success && hubbleData.images) {
                        this.images = hubbleData.images;
                        this.renderImages();
                        this.updateLastUpdateTime(hubbleData.last_update);
                        console.log(`✅ Immagini caricate da API: ${hubbleData.total_images} immagini`);
                        return;
                    }
                }
            } catch (apiError) {
                console.warn('⚠️ API locale non disponibile, uso immagini di fallback');
            }
            
            // Fallback: immagini statiche se l'API non è disponibile
            const hubbleImages = [
                {
                    id: 'ngc6302',
                    title: 'Nebulosa Farfalla (NGC 6302)',
                    description: 'Una delle nebulose planetarie più complesse conosciute, con temperature che raggiungono i 36.000°C.',
                    category: 'nebulae',
                    url: 'https://hubblesite.org/files/live/sites/hubble/files/home/hubble-30th-anniversary/images/hubble_30th_ngc6302_potw2017a.jpg'
                },
                {
                    id: 'carina_pillars',
                    title: 'Nebulosa della Carena - Pilastri Cosmici',
                    description: 'Spettacolari pilastri di gas e polvere nella Nebulosa della Carena, dove nascono nuove stelle.',
                    category: 'nebulae',
                    url: 'https://hubblesite.org/files/live/sites/hubble/files/home/hubble-30th-anniversary/images/hubble_30th_carina_nebula_pillars.jpg'
                },
                {
                    id: 'jupiter',
                    title: 'Giove - Re del Sistema Solare',
                    description: 'Il gigante gassoso Giove con la sua Grande Macchia Rossa e le complesse strutture atmosferiche.',
                    category: 'planets',
                    url: 'https://hubblesite.org/files/live/sites/hubble/files/home/science/solar-system/_images/hubble-captures-crisp-new-portrait-of-jupiter.jpg'
                },
                {
                    id: 'andromeda',
                    title: 'Galassia di Andromeda (M31)',
                    description: 'La galassia spirale più vicina alla Via Lattea, contenente oltre 1 trilione di stelle.',
                    category: 'galaxies',
                    url: 'https://hubblesite.org/files/live/sites/hubble/files/home/science/universe/galaxies/_images/hubble-goes-wide-to-seek-out-far-flung-galaxies.jpg'
                },
                {
                    id: 'saturn',
                    title: 'Saturno - Signore degli Anelli',
                    description: 'Il maestoso Saturno con i suoi anelli di ghiaccio e roccia, catturato in alta risoluzione.',
                    category: 'planets',
                    url: 'https://hubblesite.org/files/live/sites/hubble/files/home/science/solar-system/_images/saturns-aurorae.jpg'
                },
                {
                    id: 'whirlpool',
                    title: 'Galassia Vortice (M51)',
                    description: 'Una perfetta galassia spirale in interazione gravitazionale con una galassia compagna.',
                    category: 'galaxies',
                    url: 'https://hubblesite.org/files/live/sites/hubble/files/home/science/universe/galaxies/_images/hubble-sees-a-perfect-spiral.jpg'
                },
                {
                    id: 'eagle_nebula',
                    title: 'Nebulosa Aquila (M16)',
                    description: 'Famosa per i "Pilastri della Creazione", regioni di formazione stellare attiva.',
                    category: 'nebulae',
                    url: 'https://hubblesite.org/files/live/sites/hubble/files/home/hubble-30th-anniversary/images/hubble_30th_m16_stsci-h-p2016a-f-1340x520.jpg'
                },
                {
                    id: 'm15_cluster',
                    title: 'Ammasso Globulare M15',
                    description: 'Un denso ammasso di stelle antiche nella costellazione di Pegaso, vecchio di oltre 12 miliardi di anni.',
                    category: 'star_clusters',
                    url: 'https://hubblesite.org/files/live/sites/hubble/files/home/science/universe/stars/globular-clusters/_images/hubble-peers-into-the-heart-of-globular-cluster-m15.jpg'
                }
            ];

            this.images = hubbleImages;
            this.renderImages();
            this.updateLastUpdateTime();
            console.log(`📡 Immagini di fallback caricate: ${hubbleImages.length} immagini`);
            
        } catch (error) {
            console.error('❌ Errore nel caricamento delle immagini Hubble:', error);
            this.showError();
        }
    }

    showLoading() {
        this.gallery.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Caricamento immagini da Hubble...</p>
            </div>
        `;
    }

    showError() {
        this.gallery.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
                <p>Errore nel caricamento delle immagini. Riprova tra qualche minuto.</p>
            </div>
        `;
    }

    renderImages() {
        if (this.images.length === 0) {
            this.showError();
            return;
        }

        const filteredImages = this.currentFilter === 'all' 
            ? this.images 
            : this.images.filter(img => img.category === this.currentFilter);

        this.gallery.innerHTML = filteredImages.map(image => `
            <div class="hubble-image" data-category="${image.category}">
                <img src="${image.url}" alt="${image.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMTQiPkltbWFnaW5lIG5vbiBkaXNwb25pYmlsZTwvdGV4dD4KPHN2Zz4K';">
                <div class="image-category">${this.getCategoryLabel(image.category)}</div>
                <div class="image-overlay">
                    <div class="image-title">${image.title}</div>
                    <div class="image-description">${image.description}</div>
                </div>
            </div>
        `).join('');

        // Aggiungi event listener per le immagini cliccate
        this.gallery.querySelectorAll('.hubble-image').forEach(img => {
            img.addEventListener('click', () => this.openImageModal(img));
        });
    }

    getCategoryLabel(category) {
        const labels = {
            'galaxies': 'Galassia',
            'nebulae': 'Nebulosa',
            'planets': 'Pianeta',
            'star_clusters': 'Ammasso Stellare'
        };
        return labels[category] || 'Spazio';
    }

    filterImages() {
        this.renderImages();
    }

    openImageModal(imageElement) {
        // Qui potresti implementare un modal per visualizzare l'immagine a schermo intero
        const img = imageElement.querySelector('img');
        const title = imageElement.querySelector('.image-title').textContent;
        
        // Semplice implementazione: apri l'immagine in una nuova finestra
        window.open(img.src, '_blank');
    }

    updateLastUpdateTime(lastUpdate = null) {
        let timeString;
        
        if (lastUpdate) {
            // Usa il timestamp fornito dall'API
            const updateDate = new Date(lastUpdate);
            timeString = updateDate.toLocaleString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            // Usa il timestamp corrente come fallback
            const now = new Date();
            timeString = now.toLocaleString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        if (this.lastUpdateElement) {
            this.lastUpdateElement.textContent = `Ultimo aggiornamento: ${timeString}`;
        }
    }

    startAutoUpdate() {
        // Aggiorna ogni 30 minuti (1800000 ms)
        this.updateInterval = setInterval(() => {
            this.loadHubbleImages();
        }, 1800000);
    }

    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Inizializza la galleria astronomica quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
    // Inizializza solo se siamo nella sezione astronomia
    if (document.getElementById('hubble-gallery')) {
        new HubbleGallery();
    }
});
