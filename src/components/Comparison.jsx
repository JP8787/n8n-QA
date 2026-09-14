import React from 'react';

export default function Comparison() {
  const comparisons = [
    {
      before: 'Redacción manual de casos de prueba escenario por escenario.',
      after: 'Generación instantánea y estructurada a partir de criterios de aceptación o historias de usuario.'
    },
    {
      before: 'Inconsistencia en la nomenclatura y estructura de columnas.',
      after: 'Estándar formal QA de 11 columnas con pasos numerados y pre/postcondiciones.'
    },
    {
      before: 'Formato plano, texto cortado y celdas desordenadas en Excel.',
      after: 'Diseño visual corporativo automático: anchos ajustados, texto multilínea legible (wrap), bordes definidos y fila congelada.'
    },
    {
      before: 'Monotonía visual entre diferentes proyectos o módulos.',
      after: 'Paletas dinámicas en tonos pastel que identifican cada módulo automáticamente y alternancia de filas suave (zebra striping).'
    }
  ];

  return (
    <section className="comparison-section" id="problema-solucion">
      <div className="container">
        <div className="section-header-center">
          <span className="section-kicker">Transformación Operativa</span>
          <h2 className="section-title">El Problema vs. La Solución</h2>
          <p className="section-subtitle">
            Cómo la automatización con n8n elimina la fricción y eleva el estándar de calidad en cada entrega.
          </p>
        </div>

        <div className="comparison-table-wrapper">
          <div className="comparison-header-row">
            <div className="comparison-col-header before">
              <span className="tag-indicator tag-before">✕</span>
              <span>Antes (Manual)</span>
            </div>
            <div className="comparison-col-header after">
              <span className="tag-indicator tag-after">✓</span>
              <span>Con esta Solución (Automatizado)</span>
            </div>
          </div>

          <div className="comparison-rows">
            {comparisons.map((item, index) => (
              <div key={index} className="comparison-row">
                <div className="comparison-cell before">
                  <div className="cell-mobile-label">Antes (Manual)</div>
                  <p>{item.before}</p>
                </div>
                <div className="comparison-divider-icon">
                  ➔
                </div>
                <div className="comparison-cell after">
                  <div className="cell-mobile-label">Con esta Solución</div>
                  <p>{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
