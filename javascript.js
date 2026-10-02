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

const nameVideo = document.querySelector('.name-video-source');
const nameCanvas = document.querySelector('.name-video');
const nameContext = nameCanvas?.getContext('2d', { willReadFrequently: true });

if (nameVideo && nameCanvas && nameContext) {
	let isRenderingNameVideo = false;

	const renderNameVideo = () => {
		if (nameVideo.videoWidth && nameVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
			if (nameCanvas.width !== nameVideo.videoWidth || nameCanvas.height !== nameVideo.videoHeight) {
				nameCanvas.width = nameVideo.videoWidth;
				nameCanvas.height = nameVideo.videoHeight;
			}

			nameContext.drawImage(nameVideo, 0, 0);
			const frame = nameContext.getImageData(0, 0, nameCanvas.width, nameCanvas.height);
			const pixels = frame.data;

			for (let index = 0; index < pixels.length; index += 4) {
				const red = pixels[index];
				const green = pixels[index + 1];
				const blue = pixels[index + 2];
				const greenDominance = green - Math.max(red, blue);
				const keyStrength = Math.max(0, Math.min(1, (greenDominance - 24) / 28));

				if (keyStrength > 0) {
					pixels[index + 1] = Math.min(green, Math.max(red, blue) + 12);
					pixels[index + 3] = Math.round(pixels[index + 3] * (1 - keyStrength));
				}
			}

			nameContext.putImageData(frame, 0, 0);
		}

		requestAnimationFrame(renderNameVideo);
	};

	const startNameVideoRendering = () => {
		if (!isRenderingNameVideo) {
			isRenderingNameVideo = true;
			renderNameVideo();
		}
	};

	nameVideo.addEventListener('loadeddata', startNameVideoRendering, { once: true });
	nameVideo.addEventListener('playing', startNameVideoRendering);
	if (nameVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
		startNameVideoRendering();
	}
	nameVideo.play().catch(() => {});
}

if (window.lucide) {
	lucide.createIcons();
}
