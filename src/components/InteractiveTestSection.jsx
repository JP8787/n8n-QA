import React, { useState } from 'react';

export default function InteractiveTestSection({ onOpenSheet }) {
  const sampleModule = 'Autenticación y Seguridad';
  const sampleCriteria = `1. Permitir inicio de sesión con correo y contraseña válidos redirigiendo al dashboard.
2. Bloquear la cuenta tras 3 intentos fallidos con contraseña incorrecta y notificar por correo.
3. Enlace de recuperación de contraseña que despacha un token con validez de 15 minutos.`;

  const [moduleInput, setModuleInput] = useState('');
  const [criteriaInput, setCriteriaInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0); // 0: idle, 1..4: steps, 5: done
  const [activeTab, setActiveTab] = useState('auth');

  const handleLoadExample = () => {
    setModuleInput(sampleModule);
    setCriteriaInput(sampleCriteria);
  };

  const handleRunProcess = () => {
    if (!criteriaInput && !moduleInput) {
      handleLoadExample();
    }
    setIsProcessing(true);
    setProcessStep(1);

    const steps = [
      { delay: 700, step: 2 },
      { delay: 1500, step: 3 },
      { delay: 2300, step: 4 },
      { delay: 3100, step: 5 }
    ];

    steps.forEach(({ delay, step }) => {
      setTimeout(() => {
        setProcessStep(step);
        if (step === 5) {
          setIsProcessing(false);
        }
      }, delay);
    });
  };

  return (
    <section className="interactive-test-section" id="como-probarlo">
      <div className="container">
        <div className="section-header-center">
          <span className="section-kicker">Guía Interactiva</span>
          <h2 className="section-title">¿Cómo Probar la Automatización?</h2>
          <p className="section-subtitle">
            Sigue estos 3 sencillos pasos para transformar criterios de aceptación en una hoja corporativa de Google Sheets en tiempo real.
          </p>
        </div>

        {/* 3 Pasos Cards */}
        <div className="steps-cards-grid">
          {/* Paso 1 */}
          <div className="step-card">
            <div className="step-number-badge">Paso 1</div>
            <h3 className="step-title">Ingresa los Requerimientos</h3>
            <p className="step-desc">
              Pega los criterios de aceptación en el formulario de prueba o carga el ejemplo predeterminado de autenticación.
            </p>
            <div className="step-tag">Criterios de Aceptación</div>
          </div>

          {/* Paso 2 */}
          <div className="step-card">
            <div className="step-number-badge">Paso 2</div>
            <h3 className="step-title">Procesamiento Inteligente</h3>
            <p className="step-desc">
              El motor analiza la lógica de negocio, descompone casos positivos, negativos y de borde, y orquesta la inserción en Google Sheets.
            </p>
            <div className="step-tag">Gemini + n8n Engine</div>
          </div>

          {/* Paso 3 */}
          <div className="step-card">
            <div className="step-number-badge">Paso 3</div>
            <h3 className="step-title">Revisa el Resultado en Tiempo Real</h3>
            <p className="step-desc">
              Abre la hoja de cálculo generada: pestaña nueva con timestamp, autoajuste de ancho y paleta pastel dinámica.
            </p>
            <div className="step-tag">Google Sheets batchUpdate</div>
          </div>
        </div>

        {/* Formulario y Consola Interactiva */}
        <div className="interactive-tester-box">
          <div className="tester-form-panel">
            <div className="tester-panel-header">
              <h4>Consola de Prueba de Requerimientos</h4>
              <button 
                type="button" 
                className="btn-link-action"
                onClick={handleLoadExample}
              >
                📋 Cargar Ejemplo Rápido
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Módulo Funcional / Feature</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: Autenticación y Seguridad"
                value={moduleInput}
                onChange={(e) => setModuleInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Criterios de Aceptación o Historias de Usuario</label>
              <textarea 
                className="form-input form-textarea" 
                rows="6"
                placeholder="Pega aquí los criterios de aceptación (Dado/Cuando/Entonces o viñetas)..."
                value={criteriaInput}
                onChange={(e) => setCriteriaInput(e.target.value)}
              ></textarea>
            </div>

            <button 
              type="button" 
              className="pill-button pill-button-primary full-width"
              onClick={handleRunProcess}
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando en n8n...' : '⚡ Generar Matriz de Pruebas en Google Sheets'}
            </button>

            {/* Estado del Procesamiento */}
            {processStep > 0 && (
              <div className="processing-status-box">
                <div className="status-timeline">
                  <div className={`status-node ${processStep >= 1 ? 'active' : ''}`}>
                    <span className="dot"></span>
                    <span>1. Ingesta n8n</span>
                  </div>
                  <div className={`status-node ${processStep >= 2 ? 'active' : ''}`}>
                    <span className="dot"></span>
                    <span>2. Inferencia Gemini</span>
                  </div>
                  <div className={`status-node ${processStep >= 3 ? 'active' : ''}`}>
                    <span className="dot"></span>
                    <span>3. Parser 11 Cols</span>
                  </div>
                  <div className={`status-node ${processStep >= 4 ? 'active' : ''}`}>
                    <span className="dot"></span>
                    <span>4. batchUpdate Sheet</span>
                  </div>
                </div>
                {processStep === 5 && (
                  <div className="success-banner">
                    <span>✓ Matriz generada con éxito en Google Sheets con formato pastel y zebra striping.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vista Previa de la Hoja de Google Sheets Generada */}
          <div className="sheets-preview-panel">
            <div className="sheets-chrome-bar">
              <div className="sheets-title-row">
                <div className="sheets-doc-icon">📊</div>
                <div>
                  <div className="sheets-doc-name">Matriz_QA_Corporativa_2026.xlsx</div>
                  <div className="sheets-doc-meta">Última edición hace unos segundos (n8n Service Account)</div>
                </div>
              </div>
              <button 
                type="button" 
                className="pill-button pill-button-secondary"
                style={{ fontSize: '11.5px', padding: '5px 12px' }}
                onClick={onOpenSheet}
              >
                Pantalla Completa ↗
              </button>
            </div>

            <div className="sheets-formula-bar">
              <span className="fx-label">fx</span>
              <span className="formula-text">=ESTANDAR_QA_BDD(A2:K4, "Paleta_Pastel_Auto")</span>
            </div>

            {/* Spreadsheet Table View */}
            <div className="sheet-grid-container">
              <table className="sheet-table">
                <thead>
                  <tr className="sheet-pastel-header">
                    <th className="row-num-th"></th>
                    <th>A: Id</th>
                    <th>B: Módulo</th>
                    <th>C: Descripción</th>
                    <th>D: Fecha</th>
                    <th>E: Caso de Prueba</th>
                    <th>F: Precondiciones</th>
                    <th>G: Pasos (Entrada)</th>
                    <th>H: Resultado Esperado</th>
                    <th>I: Ambiente</th>
                    <th>J: Proc. Especiales</th>
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
                    <td><strong>Inicio de sesión exitoso y redirección</strong></td>
                    <td>Usuario registrado con estado 'Activo' en base de datos.</td>
                    <td>1. Ir a /login<br/>2. Ingresar usuario válido<br/>3. Ingresar clave correcta<br/>4. Clic en 'Ingresar'</td>
                    <td>HTTP 200, JWT emitido en cookie y redirección al Dashboard.</td>
                    <td>Staging v2.4, PostgreSQL, Auth Gateway</td>
                    <td>Ninguno</td>
                    <td>Sesión activa en Redis con TTL de 3600s.</td>
                  </tr>
                  <tr className="sheet-row zebra">
                    <td className="row-num-td">3</td>
                    <td className="cell-id">CP-0002</td>
                    <td>Autenticación y Seguridad</td>
                    <td>Validar bloqueo de cuenta tras 3 intentos fallidos</td>
                    <td>14/09/2026</td>
                    <td><strong>Bloqueo preventivo por fuerza bruta</strong></td>
                    <td>Cuenta existente con 0 fallos registrados.</td>
                    <td>1. Ir a /login<br/>2. Ingresar contraseña errónea 3 veces seguidas</td>
                    <td>HTTP 423 Locked, bloqueo temporal de cuenta y correo de advertencia.</td>
                    <td>Staging v2.4, Servicio SMTP</td>
                    <td>Limpiar contador Redis antes de test</td>
                    <td>Cuenta bloqueada temporalmente por 15 min.</td>
                  </tr>
                  <tr className="sheet-row">
                    <td className="row-num-td">4</td>
                    <td className="cell-id">CP-0003</td>
                    <td>Autenticación y Seguridad</td>
                    <td>Validar generación de token de recuperación</td>
                    <td>14/09/2026</td>
                    <td><strong>Recuperación de contraseña vía token</strong></td>
                    <td>Usuario registrado con email institucional accesible.</td>
                    <td>1. Clic en 'Olvidé contraseña'<br/>2. Ingresar email registrado<br/>3. Enviar</td>
                    <td>HTTP 200, correo recibido con enlace y token con vigencia de 15 min.</td>
                    <td>Staging v2.4, Servicio SMTP</td>
                    <td>Verificar recepción en buzón MailHog</td>
                    <td>Token temporal almacenado con expiración 15m.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Sheets Bottom Tab Bar */}
            <div className="sheets-tabs-bar">
              <div className="sheets-tab active">
                <span className="tab-color-mark" style={{ background: '#f8d7da' }}></span>
                <span>Autenticacion_140926</span>
              </div>
              <div className="sheets-tab">
                <span className="tab-color-mark" style={{ background: '#d1e7dd' }}></span>
                <span>Checkout_120926</span>
              </div>
              <div className="sheets-tab add-tab">+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
