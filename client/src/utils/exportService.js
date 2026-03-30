import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, filename) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, filename + '.xlsx');
};

export const exportToCSV = (data, filename) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename + '.csv');
};

export const exportToPDF = (data, title, filename) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text('Generated: ' + new Date().toLocaleDateString(), 14, 32);
  
  const headers = Object.keys(data[0] || {});
  const rows = data.map(item => Object.values(item));
  
  doc.autoTable({ head: [headers], body: rows, startY: 40, theme: 'striped', styles: { fontSize: 8 }, headStyles: { fillColor: [79, 70, 229] } });
  doc.save(filename + '.pdf');
};
