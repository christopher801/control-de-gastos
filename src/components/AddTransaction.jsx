import { useState } from 'react';
import { CATEGORIES, CATEGORY_ICONS } from '../utils/categories';
import { todayStr } from '../utils/helpers';

export default function AddTransaction({ onClose, onSave }) {
  const [type,    setType]   = useState('expense');
  const [desc,    setDesc]   = useState('');
  const [amount,  setAmount] = useState('');
  const [cat,     setCat]    = useState('');
  const [subcat,  setSubcat] = useState('');
  const [fecha,   setFecha]  = useState(todayStr());
  const [loading, setLoading] = useState(false);

  const subcats    = cat ? CATEGORIES[cat] : [];
  const isValid    = desc && amount && parseFloat(amount) > 0 && cat && subcat && fecha;

  const handleCatChange = (v) => {
    setCat(v);
    setSubcat('');
  };

  const handleSave = async () => {
    if (!isValid) return;
    setLoading(true);
    const qty = parseFloat(amount);
    await onSave({
      descripción:        desc.trim(),
      cantidad:           type === 'income' ? Math.abs(qty) : -Math.abs(qty),
      categoríaPrincipal: cat,
      subcategoría:       subcat,
      fecha,
    });
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-end justify-center animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-[28px] w-full max-w-2xl px-6 pb-10 pt-5 animate-slide-up max-h-[92dvh] overflow-y-auto">

        {/* Handle */}
        <div className="w-9 h-1 bg-ink/15 rounded-full mx-auto mb-5" />

        {/* Title */}
        <h2 className="font-display font-bold text-[22px] text-ink tracking-[-0.5px] mb-5">
          Nueva Transacción
        </h2>

        {/* Type Toggle */}
        <div className="grid grid-cols-2 bg-[rgba(10,10,10,0.05)] rounded-[10px] p-1 mb-5">
          <button
            onClick={() => setType('income')}
            className={`py-2.5 rounded-[8px] text-[14px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer ${
              type === 'income'
                ? 'bg-emerald text-white shadow-sm'
                : 'bg-transparent text-ink/50'
            }`}
          >
            ↑ Ingreso
          </button>
          <button
            onClick={() => setType('expense')}
            className={`py-2.5 rounded-[8px] text-[14px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer ${
              type === 'expense'
                ? 'bg-crimson text-white shadow-sm'
                : 'bg-transparent text-ink/50'
            }`}
          >
            ↓ Gasto
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">

          <div>
            <label className="form-label">Descripción</label>
            <input
              className="form-input"
              placeholder="Ej: Compra de materiales para obra"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="form-label">Cantidad (RD$)</label>
            <input
              className="form-input font-mono"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="form-label">Categoría principal</label>
            <select
              className="form-select"
              value={cat}
              onChange={(e) => handleCatChange(e.target.value)}
            >
              <option value="">Seleccionar categoría...</option>
              {Object.keys(CATEGORIES).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_ICONS[c]} {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Subcategoría</label>
            <select
              className="form-select"
              value={subcat}
              onChange={(e) => setSubcat(e.target.value)}
              disabled={!cat}
            >
              <option value="">
                {cat ? 'Seleccionar subcategoría...' : 'Primero elige una categoría'}
              </option>
              {subcats.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Fecha</label>
            <input
              className="form-input"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5 mt-6">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-primary"
            style={{ marginTop: 0 }}
            onClick={handleSave}
            disabled={loading || !isValid}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>

      </div>
    </div>
  );
}