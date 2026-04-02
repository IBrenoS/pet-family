(function initTheme() {
  const btn = document.getElementById('btn-theme');
  const html = document.documentElement;
  const saved = localStorage.getItem('pf-theme') || 'light';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const current = html.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('pf-theme', next);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
      btn.setAttribute('aria-label', 'Ativar modo claro');
      btn.textContent = '☀️';
    } else {
      html.classList.remove('dark');
      btn.setAttribute('aria-label', 'Ativar modo escuro');
      btn.textContent = '🌙';
    }
  }
})();

(function initMobileNav() {
  const btnOpen     = document.getElementById('btn-menu');
  const mobileNav   = document.getElementById('mobile-nav');
  const btnClose    = document.getElementById('mobile-nav-close');
  const backdrop    = document.getElementById('mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    btnOpen.focus();
  }

  btnOpen.addEventListener('click', openMenu);
  btnClose.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
})();

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

(function initFormValidation() {
  const form        = document.getElementById('contact-form');
  const successMsg  = document.getElementById('form-success');

  if (!form) return;
  const rules = {
    tutor_name: {
      validate: (v) => v.trim().length >= 3,
      message: 'Informe seu nome completo (mínimo 3 caracteres).'
    },
    email: {
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Informe um e-mail válido.'
    },
    phone: {
      validate: (v) => v.replace(/\D/g, '').length >= 10,
      message: 'Informe um telefone válido com DDD (mínimo 10 dígitos).'
    },
    pet_name: {
      validate: (v) => v.trim().length >= 2,
      message: 'Informe o nome do seu pet.'
    },
    service: {
      validate: (v) => v !== '',
      message: 'Selecione o serviço desejado.'
    },
    message: {
      validate: (v) => v.trim().length >= 20,
      message: 'Sua mensagem deve ter pelo menos 20 caracteres.'
    }
  };
  function setError(fieldName, errorText) {
    const group = form.querySelector(`[data-field="${fieldName}"]`);
    const errEl = group.querySelector('.field-error');
    if (errorText) {
      group.classList.add('has-error');
      group.classList.remove('is-valid');
      errEl.textContent = errorText;
    } else {
      group.classList.remove('has-error');
      group.classList.add('is-valid');
      errEl.textContent = '';
    }
  }
  Object.keys(rules).forEach(name => {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return;

    input.addEventListener('blur', () => {
      const rule = rules[name];
      if (!rule.validate(input.value)) {
        setError(name, rule.message);
      } else {
        setError(name, null);
      }
    });
    input.addEventListener('input', () => {
      const group = form.querySelector(`[data-field="${name}"]`);
      if (group.classList.contains('has-error')) {
        const rule = rules[name];
        if (rule.validate(input.value)) {
          setError(name, null);
        }
      }
    });
  });
  const phoneInput = form.querySelector('[name="phone"]');
  phoneInput.addEventListener('input', () => {
    let v = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    phoneInput.value = v;
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let hasErrors = false;

    Object.keys(rules).forEach(name => {
      const input = form.querySelector(`[name="${name}"]`);
      const rule = rules[name];
      if (!rule.validate(input.value)) {
        setError(name, rule.message);
        hasErrors = true;
      } else {
        setError(name, null);
      }
    });

    if (hasErrors) {
      const firstError = form.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.querySelector('input, select, textarea')?.focus();
      }
      return;
    }
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    setTimeout(() => {
      form.reset();
      form.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('is-valid', 'has-error');
      });
      successMsg.classList.add('visible');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensagem';
      setTimeout(() => successMsg.classList.remove('visible'), 6000);
    }, 1200);
  });
})();

(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.10)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });
})();

