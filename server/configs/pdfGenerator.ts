import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generateLabReportPDF = async (labReport, patientVCid, ownerDetails) => {
 
  const doc = new PDFDocument({ margin: 50 });
  const fileName = `lab_report_${labReport._id}.pdf`;
  const filePath = path.join(__dirname, '../uploads/lab-reports', fileName);

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create write stream
  const stream = fs.createWriteStream(filePath);

  // Pipe PDF document to write stream
  doc.pipe(stream);

  // ** Header Section:**
  doc.fontSize(20).font('Helvetica-Bold').text('VetClinicPro', { align: 'center' });
  doc.fontSize(12).font('Helvetica').text('Laboratory Test Report', { align: 'center' });
  doc.moveDown(2);

  // Add a horizontal line
  doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
  doc.moveDown(2);

  // ** Patient Information Section:**
  doc.fontSize(14).font('Helvetica-Bold').text('Patient Information', { underline: true });
  doc.moveDown(1);

  const patientInfo = [
    ['Patient ID:', patientVCid || 'N/A'],
    ['Patient Name:', labReport.patientName || 'N/A'],
    ['Date:', new Date(labReport.datePerformed).toLocaleDateString() || 'N/A'],
    ['Test Type:', labReport.testType || 'N/A'],
    ['Technician:', labReport.technician || 'N/A'],
  ];

  patientInfo.forEach(([key, value]) => {
    doc.fontSize(12).font('Helvetica').text(`${key} ${value}`, { align: 'left' });
  });

  doc.moveDown(2);

  // ** Owner Information Section:**
  doc.fontSize(14).font('Helvetica-Bold').text('Owner Information', { underline: true });
  doc.moveDown(1);

  const ownerInfo = [
    ['Owner Name:', `${ownerDetails.firstName} ${ownerDetails.lastName}`],
    ['Owner ID:', ownerDetails.ownerId || 'N/A'],
    ['Address:', ownerDetails.address || 'N/A'],
    ['Phone:', ownerDetails.phone || 'N/A'],
    ['Email:', ownerDetails.email || 'N/A'],
  ];

  ownerInfo.forEach(([key, value]) => {
    doc.fontSize(12).font('Helvetica').text(`${key} ${value}`, { align: 'left' });
  });

  doc.moveDown(2);

  // ** Test Results Section:**
  doc.fontSize(14).font('Helvetica-Bold').text('Test Results', { underline: true });
  doc.moveDown(1);

  const testResults = [
    ['General Observations:', labReport.generalObservations || 'None'],
    ['Medical Findings:', labReport.medicalFindings || 'None'],
    ['Recommended Follow-up:', labReport.recommendedFollowUp || 'None'],
  ];

  testResults.forEach(([key, value]) => {
    doc.fontSize(12).font('Helvetica').text(`${key} ${value}`, { align: 'left' });
  });

  doc.moveDown(2);

  // ** Images Section:**
  if (labReport.images && labReport.images.length > 0) {
    doc.addPage();
    doc.fontSize(14).font('Helvetica-Bold').text('Test Images', { underline: true });
    doc.moveDown(1);

    for (let i = 0; i < labReport.images.length; i++) {
      try {
        const response = await axios.get(labReport.images[i].url, { responseType: 'arraybuffer' });
        const imagePath = path.join(dir, `temp_${i}.jpg`);
        fs.writeFileSync(imagePath, response.data);

        if (i > 0 && i % 2 === 0) doc.addPage();
        const yPos = i % 2 === 0 ? 100 : 400;
        doc.image(imagePath, 100, yPos, { fit: [400, 250] });

        fs.unlinkSync(imagePath); // Clean up temporary file
      } catch (error) {
        console.error(`Error processing image ${i}:`, error);
      }
    }
  }

  doc.moveDown(2);

  // Finalize PDF
  doc.end();

  // Return a Promise that resolves when the PDF is written
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve({ filePath, fileName });
    });
    stream.on('error', reject);
  });
};
