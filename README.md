# 💰 Control de Gastos — PWA

Aplicación web progresiva (PWA) para gestión financiera empresarial. Construida con React + Vite + Firebase + Tailwind CSS.

---

## 🗂️ Estructura del proyecto

```
control-de-gastos/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
├── public/
│   ├── manifest.json        ← Configuración PWA
│   ├── sw.js                ← Service Worker (offline)
│   └── icons/
│       ├── icon-192.png     ← Ícono PWA 192x192
│       └── icon-512.png     ← Ícono PWA 512x512
│
└── src/
    ├── main.jsx             ← Entry point + SW registration
    ├── App.jsx              ← Router + Auth guard
    ├── index.css            ← Tailwind + estilos globales
    │
    ├── firebase/
    │   └── config.js        ← ⚠️ Aquí van tus credenciales Firebase
    │
    ├── context/
    │   └── AuthContext.jsx  ← Estado global de autenticación
    │
    ├── utils/
    │   ├── categories.js    ← Categorías y subcategorías
    │   └── helpers.js       ← Formato de fechas, moneda, filtros
    │
    ├── components/
    │   ├── Header.jsx       ← Barra superior + botón PDF + logout
    │   ├── Balance.jsx      ← Tarjeta de balance total
    │   ├── Stats.jsx        ← Cards de ingresos, gastos, ganancia
    │   ├── Chart.jsx        ← Gráfico de pastel + barras (Chart.js)
    │   ├── TransactionList.jsx ← Lista de transacciones
    │   ├── AddTransaction.jsx  ← Modal para agregar transacción
    │   └── ExportPDF.jsx    ← Generador de PDF con jsPDF
    │
    └── pages/
        ├── Login.jsx        ← Página de inicio de sesión
        ├── Register.jsx     ← Página de registro
        └── Dashboard.jsx    ← Pantalla principal
```

---

## ⚙️ Configuración — Paso a paso

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

#### 2.1 Crear proyecto
1. Ve a → https://console.firebase.google.com
2. Clic en **"Agregar proyecto"** → Dale un nombre → Crear
3. En el panel, ve a **"Agregar app"** → Elige **Web (</>)**
4. Copia el objeto `firebaseConfig`

#### 2.2 Habilitar Authentication
- Firebase Console → **Authentication** → **Sign-in method**
- Habilita **"Correo electrónico/contraseña"** → Guardar

#### 2.3 Crear Firestore Database
- Firebase Console → **Firestore Database** → **Crear base de datos**
- Selecciona **"Modo producción"** → Elige región → Crear
- Ve a la pestaña **Reglas** y pega esto:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```
- Clic en **Publicar**

#### 2.4 Insertar credenciales
Abre `src/firebase/config.js` y reemplaza los valores:

```js
const firebaseConfig = {
  apiKey:            "TU_API_KEY",
  authDomain:        "TU_PROJECT.firebaseapp.com",
  projectId:         "TU_PROJECT_ID",
  storageBucket:     "TU_PROJECT.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId:             "TU_APP_ID",
};
```

### 3. Agregar íconos PWA

Coloca dos imágenes en la carpeta `public/icons/`:
- `icon-192.png` → 192 × 192 px
- `icon-512.png` → 512 × 512 px

Herramienta gratuita: https://favicon.io/favicon-generator/

---

## 🚀 Ejecutar en desarrollo

```bash
npm run dev
```
Abre → http://localhost:5173

---

## 🏗️ Build para producción

```bash
npm run build
```
Los archivos quedan en la carpeta `/dist`.

---

## 🌐 Desplegar

### Opción A — Firebase Hosting (recomendado)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting    # directorio público: dist
npm run build
firebase deploy
```

### Opción B — Netlify
1. `npm run build`
2. Arrastra la carpeta `/dist` a https://app.netlify.com/drop

### Opción C — Vercel
```bash
npm install -g vercel
vercel
```

---

## 📱 Instalar como PWA

**Android (Chrome):**
1. Abre la app en Chrome
2. Menú (⋮) → "Agregar a pantalla de inicio"

**iOS (Safari):**
1. Abre la app en Safari
2. Ícono de compartir (□↑) → "Agregar a pantalla de inicio"

---

## 🗄️ Estructura de datos en Firestore

```
users/
  {userId}/
    transactions/
      {transactionId}
        descripción:         string
        cantidad:            number   (+ingreso / -gasto)
        categoríaPrincipal:  string
        subcategoría:        string
        fecha:               string   (YYYY-MM-DD)
        createdAt:           timestamp
```

---

## ✅ Funcionalidades

| Feature | Estado |
|---|---|
| Autenticación Email/Contraseña | ✅ |
| Auto-login persistente | ✅ |
| Cerrar sesión | ✅ |
| Agregar transacciones (ingreso/gasto) | ✅ |
| Categorías y subcategorías dinámicas | ✅ |
| Eliminar transacciones | ✅ |
| Balance total en tiempo real | ✅ |
| Stats: Ingresos, Gastos, Ganancia | ✅ |
| Filtros: Hoy, Semana, Mes, Personalizado | ✅ |
| Gráfico pastel por categoría | ✅ |
| Gráfico barras ingresos vs gastos | ✅ |
| Exportar reporte PDF profesional | ✅ |
| PWA instalable (manifest + SW) | ✅ |
| Soporte offline básico | ✅ |
| 100% en español | ✅ |
| UI fintech moderna | ✅ |
| Responsive móvil/escritorio | ✅ |