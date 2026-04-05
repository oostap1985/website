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

      this.ensureScript();
    }

    ensureScript() {
      if (document.querySelector('script[src*="hover-slider"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/web-projects-lab/hover-slider@1.0.3/hover-slider.min.js';

      document.body.appendChild(script);
    }
}

customElements.define('slider-element', SliderElement);