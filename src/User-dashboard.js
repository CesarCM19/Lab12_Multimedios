/**
 * <user-dashboard>
 * Componente orquestador.
 * 
 * Responsabilidades:
 *  1. Escucha el evento `greet` que sube desde <user-card> (bubbles + composed)
 *  2. Al recibirlo, activa el atributo `pulsing` en <warning-badge>
 *  3. Después de N segundos, desactiva `pulsing` (reset visual)
 * 
 * Parts: container, slot-card, slot-weather, slot-badge
 */
export class UserDashboard extends HTMLElement {
  #greetHandler = null;
  #resetTimer   = null;
  static PULSE_DURATION = 4000; // ms que dura el pulso

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  disconnectedCallback() {
    this.removeEventListener('greet', this.#greetHandler);
    clearTimeout(this.#resetTimer);
  }

  _bindEvents() {
    // Captura el evento `greet` que sube desde user-card (composed: true)
    this.#greetHandler = (e) => {
      const badge = this.querySelector('warning-badge');
      if (!badge) return;

      const { name } = e.detail ?? {};
      // Actualiza el mensaje del badge
      badge.setAttribute('message', `¡Hola, ${name}! — Sesión por expirar`);
      // Activa el pulso (atributo booleano reactivo)
      badge.setAttribute('pulsing', '');

      // Limpia el timer anterior si existe
      clearTimeout(this.#resetTimer);
      // Después de PULSE_DURATION vuelve al estado normal
      this.#resetTimer = setTimeout(() => {
        badge.removeAttribute('pulsing');
        badge.setAttribute('message', 'Sesión por expirar');
      }, UserDashboard.PULSE_DURATION);
    };

    this.addEventListener('greet', this.#greetHandler);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-main, 'DM Sans', sans-serif);
        }

        .dashboard {
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          gap: 1rem;
          align-items: start;
        }

        /* user-card ocupa la columna izquierda, ambas filas */
        ::slotted(user-card) {
          grid-row: 1 / 3;
        }

        .top-right {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Slots nombrados */
        slot[name="card"]    { display: contents; }
        slot[name="weather"] { display: contents; }
        slot[name="badge"]   { display: contents; }
      </style>

      <div class="dashboard" part="container">
        <slot name="card" part="slot-card"></slot>
        <div class="top-right">
          <slot name="weather" part="slot-weather"></slot>
          <slot name="badge"   part="slot-badge"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('user-dashboard', UserDashboard);