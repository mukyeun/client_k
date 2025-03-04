import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';

export const exportToExcel = async (data, fileName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // 헤더 추가
  const headers = Object.keys(data[0] || {});
  worksheet.addRow(headers);

  // 데이터 추가
  data.forEach(item => {
    worksheet.addRow(Object.values(item));
  });

  // 파일 저장
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportToCSV = (data, fileName) => {
  // CSV 헤더
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','), // 헤더 행
    ...data.map(row => headers.map(header => row[header]).join(',')) // 데이터 행
  ].join('\n');

  // 파일 다운로드
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const importFromExcel = async (file) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const worksheet = workbook.getWorksheet(1);
  
  const data = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // 헤더 제외
      data.push({
        name: row.getCell(1).value,
        email: row.getCell(2).value,
        createdAt: row.getCell(3).value
      });
    }
  });
  
  return data;
}; 