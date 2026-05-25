/**
 * Tests: user-dashboard.js  (flujo de eventos)
 *
 * Verificamos la lógica de orquestación:
 *  - Captura del evento `greet` disparado por user-card
 *  - Activación de `pulsing` en warning-badge
 *  - Actualización del mensaje del badge
 *  - Reset automático después de PULSE_DURATION
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UserDashboard } from '../src/user-dashboard.js';
import { WarningBadge }  from '../src/warning-badge.js';
import { UserCard }      from '../src/user-card.js';

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildDashboard() {
  const dashboard = document.createElement('user-dashboard');

  const card    = document.createElement('user-card');
  card.setAttribute('slot', 'card');
  card.setAttribute('name', 'Alonso');
  card.setAttribute('role', 'Profesor');

  const badge   = document.createElement('warning-badge');
  badge.setAttribute('slot', 'badge');
  badge.setAttribute('message', 'Sesión por expirar');

  dashboard.appendChild(card);
  dashboard.appendChild(badge);
  document.body.appendChild(dashboard);

  return { dashboard, card, badge };
}

// ── Suite ─────────────────────────────────────────────────────────────────────
describe('<user-dashboard> — orquestación de eventos', () => {

  let dashboard, card, badge;

  beforeEach(() => {
    vi.useFakeTimers();
    ({ dashboard, card, badge } = buildDashboard());
  });

  afterEach(() => {
    dashboard?.remove();
    vi.useRealTimers();
  });

  // ── Registro ────────────────────────────────────────────────────────────────
  it('se registra correctamente como custom element', () => {
    expect(customElements.get('user-dashboard')).toBe(UserDashboard);
  });

  it('tiene shadow root en modo "open"', () => {
    expect(dashboard.shadowRoot).not.toBeNull();
    expect(dashboard.shadowRoot.mode).toBe('open');
  });

  // ── Captura del evento greet ─────────────────────────────────────────────────
  describe('manejo del evento `greet`', () => {
    it('el dashboard escucha el evento greet y activa pulsing en el badge', () => {
      expect(badge.hasAttribute('pulsing')).toBe(false);

      // Simula el evento que dispararía user-card (composed: true)
      card.dispatchEvent(new CustomEvent('greet', {
        detail: { name: 'Alonso' },
        bubbles: true,
        composed: true,
      }));

      expect(badge.hasAttribute('pulsing')).toBe(true);
    });

    it('actualiza el message del badge con el nombre del usuario', () => {
      card.dispatchEvent(new CustomEvent('greet', {
        detail: { name: 'Alonso' },
        bubbles: true,
        composed: true,
      }));

      expect(badge.getAttribute('message')).toBe('¡Hola, Alonso! — Sesión por expirar');
    });

    it('el badge refleja is-pulsing en su shadow DOM tras el evento', () => {
      card.dispatchEvent(new CustomEvent('greet', {
        detail: { name: 'Alonso' },
        bubbles: true,
        composed: true,
      }));

      const inner = badge.shadowRoot.querySelector('.badge');
      expect(inner.classList.contains('is-pulsing')).toBe(true);
    });
  });

  // ── Reset automático ─────────────────────────────────────────────────────────
  describe('reset automático después de PULSE_DURATION', () => {
    it('quita el atributo pulsing tras el timeout', () => {
      card.dispatchEvent(new CustomEvent('greet', {
        detail: { name: 'Alonso' },
        bubbles: true,
        composed: true,
      }));

      expect(badge.hasAttribute('pulsing')).toBe(true);

      vi.advanceTimersByTime(UserDashboard.PULSE_DURATION);

      expect(badge.hasAttribute('pulsing')).toBe(false);
    });

    it('restaura el message original tras el timeout', () => {
      card.dispatchEvent(new CustomEvent('greet', {
        detail: { name: 'Alonso' },
        bubbles: true,
        composed: true,
      }));

      vi.advanceTimersByTime(UserDashboard.PULSE_DURATION);

      expect(badge.getAttribute('message')).toBe('Sesión por expirar');
    });

    it('un segundo greet reinicia el timer correctamente', () => {
      // Primer greet
      card.dispatchEvent(new CustomEvent('greet', {
        detail: { name: 'Alonso' },
        bubbles: true,
        composed: true,
      }));

      // Avanzamos MITAD del tiempo
      vi.advanceTimersByTime(UserDashboard.PULSE_DURATION / 2);
      expect(badge.hasAttribute('pulsing')).toBe(true);

      // Segundo greet reinicia el timer
      card.dispatchEvent(new CustomEvent('greet', {
        detail: { name: 'Alonso' },
        bubbles: true,
        composed: true,
      }));

      // Avanzamos otra mitad (el timer anterior ya estaría vencido)
      vi.advanceTimersByTime(UserDashboard.PULSE_DURATION / 2);
      // El badge sigue activo porque el nuevo timer tiene PULSE_DURATION completo
      expect(badge.hasAttribute('pulsing')).toBe(true);

      // Avanzamos el resto del nuevo timer
      vi.advanceTimersByTime(UserDashboard.PULSE_DURATION / 2);
      expect(badge.hasAttribute('pulsing')).toBe(false);
    });
  });

  // ── Sin badge en el DOM ──────────────────────────────────────────────────────
  it('no lanza error si no hay warning-badge en el DOM', () => {
    const solo = document.createElement('user-dashboard');
    document.body.appendChild(solo);

    expect(() => {
      solo.dispatchEvent(new CustomEvent('greet', {
        detail: { name: 'Test' },
        bubbles: true,
        composed: true,
      }));
    }).not.toThrow();

    solo.remove();
  });
});