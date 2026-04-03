// ─────────────────────────────────────────────────────────────────────────────
// Categorías del sistema
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = {
  'Materiales':   ['Vidrios', 'Tornillos', 'Accesorios', 'Masillas', 'Gomas', 'Puertas'],
  'Mano de obra': ['Sueldos'],
  'Transporte':   ['Transporte'],
  'Pagos':        ['Cheques', 'Transferencias'],
  'Otros':        ['Otros gastos'],
};

export const CATEGORY_ICONS = {
  'Materiales':   '🧱',
  'Mano de obra': '👷',
  'Transporte':   '🚚',
  'Pagos':        '💳',
  'Otros':        '📦',
};

export const CATEGORY_COLORS = {
  'Materiales':   '#3B82F6',
  'Mano de obra': '#F59E0B',
  'Transporte':   '#8B5CF6',
  'Pagos':        '#06B6D4',
  'Otros':        '#6B7280',
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);