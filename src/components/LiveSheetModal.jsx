import React, { useState, useEffect } from 'react';

export default function LiveSheetModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('auth');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sheet-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-modal-header">
          <div className="sheet-modal-title">
            <span className="sheet-icon">📊</span>
            <div>
              <h3>Matriz QA Corporativa (Google Sheets en Vivo)</h3>
              <p>Generado por n8n con Gemini 1.5/2.0 y formateado vía Sheets API v4 batchUpdate</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="sheet-status-pill">● Sincronizado</span>
            <button 
              type="button" 
              className="modal-close-btn" 
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Google Sheets UI Top Toolbar */}
        <div className="gs-toolbar">
          <div className="gs-toolbar-item">Archivo</div>
          <div className="gs-toolbar-item">Editar</div>
          <div className="gs-toolbar-item">Ver</div>
          <div className="gs-toolbar-item">Insertar</div>
          <div className="gs-toolbar-item">Formato (Pastel Dinámico)</div>
          <div className="gs-toolbar-item">Datos</div>
          <div className="gs-toolbar-item">Herramientas</div>
        </div>

        <div className="sheets-formula-bar">
          <span className="fx-label">fx</span>
          <span className="formula-text">=GENERAR_MATRIZ_N8N("Requerimientos_Auth", "Pastel_Peach_Theme")</span>
        </div>

        {/* Table View with All 11 Columns */}
        <div className="sheet-modal-body">
          <table className="sheet-table modal-view">
            <thead>
              <tr className="sheet-pastel-header">
                <th className="row-num-th">#</th>
                <th>A: Id</th>
                <th>B: Funcionalidad</th>
                <th>C: Descripción</th>
                <th>D: Fecha</th>
                <th>E: Caso de Prueba</th>
                <th>F: Precondiciones</th>
                <th>G: Datos / Pasos</th>
                <th>H: Resultado Esperado</th>
                <th>I: Ambiente</th>
                <th>J: Procedimientos</th>
                <th>K: Postcondición</th>
              </tr>
            </thead>
            <tbody>
              <tr className="sheet-row">
                <td className="row-num-td">2</td>
                <td className="cell-id">CP-0001</td>
                <td>Autenticación y Seguridad</td>
                <td>Validar login exitoso con credenciales válidas</td>
                <td>14/09/2026</td>
                <td><strong>Inicio de sesión exitoso y redirección al Dashboard</strong></td>
                <td>Usuario registrado con estado 'Activo' en PostgreSQL.</td>
                <td>1. Navegar a /login<br/>2. Ingresar email registrado<br/>3. Ingresar contraseña válida<br/>4. Clic en 'Ingresar'</td>
                <td>HTTP 200, JWT persistido en cookie HttpOnly y redirección a /dashboard.</td>
                <td>Staging v2.4, API Gateway, Auth Microservice</td>
                <td>Ninguno</td>
                <td>Sesión activa en Redis con TTL de 3600s. Registro en audit_logs.</td>
              </tr>
              <tr className="sheet-row zebra">
                <td className="row-num-td">3</td>
                <td className="cell-id">CP-0002</td>
                <td>Autenticación y Seguridad</td>
                <td>Validar bloqueo de cuenta tras 3 intentos fallidos</td>
                <td>14/09/2026</td>
                <td><strong>Bloqueo preventivo por intentos erróneos</strong></td>
                <td>Cuenta registrada con 0 intentos fallidos previos.</td>
                <td>1. Ir a /login<br/>2. Ingresar contraseña incorrecta 3 veces consecutivas</td>
                <td>HTTP 423 Locked, mensaje informativo en UI y despacho de alerta vía correo.</td>
                <td>Staging v2.4, Servicio SMTP</td>
                <td>Limpiar contador Redis antes de prueba</td>
                <td>Cuenta bloqueada temporalmente por 15 minutos en DB.</td>
              </tr>
              <tr className="sheet-row">
                <td className="row-num-td">4</td>
                <td className="cell-id">CP-0003</td>
                <td>Autenticación y Seguridad</td>
                <td>Validar emisión y vigencia de token de recuperación</td>
                <td>14/09/2026</td>
                <td><strong>Recuperación de contraseña con token de 15 min</strong></td>
                <td>Usuario con email institucional registrado y accesible.</td>
                <td>1. Clic en 'Olvidé contraseña'<br/>2. Ingresar email registrado<br/>3. Clic en 'Enviar enlace'</td>
                <td>HTTP 200, correo recibido con token firmado criptográficamente válido por 15 min.</td>
                <td>Staging v2.4, Worker de Emails</td>
                <td>Verificar buzón MailHog de pruebas</td>
                <td>Token temporal registrado en Redis con TTL de 900s.</td>
              </tr>
              <tr className="sheet-row zebra">
                <td className="row-num-td">5</td>
                <td className="cell-id">CP-0004</td>
                <td>Autenticación y Seguridad</td>
                <td>Validar rechazo de contraseña con menos de 8 caracteres</td>
                <td>14/09/2026</td>
                <td><strong>Validación de complejidad de contraseña en registro</strong></td>
                <td>Formulario de registro abierto sin datos precargados.</td>
                <td>1. Ingresar email válido<br/>2. Ingresar contraseña 'abc12'<br/>3. Clic en Registrar</td>
                <td>Error 422 Unprocessable Entity, resaltado en rojo de campo y tooltip de requisitos.</td>
                <td>Staging v2.4 Frontend React</td>
                <td>Ninguno</td>
                <td>No se inserta registro en DB. Formulario mantiene datos no sensibles.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabs Bar */}
        <div className="sheets-tabs-bar modal-tabs">
          <div 
            className={`sheets-tab ${activeTab === 'auth' ? 'active' : ''}`}
            onClick={() => setActiveTab('auth')}
          >
            <span className="tab-color-mark" style={{ background: '#f8d7da' }}></span>
            <span>Autenticación_140926</span>
          </div>
          <div 
            className={`sheets-tab ${activeTab === 'checkout' ? 'active' : ''}`}
            onClick={() => setActiveTab('checkout')}
          >
            <span className="tab-color-mark" style={{ background: '#d1e7dd' }}></span>
            <span>Checkout_Pagos</span>
          </div>
          <div 
            className={`sheets-tab ${activeTab === 'readings' ? 'active' : ''}`}
            onClick={() => setActiveTab('readings')}
          >
            <span className="tab-color-mark" style={{ background: '#cff4fc' }}></span>
            <span>Toma_Lecturas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
