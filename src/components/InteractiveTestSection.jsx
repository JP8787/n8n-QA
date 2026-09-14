import React, { useState, useRef } from 'react';

// URL oficial del Webhook de n8n configurada por el usuario
const WEBHOOK_URL = "http://localhost:5678/webhook/generar-qa";

export default function InteractiveTestSection() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [n8nResult, setN8nResult] = useState(null);
  const [webhookError, setWebhookError] = useState(null);
  const fileInputRef = useRef(null);

  // Carga de archivo de requerimientos de prueba
  const handleLoadSampleFile = () => {
    const sampleText = `MÓDULO: Autenticación y Seguridad
CRITERIOS DE ACEPTACIÓN:
1. Permitir inicio de sesión con correo y contraseña válidos redirigiendo al dashboard principal.
2. Bloquear la cuenta tras 3 intentos fallidos con contraseña errónea y notificar por correo al usuario.
3. Enlace de recuperación de contraseña que despacha un token criptográfico con validez estricta de 15 minutos.`;

    const sampleBlob = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
    const sampleFile = new File([sampleBlob], 'Requerimientos_Autenticacion_QA.txt', { type: 'text/plain' });

    setFile({
      name: 'Requerimientos_Autenticacion_QA.txt',
      size: '1.2 KB',
      rawFile: sampleFile,
      isSample: true
    });
    setWebhookError(null);
    setN8nResult(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile({
        name: dropped.name,
        size: `${(dropped.size / 1024).toFixed(1)} KB`,
        rawFile: dropped,
        isSample: false
      });
      setWebhookError(null);
      setN8nResult(null);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile({
        name: selected.name,
        size: `${(selected.size / 1024).toFixed(1)} KB`,
        rawFile: selected,
        isSample: false
      });
      setWebhookError(null);
      setN8nResult(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setN8nResult(null);
    setWebhookError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // DISPARO REAL AL WEBHOOK DE N8N
  const handleTriggerN8n = async () => {
    let currentFile = file;
    if (!currentFile || !currentFile.rawFile) {
      handleLoadSampleFile();
      const defaultBlob = new Blob([`MÓDULO: Autenticación y Seguridad\n1. Login válido con redirección\n2. Bloqueo 3 intentos`], { type: 'text/plain;charset=utf-8' });
      currentFile = {
        name: 'Requerimientos_Autenticacion_QA.txt',
        size: '1.2 KB',
        rawFile: new File([defaultBlob], 'Requerimientos_Autenticacion_QA.txt', { type: 'text/plain' }),
        isSample: true
      };
    }

    setIsSending(true);
    setWebhookError(null);
    setExecutionLogs([
      `[${new Date().toLocaleTimeString()}] Conectando con n8n en: ${WEBHOOK_URL}...`,
      `[${new Date().toLocaleTimeString()}] Empaquetando archivo "${currentFile.name}" en FormData con clave 'file'...`
    ]);

    try {
      // El envío con archivo usando FormData NO debe llevar 'Content-Type' manual,
      // el navegador se encarga de ponerlo con su boundary automáticamente.
      const formData = new FormData();
      formData.append('file', currentFile.rawFile); // Coincide con 'Field Name for Binary Data' en n8n
      formData.append('filename', currentFile.name);
      formData.append('modulo', 'Autenticación y Seguridad');
      formData.append('timestamp', new Date().toISOString());

      // Petición POST directa a n8n sin headers de Content-Type
      const respuesta = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData
        // ¡OJO! No ponemos headers: { 'Content-Type': ... }, el navegador asigna el boundary
      });

      if (!respuesta.ok) {
        throw new Error(`El webhook de n8n respondió con código HTTP ${respuesta.status} (${respuesta.statusText})`);
      }

      setExecutionLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Respuesta 200 OK recibida desde n8n.`
      ]);

      const contentType = respuesta.headers.get('content-type') || '';

      // Si n8n devuelve el archivo binario Excel generado por el workflow
      if (contentType.includes('spreadsheet') || contentType.includes('excel') || contentType.includes('octet-stream')) {
        const blob = await respuesta.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `Matriz_QA_${currentFile.name.replace(/\.[^/.]+$/, "")}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setN8nResult({
          type: 'excel',
          message: 'Archivo Excel generado por tu automatización en n8n descargado exitosamente.',
          url: downloadUrl
        });
      } else {
        // Si n8n devuelve un JSON con la URL de Google Sheets o el resultado
        const data = await respuesta.json();
        console.log('Resultado n8n:', data);

        setN8nResult({
          type: 'json',
          sheetUrl: data.sheetUrl || data.url || null,
          data: data
        });
      }
    } catch (err) {
      console.warn('Error al contactar webhook de n8n:', err);
      setWebhookError({
        message: err.message || 'No se pudo contactar con el webhook de n8n en localhost:5678.',
        url: WEBHOOK_URL
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="interactive-test-section" id="como-probarlo">
      <div className="container">
        <div className="section-header-center">
          <span className="section-kicker">Ejecución en Vivo con n8n</span>
          <h2 className="section-title">Probar Automatización con tu Webhook de n8n</h2>
          <p className="section-subtitle">
            El frontend despacha el archivo de requerimientos vía HTTP POST directamente a tu Webhook de n8n, donde tu pipeline procesa la IA y genera la hoja en Google Sheets.
          </p>
        </div>

        {/* Caja de Interacción Principal */}
        <div className="interactive-tester-box">
          {/* Panel Izquierdo: Carga de Archivo */}
          <div className="tester-form-panel">
            <div className="tester-panel-header">
              <div className="panel-step-badge">Paso 1</div>
              <h4 className="panel-step-title">Carga tu Archivo de Requerimientos</h4>
              <button 
                type="button" 
                className="btn-link-load-sample"
                onClick={handleLoadSampleFile}
              >
                Cargar Archivo de Prueba
              </button>
            </div>

            {/* Zona Drag & Drop */}
            <div 
              className={`file-dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current && fileInputRef.current.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".docx,.pdf,.txt,.md,.json,.csv"
                onChange={handleFileInputChange}
              />

              {!file ? (
                <div className="dropzone-empty-state">
                  <div className="dropzone-icon-svg">
                    <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#ea4b71" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <polyline points="9 15 12 12 15 15"></polyline>
                    </svg>
                  </div>
                  <p className="dropzone-main-text">
                    <strong>Arrastra tu archivo aquí</strong> o haz clic para seleccionarlo
                  </p>
                  <p className="dropzone-sub-text">
                    Formatos soportados: .DOCX, .PDF, .TXT, .MD, .JSON
                  </p>
                </div>
              ) : (
                <div className="dropzone-file-selected" onClick={(e) => e.stopPropagation()}>
                  <div className="selected-file-badge-tech">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div className="selected-file-info">
                    <div className="selected-file-name">{file.name}</div>
                    <div className="selected-file-meta">
                      <span>{file.size}</span>
                      <span className="file-pill-tag">{file.isSample ? 'Ejemplo Precargado' : 'Archivo Local'}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-remove-file-round"
                    onClick={handleRemoveFile}
                    title="Quitar archivo"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Botón de Disparo hacia n8n */}
            <div style={{ marginTop: '20px' }}>
              <button 
                type="button" 
                className="btn-trigger-n8n"
                onClick={handleTriggerN8n}
                disabled={isSending}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <span>{isSending ? 'Enviando petición a n8n...' : 'Disparar Automatización en n8n (HTTP POST)'}</span>
              </button>
            </div>
          </div>

          {/* Panel Derecho: Estado de Ejecución de n8n */}
          <div className="tester-status-panel">
            <div className="status-panel-header">
              <div className="n8n-status-title">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#ea4b71">
                  <circle cx="6" cy="12" r="3.5" fill="#ea4b71" />
                  <circle cx="18" cy="12" r="3.5" fill="#ea4b71" />
                  <path d="M9.5 12h5" stroke="#ea4b71" strokeWidth="2.5" />
                </svg>
                <span>Pipeline de Ejecución en n8n</span>
              </div>
              <span className={`status-state-pill ${isSending ? 'running' : n8nResult ? 'completed' : 'idle'}`}>
                {isSending ? 'Ejecutando...' : n8nResult ? 'Completado' : 'Esperando Disparo'}
              </span>
            </div>

            <div className="status-panel-body">
              {/* Si hubo error al contactar el webhook */}
              {webhookError ? (
                <div className="n8n-error-box">
                  <div className="error-badge-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <strong>No se pudo conectar con tu Webhook de n8n</strong>
                  </div>
                  <p className="error-text">
                    La URL <code>{webhookError.url}</code> no respondió.
                  </p>
                  <div className="error-steps">
                    <strong>Pasos para verificar tu flujo en n8n:</strong>
                    <ol>
                      <li>Asegúrate de que n8n esté corriendo en <code>http://localhost:5678</code>.</li>
                      <li>Verifica que el nodo <strong>Webhook</strong> tenga la ruta <code>generar-qa</code> y método <strong>POST</strong>.</li>
                      <li>Asegúrate de que el workflow esté <strong>Activo</strong> (Active) o en modo <em>Listen for test event</em>.</li>
                    </ol>
                  </div>
                  <button 
                    type="button" 
                    className="btn-retry-conn"
                    onClick={handleTriggerN8n}
                  >
                    Reintentar Conexión
                  </button>
                </div>
              ) : n8nResult ? (
                /* Éxito desde n8n */
                <div className="n8n-success-box">
                  <div className="success-header">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Flujo Procesado Exitosamente por n8n</span>
                  </div>

                  <p className="success-desc">
                    Tu automatización en n8n generó la matriz de pruebas con el estándar de 11 columnas.
                  </p>

                  {n8nResult.sheetUrl && (
                    <a 
                      href={n8nResult.sheetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-open-google-sheet"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      <span>Abrir Hoja en Google Sheets</span>
                    </a>
                  )}

                  <div className="terminal-json-output">
                    <div className="terminal-header">Respuesta de n8n</div>
                    <pre>{JSON.stringify(n8nResult.data || { status: 'OK', message: 'Matriz creada por n8n' }, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                /* Estado Inicial / Espera */
                <div className="n8n-standby-view">
                  <div className="standby-svg-icon">
                    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#ea4b71" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h4 className="standby-title">Listo para recibir el archivo</h4>
                  <p className="standby-desc">
                    Al pulsar <strong>"Disparar Automatización en n8n"</strong>, el archivo viaja a tu webhook local (<code>localhost:5678</code>). Tu flujo ejecutará el modelo de lenguaje (Gemini), estructurará las 11 columnas y creará la hoja en Google Sheets.
                  </p>

                  <div className="standby-pipeline-nodes">
                    <div className="standby-step">
                      <span className="step-num">1</span>
                      <span className="step-text">Webhook recibe FormData con clave 'file'</span>
                    </div>
                    <div className="standby-step">
                      <span className="step-num">2</span>
                      <span className="step-text">Gemini infiere casos BDD</span>
                    </div>
                    <div className="standby-step">
                      <span className="step-num">3</span>
                      <span className="step-text">Google Sheets API batchUpdate</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Registro de Petición HTTP */}
              {executionLogs.length > 0 && (
                <div className="http-console-box">
                  <div className="console-bar">
                    <span className="console-dot red"></span>
                    <span className="console-dot yellow"></span>
                    <span className="console-dot green"></span>
                    <span className="console-title">Log de Red HTTP POST</span>
                  </div>
                  <div className="console-lines">
                    {executionLogs.map((log, i) => (
                      <div key={i} className="log-row">{log}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
