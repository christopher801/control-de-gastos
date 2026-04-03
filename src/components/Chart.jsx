import { useEffect, useRef } from 'react';
import { 
  Chart, 
  ArcElement, 
  DoughnutController,
  BarController,  // ← Ajoute sa a
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { CATEGORY_COLORS } from '../utils/categories';
import { fmtCurrency } from '../utils/helpers';

// Register Chart.js components - Ajoute BarController a
Chart.register(
  ArcElement, 
  DoughnutController,
  BarController,    // ← Ajoute sa a tou
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend
);

// ─── PIE / DOUGHNUT ──────────────────────────────────────────────────────────
export function PieChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data?.length) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels:   data.map((d) => d.cat),
        datasets: [{
          data:            data.map((d) => d.total),
          backgroundColor: data.map((d) => CATEGORY_COLORS[d.cat] || '#6B7280'),
          borderWidth:     0,
          hoverOffset:     4,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: true,
        cutout:              '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `  ${fmtCurrency(ctx.parsed)}`,
            },
          },
        },
        animation: { duration: 500 },
      },
    });

    return () => chartRef.current?.destroy();
  }, [JSON.stringify(data)]);

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-28 text-ink/30 text-[13px]">
        Sin gastos registrados
      </div>
    );
  }

  return (
    <div>
      <canvas ref={canvasRef} />
      {/* Leyenda custom */}
      <div className="mt-3 space-y-1.5">
        {data.map((d) => (
          <div key={d.cat} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-[3px] flex-shrink-0"
              style={{ background: CATEGORY_COLORS[d.cat] || '#6B7280' }}
            />
            <span className="text-[10px] text-ink/50 flex-1 truncate">{d.cat}</span>
            <span className="text-[10px] font-mono text-ink">{fmtCurrency(d.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BAR CHART ───────────────────────────────────────────────────────────────
export function BarChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data?.length) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels:   data.map((d) => d.month),
        datasets: [
          {
            label:           'Ingresos',
            data:            data.map((d) => d.income),
            backgroundColor: '#00875A',
            borderRadius:    5,
            borderSkipped:   false,
          },
          {
            label:           'Gastos',
            data:            data.map((d) => d.expense),
            backgroundColor: '#C0392B',
            borderRadius:    5,
            borderSkipped:   false,
          },
        ],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `  ${ctx.dataset.label}: ${fmtCurrency(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            grid:  { display: false },
            ticks: { font: { size: 9 }, color: '#9CA3AF' },
          },
          y: {
            grid:  { color: 'rgba(0,0,0,0.04)' },
            ticks: {
              font: { size: 9 },
              color: '#9CA3AF',
              callback: (v) => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v),
            },
          },
        },
        animation: { duration: 500 },
      },
    });

    return () => chartRef.current?.destroy();
  }, [JSON.stringify(data)]);

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-28 text-ink/30 text-[13px]">
        Sin datos para mostrar
      </div>
    );
  }

  return (
    <div>
      <canvas ref={canvasRef} />
      {/* Leyenda custom */}
      <div className="mt-3 flex gap-4 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[3px] bg-emerald" />
          <span className="text-[10px] text-ink/50">Ingresos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-[3px] bg-crimson" />
          <span className="text-[10px] text-ink/50">Gastos</span>
        </div>
      </div>
    </div>
  );
}