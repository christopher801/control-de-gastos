import jsPDF from 'jspdf';
import { CATEGORY_ICONS } from '../utils/categories';
import { fmtCurrency, fmtDate, todayStr } from '../utils/helpers';

// Fonksyon pou netwaye tèks la anvan l mete nan PDF
const cleanTextForPDF = (text) => {
  if (!text) return '';
  // Ranplase karaktè Unicode ak ekivalan ASCII
  return text
    .replace(/[áàâäãå]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôöõ]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^\x00-\x7F]/g, '•'); // Retire tout lòt karaktè Unicode
};

// Ranplase ikon yo ak senbol senp
const getSafeIcon = (category) => {
  // Eseye jwenn ikon orijinal la epi netwaye l
  const originalIcon = CATEGORY_ICONS[category];
  if (originalIcon && /^[a-zA-Z0-9]$/.test(originalIcon)) {
    return originalIcon;
  }
  // Sinon, itilize yon senbol default
  return '•';
};

export function generatePDF({ transactions, filter, dateFrom, dateTo }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── Cálculos ────────────────────────────────────────────────────────────────
  const income  = transactions.filter((t) => t.cantidad > 0).reduce((s, t) => s + t.cantidad, 0);
  const expense = transactions.filter((t) => t.cantidad < 0).reduce((s, t) => s + Math.abs(t.cantidad), 0);
  const profit  = income - expense;

  const filterLabels = { today: 'Hoy', week: 'Esta semana', month: 'Este mes', custom: `${dateFrom} — ${dateTo}` };
  const periodStr    = filterLabels[filter] || 'Todas las fechas';
  const nowStr       = new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'long', year: 'numeric' });

  // ── Paleta ───────────────────────────────────────────────────────────────────
  const INK    = [10, 10, 10];
  const GRAY   = [107, 114, 128];
  const LGRAY  = [200, 199, 195];
  const WHITE  = [255, 255, 255];
  const GREEN  = [0, 135, 90];
  const RED    = [192, 57, 43];
  const BG     = [245, 244, 240];

  // ── Header bar ───────────────────────────────────────────────────────────────
  doc.setFillColor(...INK);
  doc.rect(0, 0, 210, 16, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...WHITE);
  doc.text('CONTROL DE GASTOS  —  REPORTE FINANCIERO CONFIDENCIAL', 14, 10);
  doc.text(nowStr, 196, 10, { align: 'right' });

  // ── Título ───────────────────────────────────────────────────────────────────
  let y = 28;
  doc.setTextColor(...INK);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Control de Gastos', 14, y);

  y += 7;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text('Reporte Financiero', 14, y);

  y += 5;
  doc.setFontSize(10);
  doc.text(`Período: ${periodStr}`, 14, y);

  y += 5;
  doc.setDrawColor(...LGRAY);
  doc.setLineWidth(0.4);
  doc.line(14, y, 196, y);

  // ── Summary cards ────────────────────────────────────────────────────────────
  y += 8;
  const BOX_W = 57, BOX_H = 24, GAP = 3.5;

  [
    { label: 'TOTAL INGRESOS', value: fmtCurrency(income),  color: GREEN },
    { label: 'TOTAL GASTOS',   value: fmtCurrency(expense), color: RED   },
    { label: 'GANANCIA NETA',  value: fmtCurrency(profit),  color: profit >= 0 ? GREEN : RED },
  ].forEach((b, i) => {
    const x = 14 + i * (BOX_W + GAP);
    doc.setFillColor(...BG);
    doc.roundedRect(x, y, BOX_W, BOX_H, 3, 3, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GRAY);
    doc.text(b.label, x + 5, y + 7.5);
    doc.setFontSize(13.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...b.color);
    doc.text(b.value, x + 5, y + 18);
  });

  y += BOX_H + 10;

  // ── Transacciones por categoría ──────────────────────────────────────────────
  const grouped = {};
  transactions.forEach((t) => {
    const c = cleanTextForPDF(t.categoríaPrincipal || 'Otros');
    if (!grouped[c]) grouped[c] = [];
    grouped[c].push(t);
  });

  Object.entries(grouped).forEach(([cat, txs]) => {
    if (y > 255) { doc.addPage(); y = 20; }

    // Category header
    doc.setFillColor(...BG);
    doc.rect(14, y, 182, 9, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...INK);
    // Sèvi ak yon ikon senp olye de emoji
    doc.text(`•  ${cat.toUpperCase()}`, 18, y + 6);

    // Category total
    const catTotal = txs.reduce((s, t) => s + t.cantidad, 0);
    doc.setTextColor(...(catTotal >= 0 ? GREEN : RED));
    doc.text(
      `${catTotal >= 0 ? '+' : '-'}${fmtCurrency(Math.abs(catTotal))}`,
      193, y + 6, { align: 'right' }
    );

    y += 12;

    txs.forEach((t) => {
      if (y > 270) { doc.addPage(); y = 20; }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...INK);
      doc.text(cleanTextForPDF(t.descripción || '-').substring(0, 44), 18, y);

      doc.setTextColor(...GRAY);
      doc.setFontSize(8.5);
      doc.text(cleanTextForPDF(t.subcategoría || '-'), 100, y);
      doc.text(fmtDate(t.fecha), 142, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...(t.cantidad >= 0 ? GREEN : RED));
      doc.text(
        `${t.cantidad >= 0 ? '+' : '-'}${fmtCurrency(Math.abs(t.cantidad))}`,
        193, y, { align: 'right' }
      );

      y += 5.5;
      doc.setDrawColor(230, 229, 225);
      doc.setLineWidth(0.2);
      doc.line(18, y - 0.5, 193, y - 0.5);
    });

    y += 6;
  });

  // ── Footer ───────────────────────────────────────────────────────────────────
  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text('Control de Gastos — Reporte generado automáticamente', 14, 289);
    doc.text(`Página ${p} de ${pages}`, 193, 289, { align: 'right' });
  }

  doc.save(`reporte-gastos-${todayStr()}.pdf`);
}