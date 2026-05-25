/**
 * Tests: warning-badge.js
 * 
 * Probamos el componente más crítico del flujo:
 *  - Registro correcto como custom element
 *  - Shadow DOM abierto
 *  - Atributo `pulsing` booleano reactivo (add / remove)
 *  - Atributo `message` reactivo
 *  - Getter/setter de `pulsing`
 *  - CSS Parts expuestos
 *  - Estado visual refleja correctamente el atributo
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WarningBadge } from '../src/warning-badge.js';

// ---------- helpers ----------
function createBadge(attrs = {}) {
  const el = document.createElement('warning-badge');
  for (const [k, v] of Object.entries(attrs)) {
    if (v === true || v === '') el.setAttribute(k, '');
    else if (v !== false)       el.setAttribute(k, v);
  }
  document.body.appendChild(el);
  return el;
}

// ---------- suite ----------
describe('<warning-badge>', () => {

  let el;

  afterEach(() => {
    el?.remove();
  });

  // ── Registro ────────────────────────────────────────────────────────────────
  describe('registro del custom element', () => {
    it('está registrado en customElements', () => {
      expect(customElements.get('warning-badge')).toBe(WarningBadge);
    });

    it('crea una instancia del tipo correcto', () => {
      el = createBadge();
      expect(el).toBeInstanceOf(WarningBadge);
    });
  });

  // ── Shadow DOM ───────────────────────────────────────────────────────────────
  describe('shadow DOM', () => {
    it('tiene shadow root en modo "open"', () => {
      el = createBadge();
      expect(el.shadowRoot).not.toBeNull();
      expect(el.shadowRoot.mode).toBe('open');
    });

    it('renderiza el contenedor .badge dentro del shadow root', () => {
      el = createBadge();
      const badge = el.shadowRoot.querySelector('.badge');
      expect(badge).not.toBeNull();
    });
  });

  // ── Atributo pulsing (booleano reactivo) ────────────────────────────────────
  describe('atributo `pulsing` — booleano reactivo', () => {
    it('sin `pulsing`: .badge NO tiene la clase is-pulsing', () => {
      el = createBadge();
      const badge = el.shadowRoot.querySelector('.badge');
      expect(badge.classList.contains('is-pulsing')).toBe(false);
    });

    it('con `pulsing`: .badge SÍ tiene la clase is-pulsing', () => {
      el = createBadge({ pulsing: true });
      const badge = el.shadowRoot.querySelector('.badge');
      expect(badge.classList.contains('is-pulsing')).toBe(true);
    });

    it('añadir `pulsing` dinámicamente activa la clase', () => {
      el = createBadge();
      expect(el.shadowRoot.querySelector('.badge').classList.contains('is-pulsing')).toBe(false);

      el.setAttribute('pulsing', '');

      expect(el.shadowRoot.querySelector('.badge').classList.contains('is-pulsing')).toBe(true);
    });

    it('quitar `pulsing` dinámicamente desactiva la clase', () => {
      el = createBadge({ pulsing: true });
      expect(el.shadowRoot.querySelector('.badge').classList.contains('is-pulsing')).toBe(true);

      el.removeAttribute('pulsing');

      expect(el.shadowRoot.querySelector('.badge').classList.contains('is-pulsing')).toBe(false);
    });
  });

  // ── Getter / Setter de pulsing ───────────────────────────────────────────────
  describe('getter y setter de `pulsing`', () => {
    it('getter devuelve false cuando no tiene el atributo', () => {
      el = createBadge();
      expect(el.pulsing).toBe(false);
    });

    it('getter devuelve true cuando tiene el atributo', () => {
      el = createBadge({ pulsing: true });
      expect(el.pulsing).toBe(true);
    });

    it('setter true añade el atributo y activa la clase', () => {
      el = createBadge();
      el.pulsing = true;
      expect(el.hasAttribute('pulsing')).toBe(true);
      expect(el.shadowRoot.querySelector('.badge').classList.contains('is-pulsing')).toBe(true);
    });

    it('setter false elimina el atributo y desactiva la clase', () => {
      el = createBadge({ pulsing: true });
      el.pulsing = false;
      expect(el.hasAttribute('pulsing')).toBe(false);
      expect(el.shadowRoot.querySelector('.badge').classList.contains('is-pulsing')).toBe(false);
    });
  });

  // ── Atributo message reactivo ────────────────────────────────────────────────
  describe('atributo `message` — reactivo', () => {
    it('muestra el message inicial en .text', () => {
      el = createBadge({ message: 'Sesión por expirar' });
      const text = el.shadowRoot.querySelector('.text');
      expect(text.textContent).toBe('Sesión por expirar');
    });

    it('actualiza .text cuando cambia el atributo dinámicamente', () => {
      el = createBadge({ message: 'Sesión por expirar' });
      el.setAttribute('message', '¡Hola, Alonso! — Sesión por expirar');
      const text = el.shadowRoot.querySelector('.text');
      expect(text.textContent).toBe('¡Hola, Alonso! — Sesión por expirar');
    });
  });

  // ── CSS Parts ────────────────────────────────────────────────────────────────
  describe('CSS Parts expuestos', () => {
    const parts = ['badge', 'icon', 'text', 'dot'];

    for (const part of parts) {
      it(`expone part="${part}"`, () => {
        el = createBadge();
        const node = el.shadowRoot.querySelector(`[part="${part}"]`);
        expect(node, `Se esperaba un elemento con part="${part}"`).not.toBeNull();
      });
    }
  });

  // ── observedAttributes ───────────────────────────────────────────────────────
  describe('observedAttributes', () => {
    it('incluye "pulsing" y "message"', () => {
      expect(WarningBadge.observedAttributes).toContain('pulsing');
      expect(WarningBadge.observedAttributes).toContain('message');
    });
  });
});