import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';


const swiperCss = "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css";
if (!document.querySelector(`link[href*="swiper-bundle.min.css"]`)) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = swiperCss;
  document.head.appendChild(link);
}

class SliderComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.initSwiper();
  }

  initSwiper() {
    if (!this.isConnected) return;
    const swiperContainer = this.querySelector('.swiper');
    if (!swiperContainer) return;

    this.swiper = new Swiper(swiperContainer, {
      pagination: {
        el: this.querySelector('.swiper-pagination'),
        clickable: false,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.next',
        prevEl: '.prev'
      },
      loop: true,
      speed: 300,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      simulateTouch: false,
      allowTouchMove: true,
      autoplay: false,
      grabCursor: false
    });

    const totalSlides = this.querySelectorAll('.swiper-slide').length;
    if (totalSlides <= 1) return;

    swiperContainer.addEventListener('mousemove', (e) => {
      const rect = swiperContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      let slideIndex = Math.floor(percentage * totalSlides);
      if (slideIndex >= totalSlides) slideIndex = totalSlides - 1;
      if (slideIndex < 0) slideIndex = 0;
      this.swiper.slideTo(slideIndex, 300, false);
    });

    swiperContainer.addEventListener('mouseleave', () => {
      this.swiper.slideTo(0, 800, false);
    });
  }
}

customElements.define('slider-component', SliderComponent);