import * as XLSX from "xlsx"
import { saveAs as fileSaveAs } from "file-saver"

export function downloadFile({
  data,
  fileName,
  fileType,
}: { data: BlobPart; fileName: string; fileType: string }) {
  const blob = new Blob([data], { type: fileType })

  fileSaveAs(blob, fileName)
}

export function exportToJson({
  data,
  fileName,
}: { data: Record<string, any>[]; fileName: string }) {
  downloadFile({
    data: JSON.stringify(data),
    fileName: `${fileName}.json`,
    fileType: "text/json",
  })
}

export function exportToCsv({
  data,
  fileName,
}: { data: Record<string, any>[]; fileName: string }) {
  const headers = Object.keys(data[0])

  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        const val =
          row[header] === null || row[header] === undefined ? "" : row[header]

        return `"${val.toString().replace(/"/g, '""')}"`
      })
      .join(",")
  })

  const csvString = [headers.join(","), ...csvRows].join("\n")

  downloadFile({
    data: csvString,
    fileName: `${fileName}.csv`,
    fileType: "text/csv",
  })
}

export function exportToExcel({
  data,
  fileName,
}: { data: Record<string, any>[]; fileName: string }) {
  const worksheet = XLSX.utils.json_to_sheet(data)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  })

  downloadFile({
    data: excelBuffer,
    fileName: `${fileName}.xlsx`,
    fileType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
}
