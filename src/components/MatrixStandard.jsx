import React, { useState } from 'react';
import SpreadsheetViewer, { QA_COLUMNS } from './SpreadsheetViewer';

export default function MatrixStandard({ 
  externalCases = null, 
  moduleName = '', 
  uploadedFileName = '',
  onResetSample 
}) {
  const [selectedColIndex, setSelectedColIndex] = useState(0);

  const activeCol = QA_COLUMNS[selectedColIndex] || QA_COLUMNS[0];
  const isLiveCases = Boolean(externalCases && externalCases.length > 0);

  return (
    <section className="matrix-standard-section" id="estandar-11-col">
      <div className="container">
        <div className="section-header-center">
          <span className="section-kicker">Estándar Formal Inmutable</span>
          <h2 className="section-title">Estructura de la Matriz QA (11 Columnas Oficiales)</h2>
          <p className="section-subtitle">
            Cada fila generada por n8n cumple rigurosamente con este esquema corporativo. Tablas nítidas con autoajuste de ancho, texto multilínea legible y pre/postcondiciones BDD.
          </p>
        </div>

        {/* Visor de Hoja de Cálculo Reutilizable (Tema Claro Oficial sin descargas forzadas) */}
        <SpreadsheetViewer
          cases={externalCases}
          uploadedFileName={uploadedFileName}
          moduleName={moduleName}
          isLive={isLiveCases}
          onResetSample={onResetSample}
          selectedColIndex={selectedColIndex}
          onSelectCol={setSelectedColIndex}
        />

        {/* Panel Interactivo: Explicación Detallada de la Columna Seleccionada */}
        <div className="column-inspector-panel">
          <div className="inspector-top">
            <div className="inspector-left">
              <span className="inspector-col-letter">Columna {activeCol.col}</span>
              <h3 className="inspector-title">{activeCol.name}</h3>
              <span className="inspector-bdd-badge">{activeCol.bddType}</span>
            </div>
            <div className="inspector-right">
              <span className="inspector-rule-tag">Regla en n8n: {activeCol.formatRule}</span>
            </div>
          </div>

          <div className="inspector-body-grid">
            <div className="inspector-info-card">
              <h4>Propósito en el Estándar QA</h4>
              <p>{activeCol.desc}</p>
            </div>

            <div className="inspector-info-card">
              <h4>Rol en el Flujo Automatizado</h4>
              <p>Procesado y normalizado por el nodo <strong>Node.js Code / Gemini</strong> para garantizar 100% de coherencia antes de enviarse a la API de Google Sheets.</p>
            </div>

            <div className="inspector-info-card example-card">
              <h4>Ejemplo de Celda Generada</h4>
              <code>{activeCol.sample}</code>
            </div>
          </div>

          {/* Selector Rápido de las 11 Columnas */}
          <div className="column-pills-selector">
            <span className="selector-label">Inspeccionar otra columna:</span>
            <div className="pills-track">
              {QA_COLUMNS.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pill-col-btn ${selectedColIndex === i ? 'active' : ''}`}
                  onClick={() => setSelectedColIndex(i)}
                >
                  <span className="pill-letter">{c.col}</span>
                  <span className="pill-name">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
