import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Chip,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getAppointments } from '../services/appointmentService';
import { getPatientById } from '../services/patientService';
import {
  createLabDetails,
  uploadImageToCloudinary,
} from '../services/labService';
import { showSnackbar } from '../slices/snackbarSlice';
import Loading from '../components/Loading';

const LabTechnicianPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [labRequests, setLabRequests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testResultDialog, setTestResultDialog] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const initialTestResults = {
    appointmentId: '',
    patientId: '',
    patientName: '',
    testType: '',
    technician: 'Current Technician',
    datePerformed: new Date().toISOString().split('T')[0],
    generalObservations: '',
    images: [],
    medicalFindings: '',
    recommendedFollowUp: '',
  };

  const [testResults, setTestResults] = useState(initialTestResults);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false); 
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const processLabRequests = async () => {
      setLoading(true);
      const requests = await Promise.all(
        appointments
          .filter(
            appointment =>
              appointment.prescription?.labTests?.length > 0 && // Filter appointments with test types
              appointment.status === 'Diagnosed' // Only show diagnosed appointments
          )
          .map(async appointment => {
            const patientDetails = await getPatientById(
              appointment.patient?._id
            );
            return {
              appointmentId: appointment._id,
              appointmentId1: appointment.appointmentId,
              patientId: patientDetails?._id,
              patientId1: patientDetails?.patientId,
              patientName: patientDetails?.name || 'N/A',
              testType:
                appointment.prescription?.labTests?.join(', ') ||
                'No Lab Tests',
              doctorName: appointment.doctor?.firstName || 'N/A',
              paymentStatus: appointment.payment?.paymentStatus ?? 'Pending',
            };
          })
      );
      setLabRequests(requests);
      setLoading(false);
    };

    if (appointments.length > 0) processLabRequests();
  }, [appointments]);

  const handleImageUpload = async e => {
    const files = e.target.files;
    if (files.length === 0) {
      dispatch(
        showSnackbar({
          message: t('noFilesSelected'),
          severity: 'warning',
        })
      );
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    try {
      const uploadedImages = await uploadImageToCloudinary(formData);
      setTestResults(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
      setImagePreview(prev => [...prev, ...uploadedImages.map(img => img.url)]);
      dispatch(
        showSnackbar({
          message: t('imageUploadSuccess'),
          severity: 'success',
        })
      );
    } catch (error) {
      console.error('Error uploading images:', error.message);
      dispatch(
        showSnackbar({
          message: t('imageUploadFailure'),
          severity: 'error',
        })
      );
    }
  };

  const handleStartTest = async test => {
    if (test.paymentStatus === 'Completed') {
      const patientDetails = await getPatientById(test.patientId);
      setTestResults({
        ...initialTestResults,
        appointmentId: test.appointmentId,
        patientId: test.patientId,
        patientName: test.patientName,
        testType: test.testType,
      });
      setPatientDetails(patientDetails);
      setSelectedTest(test);
      setTestResultDialog(true);
    } else {
      dispatch(
        showSnackbar({
          message: t('testCannotBePerformedPaymentPending'),
          severity: 'error',
        })
      );
    }
  };

  const handleSubmitTestResult = async e => {
    e.preventDefault();
    if (testResults.images.length === 0) {
      dispatch(
        showSnackbar({
          message: t('submitBeforeUpload'),
          severity: 'warning',
        })
      );
      return;
    }

    try {
      await createLabDetails({ ...testResults, patient: patientDetails });
      setLabRequests(prev =>
        prev.filter(
          request => request.appointmentId !== testResults.appointmentId
        )
      );
      dispatch(
        showSnackbar({
          message: t('labReportSubmitSuccess'),
          severity: 'success',
        })
      );
      setTestResultDialog(false);
      setTestResults(initialTestResults);
      setImagePreview([]);
    } catch (error) {
      console.error('Failed to submit lab details:', error.message);
      dispatch(
        showSnackbar({
          message: t('labReportSubmitFailure'),
          severity: 'error',
        })
      );
    }
  };

  const renderTestCards = tests => {
    return tests.map(test => (
      <Grid item xs={12} sm={6} md={4} key={test.appointmentId}>
        <Card>
          <CardContent>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Chip
                label={test.paymentStatus === 'Completed' ? 'Paid' : 'Unpaid'}
                style={{
                  backgroundColor:
                    test.paymentStatus === 'Completed' ? 'green' : 'red',
                  color: 'white',
                }}
              />
            </div>
            <Typography variant='h6'>{test.patientName}</Typography>
            <Typography color='textSecondary' gutterBottom>
              {`${t('patientId')}: ${test.patientId1 || 'N/A'}`}
            </Typography>
            <Typography color='textSecondary' gutterBottom>
              {`${t('appointmentId')}: ${test.appointmentId1 || 'N/A'}`}
            </Typography>
            <Typography>
              {`${t('testType')}: ${test.testType || 'N/A'}`}
            </Typography>
            <Typography>
              {`${t('doctor')}: ${test.doctorName || 'N/A'}`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => handleStartTest(test)}
              disabled={test.paymentStatus !== 'Completed'}
              style={{
                backgroundColor:
                  test.paymentStatus === 'Completed' ? 'green' : '#d32f2f',
                color: 'white',
              }}
              variant='contained'
            >
              {test.paymentStatus === 'Completed'
                ? t('performTest')
                : t('paymentPendingText')}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h4' gutterBottom mb={4}>
          {t('summaryOfPendingTests')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h5' gutterBottom>
              {`${t('paidTests')} (
              ${
                labRequests.filter(r => r.paymentStatus === 'Completed').length
              })`}
            </Typography>
            <Grid container spacing={2}>
              {renderTestCards(
                labRequests.filter(r => r.paymentStatus === 'Completed')
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h5' gutterBottom>
              {`${t('paymentPendingTests')} (
              ${
                labRequests.filter(r => r.paymentStatus !== 'Completed').length
              })`}
            </Typography>
            <Grid container spacing={2}>
              {renderTestCards(
                labRequests.filter(r => r.paymentStatus !== 'Completed')
              )}
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          open={testResultDialog}
          onClose={() => setTestResultDialog(false)}
          maxWidth='md'
          fullWidth
        >
          <DialogTitle>
            {`${t('labTestResults')} - ${testResults.patientName}`}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmitTestResult}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Test Type'
                    value={testResults.testType}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={t('generalObservations')}
                    value={testResults.generalObservations}
                    onChange={e =>
                      setTestResults(prev => ({
                        ...prev,
                        generalObservations: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={t('medicalFindings')}
                    value={testResults.medicalFindings}
                    onChange={e =>
                      setTestResults(prev => ({
                        ...prev,
                        medicalFindings: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('recommendedFollowUp')}
                    value={testResults.recommendedFollowUp}
                    onChange={e =>
                      setTestResults(prev => ({
                        ...prev,
                        recommendedFollowUp: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept='image/*'
                    type='file'
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id='lab-image-upload'
                  />
                  <label htmlFor='lab-image-upload'>
                    <Button variant='outlined' component='span'>
                      {t('uploadImages')}
                    </Button>
                  </label>
                </Grid>
                {imagePreview.length > 0 && (
                  <Grid item xs={12}>
                    <Box display='flex' flexWrap='wrap' gap={2}>
                      {imagePreview.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt='preview'
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setTestResultDialog(false)}
              color='secondary'
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleSubmitTestResult}
              color='primary'
              variant='contained'
            >
              {t('submit')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default LabTechnicianPage;
