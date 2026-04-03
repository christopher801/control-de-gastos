import { useState, useEffect, useCallback } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

import Header          from '../components/Header';
import Balance         from '../components/Balance';
import Stats           from '../components/Stats';
import { PieChart, BarChart } from '../components/Chart';
import TransactionList from '../components/TransactionList';
import AddTransaction  from '../components/AddTransaction';
import { generatePDF } from '../components/ExportPDF';

import {
  todayStr, startOfMonthStr,
  calcTotals, filterTransactions,
  buildPieData, buildBarChartData,
} from '../utils/helpers';

// ─── Filters ─────────────────────────────────────────────────────────────────
const FILTERS = [
  { key: 'today',  label: 'Hoy'          },
  { key: 'week',   label: 'Semana'       },
  { key: 'month',  label: 'Mes'          },
  { key: 'custom', label: 'Personalizado'},
];

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-white text-[13px] font-medium
                    px-5 py-3 rounded-full shadow-lg z-[999] animate-toast whitespace-nowrap">
      {msg}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loadingTxs,   setLoadingTxs]   = useState(true);
  const [showAdd,      setShowAdd]      = useState(false);
  const [toast,        setToast]        = useState(null);

  // Filters
  const [filter,   setFilter]   = useState('month');
  const [dateFrom, setDateFrom] = useState(startOfMonthStr());
  const [dateTo,   setDateTo]   = useState(todayStr());

  // ── Load transactions from Firestore ───────────────────────────────────────
  const loadTransactions = useCallback(async () => {
    if (!user) return;
    setLoadingTxs(true);
    try {
      const q    = query(collection(db, 'users', user.uid, 'transactions'), orderBy('fecha', 'desc'));
      const snap = await getDocs(q);
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Error cargando transacciones:', e);
      showToast('Error al cargar transacciones');
    } finally {
      setLoadingTxs(false);
    }
  }, [user]);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  // ── Save transaction ───────────────────────────────────────────────────────
  const handleSave = async (data) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'transactions'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      await loadTransactions();
      showToast('Transacción guardada ✓');
    } catch (e) {
      console.error(e);
      showToast('Error al guardar');
    }
  };

  // ── Delete transaction ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta transacción?')) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast('Transacción eliminada');
    } catch (e) {
      showToast('Error al eliminar');
    }
  };

  // ── Export PDF ─────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!filtered.length) {
      showToast('No hay transacciones para exportar');
      return;
    }
    generatePDF({ transactions: filtered, filter, dateFrom, dateTo });
    showToast('Generando reporte PDF...');
  };

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = (msg) => setToast(msg);

  // ── Computed data ──────────────────────────────────────────────────────────
  const filtered  = filterTransactions(transactions, filter, dateFrom, dateTo);
  const totals    = calcTotals(filtered);
  const pieData   = buildPieData(filtered);
  const barData   = buildBarChartData(transactions, 6);
  const showCharts = pieData.length > 0 || barData.some((d) => d.income > 0 || d.expense > 0);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-paper">

      <Header onExport={handleExport} />

      <main className="max-w-2xl mx-auto px-4 pt-5 pb-28 space-y-4">

        {/* ── Filter Bar ──────────────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -webkit-overflow-scrolling-touch">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-pill ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Custom date range ───────────────────────────────────────────── */}
        {filter === 'custom' && (
          <div className="grid grid-cols-2 gap-3 animate-slide-down">
            <div>
              <label className="form-label">Desde</label>
              <input
                className="form-input"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Hasta</label>
              <input
                className="form-input"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── Balance Card ────────────────────────────────────────────────── */}
        <Balance
          balance={totals.balance}
          filter={filter}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <Stats
          income={totals.income}
          expense={totals.expense}
          balance={totals.balance}
        />

        {/* ── Charts ──────────────────────────────────────────────────────── */}
        {showCharts && (
          <div className="grid grid-cols-2 gap-3">
            {/* Pie Chart */}
            <div className="card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-ink/40 mb-3">
                Gastos por categoría
              </p>
              <PieChart data={pieData} key={JSON.stringify(pieData)} />
            </div>

            {/* Bar Chart */}
            <div className="card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-ink/40 mb-3">
                Ingresos vs Gastos
              </p>
              <BarChart data={barData} key={JSON.stringify(barData)} />
            </div>
          </div>
        )}

        {/* ── Transaction List ─────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="section-title">
              Transacciones {filtered.length > 0 && `(${filtered.length})`}
            </span>
          </div>

          {loadingTxs ? (
            <div className="card flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-[rgba(10,10,10,0.1)] border-t-ink rounded-full animate-spin" />
            </div>
          ) : (
            <TransactionList
              transactions={filtered}
              onDelete={handleDelete}
            />
          )}
        </div>

      </main>

      {/* ── FAB ─────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-7 left-1/2 -translate-x-1/2 bg-ink text-white font-semibold
                   text-[15px] tracking-[0.2px] px-7 py-[15px] rounded-full shadow-[0_8px_32px_rgba(10,10,10,0.3)]
                   flex items-center gap-2 transition-all duration-200 z-50 border-none cursor-pointer
                   hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(10,10,10,0.4)]
                   active:translate-y-0"
        aria-label="Agregar transacción"
      >
        <span className="text-[18px] leading-none">+</span>
        Agregar
      </button>

      {/* ── Add Transaction Modal ────────────────────────────────────────────── */}
      {showAdd && (
        <AddTransaction
          onClose={() => setShowAdd(false)}
          onSave={handleSave}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

    </div>
  );
}