/**
 * <warning-badge>
 * Atributos: pulsing (booleano reactivo), message
 * Parts: badge, icon, text
 * 
 * El atributo `pulsing` es totalmente reactivo:
 *   - Presencia del atributo  → activa la animación
 *   - Ausencia del atributo   → detiene la animación
 */
export class WarningBadge extends HTMLElement {
  static get observedAttributes() {
    return ['pulsing', 'message'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;

    if (name === 'pulsing') {
      // Reactividad granular: solo toggleamos la clase, no re-renderizamos
      this._updatePulse();
    } else if (name === 'message') {
      const textEl = this.shadowRoot.querySelector('.text');
      if (textEl) textEl.textContent = newVal || '';
    }
  }

  get pulsing() {
    return this.hasAttribute('pulsing');
  }

  set pulsing(val) {
    if (val) {
      this.setAttribute('pulsing', '');
    } else {
      this.removeAttribute('pulsing');
    }
  }

  get message() {
    return this.getAttribute('message') || this.textContent.trim() || 'Advertencia';
  }

  _updatePulse() {
    const badge = this.shadowRoot.querySelector('.badge');
    if (!badge) return;
    if (this.pulsing) {
      badge.classList.add('is-pulsing');
    } else {
      badge.classList.remove('is-pulsing');
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: var(--font-main, 'DM Sans', sans-serif);
        }

        :host(:not([pulsing])) .badge {
          opacity: 0.55;
          filter: grayscale(0.3);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.35);
          border-radius: 999px;
          padding: 0.45rem 1rem;
          color: #fca5a5;
          font-size: 0.82rem;
          font-weight: 600;
          position: relative;
          transition: opacity 0.3s ease, filter 0.3s ease;
          cursor: default;
          user-select: none;
        }

        /* Halo de pulso — CSS puro */
        .badge.is-pulsing::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 999px;
          border: 2px solid rgba(239,68,68,0.5);
          animation: pulse-ring 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-ring {
          0%   { opacity: 1;   transform: scale(1); }
          100% { opacity: 0;   transform: scale(1.35); }
        }

        /* Icono parpadeante */
        .badge.is-pulsing .icon {
          animation: blink 1.4s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        .icon {
          font-size: 1rem;
          line-height: 1;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
          flex-shrink: 0;
        }

        .badge.is-pulsing .dot {
          animation: dot-pulse 1.4s ease-in-out infinite;
        }

        @keyframes dot-pulse {
          0%, 100% { background: #ef4444; box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
          50%       { background: #fca5a5; box-shadow: 0 0 0 5px rgba(239,68,68,0); }
        }
      </style>

      <div class="badge ${this.pulsing ? 'is-pulsing' : ''}" part="badge">
        <span class="dot" part="dot"></span>
        <span class="icon" part="icon">⚠️</span>
        <span class="text" part="text">${this.message}</span>
      </div>
    `;
  }
}

customElements.define('warning-badge', WarningBadge);