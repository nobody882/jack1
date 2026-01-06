(function() {
	'use strict';

	const root = document.documentElement;
	const nav = document.getElementById('siteNav');
	const menuToggle = document.getElementById('menuToggle');
	const yearSpan = document.getElementById('year');

	// Année footer
	if (yearSpan) {
		yearSpan.textContent = String(new Date().getFullYear());
	}

	// Menu mobile
	if (menuToggle && nav) {
		menuToggle.addEventListener('click', () => {
			nav.classList.toggle('open');
		});
		// Fermer après clic lien
		nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
	}

	// Slider simple
	document.querySelectorAll('[data-slider]').forEach((slider) => {
		const prev = slider.querySelector('.prev');
		const next = slider.querySelector('.next');
		const track = slider.querySelector('.slides');
		if (!prev || !next || !track) return;
		const scrollBy = () => track.clientWidth * 0.8;
		prev.addEventListener('click', () => track.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
		next.addEventListener('click', () => track.scrollBy({ left: scrollBy(), behavior: 'smooth' }));
	});

	// Formulaire -> mailto + validation simple
	const form = document.getElementById('contactForm');
	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const formData = new FormData(form);
			const name = (formData.get('name') || '').toString().trim();
			const email = (formData.get('email') || '').toString().trim();
			const message = (formData.get('message') || '').toString().trim();

			if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
				alert('Merci de remplir correctement tous les champs.');
				return;
			}

			const subject = encodeURIComponent('Demande de booking – ' + name);
			const body = encodeURIComponent('Nom: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
			window.location.href = 'mailto:booking@example.com?subject=' + subject + '&body=' + body;
		});
	}

	// Scroll reveal
	const revealEls = document.querySelectorAll('[data-reveal]');
	if (revealEls.length) {
		const io = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					// Charger lazy les vidéos locales
					entry.target.querySelectorAll('video[data-src]').forEach((v) => {
						if (!v.src) { v.src = v.getAttribute('data-src') || ''; }
					});
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15 });
		revealEls.forEach((el) => io.observe(el));
	}

	// Equalizer random tempo
	const eq = document.querySelector('.equalizer');
	if (eq) {
		const bars = Array.from(eq.querySelectorAll('.bar'));
		function animateEq() {
			bars.forEach((bar, i) => {
				const t = Date.now() / (450 + i * 23);
				const h = 10 + Math.abs(Math.sin(t) * 26) + Math.random() * 4;
				bar.style.height = h.toFixed(0) + 'px';
			});
			requestAnimationFrame(animateEq);
		}
		animateEq();
	}

	// Parallax léger du fond
	const heroMedia = document.querySelector('.hero-media');
	if (heroMedia) {
		window.addEventListener('scroll', () => {
			const y = window.scrollY * 0.08;
			heroMedia.style.transform = 'translateY(' + y.toFixed(1) + 'px)';
		});
	}

	// Particules musicales (canvas)
	const canvas = document.getElementById('heroParticles');
	if (canvas) {
		const ctx = canvas.getContext('2d');
		function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
		window.addEventListener('resize', resize); resize();
		const symbols = ['♪','♫','♬','♩'];
		const particles = Array.from({ length: 24 }).map(() => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			s: 0.6 + Math.random() * 1.2,
			vy: 0.2 + Math.random() * 0.6,
			sym: symbols[Math.floor(Math.random()*symbols.length)],
			phase: Math.random() * Math.PI * 2
		}));
		function step() {
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.font = '16px Germania One, cursive';
			particles.forEach(p => {
				p.y -= p.vy;
				p.x += Math.sin(p.phase) * 0.3;
				p.phase += 0.03;
				if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random()*canvas.width; }
				ctx.globalAlpha = 0.6;
				ctx.fillStyle = '#ffb703';
				ctx.fillText(p.sym, p.x, p.y);
			});
			requestAnimationFrame(step);
		}
		step();
	}
})();
