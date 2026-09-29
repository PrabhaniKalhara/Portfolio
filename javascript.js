const navLinks = document.querySelectorAll('.nav-link');
const panels = document.querySelectorAll('.panel');

const sectionObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) {
			return;
		}

		entry.target.classList.add('visible');
		navLinks.forEach((link) => {
			link.classList.toggle('active', link.dataset.section === entry.target.dataset.panel);
		});
	});
}, { threshold: 0.45 });

panels.forEach((panel) => sectionObserver.observe(panel));

if (window.lucide) {
	lucide.createIcons();
}
