import * as XLSX from 'xlsx';

/**
 * Exporta un array de casos de prueba al formato estándar oficial .xlsx (Microsoft Excel)
 * con autoajuste de anchos para las 11 columnas corporativas.
 */
export function exportCasesToExcel(cases, filename = 'Matriz_QA_Corporativa.xlsx') {
  if (!cases || !cases.length) return;

  const rows = cases.map((c, index) => ({
    'Id': c.Id || c.id || `CP-${String(index + 1).padStart(4, '0')}`,
    'Funcionalidad / Característica': c['Funcionalidad / Característica'] || c.module || c.modulo || 'Autenticación y Seguridad',
    'Descripción': c['Descripción'] || c.desc || '',
    'Fecha': c['Fecha'] || c.date || new Date().toLocaleDateString('es-ES'),
    'Caso de Prueba': c['Caso de Prueba'] || c.scenario || '',
    'Precondiciones': c['Precondiciones'] || c.given || '',
    'Datos / Acciones de Entrada': c['Datos / Acciones de Entrada'] || c.when || '',
    'Resultado Esperado': c['Resultado Esperado'] || c.then || '',
    'Requerimientos de Ambiente': c['Requerimientos de Ambiente'] || c.env || '',
    'Procedimientos Especiales': c['Procedimientos Especiales'] || c.special || '',
    'Postcondición': c['Postcondición'] || c.post || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Configuración de anchos recomendados para las 11 columnas oficiales
  worksheet['!cols'] = [
    { wch: 12 }, // Col A: Id
    { wch: 28 }, // Col B: Funcionalidad / Característica
    { wch: 35 }, // Col C: Descripción
    { wch: 14 }, // Col D: Fecha
    { wch: 35 }, // Col E: Caso de Prueba
    { wch: 35 }, // Col F: Precondiciones
    { wch: 42 }, // Col G: Datos / Acciones de Entrada
    { wch: 42 }, // Col H: Resultado Esperado
    { wch: 26 }, // Col I: Requerimientos de Ambiente
    { wch: 26 }, // Col J: Procedimientos Especiales
    { wch: 32 }  // Col K: Postcondición
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Matriz QA 11 Columnas');
  
  const cleanName = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, cleanName);
}

/**
 * Exporta un array de casos de prueba al formato estándar .csv con codificación UTF-8 BOM
 * para compatibilidad nativa con Microsoft Excel en español.
 */
export function exportCasesToCsv(cases, filename = 'Matriz_QA_Corporativa.csv') {
  if (!cases || !cases.length) return;

  const headers = [
    'Id',
    'Funcionalidad / Característica',
    'Descripción',
    'Fecha',
    'Caso de Prueba',
    'Precondiciones',
    'Datos / Acciones de Entrada',
    'Resultado Esperado',
    'Requerimientos de Ambiente',
    'Procedimientos Especiales',
    'Postcondición'
  ];

  const escapeCsv = (val) => {
    if (val == null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = cases.map((c, index) => [
    escapeCsv(c.Id || c.id || `CP-${String(index + 1).padStart(4, '0')}`),
    escapeCsv(c['Funcionalidad / Característica'] || c.module || c.modulo || 'Autenticación y Seguridad'),
    escapeCsv(c['Descripción'] || c.desc || ''),
    escapeCsv(c['Fecha'] || c.date || new Date().toLocaleDateString('es-ES')),
    escapeCsv(c['Caso de Prueba'] || c.scenario || ''),
    escapeCsv(c['Precondiciones'] || c.given || ''),
    escapeCsv(c['Datos / Acciones de Entrada'] || c.when || ''),
    escapeCsv(c['Resultado Esperado'] || c.then || ''),
    escapeCsv(c['Requerimientos de Ambiente'] || c.env || ''),
    escapeCsv(c['Procedimientos Especiales'] || c.special || ''),
    escapeCsv(c['Postcondición'] || c.post || '')
  ].join(','));

  // UTF-8 BOM (\uFEFF) para que Excel reconozca tildes y caracteres en español
  const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
