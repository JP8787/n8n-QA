import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import * as XLSX from 'xlsx';

// Configuración obligatoria del worker de PDF empaquetado directamente por Vite sin depender de CDN externo
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker || 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/build/pdf.worker.min.mjs';

// URL oficial del Webhook de n8n configurada (Túnel HTTPS seguro de Cloudflare para acceso público desde celulares y GitHub Pages)
const DEFAULT_WEBHOOK_URL = "https://computation-immune-except-adjustment.trycloudflare.com/webhook/generar-qa";



// Diagnóstico inteligente de errores de red o comunicación (adaptado para visitantes y evaluadores públicos)
const diagnoseError = (err, currentFile, extractedText, currentWebhookUrl) => {
  const isLocalhostUrl = currentWebhookUrl.includes('localhost') || currentWebhookUrl.includes('127.0.0.1');

  // Si aún tuviese una dirección local por alguna razón
  if (isLocalhostUrl) {
    return {
      category: 'localhost',
      badge: 'Conexión a Nube Requerida',
      badgeColor: 'amber',
      title: 'El servicio está configurado para la nube pública',
      desc: 'Para que cualquier visitante o reclutador pueda probar la automatización por internet, la conexión se realiza a través del túnel público seguro de Cloudflare.',
      solutions: [
        'Pulsa el botón "Reintentar" para conectar automáticamente con el webhook en la nube.',
        'Explora la matriz interactiva de 11 columnas y la arquitectura del flujo en esta misma página.'
      ]
    };
  }

  // Caso: Servidor n8n en vivo temporalmente inactivo, apagado o en pausa
  return {
    category: 'network',
    badge: 'Servicio en Vivo Temporalmente en Pausa',
    badgeColor: 'amber',
    title: 'El servicio de automatización en vivo no está disponible en este momento',
    desc: 'La conexión con el webhook del pipeline en la nube no recibió respuesta. Al ser una demostración en vivo vinculada a la infraestructura personal de n8n del autor, el servidor o el túnel público pueden encontrarse temporalmente apagados o en pausa.',
    solutions: [
      'Pulsa el botón "Reintentar" por si se trató de una intermitencia momentánea de conexión a la nube.',
      'Explora toda la demostración interactiva en esta landing: interactúa con la Matriz QA oficial de 11 columnas en la sección superior y revisa la arquitectura del pipeline.',
      'Si deseas una demostración en vivo personalizada con tus propios requerimientos de software, contacta al autor para encender la instancia de n8n en tiempo real.'
    ]
  };
};

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

  // 3. Si es un archivo de Word (.docx o .doc)
  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (extension === 'doc') {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const bytes = new Uint8Array(arrayBuffer);
      let textChunk = '';
      for (let i = 0; i < bytes.length; i++) {
        const code = bytes[i];
        if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code >= 160) {
          textChunk += String.fromCharCode(code);
        } else if (textChunk.length > 0 && textChunk[textChunk.length - 1] !== ' ') {
          textChunk += ' ';
        }
      }
      const palabras = textChunk.match(/[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9_-]{3,}/g) || [];
      return palabras.join(' ');
    } catch (e) {
      return '';
    }
  }

  // 4. Si es un PDF
  if (extension === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textoCompleto = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textoPagina = textContent.items.map(item => item.str).join(' ');
        textoCompleto += textoPagina + '\n';
      }
      if (textoCompleto.trim().length > 10) {
        return textoCompleto;
      }
    } catch (pdfErr) {
      console.warn("Aviso en pdfjsLib, aplicando extractor binario de respaldo:", pdfErr);
    }

    // Extractor de respaldo binario para PDFs con streams de texto plano
    try {
      const bytes = new Uint8Array(arrayBuffer);
      let textChunk = '';
      for (let i = 0; i < bytes.length; i++) {
        const code = bytes[i];
        if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code >= 160) {
          textChunk += String.fromCharCode(code);
        } else if (textChunk.length > 0 && textChunk[textChunk.length - 1] !== ' ') {
          textChunk += ' ';
        }
      }
      const palabras = textChunk.match(/[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9_-]{3,}/g) || [];
      const textoFallback = palabras.join(' ');
      if (textoFallback.length > 20) {
        return textoFallback;
      }
    } catch (fallbackErr) {
      console.warn("Aviso en fallback de texto PDF:", fallbackErr);
    }

    return '';
  }

  throw new Error("Formato de archivo no soportado. Sube un Excel, PDF, DOCX, TXT o CSV.");
};

// Notificación sonora agradable y sutil mediante Web Audio API nativa
const playSuccessChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // Tono 1 (suave)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tono 2 (alegre y resolutivo)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.12); // G5
    gain2.gain.setValueAtTime(0.1, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    // Si las políticas de autoplay bloquean audio, continúa sin interrumpir
  }
};

export default function InteractiveTestSection({ onCasesGenerated, onScrollToMatrix }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [n8nResult, setN8nResult] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);
  const [webhookError, setWebhookError] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('n8n_custom_webhook_url');
      if (
        saved && 
        !saved.includes('localhost') && 
        !saved.includes('sol-florida') && 
        !saved.includes('turbo-southwest') &&
        !saved.includes('academic-expensive') &&
        saved.includes('computation-immune-except-adjustment')
      ) {
        return saved;
      }
      localStorage.setItem('n8n_custom_webhook_url', DEFAULT_WEBHOOK_URL);
      return DEFAULT_WEBHOOK_URL;
    }
    return DEFAULT_WEBHOOK_URL;
  });
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
    setSuccessAlert(null);
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
      setSuccessAlert(null);
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
      setSuccessAlert(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setN8nResult(null);
    setWebhookError(null);
    setSuccessAlert(null);
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
      `[${new Date().toLocaleTimeString()}] Conectando con n8n en: ${webhookUrl}...`
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

    setExecutionLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Archivo procesado. Despachando a n8n...`
    ]);

    const reader = new FileReader();

    reader.onload = async (event) => {
      // Extraemos solo el código Base64 del archivo
      const base64Data = event.target.result.split(',')[1];
      const mimeType = currentFile.rawFile.type || 'text/plain';

      // Deducir nombre base del archivo sin extensiones para titular la matriz
      const fileRawBase = (currentFile && currentFile.name)
        ? currentFile.name.replace(/\.[^/.]+$/, "").trim()
        : '';
      const fileBaseTitle = fileRawBase || 'Módulo QA';

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
        const respuesta = await fetch(webhookUrl, {
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
          const arrayBuffer = await respuesta.arrayBuffer();
          // Leemos el libro de Excel en memoria sin forzar descargas a disco
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const parsedCases = XLSX.utils.sheet_to_json(worksheet);

          if (parsedCases && parsedCases.length > 0 && onCasesGenerated) {
            onCasesGenerated(parsedCases, fileBaseTitle, currentFile.name);
          }

          setN8nResult({
            type: 'cases',
            cases: parsedCases,
            module: fileBaseTitle,
            fileName: currentFile.name,
            raw: { status: 'success', rowsParsed: parsedCases.length }
          });

          // Alerta destacada y sonido sutil de finalización
          setSuccessAlert({
            casesCount: parsedCases?.length || 1,
            fileName: currentFile.name,
            sheetUrl: null
          });
          playSuccessChime();

          setExecutionLogs(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] Archivo Excel binario procesado (${parsedCases.length} casos leídos) y visualizado en la matriz.`
          ]);
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

          // Preservamos el nombre del archivo del usuario fielmente
          const finalModule = fileBaseTitle;

          // Sincronizamos con la tabla de 11 columnas de la sección 4 y el visor local
          if (cases && cases.length > 0 && onCasesGenerated) {
            onCasesGenerated(cases, finalModule, currentFile.name);
          }

          setN8nResult({
            type: cases ? 'cases' : 'json',
            cases: cases,
            module: finalModule,
            fileName: currentFile.name,
            sheetUrl: data.sheetUrl || data.url || null,
            raw: data
          });

          // Alerta destacada y sonido sutil de finalización
          setSuccessAlert({
            casesCount: cases ? cases.length : 1,
            fileName: currentFile.name,
            sheetUrl: data.sheetUrl || data.url || null
          });
          playSuccessChime();

          setExecutionLogs(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ${cases ? `${cases.length} casos extraídos (Archivo: ${currentFile.name}) y visualizados en vivo en la matriz.` : 'Datos procesados correctamente.'}`
          ]);
        }
      } catch (err) {
        console.error("Error en comunicación con n8n:", err);
        const diagnosis = diagnoseError(err, currentFile, textoExtraido, webhookUrl);
        setWebhookError(diagnosis);
        setExecutionLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Aviso: ${diagnosis.title}`
        ]);
      } finally {
        setIsSending(false);
      }
    };

    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
      setWebhookError({
        category: 'empty',
        badge: 'Lectura de Archivo',
        badgeColor: 'orange',
        title: 'No se pudo leer el archivo local',
        desc: 'El navegador tuvo problemas para leer los datos del archivo en tu dispositivo.',
        solutions: [
          'Verifica que el archivo no esté abierto ni bloqueado en otro programa.',
          'Prueba con un archivo .txt, .docx, .xlsx o .pdf estándar.'
        ],
        showLoadSample: true
      });
      setIsSending(false);
    };

    // Disparamos la lectura del archivo
    reader.readAsDataURL(currentFile.rawFile);
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
                accept=".docx,.doc,.pdf,.xlsx,.xls,.txt,.md,.json,.csv"
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
              {/* Si hubo error al contactar el webhook o el archivo no es apto */}
              {webhookError ? (
                <div className={`friendly-error-card tone-${webhookError.badgeColor || 'rose'}`}>
                  {/* Cabecera amigable con Badge y Título */}
                  <div className="friendly-error-header">
                    <div className="friendly-error-badge-pill">
                      {webhookError.badgeColor === 'amber' ? '📱' : webhookError.badgeColor === 'orange' ? '⚠️' : '🔌'}{' '}
                      {webhookError.badge || 'Aviso de Ejecución'}
                    </div>
                    <h4 className="friendly-error-title">{webhookError.title}</h4>
                    <p className="friendly-error-desc">{webhookError.desc}</p>
                  </div>

                  {/* Soluciones claras y comprensibles para todo público */}
                  {webhookError.solutions && webhookError.solutions.length > 0 && (
                    <div className="friendly-solutions-box">
                      <strong className="friendly-solutions-title">
                        {webhookError.category === 'accounting' ? '💡 ¿Por qué ocurre y cómo continuar?' : '💡 Solución sugerida:'}
                      </strong>
                      <ul className="friendly-solutions-list">
                        {webhookError.solutions.map((sol, idx) => (
                          <li key={idx}>
                            <span className="solution-bullet-check">✓</span>
                            <span>{sol}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fila de Acciones Rápidas */}
                  <div className="friendly-actions-row">
                    {webhookError.showLoadSample && (
                      <button
                        type="button"
                        className="btn-friendly-action-sample"
                        onClick={() => {
                          handleLoadSampleFile();
                          setWebhookError(null);
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <polyline points="9 15 12 12 15 15"></polyline>
                        </svg>
                        <span>Cargar Archivo de Software de Ejemplo</span>
                      </button>
                    )}

                    <button 
                      type="button" 
                      className="btn-friendly-retry"
                      onClick={handleTriggerN8n}
                    >
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                      </svg>
                      <span>Reintentar</span>
                    </button>
                  </div>
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
                      <span className="metric-label">Archivo:</span>
                      <strong className="metric-value">{n8nResult.fileName || (file ? file.name : 'Archivo QA')}</strong>
                    </div>
                    <div className="metric-pill">
                      <span className="metric-label">Columnas:</span>
                      <strong className="metric-value">11 Oficiales (A-K)</strong>
                    </div>
                  </div>

                  {/* Letrero / Banner de Sincronización con Botón para Subir a la Hoja Superior */}
                  <div className="result-synced-notice-box">
                    <div className="notice-header-row">
                      <div className="notice-icon-circle">
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="#107c41">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                          <path d="M7 7h4v2H7zm0 4h4v2H7zm0 4h4v2H7zm6-8h4v2h-4zm0 4h4v2h-4zm0 4h4v2h-4z"/>
                        </svg>
                      </div>
                      <div className="notice-text-content">
                        <h4 className="notice-title">¡Matriz QA cargada con éxito en la tabla de arriba!</h4>
                        <p className="notice-description">
                          Los <strong>{n8nResult.cases ? n8nResult.cases.length : 0} casos de prueba</strong> para tu archivo <strong>"{n8nResult.fileName || (file ? file.name : '')}"</strong> ya quedaron estructurados y listos en la hoja de cálculo oficial superior (Sección 4).
                        </p>
                      </div>
                    </div>

                    <div className="notice-actions-row">
                      <button 
                        type="button" 
                        className="btn-scroll-up-to-matrix"
                        onClick={onScrollToMatrix}
                        title="Subir a ver la Matriz QA en la sección superior"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="19" x2="12" y2="5"></line>
                          <polyline points="5 12 12 5 19 12"></polyline>
                        </svg>
                        <span>Ver Matriz en la Hoja de Arriba (11 Columnas)</span>
                      </button>

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
                    Al pulsar <strong>"Disparar Automatización en n8n"</strong>, el archivo viaja mediante JSON al webhook del pipeline en la nube. El flujo ejecuta el modelo de lenguaje (Gemini), estructura las 11 columnas oficiales y genera la matriz QA lista para descarga en Excel y previsualización instantánea.
                  </p>

                  <div className="standby-pipeline-nodes">
                    <div className="standby-step">
                      <span className="step-num">1</span>
                      <span className="step-text">FileReader convierte archivo a Base64</span>
                    </div>
                    <div className="standby-step">
                      <span className="step-num">2</span>
                      <span className="step-text">POST JSON con payload al Webhook en la nube</span>
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

      {/* Alerta Flotante Prominente de Finalización Exitosa */}
      {successAlert && (
        <div className="floating-success-toast" role="alert" aria-live="assertive">
          <div className="toast-glow-accent"></div>
          <button 
            type="button" 
            className="btn-toast-close"
            onClick={() => setSuccessAlert(null)}
            aria-label="Cerrar notificación"
          >
            ✕
          </button>

          <div className="toast-body-layout">
            <div className="toast-icon-wrap">
              <div className="toast-icon-pulse"></div>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#22c55e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <div className="toast-content">
              <div className="toast-badge">
                <span>¡Automatización Completada con Éxito!</span>
              </div>
              <h4 className="toast-title">
                {successAlert.casesCount} Casos de Prueba Listos
              </h4>
              <p className="toast-desc">
                Tu pipeline en n8n procesó los requerimientos de <strong>"{successAlert.fileName}"</strong> y estructuró la matriz corporativa oficial de 11 columnas.
              </p>

              <div className="toast-actions-row">
                <button
                  type="button"
                  className="btn-toast-view-matrix"
                  onClick={() => {
                    if (onScrollToMatrix) onScrollToMatrix();
                    setSuccessAlert(null);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                  <span>Ver Matriz en la Hoja Superior (11 Columnas)</span>
                </button>

                {successAlert.sheetUrl && (
                  <a
                    href={successAlert.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-toast-sheet-link"
                  >
                    <span>Abrir Google Sheets</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
