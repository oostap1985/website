const libraryJs = "https://cdn.jsdelivr.net/gh/web-projects-lab/hover-slider@1.0.3/hover-slider.min.js";
const libraryCss = "https://cdn.jsdelivr.net/gh/web-projects-lab/hover-slider@1.0.3/hover-slider-indicator.css";

class SliderElement extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const img = this.querySelector('.hover-switch-image');
      if (!img) {
        return;
      }

      const src = this.getAttribute('src');
      const alt = this.getAttribute('alt');
      const slides = this.getAttribute('data-hover-slides');
      const options = this.getAttribute('data-options');

      if (src) img.src = src;
      if (alt) img.alt = alt;
      if (slides) img.setAttribute('data-hover-slides', slides);
      if (options) img.setAttribute('data-options', options);

      this.ensureStyles();
      this.ensureScript();
      this.switchingByButtons();
    }

    ensureStyles() {
      if (document.querySelector('link[href*="hover-slider-indicator.css"]')) {
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = libraryCss;
      document.head.appendChild(link);
    }

    ensureScript() {
      if (document.querySelector('script[src*="hover-slider"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = libraryJs;

      document.body.appendChild(script);
    }

    switchingByButtons() {
    const backBtn = this.querySelector('#back');
    const nextBtn = this.querySelector('#next');
    const container = this.querySelector('.container')
    if (!backBtn || !nextBtn) return;

    const switchSlide = (num) => {
      const panes = [...container.querySelectorAll('.hover-slider-toggle-pane')];
      if (panes.length < 2) return;

      const activeDot = container.querySelector('.hover-slider-indicator-dot.active');
      let currentIndex = panes.findIndex(pane => 
        pane.dataset.hoverSliderI === activeDot?.dataset.hoverSliderI
      );
      if (currentIndex === -1) currentIndex = 0;

      let newIndex = currentIndex + num;
      if (newIndex < 0) newIndex = panes.length - 1;
      if (newIndex >= panes.length) newIndex = 0;

      panes[newIndex].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    };

      backBtn.addEventListener('click', (e) => { e.preventDefault(); switchSlide(-1); });
      nextBtn.addEventListener('click', (e) => { e.preventDefault(); switchSlide(1); });
    }
}

customElements.define('slider-element', SliderElement);