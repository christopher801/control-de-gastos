import { fmtCurrency } from '../utils/helpers';

const FILTER_LABELS = {
  today:  'Hoy',
  week:   'Esta semana',
  month:  'Este mes',
  custom: 'Rango personalizado',
};

export default function Balance({ balance, filter, dateFrom, dateTo }) {
  const isPositive = balance >= 0;

  const periodLabel =
    filter === 'custom'
      ? `${dateFrom}  —  ${dateTo}`
      : FILTER_LABELS[filter] || 'Este mes';

  return (
    <div className="relative bg-ink rounded-[28px] px-6 py-7 overflow-hidden animate-slide-down">

      {/* Decorative glow top-right */}
      <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(200,169,106,0.18) 0%, transparent 70%)' }} />

      {/* Decorative glow bottom-left */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

      {/* Label */}
      <p className="text-[11px] font-semibold uppercase tracking-[1.3px] text-white/40 mb-2">
        Balance neto
      </p>

      {/* Amount */}
      <p className={`font-mono text-[40px] font-medium tracking-[-1.5px] leading-none mb-1.5 ${
        isPositive ? 'text-emerald-400' : 'text-red-400'
      }`}>
        {isPositive ? '+' : '-'}{fmtCurrency(Math.abs(balance))}
      </p>

      {/* Period */}
      <p className="text-[12px] text-white/30 mt-2.5 font-medium">
        {periodLabel}
      </p>

    </div>
  );
}