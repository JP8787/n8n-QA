import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

// Configuración obligatoria para que el lector de PDF funcione en el navegador
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// URL oficial del Webhook de n8n configurada por el usuario
const DEFAULT_WEBHOOK_URL = "http://localhost:5678/webhook/generar-qa";

// Diagnóstico inteligente de errores para que cualquier persona entienda qué ocurrió sin tecnicismos
const diagnoseError = (err, currentFile, extractedText, currentWebhookUrl) => {
  const isMobile = typeof window !== 'undefined' && 
    (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isLocalhostUrl = currentWebhookUrl.includes('localhost') || currentWebhookUrl.includes('127.0.0.1');

  const combinedText = ((currentFile?.name || '') + ' ' + (extractedText || '')).toLowerCase();
  const accountingKeywords = [
    'contab', 'balance', 'factura', 'asiento', 'iva', 'retencion', 
    'nomina', 'extracto', 'financier', 'debe', 'haber', 'puc', 'impuesto', 
    'tributar', 'activo corriente', 'pasivo', 'patrimonio', 'saldo', 'cuenta por cobrar'
  ];
  const isAccounting = accountingKeywords.some(k => combinedText.includes(k));

  // 1. Caso: Navegación desde Celular / Dispositivo Móvil
  if (isMobile && isLocalhostUrl) {
    return {
      category: 'mobile',
      badge: 'Dispositivo Móvil / Celular',
      badgeColor: 'amber',
      title: 'Estás probando desde un celular o dispositivo externo',
      desc: 'Tu servidor de n8n está instalado en tu computadora personal (`localhost:5678`). Cuando pulsas el botón desde tu celular, este intenta buscar n8n dentro del propio teléfono (donde no está instalado), por lo que no puede comunicarse.',
      solutions: [
        'La opción más fácil y recomendada: Abre este enlace directamente desde el navegador de tu computadora donde tienes n8n abierto.',
        'Si deseas probar desde tu celular: Puedes cambiar la URL del Webhook abajo para poner la dirección IP local de tu PC en la red Wi-Fi (ej: http://192.168.1.50:5678/webhook/generar-qa) o una URL pública de n8n Cloud / ngrok.'
      ],
      allowEditUrl: true
    };
  }

  // 2. Caso: Bloqueo de Navegador HTTPS a HTTP local (Mixed Content en GitHub Pages)
  if (isHttps && isLocalhostUrl) {
    return {
      category: 'https',
      badge: 'Seguridad del Navegador',
      badgeColor: 'amber',
      title: 'El navegador bloqueó la llamada local por seguridad',
      desc: 'Estás visitando la página desde un enlace seguro HTTPS (GitHub Pages). Por normas de seguridad internacionales, los navegadores impiden que una página HTTPS envíe datos a una dirección HTTP local sin cifrar (`http://localhost:5678`).',
      solutions: [
        'Para probar tu n8n local en esta computadora, ejecuta el proyecto localmente (http://localhost:5173).',
        'O configura una URL pública HTTPS para tu n8n utilizando un túnel seguro como ngrok o n8n Cloud.'
      ],
      allowEditUrl: true
    };
  }

  // 3. Caso: Archivo Contable o no apto para QA de Software
  if (isAccounting) {
    return {
      category: 'accounting',
      badge: 'Documento No Compatible con QA',
      badgeColor: 'orange',
      title: 'El archivo subido parece ser de tipo contable o financiero',
      desc: `Detectamos que "${currentFile?.name || 'tu archivo'}" contiene números, balances o asientos contables en lugar de requerimientos de software. Esta Inteligencia Artificial está entrenada para leer criterios de aceptación de sistemas e historias de usuario para generar casos de prueba QA.`,
      solutions: [
        'Los documentos contables no contienen pantallas, botones ni flujos de usuario para probar.',
        'Haz clic en el botón de abajo "Cargar Archivo de Prueba" para probar con un ejemplo oficial de software, o sube un documento que describa cómo debe funcionar un sistema (ej: login, registro, carrito de compras).'
      ],
      showLoadSample: true
    };
  }

  // 4. Caso: Documento vacío o sin texto
  if (extractedText && extractedText.trim().length < 15) {
    return {
      category: 'empty',
      badge: 'Documento sin Texto Legible',
      badgeColor: 'orange',
      title: 'No encontramos texto dentro del documento',
      desc: `El archivo "${currentFile?.name || 'tu archivo'}" parece estar vacío o contiene imágenes escaneadas sin texto digital seleccionable.`,
      solutions: [
        'Verifica que el archivo no esté en blanco ni protegido contra copia.',
        'Sube un archivo Word (.docx), Excel (.xlsx), PDF con texto o un archivo de texto (.txt).'
      ],
      showLoadSample: true
    };
  }

  // 5. Caso: Servidor n8n apagado o no responde en la PC
  return {
    category: 'network',
    badge: 'Servidor n8n Desconectado',
    badgeColor: 'rose',
    title: 'No se pudo conectar con tu flujo en n8n',
    desc: 'No recibimos respuesta de tu n8n en `localhost:5678`. Esto ocurre comúnmente cuando n8n no está iniciado en la terminal o el flujo no está en modo de escucha.',
    solutions: [
      'Verifica que n8n esté ejecutándose en tu terminal (comando: `n8n start`).',
      'Abre n8n en tu navegador (http://localhost:5678) y asegúrate de que el workflow tenga el switch "Active" encendido o esté en modo "Test step".',
      'Confirma que el nodo Webhook tenga el método POST y la ruta "generar-qa".'
    ],
    allowEditUrl: true
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
  const [webhookUrl, setWebhookUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('n8n_custom_webhook_url') || DEFAULT_WEBHOOK_URL;
    }
    return DEFAULT_WEBHOOK_URL;
  });
  const [showUrlConfig, setShowUrlConfig] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpdateWebhookUrl = (newUrl) => {
    setWebhookUrl(newUrl);
    if (typeof window !== 'undefined') {
      localStorage.setItem('n8n_custom_webhook_url', newUrl);
    }
  };

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

    // Detección proactiva y amigable de documentos contables o vacíos
    const combinedLower = ((currentFile?.name || '') + ' ' + (textoExtraido || '')).toLowerCase();
    const accountingKeywords = [
      'contab', 'balance', 'factura', 'asiento', 'iva', 'retencion', 
      'nomina', 'extracto', 'financier', 'debe', 'haber', 'puc', 'impuesto', 
      'tributar', 'activo corriente', 'pasivo', 'patrimonio', 'saldo', 'cuenta por cobrar'
    ];
    const isAccountingDoc = accountingKeywords.some(kw => combinedLower.includes(kw));

    if (isAccountingDoc) {
      const diag = diagnoseError(new Error("Documento contable detectado"), currentFile, textoExtraido, webhookUrl);
      setWebhookError(diag);
      setIsSending(false);
      setExecutionLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Detección: El archivo "${currentFile.name}" contiene términos contables/financieros.`
      ]);
      return;
    }

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

            {/* Configuración Rápida de URL para Pruebas en Móviles o Red Local */}
            <div className="tester-config-drawer">
              <button 
                type="button" 
                className="btn-toggle-config-drawer"
                onClick={() => setShowUrlConfig(!showUrlConfig)}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>{showUrlConfig ? 'Ocultar ajustes de conexión' : '¿Pruebas desde celular u otra red? Ajustar URL Webhook'}</span>
              </button>

              {showUrlConfig && (
                <div className="drawer-url-config-box">
                  <label className="drawer-url-label">Dirección del Webhook de n8n:</label>
                  <div className="drawer-url-input-row">
                    <input 
                      type="text" 
                      className="drawer-url-input"
                      value={webhookUrl}
                      onChange={(e) => handleUpdateWebhookUrl(e.target.value)}
                      placeholder="http://localhost:5678/webhook/generar-qa"
                    />
                    <button 
                      type="button" 
                      className="btn-drawer-url-reset"
                      onClick={() => handleUpdateWebhookUrl(DEFAULT_WEBHOOK_URL)}
                      title="Restablecer URL por defecto"
                    >
                      Por Defecto
                    </button>
                  </div>
                  <p className="drawer-url-tip">
                    💡 <strong>Para celulares:</strong> Reemplaza <code>localhost</code> por la IP de tu PC en tu red Wi-Fi (ej: <code>http://192.168.1.50:5678/webhook/generar-qa</code>) o un túnel ngrok.
                  </p>
                </div>
              )}
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

                    {webhookError.allowEditUrl && (
                      <button
                        type="button"
                        className="btn-friendly-action-config"
                        onClick={() => setShowUrlConfig(!showUrlConfig)}
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        <span>{showUrlConfig ? 'Cerrar Ajustes de Conexión' : 'Configurar IP o URL de n8n'}</span>
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

                  {/* Sección desplegable para ajustar IP / URL dentro de la misma alerta */}
                  {showUrlConfig && (
                    <div className="friendly-url-config-section">
                      <label className="url-config-label">
                        URL de Webhook n8n (puedes ingresar la IP local de tu PC, ej: <code>http://192.168.1.15:5678/webhook/generar-qa</code>):
                      </label>
                      <div className="url-config-input-group">
                        <input 
                          type="text" 
                          className="url-config-input"
                          value={webhookUrl}
                          onChange={(e) => handleUpdateWebhookUrl(e.target.value)}
                          placeholder="http://localhost:5678/webhook/generar-qa"
                        />
                        <button 
                          type="button"
                          className="btn-reset-default-url"
                          onClick={() => handleUpdateWebhookUrl(DEFAULT_WEBHOOK_URL)}
                          title="Restaurar a localhost:5678"
                        >
                          Restaurar
                        </button>
                      </div>
                    </div>
                  )}
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
