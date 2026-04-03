// ─────────────────────────────────────────────────────────────────────────────
// Helpers de formato y fechas
// ─────────────────────────────────────────────────────────────────────────────

/** Formatea número como moneda RD$ */
export const fmtCurrency = (n = 0) => {
  const abs = Math.abs(n);
  const s = abs.toLocaleString('es-DO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$${s}`;
};

/** Formatea fecha "YYYY-MM-DD" → "15 ene. 2025" */
export const fmtDate = (d) => {
  if (!d) return '';
  const dt = typeof d === 'string' ? new Date(d + 'T00:00:00') : d;
  return dt.toLocaleDateString('es-DO', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
};

/** Fecha de hoy en formato YYYY-MM-DD */
export const todayStr = () => new Date().toISOString().split('T')[0];

/** Inicio de la semana actual (domingo) */
export const startOfWeekStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
};

/** Inicio del mes actual */
export const startOfMonthStr = () => {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split('T')[0];
};

/** Nombre corto del mes a partir de índice 0 */
export const shortMonthName = (monthIndex) =>
  new Date(2000, monthIndex, 1).toLocaleDateString('es-DO', { month: 'short' });

/** Devuelve datos de los últimos N meses para el gráfico de barras */
export const buildBarChartData = (transactions, months = 6) => {
  const result = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('es-DO', { month: 'short' });
    const txs   = transactions.filter((t) => t.fecha?.startsWith(key));
    result.push({
      month:   label,
      income:  txs.filter((t) => t.cantidad > 0).reduce((s, t) => s + t.cantidad, 0),
      expense: txs.filter((t) => t.cantidad < 0).reduce((s, t) => s + Math.abs(t.cantidad), 0),
    });
  }
  return result;
};

/** Agrupa gastos por categoría para el pie chart */
export const buildPieData = (transactions) => {
  const map = {};
  transactions
    .filter((t) => t.cantidad < 0)
    .forEach((t) => {
      const cat = t.categoríaPrincipal || 'Otros';
      map[cat] = (map[cat] || 0) + Math.abs(t.cantidad);
    });
  return Object.entries(map).map(([cat, total]) => ({ cat, total }));
};

/** Calcula totales de un array de transacciones */
export const calcTotals = (txs) => {
  const income  = txs.filter((t) => t.cantidad > 0).reduce((s, t) => s + t.cantidad, 0);
  const expense = txs.filter((t) => t.cantidad < 0).reduce((s, t) => s + Math.abs(t.cantidad), 0);
  return { income, expense, balance: income - expense };
};

/** Filtra transacciones según el filtro seleccionado */
export const filterTransactions = (txs, filter, dateFrom, dateTo) => {
  const today = todayStr();
  if (filter === 'today')  return txs.filter((t) => t.fecha === today);
  if (filter === 'week')   return txs.filter((t) => t.fecha >= startOfWeekStr() && t.fecha <= today);
  if (filter === 'month')  return txs.filter((t) => t.fecha >= startOfMonthStr() && t.fecha <= today);
  if (filter === 'custom') return txs.filter((t) => t.fecha >= dateFrom && t.fecha <= dateTo);
  return txs;
};

/** Mensaje de error Firebase → Español */
export const firebaseErrorMsg = (code) => {
  const map = {
    'auth/user-not-found':        'Usuario no encontrado.',
    'auth/wrong-password':        'Contraseña incorrecta.',
    'auth/email-already-in-use':  'El correo ya está registrado.',
    'auth/invalid-email':         'Correo electrónico inválido.',
    'auth/weak-password':         'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-credential':    'Credenciales incorrectas. Verifica tu correo y contraseña.',
    'auth/too-many-requests':     'Demasiados intentos. Espera un momento.',
    'auth/network-request-failed':'Error de red. Verifica tu conexión a internet.',
  };
  return map[code] || 'Ocurrió un error. Intenta de nuevo.';
};