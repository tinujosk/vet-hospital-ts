import { generateLabReportPDF } from '../configs/pdfGenerator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import LabReport from '../model/LabReport.js';
import Appointment from '../model/Appointment.js';
import cloudinary from '../configs/cloudinary.js';
import nodemailer from 'nodemailer';
import { html } from 'd3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create lab report directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/labreports');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
export const createLabDetails = async (req, res) => {
  let pdfPath = null;

  try {
    const { appointmentId, patientId, images, patient, ...labReportData } =
      req.body;

    const patientVCid = patient?.patientId;
    const ownerDetails = patient?.owner || {};
    const email = ownerDetails.email;
    const newLabReport = new LabReport({
      appointment: appointmentId,
      patient: patientId,
      patientName: patient?.name || labReportData.patientName,
      images,
      testType: labReportData.testType,
      technician: labReportData.technician,
      datePerformed: labReportData.datePerformed,
      generalObservations: labReportData.generalObservations,
      medicalFindings: labReportData.medicalFindings,
      recommendedFollowUp: labReportData.recommendedFollowUp,
      status: 'Completed',
    });

    try {
      // Generate PDF
      const { filePath, fileName } = await generateLabReportPDF(
        newLabReport,
        patientVCid,
        ownerDetails
      );
      pdfPath = filePath;
      const localFolder = path.join(__dirname, '../uploads/labreports');
      if (!fs.existsSync(localFolder)) {
        fs.mkdirSync(localFolder, { recursive: true });
      }

      const localPath = path.join(localFolder, fileName);
      fs.copyFileSync(filePath, localPath); // Save a local copy

      // Upload PDF to Cloudinary
      const pdfUploadResult = await cloudinary.uploader.upload(localPath, {
        folder: 'lab_test_pdfs',
        resource_type: 'raw',
        access_mode: 'public',
      });

      newLabReport.pdfPath = localPath;

      if (email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const htmlFilePath = path.join(
          __dirname,
          '..',
          'templates',
          'labReportEmail.html'
        );
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

        const emailHtml = htmlContent.replace('{{email}}', email || 'Customer');

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Lab Report for ${
            patient?.name || labReportData.patientName
          }`,
          html: emailHtml,
          attachments: [
            {
              filename: fileName,
              path: localPath,
              contentType: 'application/pdf',
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', email);
      } else {
        console.log('No email provided for the owner.');
      }
    } catch (pdfError) {
      console.error('Error generating/uploading PDF:', pdfError);
    }

    const savedLabReport = await newLabReport.save();

    if (appointmentId) {
      await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          status: 'LabTestsPerformed',
          labReportStatus: 'Completed',
          labreport: savedLabReport._id,
        },
        { new: true }
      );
    }

    // Optionally delete the local PDF file after uploading
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    res.status(201).json({
      success: true,
      data: savedLabReport,
      pdfUrl: newLabReport.pdfPath,
    });
  } catch (error) {
    if (pdfPath && fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (cleanupError) {
        console.error('Error cleaning up PDF file:', cleanupError);
      }
    }

    console.error('Error creating lab report:', error);
    res
      .status(500)
      .json({ message: 'Failed to create lab report', error: error.message });
  }
};

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, { folder: 'lab_test_images' })
    );

    const results = await Promise.all(uploadPromises);

    const uploadedImages = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    res.json({ success: true, data: uploadedImages });
  } catch (error) {
    console.error('Error uploading images to Cloudinary:', error);
    res
      .status(500)
      .json({ message: 'Failed to upload images', error: error.message });
  }
};
