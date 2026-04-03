import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { firebaseErrorMsg } from '../utils/helpers';
import { Link } from 'react-router-dom';

export default function Register({ onToast }) {
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email || !pass || !confirm) return;
    if (pass !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (pass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      onToast?.('¡Cuenta creada exitosamente! 🎉');
    } catch (e) {
      setError(firebaseErrorMsg(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-paper flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(200,169,106,0.07) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(0,135,90,0.05) 0%, transparent 70%)' }} />

      {/* Logo */}
      <div className="text-center mb-10 animate-slide-down">
        <div className="w-14 h-14 bg-ink rounded-[18px] flex items-center justify-center text-[26px] mx-auto mb-4 shadow-lg">
          💰
        </div>
        <h1 className="font-display font-bold text-[26px] text-ink tracking-[-0.5px]">
          Control de Gastos
        </h1>
        <p className="text-[13px] text-ink/50 mt-1 font-medium">
          Gestión financiera empresarial
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-[28px] p-8 shadow-lg border border-[rgba(10,10,10,0.08)] animate-fade-in">

        <h2 className="font-display font-bold text-[20px] text-ink mb-6 tracking-[-0.3px]">
          Crear cuenta
        </h2>

        {error && (
          <div className="bg-crimson-soft text-crimson text-[13px] px-4 py-3 rounded-[10px] mb-5 border border-[rgba(192,57,43,0.15)] animate-fade-in">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="form-label">Correo electrónico</label>
            <input
              className="form-input"
              type="email"
              placeholder="tu@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="form-label">Confirmar contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoComplete="new-password"
            />
          </div>
        </div>

        <button
          className="btn-primary mt-6"
          onClick={handleSubmit}
          disabled={loading || !email || !pass || !confirm}
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>

        <p className="text-center text-[13px] text-ink/50 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-ink font-semibold hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>

      </div>
    </div>
  );
}