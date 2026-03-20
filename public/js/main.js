// ============================================
// LF Cybersecurity — Client-Side JavaScript
// Particles, Typing Animation, UI Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile Nav Toggle ----------
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  // ---------- Register: Toggle Company Fields ----------
  const accountTypeRadios = document.querySelectorAll('input[name="account_type"]');
  const companyFields = document.getElementById('company-fields');
  if (accountTypeRadios.length > 0 && companyFields) {
    accountTypeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const companyName = document.getElementById('company_name');
        if (radio.value === 'company' && radio.checked) {
          companyFields.classList.remove('hidden');
          if (companyName) companyName.required = true;
        } else if (radio.value === 'user' && radio.checked) {
          companyFields.classList.add('hidden');
          if (companyName) companyName.required = false;
        }
      });
    });
  }

  // ---------- Auto-dismiss Flash Messages ----------
  document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s ease';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });

  // ---------- Hero Typing Animation ----------
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    const text = heroTitle.getAttribute('data-text') || 'Protect Your Digital World';
    heroTitle.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';

    let i = 0;
    function type() {
      if (i < text.length) {
        heroTitle.textContent = text.substring(0, i + 1);
        heroTitle.appendChild(cursor);
        i++;
        setTimeout(type, 60 + Math.random() * 40);
      } else {
        // Remove cursor after a pause
        setTimeout(() => {
          if (cursor.parentNode) cursor.remove();
        }, 2000);
      }
    }

    // Start typing after a small delay
    setTimeout(type, 500);
  }

  // ---------- Particle Animation ----------
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 168, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 168, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update positions
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationId);
      resize();
      createParticles();
      drawParticles();
    });
  }

});
