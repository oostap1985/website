document.addEventListener("DOMContentLoaded", () => {
	// Медиа-запрос
	const mediaQuery = window.matchMedia("(max-width: 769px)");

	// Функция для получения текущего режима
	const isMobile = () => mediaQuery.matches;

	// Находим все изображения
	const images = document.querySelectorAll(".hover-switch-image");

	images.forEach((img) => {
		let imagesList = [];
		try {
			imagesList = JSON.parse(img.dataset.images);
		} catch (e) {}
		if (!imagesList.length) return;

		const originalSrc = imagesList[0];
		let currentIndex = 0;

		// DOM-элементы
		const container = img.closest(".container");
		if (!container) return;

		const indicator = container.querySelector(".image-indicator");
		if (!indicator) return;
		const dots = indicator.querySelectorAll(".indicator-dot");
		const totalImages = imagesList.length;

		const backBtn = container.querySelector(".back");
		const nextBtn = container.querySelector(".next");

		// Функция обновления активной точки
		const setActiveDot = (index) => {
			dots.forEach((dot, i) => {
				if (i === index) dot.classList.add("active");
				else dot.classList.remove("active");
			});
		};

		// Функция обновления видимости кнопок в мобильном режиме
		const updateMobileButtons = () => {
			if (!backBtn || !nextBtn) return;
			if (!isMobile()) return; // на десктопе кнопки скрыты
			if (currentIndex === 0) {
				backBtn.classList.add('D-n');
				nextBtn.classList.remove('D-n');
			} else if (currentIndex === totalImages - 1) {
				backBtn.classList.remove('D-n');
				nextBtn.classList.add('D-n');
			} else {
				backBtn.classList.remove('D-n');
				nextBtn.classList.remove('D-n');
			}
		};

		// Функция смены изображения
		const setImageByIndex = (newIndex) => {
			if (newIndex < 0) newIndex = 0;
			if (newIndex >= totalImages) newIndex = totalImages - 1;
			if (newIndex === currentIndex) return;
			currentIndex = newIndex;
			img.src = imagesList[currentIndex];
			setActiveDot(currentIndex);
			if (isMobile()) {
				updateMobileButtons();
			};
		};

		// Сброс к первому изображению (при уходе мыши или смене режима)
		const resetToFirst = () => {
			setImageByIndex(0);
			setActiveDot(0)
		};

		// --- Обработчики событий, общие для обоих режимов ---

		// Движение мыши – работает только на десктопе
		img.addEventListener("mousemove", (e) => {
			if (isMobile()) return; // игнорируем на мобильных
			const rect = img.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const width = rect.width;
			const ratio = x / width;
			let newIndex = Math.floor(ratio * totalImages);
			if (newIndex >= totalImages) newIndex = totalImages - 1;
			if (newIndex !== currentIndex) {
				setImageByIndex(newIndex);
			}
		});

		// Показ индикатора (только на десктопе)
		img.addEventListener("mouseenter", () => {
			if (isMobile()) return;
			indicator.classList.remove("D-n");
			setActiveDot(0);
			if (img.src !== originalSrc) {
				img.src = originalSrc;
				currentIndex = 0;
			}
		});

		// Скрытие индикатора и сброс (только на десктопе)
		img.addEventListener("mouseleave", () => {
			if (isMobile()) return;
			indicator.classList.add("D-n");
			if (img.src !== originalSrc) {
				img.src = originalSrc;
				currentIndex = 0;
				setActiveDot(0);
			}
		});

		// Клик на кнопку "назад"
		if (backBtn) {
			backBtn.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!isMobile()) return;
				setImageByIndex(currentIndex - 1);
			});
		}

		// Клик на кнопку "вперёд"
		if (nextBtn) {
			nextBtn.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!isMobile()) return;
				setImageByIndex(currentIndex + 1);
			});
		}

		// --- Функция переключения режима при изменении ширины ---
		const switchMode = () => {
			if (isMobile()) {
				// Мобильный режим: показываем индикатор и кнопки
				indicator.classList.remove("D-n");
				if (backBtn) backBtn.classList.remove("D-n");
				if (nextBtn) nextBtn.classList.remove("D-n");
				resetToFirst();
				updateMobileButtons();
			} else {
				// Десктопный режим: скрываем индикатор и кнопки
				indicator.classList.add("D-n");
				if (backBtn) {
					backBtn.classList.add("D-n");
				}
				if (nextBtn) {
					nextBtn.classList.add("D-n");
				}
				resetToFirst();
			}
		};

		// Слушаем изменение ширины
		mediaQuery.addEventListener("change", switchMode);

		// Первоначальная настройка
		switchMode();
	});
});
