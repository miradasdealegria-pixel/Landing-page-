/**
 * ==========================================================================
 * js/script.js
 * JavaScript principal para la Fundación ONG
 * - Menú hamburguesa móvil
 * - Navbar con efecto scroll
 * - Botón "Volver arriba"
 * - Inicialización de AOS
 * - Welcome Popup
 * - Active link highlighting
 * - Donation & Contact Modals
 * - Impact Calculator
 * - Firebase subscription
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========== DOM Elements ==========
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav-link');

  // ========== Welcome Popup ==========
  const welcomePopup = document.getElementById('welcome-popup');
  const welcomePopupContent = document.getElementById('welcome-popup-content');
  const closePopupBtn = document.getElementById('close-popup');
  const skipPopupBtn = document.getElementById('skip-popup');

  // Hide popup function (declared once, reusable)
  const hidePopup = () => {
    if (!welcomePopup) return;
    // Restore background scrolling
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    welcomePopup.classList.add('opacity-0', 'invisible');
    if (welcomePopupContent) {
      welcomePopupContent.classList.remove('scale-100');
      welcomePopupContent.classList.add('scale-95');
    }
    // Destroy from DOM after transition to avoid blocking clicks
    setTimeout(() => {
      welcomePopup.style.display = 'none';
    }, 500);
  };

  window.addEventListener('load', () => {
    // Show popup shortly after load
    if (welcomePopup) {
      setTimeout(() => {
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        welcomePopup.classList.remove('opacity-0', 'invisible');
        if (welcomePopupContent) {
          welcomePopupContent.classList.remove('scale-95');
          welcomePopupContent.classList.add('scale-100');
        }
      }, 500);
    }

    // Inicializar AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        delay: 50,
        anchorPlacement: 'top-bottom',
      });

      // Recalculate section positions after AOS finishes animating
      setTimeout(calculateSectionPositions, 1200);
    }
  });

  if (closePopupBtn) closePopupBtn.addEventListener('click', hidePopup);
  if (skipPopupBtn) skipPopupBtn.addEventListener('click', hidePopup);
  if (welcomePopup) {
    welcomePopup.addEventListener('click', (e) => {
      if (e.target === welcomePopup) hidePopup();
    });
  }

  // ========== Mobile Menu Toggle ==========
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('active');
    hamburgerBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners del menú móvil
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Cerrar menú al hacer clic en un enlace
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Cerrar menú y modales con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
      // Also close modals with Escape
      const donationModal = document.getElementById('donation-modal');
      const contactModal = document.getElementById('contact-modal');
      if (donationModal && !donationModal.classList.contains('invisible')) {
        closeDonationModal();
      }
      if (contactModal && !contactModal.classList.contains('invisible')) {
        closeContactModal();
      }
    }
  });

  // ========== Navbar Scroll Effect ==========
  const scrollThreshold = 60;

  function handleScroll() {
    const currentScrollY = window.scrollY;

    // Navbar scroll effect
    if (navbar) {
      if (currentScrollY > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (currentScrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Highlight active nav link based on current section
    highlightActiveSection();
  }

  // Throttle scroll events with passive listener for better performance
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ========== Active Section Highlighting ==========
  let sectionPositions = [];

  function calculateSectionPositions() {
    const sections = document.querySelectorAll('section[id]');
    sectionPositions = Array.from(sections).map(section => ({
      id: section.getAttribute('id'),
      top: section.offsetTop,
      bottom: section.offsetTop + section.offsetHeight
    }));
  }

  // Calculate initially and debounce on resize (avoid running on every pixel)
  calculateSectionPositions();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(calculateSectionPositions, 250);
  });

  function highlightActiveSection() {
    const scrollPosition = window.scrollY + 120;

    // Iterate reverse for better bottom-section detection
    let activeSection = null;
    for (let i = sectionPositions.length - 1; i >= 0; i--) {
      if (scrollPosition >= sectionPositions[i].top) {
        activeSection = sectionPositions[i];
        break;
      }
    }

    if (activeSection) {
      const sectionId = activeSection.id;

      // Desktop nav links — use classList.toggle for cleaner code
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
      });

      // Mobile nav links
      mobileLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
      });
    }
  }

  // ========== Back to Top ==========
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ========== Smooth Scroll for Anchor Links ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // ========== Counter Animation (Intersection Observer) ==========
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'));
          const suffix = entry.target.getAttribute('data-suffix') || '';
          animateCounter(entry.target, target, suffix);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
  }

  function animateCounter(element, target, suffix) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(target * eased);

      element.textContent = currentValue.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ========== Calculator Logic ==========
  const impactSlider = document.getElementById('impact-slider');
  const calcAmountDisplay = document.getElementById('calc-amount-display');
  const calcKits = document.getElementById('calc-kits');
  const calcMeals = document.getElementById('calc-meals');

  if (impactSlider && calcAmountDisplay && calcKits && calcMeals) {
    const calcCurrencySelector = document.getElementById('calc-currency-selector');

    const updateCalculatorUI = () => {
      const val = parseInt(impactSlider.value);
      const isUSD = calcCurrencySelector && calcCurrencySelector.value === 'USD';

      const symbol = isUSD ? '$' : '₡';
      calcAmountDisplay.textContent = symbol + val.toLocaleString('es-CR');

      // Calculate impact
      // 1 Kit = 5000 CRC or 10 USD
      // 1 Meal = 666 CRC or 1.33 USD
      const kitCost = isUSD ? 10 : 5000;
      const mealCost = isUSD ? 1.33 : 666;

      calcKits.textContent = Math.floor(val / kitCost);
      calcMeals.textContent = Math.floor(val / mealCost);
    };

    impactSlider.addEventListener('input', updateCalculatorUI);

    if (calcCurrencySelector) {
      calcCurrencySelector.addEventListener('change', () => {
        if (calcCurrencySelector.value === 'USD') {
          impactSlider.min = 5;
          impactSlider.max = 500;
          impactSlider.step = 5;
          impactSlider.value = 20;
        } else {
          impactSlider.min = 1000;
          impactSlider.max = 100000;
          impactSlider.step = 1000;
          impactSlider.value = 10000;
        }
        updateCalculatorUI();
      });
    }
  }

  // ========== Modal Close on Background Click ==========
  document.addEventListener('click', (e) => {
    const donationModal = document.getElementById('donation-modal');
    const contactModal = document.getElementById('contact-modal');

    if (e.target === donationModal) closeDonationModal();
    if (e.target === contactModal) closeContactModal();
  });

  // Close buttons setup
  const closeDonBtn = document.getElementById('close-donation-modal');
  const closeConBtn = document.getElementById('close-contact-modal');
  if (closeDonBtn) closeDonBtn.addEventListener('click', closeDonationModal);
  if (closeConBtn) closeConBtn.addEventListener('click', closeContactModal);

  // ========== Initialize ==========
  handleScroll(); // Set initial scroll state
});

// ==================== DONATION & CONTACT MODALS LOGIC ====================

function openDonationModal() {
  const modal = document.getElementById('donation-modal');
  const content = document.getElementById('donation-modal-content');
  if (!modal || !content) return;

  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  // Reset view
  const mainView = document.getElementById('donation-main-view');
  const successView = document.getElementById('donation-success');
  if (mainView) mainView.classList.remove('hidden');
  if (successView) successView.classList.add('hidden');

  modal.classList.remove('opacity-0', 'invisible');
  content.classList.remove('scale-95');
  content.classList.add('scale-100');

  // Hide welcome popup if open
  const welcome = document.getElementById('welcome-popup');
  if (welcome) welcome.style.display = 'none';
}

function closeDonationModal() {
  const modal = document.getElementById('donation-modal');
  const content = document.getElementById('donation-modal-content');
  if (!modal || !content) return;

  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';

  modal.classList.add('opacity-0', 'invisible');
  content.classList.remove('scale-100');
  content.classList.add('scale-95');
}

function selectDonationType(type) {
  const btnUnica = document.getElementById('btn-donacion-unica');
  const btnMensual = document.getElementById('btn-donacion-mensual');
  if (!btnUnica || !btnMensual) return;

  const activeClasses = 'w-1/2 py-2 text-sm font-bold rounded-lg text-white bg-verde-bosque shadow';
  const inactiveClasses = 'w-1/2 py-2 text-sm font-bold rounded-lg text-gray-600 hover:text-verde-bosque';

  if (type === 'unica') {
    btnUnica.className = activeClasses;
    btnMensual.className = inactiveClasses;
  } else {
    btnMensual.className = activeClasses;
    btnUnica.className = inactiveClasses;
  }
}

function selectAmount(amount) {
  const buttons = document.querySelectorAll('.monto-btn');
  buttons.forEach(btn => {
    const btnAmount = parseInt(btn.getAttribute('data-amount'));
    if (btnAmount === amount) {
      btn.classList.add('bg-verde-bosque', '!text-white', '!border-verde-bosque');
      btn.classList.remove('border-gray-200', 'text-gray-600');
    } else {
      btn.classList.remove('bg-verde-bosque', '!text-white', '!border-verde-bosque');
      btn.classList.add('border-gray-200', 'text-gray-600');
    }
  });
  const customInput = document.getElementById('custom-amount');
  if (customInput) customInput.value = '';
}

function clearAmountButtons() {
  const buttons = document.querySelectorAll('.monto-btn');
  buttons.forEach(btn => {
    btn.classList.remove('bg-verde-bosque', '!text-white', '!border-verde-bosque');
    btn.classList.add('border-gray-200', 'text-gray-600');
  });
}

function selectPaymentMethod(method) {
  const labels = document.querySelectorAll('.payment-method-lbl');
  labels.forEach(lbl => {
    lbl.classList.remove('border-verde-bosque', 'bg-green-50');
    lbl.classList.add('border-gray-200');

    const icon = lbl.querySelector('i');
    const text = lbl.querySelector('span');
    if (icon) {
      icon.classList.remove('text-verde-bosque');
      icon.classList.add('text-gray-500');
    }
    if (text) {
      text.classList.remove('text-verde-bosque');
      text.classList.add('text-gray-600');
    }
  });

  const selectedLbl = document.getElementById('lbl-' + method);
  if (selectedLbl) {
    selectedLbl.classList.remove('border-gray-200');
    selectedLbl.classList.add('border-verde-bosque', 'bg-green-50');

    const icon = selectedLbl.querySelector('i');
    const text = selectedLbl.querySelector('span');
    if (icon) {
      icon.classList.remove('text-gray-500');
      icon.classList.add('text-verde-bosque');
    }
    if (text) {
      text.classList.remove('text-gray-600');
      text.classList.add('text-verde-bosque');
    }
  }

  // Toggle detail fields
  const details = ['tarjeta', 'sinpe', 'paypal', 'stripe'];
  details.forEach(det => {
    const el = document.getElementById('details-' + det);
    if (el) {
      el.classList.toggle('hidden', det !== method);
      el.classList.toggle('block', det === method);
    }
  });
}

function updateCurrencySymbols() {
  const selector = document.getElementById('currency-selector');
  if (!selector) return;

  const currency = selector.value;
  const symbolEls = document.querySelectorAll('.currency-symbol');
  const valEls = document.querySelectorAll('.monto-val');

  if (valEls.length < 3) return; // Guard: avoid index errors

  if (currency === 'CRC') {
    symbolEls.forEach(el => el.textContent = '₡');
    valEls[0].textContent = '5000';
    valEls[1].textContent = '10000';
    valEls[2].textContent = '25000';
  } else {
    symbolEls.forEach(el => el.textContent = '$');
    valEls[0].textContent = '10';
    valEls[1].textContent = '25';
    valEls[2].textContent = '50';
  }
}

function showDonationSuccess() {
  // Validate reCAPTCHA
  if (typeof grecaptcha === 'undefined' || typeof recaptchaDonationId === 'undefined') {
    alert('El sistema de seguridad reCAPTCHA no pudo cargar. Por favor, deshabilita tu AdBlock temporalmente e intenta de nuevo.');
    return;
  }

  if (!grecaptcha.getResponse(recaptchaDonationId)) {
    alert('Por favor, completa el reCAPTCHA para continuar.');
    return;
  }

  const mainView = document.getElementById('donation-main-view');
  const successView = document.getElementById('donation-success');
  const form = document.getElementById('donation-form');

  if (mainView) mainView.classList.add('hidden');
  if (successView) successView.classList.remove('hidden');
  if (form) form.reset();

  // Reset reCAPTCHA for next time
  grecaptcha.reset(recaptchaDonationId);
}

// --- Contact Modal Actions ---
function openContactModal() {
  const modal = document.getElementById('contact-modal');
  const content = document.getElementById('contact-modal-content');
  if (!modal || !content) return;

  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  modal.classList.remove('opacity-0', 'invisible');
  content.classList.remove('scale-95');
  content.classList.add('scale-100');

  // Hide welcome popup if open
  const welcome = document.getElementById('welcome-popup');
  if (welcome) welcome.style.display = 'none';
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  const content = document.getElementById('contact-modal-content');
  if (!modal || !content) return;

  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';

  modal.classList.add('opacity-0', 'invisible');
  content.classList.remove('scale-100');
  content.classList.add('scale-95');
}

/**
 * Sanitizes user input and sends message via WhatsApp.
 * Uses encodeURIComponent to prevent XSS injection.
 */
function sendToWhatsApp() {
  // Validate reCAPTCHA
  if (typeof grecaptcha === 'undefined' || typeof recaptchaContactId === 'undefined') {
    alert('El sistema de seguridad reCAPTCHA no pudo cargar. Por favor, deshabilita tu AdBlock temporalmente e intenta de nuevo.');
    return;
  }

  if (!grecaptcha.getResponse(recaptchaContactId)) {
    alert('Por favor, completa el reCAPTCHA para continuar.');
    return;
  }

  const nameEl = document.getElementById('contact-name');
  const reasonEl = document.getElementById('contact-reason');
  const messageEl = document.getElementById('contact-message');

  if (!nameEl || !reasonEl || !messageEl) return;

  const name = nameEl.value.trim();
  const reason = reasonEl.value.trim();
  const message = messageEl.value.trim();

  if (!name || !reason || !message) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  const phone = "50612345678"; // TODO: Reemplazar por el número de WhatsApp de la ONG real
  // FIX: Use encodeURIComponent to prevent XSS and double-encoding issues
  const text = encodeURIComponent(
    `Hola Miradas de Alegría, mi nombre es ${name}.\n\n*Motivo:* ${reason}\n*Mensaje:* ${message}`
  );

  const url = `https://wa.me/${phone}?text=${text}`;
  window.open(url, '_blank', 'noopener,noreferrer');

  closeContactModal();

  const form = document.getElementById('contact-form');
  if (form) form.reset();

  // Reset reCAPTCHA for next time
  grecaptcha.reset(recaptchaContactId);
}

// ==================== FUNCIÓN PARA GUARDAR SUSCRIPCIÓN (Firebase) ====================
async function guardarEmail(inputId) {
  const inputElement = document.getElementById(inputId);
  if (!inputElement) return;

  const emailInput = inputElement.value.trim();

  if (!emailInput) {
    alert("Por favor, ingresa tu correo electrónico.");
    return;
  }

  // Validación de formato de correo electrónico
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
  if (!emailRegex.test(emailInput)) {
    alert("Por favor, ingresa un correo electrónico válido.");
    return;
  }

  // Validate reCAPTCHA based on which form is submitting
  if (typeof grecaptcha !== 'undefined') {
    // Map inputId to corresponding reCAPTCHA widget ID
    const recaptchaMap = {
      'email-popup': typeof recaptchaPopupId !== 'undefined' ? recaptchaPopupId : null,
      'email-news': typeof recaptchaNewsId !== 'undefined' ? recaptchaNewsId : null
    };

    const widgetId = recaptchaMap[inputId];

    if (widgetId === null || widgetId === undefined) {
      alert('El sistema de seguridad reCAPTCHA no pudo cargar. Por favor, deshabilita tu AdBlock temporalmente e intenta de nuevo.');
      return;
    }

    if (!grecaptcha.getResponse(widgetId)) {
      alert('Por favor, completa el reCAPTCHA para continuar.');
      return;
    }
  } else {
    alert('El sistema de seguridad reCAPTCHA no pudo cargar. Por favor, deshabilita tu AdBlock temporalmente e intenta de nuevo.');
    return;
  }

  try {
    // Asegurarse de que Firebase esté inicializado y db exista
    if (typeof firebase === "undefined" || typeof db === "undefined") {
      alert("❌ Firebase no está configurado. Por favor, revisa tu index.html y añade las credenciales.");
      return;
    }

    // Include timestamp and tipo to match Firestore security rules
    await db.collection("suscriptores").add({
      email: emailInput,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      tipo: "suscripcion-web"
    });

    alert("✅ ¡Gracias por suscribirte! Tu correo ha sido guardado correctamente.");
    inputElement.value = "";

    // Reset the reCAPTCHA for next use
    const recaptchaMap = {
      'email-popup': typeof recaptchaPopupId !== 'undefined' ? recaptchaPopupId : null,
      'email-news': typeof recaptchaNewsId !== 'undefined' ? recaptchaNewsId : null
    };
    const widgetId = recaptchaMap[inputId];
    if (widgetId !== null && widgetId !== undefined) {
      grecaptcha.reset(widgetId);
    }

    // Si es el popup, cerrarlo
    if (inputId === 'email-popup') {
      const closeBtn = document.getElementById('close-popup');
      if (closeBtn) closeBtn.click();
    }
  } catch (error) {
    console.error("Error al guardar el correo:", error);

    if (error.code === "permission-denied") {
      alert("❌ No se pudo guardar. Verifica los permisos de Firebase (Rules).");
    } else {
      alert("❌ Hubo un error al conectar con Firebase. Revisa tu configuración inicial.");
    }
  }
}
