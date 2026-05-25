/**
 * <weather-time>
 * Atributos: city, temp, condition
 * Parts: city, temp, condition, icon
 */
export class WeatherTime extends HTMLElement {
  static get observedAttributes() {
    return ['city', 'temp', 'condition'];
  }

  #tickInterval = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._startClock();
  }

  disconnectedCallback() {
    clearInterval(this.#tickInterval);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal && this.shadowRoot.innerHTML) {
      this._updateDisplay();
    }
  }

  get city()      { return this.getAttribute('city') || 'Ciudad'; }
  get temp()      { return this.getAttribute('temp') || '--'; }
  get condition() { return this.getAttribute('condition') || 'Clear'; }

  _icon(condition) {
    const map = {
      sunny: '☀️', clear: '☀️',
      cloudy: '☁️', overcast: '☁️',
      rainy: '🌧️', rain: '🌧️',
      stormy: '⛈️', storm: '⛈️',
      windy: '💨',
      snowy: '❄️', snow: '❄️',
      foggy: '🌫️', fog: '🌫️',
      partlycloudy: '⛅',
    };
    return map[condition.toLowerCase().replace(/\s/g, '')] || '🌡️';
  }

  _formatTime() {
    return new Date().toLocaleTimeString('es-CR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }

  _startClock() {
    const el = this.shadowRoot.querySelector('.time');
    if (!el) return;
    this.#tickInterval = setInterval(() => {
      el.textContent = this._formatTime();
    }, 1000);
  }

  _updateDisplay() {
    const nameEl = this.shadowRoot.querySelector('.city');
    const tempEl = this.shadowRoot.querySelector('.temp');
    const condEl = this.shadowRoot.querySelector('.condition');
    const iconEl = this.shadowRoot.querySelector('.icon');
    if (nameEl) nameEl.textContent = this.city;
    if (tempEl) tempEl.textContent = `${this.temp} °C`;
    if (condEl) condEl.textContent = this.condition;
    if (iconEl) iconEl.textContent = this._icon(this.condition);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-main, 'DM Sans', sans-serif);
        }

        .widget {
          background: linear-gradient(135deg, #0c1a3a 0%, #0f2851 60%, #1a1040 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          color: white;
        }

        .widget::after {
          content: '';
          position: absolute;
          bottom: -30px; right: -30px;
          width: 130px; height: 130px;
          background: radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .city {
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 0.3rem;
        }

        .time {
          font-size: 1rem;
          font-weight: 700;
          color: #e2e8f0;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
        }

        .icon {
          font-size: 2.5rem;
          line-height: 1;
          filter: drop-shadow(0 0 10px rgba(251,191,36,0.5));
        }

        .bottom {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .temp {
          font-size: 2.2rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .condition {
          font-size: 0.9rem;
          font-weight: 500;
          color: #7dd3fc;
          align-self: center;
        }
      </style>

      <div class="widget">
        <div class="top">
          <div>
            <p class="city" part="city">${this.city}</p>
            <span class="time">${this._formatTime()}</span>
          </div>
          <span class="icon" part="icon">${this._icon(this.condition)}</span>
        </div>
        <div class="bottom">
          <span class="temp" part="temp">${this.temp} °C</span>
          <span class="condition" part="condition">${this.condition}</span>
        </div>
      </div>
    `;
  }
}

customElements.define('weather-time', WeatherTime);