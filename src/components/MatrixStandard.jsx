import React, { useState } from 'react';

export default function MatrixStandard() {
  const columns = [
    {
      col: 'A',
      name: 'Id',
      example: 'CP-0001',
      desc: 'Identificador único formal y secuencial para trazabilidad de pruebas (ej: CP-0001, CP-0002).',
      bdd: 'ID Trazabilidad'
    },
    {
      col: 'B',
      name: 'Funcionalidad / Característica',
      example: 'Autenticación y Seguridad',
      desc: 'Módulo funcional o épica bajo evaluación (ej: Autenticación, Checkout, Toma de Lecturas).',
      bdd: 'Feature / Feature Name'
    },
    {
      col: 'C',
      name: 'Descripción',
      example: 'Validar acceso exitoso con credenciales legítimas',
      desc: 'Objetivo concreto y alcance puntual de la validación.',
      bdd: 'Contexto de negocio'
    },
    {
      col: 'D',
      name: 'Fecha',
      example: '14/09/2026',
      desc: 'Fecha automática de generación en formato DD/MM/YYYY registrada por el nodo n8n.',
      bdd: 'Timestamp'
    },
    {
      col: 'E',
      name: 'Caso de Prueba',
      example: 'Inicio de sesión con credenciales válidas y redirección',
      desc: 'Título descriptivo y conciso del escenario evaluado.',
      bdd: 'Scenario Title'
    },
    {
      col: 'F',
      name: 'Precondiciones',
      example: 'Usuario registrado con correo verificado y estado Activo en base de datos.',
      desc: 'Estado previo obligatorio del sistema y del usuario antes de iniciar la prueba.',
      bdd: 'Dado (Given)'
    },
    {
      col: 'G',
      name: 'Datos / Acciones de Entrada',
      example: '1. Navegar a /login. 2. Ingresar email registrado. 3. Ingresar contraseña correcta. 4. Clic en "Ingresar".',
      desc: 'Pasos numerados y secuenciales ejecutados minuciosamente por el tester o bot.',
      bdd: 'Cuando (When)'
    },
    {
      col: 'H',
      name: 'Resultado Esperado',
      example: 'HTTP 200, JWT persistido en cookie HttpOnly y redirección al Dashboard.',
      desc: 'Comportamiento esperado exacto y respuestas observables del sistema.',
      bdd: 'Entonces (Then)'
    },
    {
      col: 'I',
      name: 'Requerimientos de Ambiente',
      example: 'Entorno Staging v2.4, API Gateway activo, base de datos PostgreSQL poblada.',
      desc: 'Dependencias de infraestructura técnica (servidores, APIs, conectividad, versiones).',
      bdd: 'Infraestructura'
    },
    {
      col: 'J',
      name: 'Procedimientos Especiales',
      example: 'Limpieza previa de sesiones activas en Redis para el ID de usuario.',
      desc: 'Preparación de datos, scripts de seed, mockeo o limpieza posterior.',
      bdd: 'Data Setup'
    },
    {
      col: 'K',
      name: 'Postcondición',
      example: 'Sesión activa en Redis con TTL 3600s y registro en tabla audit_logs.',
      desc: 'Estado final en el que queda la plataforma tras concluir la prueba.',
      bdd: 'Estado Final'
    }
  ];

  const [selectedCol, setSelectedCol] = useState(columns[0]);

  return (
    <section className="matrix-standard-section" id="estandar-11-col">
      <div className="container">
        <div className="section-header-center">
          <span className="section-kicker">Estructura Corporativa</span>
          <h2 className="section-title">Estándar de la Matriz QA (11 Columnas Oficiales)</h2>
          <p className="section-subtitle">
            Cada caso de prueba se formatea automáticamente respetando el estándar formal de la industria para auditoría y ejecución ágil.
          </p>
        </div>

        {/* Column Navigation Badges */}
        <div className="column-pills-scroll">
          {columns.map((c, i) => (
            <button
              key={i}
              type="button"
              className={`col-pill-btn ${selectedCol.col === c.col ? 'active' : ''}`}
              onClick={() => setSelectedCol(c)}
            >
              <span className="col-pill-letter">{c.col}</span>
              <span className="col-pill-name">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Column Detail Card */}
        <div className="col-detail-card">
          <div className="col-detail-header">
            <div>
              <span className="col-letter-badge">Columna {selectedCol.col}</span>
              <h3 className="col-detail-title">{selectedCol.name}</h3>
            </div>
            <span className="col-bdd-badge">{selectedCol.bdd}</span>
          </div>

          <div className="col-detail-body">
            <div className="col-info-block">
              <label>Propósito en la Matriz</label>
              <p>{selectedCol.desc}</p>
            </div>
            <div className="col-info-block example">
              <label>Ejemplo Generado por la IA</label>
              <code>{selectedCol.example}</code>
            </div>
          </div>
        </div>

        {/* Full Overview Table */}
        <div className="full-table-preview-wrap">
          <table className="qa-matrix-table">
            <thead>
              <tr>
                {columns.map((c, i) => (
                  <th key={i} onClick={() => setSelectedCol(c)} title={c.desc}>
                    <div className="th-cell">
                      <span className="th-letter">{c.col}</span>
                      <span>{c.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {columns.map((c, i) => (
                  <td key={i}>
                    <div className="td-cell">{c.example}</div>
                  </td>
                ))}
              </tr>
              <tr className="zebra-row">
                <td><div className="td-cell">CP-0002</div></td>
                <td><div className="td-cell">Autenticación y Seguridad</div></td>
                <td><div className="td-cell">Validar bloqueo de cuenta tras 3 intentos fallidos</div></td>
                <td><div className="td-cell">14/09/2026</div></td>
                <td><div className="td-cell">Bloqueo preventivo por fuerza bruta</div></td>
                <td><div className="td-cell">Usuario existente con 0 intentos previos registrados.</div></td>
                <td><div className="td-cell">1. Ingresar email válido. 2. Ingresar pass erróneo 3 veces. 3. Verificar estado.</div></td>
                <td><div className="td-cell">HTTP 423 Locked, mensaje informativo y despacho de alerta vía correo.</div></td>
                <td><div className="td-cell">Servicio de correos SMTP y Redis configurados en Staging.</div></td>
                <td><div className="td-cell">Reiniciar contador de rate-limiting en caché antes de iniciar.</div></td>
                <td><div className="td-cell">Campo is_locked = true en DB con expiración en 30 minutos.</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
