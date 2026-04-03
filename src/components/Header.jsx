import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function Header({ onExport }) {
  const handleLogout = async () => {
    if (!window.confirm('¿Cerrar sesión?')) return;
    await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-xl border-b border-[rgba(10,10,10,0.08)]">
      <div className="max-w-2xl mx-auto h-[60px] px-5 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] bg-ink rounded-[10px] flex items-center justify-center text-[16px] shadow-sm">
            💰
          </div>
          <span className="font-display font-bold text-[17px] text-ink tracking-[-0.3px]">
            Control de Gastos
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="btn-icon"
            onClick={onExport}
            title="Exportar PDF"
            aria-label="Exportar reporte PDF"
          >
            📄
          </button>
          <button
            className="btn-icon"
            onClick={handleLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 7.5H5M10.5 4.5L13.5 7.5L10.5 10.5M8 2H2.5C2.22386 2 2 2.22386 2 2.5V12.5C2 12.7761 2.22386 13 2.5 13H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}