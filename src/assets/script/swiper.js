const swiperModule = "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs";
const swiperCss = "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css";

class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.images = JSON.parse(this.getAttribute('images') || '[]');
    this.title = this.getAttribute('title') || '';
  }

  connectedCallback() {
    this.render();
    this.ensureStyles();
    this.loadSwiperModule();
  }

  render() {
    const slidesHtml = this.images.length > 0
      ? this.images.map(img => `
          <div class="swiper-slide">
            <div class="W100p H244">
              <img src="${img}" alt="${this.title}" class="H100p W100p Ojf-cv Ojp-c Bdrd8">
            </div>
          </div>
        `)
      : `<div class="swiper-slide">Нет изображений</div>`;

    this.innerHTML = `
    <div class="P2.5u">
      <div class="swiper">
        <div class="swiper-wrapper">${slidesHtml}</div>
        <div class="swiper-pagination"></div>
        <button class="prev D-f P1u Bg-n Bd-n Bdrd8 Ps-a T109 L0 Zi1 md_D-n">
          <svg class="Fi-$gray200 Fi-$brand_a Ts-shortTs Tf -Rt180d Cs" width="26px" height="26px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <polygon points="150.46 478 129.86 456.5 339.11 256 129.86 55.49 150.46 34 382.14 256 150.46 478"/>
          </svg>
        </button>
        <button class="next D-f P1u Bg-n Bd-n Bdrd8 Ps-a T109 R0 Zi1 md_D-n">
          <svg class="Fi-$gray200 Fi-$brand_a Ts-$shortTs Cs" width="26px" height="26px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <polygon points="150.46 478 129.86 456.5 339.11 256 129.86 55.49 150.46 34 382.14 256 150.46 478"/>
          </svg>
        </button>
      </div>
    </div>
    `;
  }

  ensureStyles() {
    if (document.querySelector(`link[href*="swiper-bundle.min.css"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = swiperCss;
    document.head.appendChild(link);
  }

  async loadSwiperModule() {
    try {
      const { default: Swiper } = await import(swiperModule);

      if (!SliderComponent.Swiper) {
        SliderComponent.Swiper = Swiper;
      }

      if (document.querySelector(`link[href*="swiper-bundle.min.css"]`)) {
        this.initSwiper(Swiper);
      } else {
        this.waitForStylesAndInit(Swiper);
      }
    } catch (error) {
      console.error(error);
    }
  }

  waitForStylesAndInit(Swiper) {
    const checkStyles = () => {
      if (document.querySelector(`link[href*="swiper-bundle.min.css"]`)) {
        this.initSwiper(Swiper);
      } else {
        setTimeout(checkStyles, 50);
      }
    };
    checkStyles();
  }

  initSwiper(Swiper) {
    if (!this.isConnected) return;

    const swiperContainer = this.querySelector('.swiper');
    if (!swiperContainer) {
      return;
    }

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