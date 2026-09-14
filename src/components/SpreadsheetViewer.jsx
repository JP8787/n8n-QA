import React, { useState } from 'react';

export const QA_COLUMNS = [
  {
    col: 'A',
    name: 'Id',
    bddType: 'ID Trazabilidad',
    width: '85px',
    align: 'center',
    role: 'Trazabilidad Jira / TestRail',
    desc: 'Identificador único formal correlativo (CP-0001, CP-0002) generado secuencialmente por el nodo de código en n8n.',
    formatRule: 'Texto en negrita, centrado, ancho fijo 80px.',
    sample: 'CP-0001'
  },
  {
    col: 'B',
    name: 'Funcionalidad / Característica',
    bddType: 'Feature / Módulo',
    width: '180px',
    align: 'left',
    role: 'Alcance Funcional',
    desc: 'Módulo, épica o microservicio bajo prueba. Sirve para nombrar automáticamente la pestaña en Google Sheets y agrupar ejecuciones.',
    formatRule: 'Texto a la izquierda, ancho 180px.',
    sample: 'Autenticación y Seguridad'
  },
  {
    col: 'C',
    name: 'Descripción',
    bddType: 'Objetivo de Negocio',
    width: '240px',
    align: 'left',
    role: 'Propósito de Prueba',
    desc: 'Propósito conciso y directo de la validación. Resume qué regla de negocio o criterio de aceptación se está garantizando.',
    formatRule: 'Ajuste de línea (wrap habilitado), ancho 240px.',
    sample: 'Validar inicio de sesión exitoso con credenciales válidas y redirección al Dashboard.'
  },
  {
    col: 'D',
    name: 'Fecha',
    bddType: 'Timestamp de Ejecución',
    width: '105px',
    align: 'center',
    role: 'Auditoría Temporal',
    desc: 'Fecha de ejecución y generación automática calculada dinámicamente en formato DD/MM/YYYY por el workflow de n8n.',
    formatRule: 'Texto centrado, formato fecha, ancho 100px.',
    sample: '14/09/2026'
  },
  {
    col: 'E',
    name: 'Caso de Prueba',
    bddType: 'Scenario Title',
    width: '230px',
    align: 'left',
    role: 'Escenario Evaluado',
    desc: 'Título descriptivo del escenario evaluado (camino feliz, caso negativo, límite o validación de seguridad).',
    formatRule: 'Texto en negrita, ancho 220px.',
    sample: 'Inicio de sesión con credenciales válidas y redirección al Dashboard'
  },
  {
    col: 'F',
    name: 'Precondiciones',
    bddType: 'Dado (Given)',
    width: '230px',
    align: 'left',
    role: 'Estado Inicial BDD',
    desc: 'Estado previo indispensable del sistema, base de datos y usuario antes de comenzar la interacción.',
    formatRule: 'Ajuste de línea automático, ancho 220px.',
    sample: 'Usuario previamente registrado con correo verificado y estado "Activo" en PostgreSQL.'
  },
  {
    col: 'G',
    name: 'Datos / Acciones de Entrada',
    bddType: 'Cuando (When)',
    width: '280px',
    align: 'left',
    role: 'Pasos de Ejecución BDD',
    desc: 'Secuencia numerada estricta (1, 2, 3...) de acciones de entrada o llamadas a endpoints que el tester o bot ejecuta.',
    formatRule: 'Pasos con saltos de línea y numeración estricta, ancho 280px.',
    sample: '1. Navegar a /login\n2. Ingresar usuario registrado\n3. Ingresar contraseña correcta\n4. Clic en "Ingresar"'
  },
  {
    col: 'H',
    name: 'Resultado Esperado',
    bddType: 'Entonces (Then)',
    width: '270px',
    align: 'left',
    role: 'Validación Esperada BDD',
    desc: 'Comportamiento verificable del sistema: código de respuesta HTTP (ej: 200 OK), cookies emitidas y redirección en UI.',
    formatRule: 'Ajuste de línea automático, ancho 260px.',
    sample: 'HTTP 200 OK. Cookie JWT emitida con flag HttpOnly y redirección automática al Dashboard.'
  },
  {
    col: 'I',
    name: 'Requerimientos de Ambiente',
    bddType: 'Infraestructura',
    width: '190px',
    align: 'left',
    role: 'Entorno Técnico',
    desc: 'Dependencias de infraestructura necesarias para ejecutar la prueba (Staging, Docker, APIs activas, versiones).',
    formatRule: 'Texto regular, ancho 180px.',
    sample: 'Entorno Staging v2.4, PostgreSQL, Auth Gateway'
  },
  {
    col: 'J',
    name: 'Procedimientos Especiales',
    bddType: 'Setup / Cleanup',
    width: '190px',
    align: 'left',
    role: 'Gestión de Datos',
    desc: 'Procedimientos de preparación previa de datos o limpieza post-ejecución (limpiar caché en Redis, seeds de prueba).',
    formatRule: 'Texto regular, ancho 180px.',
    sample: 'Limpieza previa de sesiones activas en Redis para el ID de usuario.'
  },
  {
    col: 'K',
    name: 'Postcondición',
    bddType: 'Estado Final',
    width: '220px',
    align: 'left',
    role: 'Persistencia Final',
    desc: 'Estado final en el que queda el sistema, las tablas de base de datos o colas de eventos tras finalizar la prueba.',
    formatRule: 'Ajuste de línea automático, ancho 200px.',
    sample: 'Sesión persistida en Redis con TTL de 3600 segundos y evento emitido en audit_logs.'
  }
];

export const SAMPLE_QA_ROWS = [
  {
    id: 'CP-0001',
    module: 'Autenticación y Seguridad',
    desc: 'Validar acceso exitoso con credenciales legítimas y redirección.',
    date: '14/09/2026',
    scenario: 'Inicio de sesión con credenciales válidas y redirección al Dashboard',
    given: 'Usuario registrado previamente con correo verificado y estado "Activo" en PostgreSQL.',
    when: '1. Navegar a /login\n2. Ingresar correo registrado (usuario@empresa.com)\n3. Ingresar clave correcta\n4. Clic en "Ingresar"',
    then: 'HTTP 200 OK. Cookie JWT emitida con flag HttpOnly y redirección automática al Dashboard principal.',
    env: 'Staging v2.4, PostgreSQL, Auth Gateway',
    special: 'Limpieza previa de sesiones activas en Redis para el ID de usuario.',
    post: 'Sesión activa en Redis con TTL de 3600s y registro en audit_logs.'
  },
  {
    id: 'CP-0002',
    module: 'Autenticación y Seguridad',
    desc: 'Validar bloqueo preventivo de cuenta tras 3 intentos fallidos.',
    date: '14/09/2026',
    scenario: 'Bloqueo temporal de cuenta por exceso de intentos fallidos (Fuerza bruta)',
    given: 'Cuenta de usuario existente y activa con 0 intentos fallidos registrados.',
    when: '1. Navegar a /login\n2. Ingresar correo válido\n3. Ingresar contraseña incorrecta 3 veces seguidas',
    then: 'Al 3er intento: HTTP 423 Locked. Alerta en interfaz y despacho de correo al usuario.',
    env: 'Staging v2.4, Servicio SMTP',
    special: 'Reiniciar contador de intentos en Redis antes de iniciar la prueba.',
    post: 'Campo is_locked = true en base de datos con temporizador de desbloqueo en 15 min.'
  },
  {
    id: 'CP-0003',
    module: 'Autenticación y Seguridad',
    desc: 'Validar emisión de token criptográfico para recuperación de contraseña.',
    date: '14/09/2026',
    scenario: 'Recuperación de contraseña con token de 15 minutos de caducidad',
    given: 'Usuario con correo electrónico institucional registrado y accesible.',
    when: '1. Clic en "¿Olvidaste tu contraseña?"\n2. Ingresar email registrado\n3. Clic en "Enviar enlace"',
    then: 'HTTP 200 OK. Correo recibido con enlace único firmado que contiene token de un solo uso válido por 15 min.',
    env: 'Staging v2.4, Worker de Emails',
    special: 'Verificar recepción en buzón de pruebas MailHog.',
    post: 'Token almacenado en Redis con TTL estricto de 900 segundos (15 minutos).'
  }
];

export default function SpreadsheetViewer({
  cases = null,
  uploadedFileName = '',
  moduleName = '',
  isLive = false,
  onResetSample = null,
  selectedColIndex = 0,
  onSelectCol = null,
  compact = false
}) {
  const [internalSelectedCol, setInternalSelectedCol] = useState(0);

  const activeColIndex = onSelectCol ? selectedColIndex : internalSelectedCol;
  const handleColClick = (index) => {
    if (onSelectCol) {
      onSelectCol(index);
    } else {
      setInternalSelectedCol(index);
    }
  };

  // Mapeo seguro de filas
  const displayRows = (cases && cases.length > 0)
    ? cases.map((c, idx) => ({
        id: c.Id || c.id || `CP-${String(idx + 1).padStart(4, '0')}`,
        module: c['Funcionalidad / Característica'] || c.module || c.modulo || moduleName || 'Módulo QA',
        desc: c['Descripción'] || c.desc || c.description || 'Validación de flujo generado automáticamente.',
        date: c['Fecha'] || c.date || new Date().toLocaleDateString('es-ES'),
        scenario: c['Caso de Prueba'] || c.scenario || c.caso || 'Caso de prueba generado por IA',
        given: c['Precondiciones'] || c.given || c.precondicion || 'Precondición definida en el criterio de aceptación.',
        when: c['Datos / Acciones de Entrada'] || c.when || c.acciones || '1. Ejecutar pasos de prueba',
        then: c['Resultado Esperado'] || c.then || c.esperado || 'HTTP 200 OK / Validación exitosa',
        env: c['Requerimientos de Ambiente'] || c.env || c.ambiente || 'Entorno Staging / Producción',
        special: c['Procedimientos Especiales'] || c.special || c.especiales || 'N/A',
        post: c['Postcondición'] || c.post || c.postcondicion || 'N/A'
      }))
    : SAMPLE_QA_ROWS;

  // Lógica infalible de nombre de archivo y módulo:
  // Si el usuario subió un archivo (ej: "casa.docx" o "casa"), NUNCA lo sobreescribimos con otro nombre
  const rawBaseName = uploadedFileName
    ? uploadedFileName.replace(/\.[^/.]+$/, "").trim()
    : '';

  const cleanBaseName = rawBaseName
    ? rawBaseName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
    : '';

  const fileName = cleanBaseName
    ? `Matriz_QA_${cleanBaseName}.xlsx`
    : (isLive 
        ? `Matriz_QA_${(moduleName || 'Generada').replace(/\s+/g, '_')}.xlsx`
        : 'Matriz_QA_Autenticacion_y_Seguridad.xlsx');

  const tabTitle = rawBaseName || moduleName || (isLive ? 'Módulo QA' : 'Autenticación y Seguridad');

  return (
    <div className={`spreadsheet-window ${compact ? 'spreadsheet-compact' : ''}`}>
      {/* Barra Superior de la Hoja de Cálculo: Tema Claro Profesional */}
      <div className="spreadsheet-top-bar">
        <div className="sheet-file-info">
          <div className="sheet-icon-wrap">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#107c41">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
              <path d="M7 7h4v2H7zm0 4h4v2H7zm0 4h4v2H7zm6-8h4v2h-4zm0 4h4v2h-4zm0 4h4v2h-4z"/>
            </svg>
          </div>
          <div className="sheet-name-details">
            <span className="sheet-filename">{fileName}</span>
            <span className="sheet-meta">
              {isLive 
                ? `🟢 ${displayRows.length} Casos Oficiales en Vivo · Archivo: ${uploadedFileName || tabTitle}`
                : 'Esquema Base QA · Google Sheets API v4 · 11 Columnas Oficiales'}
            </span>
          </div>
        </div>

        <div className="sheet-actions-right">
          {onResetSample && isLive && (
            <button 
              type="button" 
              className="btn-sheet-reset-sample"
              onClick={onResetSample}
              title="Volver a los datos de ejemplo"
            >
              Restaurar Ejemplo
            </button>
          )}
          <span className={`sheet-status-pill ${isLive ? 'live-pill' : ''}`}>
            <span className="sheet-status-dot"></span>
            {isLive ? 'Visualizador en Vivo' : 'Esquema Corporativo'}
          </span>
        </div>
      </div>

      {/* Barra de Pestañas (Tabs): Refleja fielmente el archivo o módulo activo */}
      <div className="sheet-tabs-bar">
        <div className="sheet-tab active-tab">
          <span className="tab-indicator"></span>
          <span className="tab-name">
            {tabTitle} ({displayRows.length} Casos Oficiales)
          </span>
        </div>
      </div>

      {/* Contenedor de la Tabla con Cuadrícula y Scroll Horizontal */}
      <div className="spreadsheet-grid-viewport">
        <table className="spreadsheet-qa-table">
          <thead>
            {/* Fila 1: Letras de Columna (A a la K) estilo Excel/Sheets */}
            <tr className="excel-col-letter-row">
              <th className="excel-corner-cell">#</th>
              {QA_COLUMNS.map((c, i) => (
                <th 
                  key={i} 
                  className={`excel-letter-header ${activeColIndex === i ? 'highlighted' : ''}`}
                  onClick={() => handleColClick(i)}
                  title={`Haz clic para inspeccionar la Columna ${c.col}`}
                >
                  <span className="excel-letter">{c.col}</span>
                </th>
              ))}
            </tr>

            {/* Fila 2: Nombres Corporativos de las 11 Columnas */}
            <tr className="qa-columns-title-row">
              <th className="qa-num-header">Fila</th>
              {QA_COLUMNS.map((c, i) => (
                <th 
                  key={i} 
                  className={`qa-col-header ${activeColIndex === i ? 'highlighted' : ''}`}
                  onClick={() => handleColClick(i)}
                  style={{ minWidth: c.width }}
                >
                  <div className="header-cell-box">
                    <span className="header-col-name">{c.name}</span>
                    <span className={`header-bdd-pill ${c.col === 'F' ? 'given' : c.col === 'G' ? 'when' : c.col === 'H' ? 'then' : 'standard'}`}>
                      {c.bddType}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {displayRows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 1 ? 'zebra-stripe' : ''}>
                <td className="row-number-cell">{idx + 2}</td>

                {/* Col A: ID */}
                <td className="cell-id-fixed">
                  <span className="id-badge-mono">{row.id}</span>
                </td>

                {/* Col B: Módulo */}
                <td className="cell-module">{row.module}</td>

                {/* Col C: Descripción */}
                <td className="cell-desc">{row.desc}</td>

                {/* Col D: Fecha */}
                <td className="cell-center-date">{row.date}</td>

                {/* Col E: Caso de Prueba */}
                <td className="cell-scenario">
                  <strong>{row.scenario}</strong>
                </td>

                {/* Col F: Precondición (Dado) */}
                <td className="cell-bdd given-cell">
                  <span className="bdd-lead-tag given">Dado:</span> {row.given}
                </td>

                {/* Col G: Acciones de Entrada (Cuando) */}
                <td className="cell-bdd when-cell">
                  <span className="bdd-lead-tag when">Cuando:</span>
                  <pre className="steps-pre">{row.when}</pre>
                </td>

                {/* Col H: Resultado Esperado (Entonces) */}
                <td className="cell-bdd then-cell">
                  <span className="bdd-lead-tag then">Entonces:</span> {row.then}
                </td>

                {/* Col I: Ambiente */}
                <td className="cell-env">{row.env}</td>

                {/* Col J: Procedimientos Especiales */}
                <td className="cell-special">{row.special}</td>

                {/* Col K: Postcondición */}
                <td className="cell-post">{row.post}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Barra inferior de navegación de columnas */}
      <div className="spreadsheet-bottom-bar">
        <div className="bottom-scroll-info">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Desplaza horizontalmente para ver las 11 columnas completas (A a la K)</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        <div className="bottom-sheets-api-tag">
          Auto-ajuste de celdas & BDD visualizador en vivo
        </div>
      </div>
    </div>
  );
}
