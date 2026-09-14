import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { exportCasesToExcel, exportCasesToCsv } from '../utils/exportExcel';

// Configuración obligatoria para que el lector de PDF funcione en el navegador
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// URL oficial del Webhook de n8n configurada por el usuario
const WEBHOOK_URL = "http://localhost:5678/webhook/generar-qa";

// Función extractora: detecta la extensión del archivo y aplica la herramienta correcta (.docx, .pdf, .xlsx, .txt, .csv)
const extraerTextoDelArchivo = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();

  // 1. Si es un archivo de texto plano o CSV nativo
  if (extension === 'txt' || extension === 'csv' || extension === 'md' || extension === 'json') {
    return await file.text();
  }

  // 2. Si es un Excel (.xlsx o .xls)
  if (extension === 'xlsx' || extension === 'xls') {
    const arrayBuffer = await file.arrayBuffer();
    // Leemos el libro de Excel en memoria
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let textoCompleto = '';
    
    // Recorremos todas las hojas (pestañas) que tenga el Excel
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      // Convertimos cada hoja a texto (CSV) para que la IA lo entienda fácil
      textoCompleto += XLSX.utils.sheet_to_csv(worksheet) + '\n\n';
    });
    
    return textoCompleto;
  }

  // 3. Si es un archivo de Word (.docx)
  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  // 4. Si es un PDF
  if (extension === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let textoCompleto = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textoPagina = textContent.items.map(item => item.str).join(' ');
      textoCompleto += textoPagina + '\n';
    }
    return textoCompleto;
  }

  throw new Error("Formato de archivo no soportado. Sube un Excel, PDF, DOCX, TXT o CSV.");
};

export default function InteractiveTestSection({ onCasesGenerated, onScrollToMatrix }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [n8nResult, setN8nResult] = useState(null);
  const [webhookError, setWebhookError] = useState(null);
  const [showJson, setShowJson] = useState(false);
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

  // DISPARO REAL AL WEBHOOK DE N8N CON FILEREADER Y BASE64 JSON
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
      `[${new Date().toLocaleTimeString()}] Extrayendo texto de "${currentFile.name}" (Word, PDF, Excel, TXT, CSV)...`,
      `[${new Date().toLocaleTimeString()}] Conectando con n8n en: ${WEBHOOK_URL}...`
    ]);

    let textoExtraido = '';
    try {
      textoExtraido = await extraerTextoDelArchivo(currentFile.rawFile);
      setExecutionLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Contenido de texto extraído exitosamente (${textoExtraido.length} caracteres).`
      ]);
    } catch (extractErr) {
      console.warn("Aviso al extraer texto plano:", extractErr);
      setExecutionLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Aviso: se procesará archivo mediante Base64.`
      ]);
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      // Extraemos solo el código Base64 del archivo
      const base64Data = event.target.result.split(',')[1];
      const mimeType = currentFile.rawFile.type || 'text/plain';

      // Deducir nombre de módulo del archivo para no enviar "Autenticación" fijo cuando se sube otro archivo
      const fileBaseTitle = (currentFile && currentFile.name && !currentFile.isSample)
        ? currentFile.name
            .replace(/\.[^/.]+$/, "")
            .replace(/requerimientos/gi, "")
            .replace(/qa/gi, "")
            .replace(/^[_\s-]+|[_\s-]+$/g, "")
            .replace(/_/g, " ")
            .trim() || 'Módulo QA'
        : 'Autenticación y Seguridad';

      // Armamos un JSON limpio con los datos y el texto extraído
      const payload = {
        filename: currentFile.name,
        modulo: fileBaseTitle,
        module: fileBaseTitle,
        mimeType: mimeType,
        fileData: base64Data, // Archivo convertido a Base64
        texto: textoExtraido, // Texto limpio extraído de Word, PDF, Excel, TXT o CSV
        contenido: textoExtraido,
        content: textoExtraido
      };

      try {
        const respuesta = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Cambiamos a JSON puro
          },
          body: JSON.stringify(payload)
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
            message: 'Archivo Excel binario descargado exitosamente.',
            url: downloadUrl,
            raw: { status: 'success', file: 'binary_xlsx' }
          });
        } else {
          // Si n8n devuelve un JSON con casos estructurados o URL de Sheets
          const data = await respuesta.json();
          console.log("Respuesta n8n:", data);

          // Extraemos los casos generados (soporta data.casos, data o anidados)
          const cases = Array.isArray(data.casos)
            ? data.casos
            : (Array.isArray(data)
                ? data
                : (data.data?.casos || data.casos_de_prueba || null));

          // Detección inteligente del módulo real:
          // 1. Mirar si el primer caso generado trae su propia columna "Funcionalidad / Característica"
          let detectedModule = '';
          if (cases && cases.length > 0) {
            const firstCase = cases[0];
            const feat = firstCase['Funcionalidad / Característica'] || firstCase.module || firstCase.modulo || '';
            if (feat) {
              detectedModule = feat.includes(' - ') ? feat.split(' - ')[0].trim() : feat.trim();
            }
          }

          // 2. Si no, mirar si data.modulo vino de n8n y no es el default estático
          if (!detectedModule && data.modulo && data.modulo !== 'Autenticación y Seguridad') {
            detectedModule = data.modulo;
          }

          const finalModule = detectedModule || fileBaseTitle || data.modulo || 'Módulo QA';

          // Sincronizamos con la tabla de 11 columnas de la sección 4
          if (cases && cases.length > 0 && onCasesGenerated) {
            onCasesGenerated(cases, finalModule);
          }

          setN8nResult({
            type: cases ? 'cases' : 'json',
            cases: cases,
            module: finalModule,
            sheetUrl: data.sheetUrl || data.url || null,
            raw: data
          });

          setExecutionLogs(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ${cases ? `${cases.length} casos extraídos (Módulo: ${finalModule}) y sincronizados con la Matriz.` : 'Datos procesados correctamente.'}`
          ]);
        }
      } catch (err) {
        console.error("Error:", err);
        setWebhookError({
          message: err.message || 'No se pudo contactar con el webhook de n8n en localhost:5678.',
          url: WEBHOOK_URL
        });
      } finally {
        setIsSending(false);
      }
    };

    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
      setWebhookError({
        message: 'Error al leer el archivo local antes del envío.',
        url: WEBHOOK_URL
      });
      setIsSending(false);
    };

    // Disparamos la lectura del archivo
    reader.readAsDataURL(currentFile.rawFile);
  };

  // Descarga del Excel generado
  const handleDownloadExcel = () => {
    if (!n8nResult || !n8nResult.cases) return;
    const cleanMod = (n8nResult.module || 'Autenticacion')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');
    exportCasesToExcel(n8nResult.cases, `Matriz_QA_${cleanMod || 'Corporativa'}.xlsx`);
  };

  // Descarga del CSV
  const handleDownloadCsv = () => {
    if (!n8nResult || !n8nResult.cases) return;
    const cleanMod = (n8nResult.module || 'Autenticacion')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');
    exportCasesToCsv(n8nResult.cases, `Matriz_QA_${cleanMod || 'Corporativa'}.csv`);
  };

  return (
    <section className="interactive-test-section" id="como-probarlo">
      <div className="container">
        <div className="section-header-center">
          <span className="section-kicker">Ejecución en Vivo con n8n</span>
          <h2 className="section-title">Probar Automatización con tu Webhook de n8n</h2>
          <p className="section-subtitle">
            El frontend convierte el archivo a Base64 y lo despacha como JSON seguro a tu webhook. Tu workflow en n8n procesa la IA, genera los casos de prueba y se visualizan y descargan al instante.
          </p>
        </div>

        {/* Caja de Interacción Principal */}
        <div className="interactive-tester-box">
          {/* Panel Izquierdo: Carga de Archivo */}
          <div className="tester-form-panel">
            <div className="tester-panel-header">
              <div className="panel-step-badge">Paso 1</div>
              <h4 className="panel-step-title">Carga de Requerimientos</h4>
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
                accept=".docx,.pdf,.xlsx,.xls,.txt,.md,.json,.csv"
                onChange={handleFileInputChange}
              />

              {!file ? (
                <div className="dropzone-empty-state">
                  <div className="dropzone-icon-svg">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ea4b71" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <polyline points="9 15 12 12 15 15"></polyline>
                    </svg>
                  </div>
                  <p className="dropzone-main-text">
                    <strong>Arrastra tu archivo aquí</strong> o haz clic para seleccionar
                  </p>
                  <p className="dropzone-sub-text">
                    Formatos soportados: .DOCX, .PDF, .XLSX, .TXT, .MD, .CSV
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
                    <div className="selected-file-name" title={file.name}>
                      {file.name}
                    </div>
                    <div className="selected-file-meta">
                      <span className="file-size-badge">{file.size}</span>
                      <span className="file-pill-tag">{file.isSample ? 'Ejemplo' : 'Archivo Local'}</span>
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
            <div className="trigger-btn-container">
              <button 
                type="button" 
                className={`btn-trigger-n8n ${isSending ? 'is-loading' : ''}`}
                onClick={handleTriggerN8n}
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Procesando en n8n...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    <span>Disparar Automatización en n8n</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Panel Derecho: Estado y Resultado de n8n */}
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
                /* Éxito desde n8n: Card de Alto Impacto con Descarga y Vista */
                <div className="n8n-result-card">
                  {/* Banner de Éxito */}
                  <div className="result-success-banner">
                    <div className="result-icon-wrap">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" strokeWidth="2.5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div className="result-banner-content">
                      <h4 className="result-title">¡Matriz QA Generada Exitosamente por n8n!</h4>
                      <p className="result-desc">
                        Tu pipeline en n8n procesó los criterios de aceptación y construyó la matriz corporativa con el estándar de 11 columnas.
                      </p>
                    </div>
                  </div>

                  {/* Fila de Métricas del Resultado */}
                  <div className="result-metrics-row">
                    <div className="metric-pill">
                      <span className="metric-label">Casos Generados:</span>
                      <strong className="metric-value">{n8nResult.cases ? n8nResult.cases.length : 1}</strong>
                    </div>
                    <div className="metric-pill">
                      <span className="metric-label">Módulo:</span>
                      <strong className="metric-value">{n8nResult.module || 'Autenticación'}</strong>
                    </div>
                    <div className="metric-pill">
                      <span className="metric-label">Columnas:</span>
                      <strong className="metric-value">11 Oficiales (A-K)</strong>
                    </div>
                  </div>

                  {/* Botones de Acción Primarios */}
                  <div className="result-actions-grid">
                    {/* Botón Descarga Excel */}
                    <button 
                      type="button" 
                      className="btn-action-primary-download"
                      onClick={handleDownloadExcel}
                      title="Descargar archivo .xlsx compatible con Microsoft Excel"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>Descargar Matriz QA (.xlsx)</span>
                    </button>

                    {/* Botón Ver en Tabla de 11 Columnas */}
                    <button 
                      type="button" 
                      className="btn-action-view-table"
                      onClick={onScrollToMatrix}
                      title="Ver los casos en la hoja de cálculo interactiva"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                      </svg>
                      <span>Ver en Tabla de 11 Columnas</span>
                    </button>

                    {/* Botón Descarga CSV */}
                    <button 
                      type="button" 
                      className="btn-action-secondary-csv"
                      onClick={handleDownloadCsv}
                      title="Descargar matriz en archivo CSV estándar"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span>Descargar CSV</span>
                    </button>

                    {/* Botón Google Sheets si n8n incluyó la URL */}
                    {n8nResult.sheetUrl && (
                      <a 
                        href={n8nResult.sheetUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-action-google-sheet"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span>Abrir en Google Sheets</span>
                      </a>
                    )}
                  </div>

                  {/* Acordeón Plegable para Respuesta Técnica JSON (Opcional) */}
                  <div className="result-json-accordion">
                    <button 
                      type="button" 
                      className="btn-toggle-json"
                      onClick={() => setShowJson(!showJson)}
                    >
                      <span className="toggle-label">
                        {showJson ? '▾ Ocultar Respuesta Técnica JSON de n8n' : '▸ Ver Respuesta Técnica JSON de n8n (Opcional)'}
                      </span>
                      <span className="toggle-tag">JSON</span>
                    </button>

                    {showJson && (
                      <div className="terminal-json-output">
                        <div className="terminal-header">Respuesta de n8n (Payload Raw)</div>
                        <pre>{JSON.stringify(n8nResult.raw || n8nResult, null, 2)}</pre>
                      </div>
                    )}
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
                    Al pulsar <strong>"Disparar Automatización en n8n"</strong>, el archivo viaja convertido en Base64 mediante JSON a tu webhook local (<code>localhost:5678</code>). Tu flujo ejecutará el modelo de lenguaje (Gemini), estructurará las 11 columnas y la matriz estará disponible de inmediato para descarga y previsualización.
                  </p>

                  <div className="standby-pipeline-nodes">
                    <div className="standby-step">
                      <span className="step-num">1</span>
                      <span className="step-text">FileReader convierte archivo a Base64</span>
                    </div>
                    <div className="standby-step">
                      <span className="step-num">2</span>
                      <span className="step-text">POST JSON con payload a tu Webhook</span>
                    </div>
                    <div className="standby-step">
                      <span className="step-num">3</span>
                      <span className="step-text">Genera casos, descarga .xlsx y visualiza en vivo</span>
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
