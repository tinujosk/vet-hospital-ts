import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Grid2 as Grid,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loading from '../components/Loading';
import AddMedications from '../components/AddMedication';
import MedicationTable from '../components/MedicationTable';
import { getAppointment } from '../services/appointmentService';
import { createPrescription } from '../services/prescriptionService';
import { showSnackbar } from '../slices/snackbarSlice';

const getTreatmentSteps = t => [
  {
    label: t('caseOpenedLabel'),
    description: t('caseOpenedDescription'),
  },
  {
    label: t('preliminaryExaminationLabel'),
    description: t('preliminaryExaminationDescription'),
  },
  {
    label: t('diagnosisAndPrescriptionLabel'),
    description: t('diagnosisAndPrescriptionDescription'),
  },
  {
    label: t('labTestsPerformedLabel'),
    description: t('labTestsPerformedDescription'),
  },
  {
    label: t('treatmentCompletedLabel'),
    description: t('treatmentCompletedDescription'),
  },
];

const statusMap = {
  Pending: 0,
  Prelims: 1,
  Diagnosed: 2,
  LabTestsPerformed: 3,
  Completed: 4,
};

const Treatment = () => {
  const [appointment, setAppointment] = useState();
  const [prescription, setPrescription] = useState({});
  const [medications, setMedications] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ medicalCondition: '' });
  const [labTests, setLabTests] = useState([]);
  const [selectedLabTests, setSelectedLabTests] = useState([]);

  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleDeleteMedications = id => {
    const updatedMedications = medications?.filter(
      medication => medication.medication != id
    );
    setMedications(updatedMedications);
  };

  const validate = () => {
    let tempErrors = { medicalCondition: '' };
    let isValid = true;

    if (!prescription.medicalCondition) {
      tempErrors.medicalCondition = t('medicalConditionRequired');
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const fetchAppointment = async () => {
    try {
      const appointment = await getAppointment(id);
      setAppointment(appointment);
      if (appointment?.prescription) {
        setPrescription(appointment.prescription);
        setMedications(appointment.prescription?.medications);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  useEffect(() => {
    setActiveStep(statusMap[appointment?.status]);
  }, [appointment]);

  const handleChange = e => {
    const { name, value } = e.target;
    setPrescription({
      ...prescription,
      [name]: value,
    });
  };

  const handleLabTestChange = test => {
    setSelectedLabTests(prev =>
      prev.includes(test) ? prev.filter(item => item !== test) : [...prev, test]
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      try {
        const newPrescription = {
          ...prescription,
          medications,
          labTests: selectedLabTests,
          appointment: appointment._id,
        };

        setLoading(true);
        const result = await createPrescription(newPrescription);
        if (result) {
          setLoading(false);
          dispatch(
            showSnackbar({
              message: t('prescriptionAdded'),
              severity: 'success',
            })
          );
          fetchAppointment();
        }
      } catch (error) {
        console.error('Error adding prescription:', error);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
      }}
    >
      <Typography variant='h5' marginBottom={4} fontSize={{ xs: 20, sm: 30 }}>
        {`${t('case')} ${appointment?.appointmentId}`}
        <Typography
          sx={{
            display: { xs: 'block', md: 'inline' },
            marginLeft: { md: '10px' },
            fontWeight: 'normal',
            fontSize: { xs: 16, sm: 20 },
          }}
        >
          (
          {`${t('appointmentFor')}: ${appointment?.patient?.name}, ${
            appointment?.patient?.species
          }, ${appointment?.patient?.age} yrs`}
          )
        </Typography>
      </Typography>

      <Box
        display='flex'
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'center', md: 'space-around', xl: 'center' }}
        gap={4}
      >
        <Box width={{ xs: '100%', md: '35%' }}>
          <Paper
            style={{ padding: '20px', height: '100%' }}
            sx={{ minWidth: 300 }}
          >
            <Typography variant='h5' gutterBottom marginBottom={3}>
              {t('prescription')}
            </Typography>
            {appointment?.status === 'Pending' ? (
              <Typography textAlign='center' variant='h6'>
                {t('preliminaryExaminationRequired')}
              </Typography>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction={'column'}>
                  <Grid
                    xs={12}
                    textAlign='center'
                    sx={{ overflowX: 'auto', width: '100%' }}
                  >
                    <AddMedications
                      isModalOpen={isModalOpen}
                      closeModal={() => setIsModalOpen(false)}
                      setMedications={medication =>
                        setMedications([...medications, medication])
                      }
                    />
                    {medications && medications.length ? (
                      <MedicationTable
                        medications={medications}
                        handleDeleteMedications={handleDeleteMedications}
                      />
                    ) : (
                      <Typography
                        variant='h6'
                        color='gray'
                        textAlign='center'
                        padding={5}
                      >
                        {t('noMedicationsAdded')}
                      </Typography>
                    )}
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={() => setIsModalOpen(true)}
                      sx={{ marginTop: 2 }}
                    >
                      {t('addMedications')}
                    </Button>
                  </Grid>

                  <Grid xs={12}>
                    <TextField
                      label={t('medicalCondition')}
                      name='medicalCondition'
                      value={prescription?.medicalCondition}
                      onChange={handleChange}
                      fullWidth
                      error={!!errors.medicalCondition}
                      helperText={errors.medicalCondition}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      label={t('notes')}
                      name='notes'
                      value={prescription?.notes}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <FormGroup>
                      <Typography variant='h6'>
                        {t('selectLabTests')}
                      </Typography>
                      {['Blood Test', 'X-Ray', 'MRI', 'CT Scan'].map(test => (
                        <FormControlLabel
                          key={test}
                          control={
                            <Checkbox
                              checked={selectedLabTests.includes(test)}
                              onChange={() => handleLabTestChange(test)}
                            />
                          }
                          label={t(test)}
                        />
                      ))}
                    </FormGroup>
                  </Grid>

                  {/* <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={labTestRequired}
                            onChange={handleLabTestChange}
                          />
                        }
                        label="Lab Tests Required"
                      />
                    </FormGroup> */}
                  <Grid xs={12}>
                    {appointment?.prescription && (
                      <Typography
                        gutterBottom
                        sx={{ fontSize: '16px', color: 'red' }}
                      >
                        {t('prescriptionAlreadySubmitted')}
                      </Typography>
                    )}
                    <Button type='submit' variant='contained' color='primary'>
                      {t('submitPrescription')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Paper>
        </Box>
        <Box width={{ xs: '100%', md: '35%' }}>
          <Typography variant='h5' gutterBottom>
            {t('treatmentStatus')}
          </Typography>
          <Stepper activeStep={activeStep} orientation='vertical'>
            {getTreatmentSteps(t).map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === getTreatmentSteps(t).length - 1 ? (
                      <Typography variant='caption'>
                        {' '}
                        {t('lastStep')}
                      </Typography>
                    ) : (
                      <Typography variant='caption'>
                        {index == 0
                          ? `${t('openedOn')}
                          ${new Date(appointment.createdAt).toLocaleString()}`
                          : activeStep === index &&
                            `${t('lastUpdated')} ${new Date(
                              appointment.updatedAt
                            ).toLocaleString()}`}
                      </Typography>
                    )
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>
    </Box>
  );
};

export default Treatment;
