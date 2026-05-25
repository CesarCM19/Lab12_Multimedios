/**
 * <user-card>
 * Atributos: name, role, avatar
 * Parts: avatar, name, role, button
 * Eventos: greet (custom event, bubbles hacia el dashboard)
 */
export class UserCard extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'role', 'avatar'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal && this.shadowRoot.innerHTML) {
      this.render();
      this._bindEvents();
    }
  }

  _bindEvents() {
    const btn = this.shadowRoot.querySelector('button');
    btn?.addEventListener('click', () => {
      const name = this.getAttribute('name') || 'Estudiante';
      // Dispara evento personalizado que sube (bubbles: true, composed: true para cruzar Shadow DOM)
      this.dispatchEvent(new CustomEvent('greet', {
        detail: { name },
        bubbles: true,
        composed: true,
      }));
    });
  }

  get name() { return this.getAttribute('name') || ''; }
  get role() { return this.getAttribute('role') || ''; }
  get avatar() { return this.getAttribute('avatar') || ''; }

  render() {
    const { name, role, avatar } = this;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-main, 'DM Sans', sans-serif);
        }

        .card {
          background: var(--card-bg, #0f172a);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: -40px; left: -40px;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%);
          pointer-events: none;
        }

        ::slotted(*) {}

        .avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(99,102,241,0.6);
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          color: white;
          font-weight: 700;
          overflow: hidden;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary, #f8fafc);
          letter-spacing: -0.02em;
          margin: 0;
        }

        .role {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-muted, #94a3b8);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin: 0;
          background: rgba(99,102,241,0.15);
          padding: 0.2rem 0.7rem;
          border-radius: 20px;
        }

        button {
          margin-top: 0.5rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.55rem 1.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.01em;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 14px rgba(99,102,241,0.4);
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.55);
        }

        button:active {
          transform: translateY(0);
        }

        /* CSS Parts expuestos al exterior */
        .avatar    { /* part="avatar" */ }
        .name      { /* part="name" */ }
        .role      { /* part="role" */ }
        button     { /* part="button" */ }
      </style>

      <div class="card">
        <div class="avatar" part="avatar">
          ${avatar
            ? `<img src="${avatar}" alt="${name}" />`
            : name.charAt(0).toUpperCase()}
        </div>
        <p class="name" part="name">${name}</p>
        <span class="role" part="role">${role}</span>
        <button part="button">Saludar</button>
      </div>
    `;
  }
}

customElements.define('user-card', UserCard);