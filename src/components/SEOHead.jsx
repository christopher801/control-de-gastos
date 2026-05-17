import { Helmet } from 'react-helmet-async';

const BASE_URL   = 'https://controlsgastos.vercel.app';
const OG_IMAGE   = `${BASE_URL}/og-image.png`;
const SITE_NAME  = 'Control de Gastos';

/**
 * SEOHead — Inyecta <title> y <meta> dinámicos por página.
 *
 * Uso:
 *   <SEOHead
 *     title="Iniciar sesión"
 *     description="..."
 *     path="/login"
 *   />
 */
export default function SEOHead({
  title,
  description = 'Aplicación profesional para controlar ingresos y gastos de tu empresa. Categorías, gráficos y reportes PDF.',
  path        = '/',
  noIndex     = false,
}) {
  const fullTitle    = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Gestión Financiera Empresarial`;
  const canonicalUrl = `${BASE_URL}${path}`;

  return (
    <Helmet>
      {/* Básico */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:image"       content={OG_IMAGE} />

      {/* Twitter */}
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={OG_IMAGE} />
    </Helmet>
  );
}