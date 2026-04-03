// ─────────────────────────────────────────────────────────────────────────────
// Categorías del sistema
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = {
  'Materiales':   ['Aluminios','Vidrios', 'Tornillos', 'Accesorios', 'Masillas', 'Gomas', 'Puertas'],
  'Mano de obra': ['Sueldos', 'Por dia'],
  'Transporte':   ['Transporte'],
  'Pagos':        ['Cheques', 'Transferencias', 'Efectivo'],
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