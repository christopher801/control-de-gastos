import { fmtCurrency } from '../utils/helpers';

function StatCard({ icon, label, value, colorClass, bgClass }) {
  return (
    <div className="card p-4 flex flex-col gap-2.5 animate-fade-in">
      <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center text-[13px] ${bgClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.6px] text-ink/50 mb-0.5">
          {label}
        </p>
        <p className={`font-mono text-[13px] font-medium tracking-[-0.3px] ${colorClass}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function Stats({ income, expense, balance }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <StatCard
        icon="↑"
        label="Ingresos"
        value={fmtCurrency(income)}
        colorClass="text-emerald"
        bgClass="bg-emerald-soft"
      />
      <StatCard
        icon="↓"
        label="Gastos"
        value={fmtCurrency(expense)}
        colorClass="text-crimson"
        bgClass="bg-crimson-soft"
      />
      <StatCard
        icon="≈"
        label="Ganancia"
        value={fmtCurrency(balance)}
        colorClass={balance >= 0 ? 'text-emerald' : 'text-crimson'}
        bgClass="bg-[rgba(200,169,106,0.12)]"
      />
    </div>
  );
}