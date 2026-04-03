import { CATEGORY_ICONS } from '../utils/categories';
import { fmtCurrency, fmtDate } from '../utils/helpers';

function TransactionItem({ tx, onDelete }) {
  const isIncome = tx.cantidad > 0;

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(10,10,10,0.05)] last:border-0 hover:bg-[rgba(10,10,10,0.02)] transition-colors group">

      {/* Icon */}
      <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-[17px] flex-shrink-0 ${
        isIncome ? 'bg-emerald-soft' : 'bg-crimson-soft'
      }`}>
        {CATEGORY_ICONS[tx.categoríaPrincipal] || '•'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-ink truncate">{tx.descripción}</p>
        <p className="text-[11px] text-ink/50 mt-0.5 truncate">
          {tx.categoríaPrincipal} · {tx.subcategoría}
        </p>
      </div>

      {/* Amount + Date */}
      <div className="text-right flex-shrink-0">
        <p className={`font-mono text-[14px] font-medium tracking-[-0.3px] ${
          isIncome ? 'text-emerald' : 'text-crimson'
        }`}>
          {isIncome ? '+' : '-'}{fmtCurrency(Math.abs(tx.cantidad))}
        </p>
        <p className="text-[11px] text-ink/40 mt-0.5">{fmtDate(tx.fecha)}</p>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(tx.id)}
        className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[13px] text-ink/30
                   opacity-0 group-hover:opacity-100 transition-all hover:bg-crimson-soft hover:text-crimson
                   flex-shrink-0 ml-1 border-none bg-transparent cursor-pointer"
        aria-label="Eliminar transacción"
      >
        ✕
      </button>

    </div>
  );
}

export default function TransactionList({ transactions, onDelete }) {
  if (!transactions?.length) {
    return (
      <div className="card p-10 text-center animate-fade-in">
        <div className="text-4xl mb-3 opacity-30">📊</div>
        <h3 className="text-[15px] font-medium text-ink mb-1.5">Sin transacciones</h3>
        <p className="text-[13px] text-ink/50">
          Agrega tu primera transacción usando el botón de abajo.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden animate-fade-in">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} tx={tx} onDelete={onDelete} />
      ))}
    </div>
  );
}