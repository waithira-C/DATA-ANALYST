import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import QRCode from 'qrcode'
import type { Certificate } from '../store/progress'

export function verifyUrl(id: string) {
  return `${window.location.origin}/verify/${encodeURIComponent(id)}`
}

/** Renders a landscape A4 certificate and returns the PDF bytes. */
export async function certificatePdf(c: Certificate): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  pdf.setTitle(`DataLadder Certificate: ${c.fullName}`)
  pdf.setAuthor('DataLadder')
  const page = pdf.addPage([842, 595])
  const { width: W, height: H } = page.getSize()
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const serifIt = await pdf.embedFont(StandardFonts.TimesRomanItalic)
  const sans = await pdf.embedFont(StandardFonts.Helvetica)
  const sansB = await pdf.embedFont(StandardFonts.HelveticaBold)

  const ink = rgb(0.05, 0.07, 0.14)
  const navy = rgb(0.04, 0.06, 0.13)
  const sky = rgb(0.22, 0.74, 0.97)
  const violet = rgb(0.55, 0.36, 0.96)
  const gold = rgb(0.96, 0.62, 0.04)
  const muted = rgb(0.38, 0.42, 0.52)

  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.99, 0.99, 1) })
  // side band
  page.drawRectangle({ x: 0, y: 0, width: 150, height: H, color: navy })
  for (let i = 0; i < 10; i++) {
    const h = 30 + i * 34
    page.drawRectangle({ x: 28 + (i % 2) * 48, y: 60 + i * 47, width: 40, height: 6, color: i % 3 === 0 ? gold : i % 3 === 1 ? sky : violet, opacity: 0.85 })
    void h
  }
  page.drawText('DATALADDER', { x: 98, y: 210, size: 26, font: sansB, color: rgb(1, 1, 1), rotate: degrees(90) })
  // borders
  page.drawRectangle({ x: 170, y: 20, width: W - 190, height: H - 40, borderColor: gold, borderWidth: 2 })
  page.drawRectangle({ x: 178, y: 28, width: W - 206, height: H - 56, borderColor: rgb(0.85, 0.87, 0.92), borderWidth: 0.8 })

  const cx = 170 + (W - 190) / 2
  const center = (text: string, y: number, size: number, font = sans, color = ink) => {
    const w = font.widthOfTextAtSize(text, size)
    page.drawText(text, { x: cx - w / 2, y, size, font, color })
  }

  center('CERTIFICATE OF COMPLETION', H - 95, 14, sansB, muted)
  center('Data Analyst Career Path', H - 135, 30, serif, ink)
  center('This certifies that', H - 185, 13, serifIt, muted)
  let nameSize = 40
  while (serif.widthOfTextAtSize(c.fullName, nameSize) > 520 && nameSize > 20) nameSize -= 2
  center(c.fullName, H - 238, nameSize, serif, navy)
  page.drawLine({ start: { x: cx - 200, y: H - 252 }, end: { x: cx + 200, y: H - 252 }, thickness: 1, color: gold })
  center('has completed all ten floors of the DataLadder curriculum (spreadsheets, statistics, SQL,', H - 282, 11, sans, ink)
  center('data visualization & BI, Python/pandas and business analytics), passed the final exam', H - 298, 11, sans, ink)
  center(`with a score of ${c.examScore}%, and shipped a portfolio capstone project.`, H - 314, 11, sans, ink)

  const issued = new Date(c.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  page.drawText('Issued', { x: 215, y: 120, size: 9, font: sans, color: muted })
  page.drawText(issued, { x: 215, y: 104, size: 13, font: sansB, color: ink })
  page.drawText('Credential ID', { x: 215, y: 80, size: 9, font: sans, color: muted })
  page.drawText(c.id, { x: 215, y: 64, size: 13, font: sansB, color: ink })
  if (c.capstoneUrl) {
    page.drawText('Capstone', { x: 420, y: 120, size: 9, font: sans, color: muted })
    const url = c.capstoneUrl.length > 48 ? c.capstoneUrl.slice(0, 47) + '…' : c.capstoneUrl
    page.drawText(url, { x: 420, y: 104, size: 10, font: sans, color: sky })
  }
  page.drawText(c.local ? 'Self-issued (offline mode): not verifiable online' : 'Verify at the QR code or the URL below', { x: 420, y: 80, size: 9, font: sans, color: muted })
  page.drawText(c.local ? 'Connect an account to issue a verifiable credential.' : verifyUrl(c.id), { x: 420, y: 64, size: 9, font: sans, color: c.local ? muted : sky })

  const qr = await QRCode.toDataURL(verifyUrl(c.id), { margin: 1, width: 300, color: { dark: '#0b1020', light: '#ffffff' } })
  const png = await pdf.embedPng(qr)
  page.drawImage(png, { x: W - 140, y: 48, width: 92, height: 92 })

  // seal
  page.drawCircle({ x: W - 94, y: H - 110, size: 46, color: gold, opacity: 0.95 })
  page.drawCircle({ x: W - 94, y: H - 110, size: 38, borderColor: rgb(1, 1, 1), borderWidth: 1.5 })
  const seal = 'CERTIFIED'
  page.drawText(seal, { x: W - 94 - sansB.widthOfTextAtSize(seal, 10) / 2, y: H - 106, size: 10, font: sansB, color: rgb(1, 1, 1) })
  page.drawText('ANALYST', { x: W - 94 - sansB.widthOfTextAtSize('ANALYST', 8) / 2, y: H - 120, size: 8, font: sansB, color: rgb(1, 1, 1) })

  page.drawText('DataLadder certificates are issued by the platform and are not an accredited academic qualification.', { x: 215, y: 36, size: 7.5, font: sans, color: muted })
  return pdf.save()
}

export function download(bytes: Uint8Array, filename: string) {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
