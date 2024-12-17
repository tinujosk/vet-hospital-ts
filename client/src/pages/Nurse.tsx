import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Autocomplete,
  Container,
  FormHelperText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PatientDetails from '../components/PatientDetails';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; 
import {
  createPatient,
  getPatients,
  getPatientById,
  uploadPatientImage,
} from '../services/patientService';
import {
  createAppointment,
  getAppointments,
  updateAppointment,
} from '../services/appointmentService';
import { getOwners } from '../services/ownerService';
import { getDoctors } from '../services/doctorService';
import GenericTable from '../components/GenericTable';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import Loading from '../components/Loading';

let ownerData = [];

const columns = [
  { headerName: 'Appointment ID', field: 'appointmentId' },
  { headerName: 'Doctor ID', field: 'doctor.staffId' },
  { headerName: 'Appointment Date', field: 'appointmentDate' },
  { headerName: 'Patient Name', field: 'patient.name' },
  { headerName: 'Slot', field: 'timeSlot' },
  { headerName: 'Reason', field: 'reason' },
  { headerName: 'Created At', field: 'createdAt' },
  { headerName: 'Status', field: 'status' },
];

function NursePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [editAppointmentModalOpen, setEditAppointmentModalOpen] =
    useState(false);
  const [isSameOwner, setIsSameOwner] = useState(true);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { t } = useTranslation();

  const initialPatientState = {
    patientname: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    weight: '',
    medicalHistory: '',
    ownerId: '',
    ownerfname: '',
    ownerlname: '',
    address: '',
    phone: '',
    email: '',
  };

  const initialAppointmentState = {
    appointmentId: '',
    doctorID: '',
    appointmentDate: '',
    timeSlot: '',
    patient: '',
    patientName: '',
    reason: '',
    status: 'Pending',
  };

  const [newPatient, setNewPatient] = useState(initialPatientState);
  const [newAppointment, setNewAppointment] = useState(initialAppointmentState);
  const [editedAppointment, setEditedAppointment] = useState(
    initialAppointmentState
  );
  const [patients, setPatients] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        const options = data.map(patient => ({
          value: patient._id,
          label: `${patient.name} (${patient.patientId})`,
        }));

        setPatients(data);
        setPatientOptions(options);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
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
    const fetchOwners = async () => {
      try {
        const data = await getOwners();
        ownerData = data;
        const options = data.map(owner => ({
          value: owner.ownerId,
          label: `${owner.firstName} ${owner.lastName} (${owner.email})`,
        }));
        setOwnerOptions(options);
      } catch (error) {
        console.error('Failed to fetch owners:', error);
      }
    };

    fetchOwners();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        const options = data.map(doctor => ({
          value: doctor._id,
          label: `${doctor.firstName} ${doctor.lastName} (ID: ${doctor.staffId})`,
        }));
        console.log('Doctor Options:', options);

        setDoctorOptions(options);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleImageUpload = event => {
    console.log('Image Upload:', event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRowClick = async row => {
    const result = await getPatientById(row?.patient?._id);
    if (result) {
      setSelectedRow(row);
      setSelectedPatient(result);
      setDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditMode(false);
  };

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    setNewPatient(initialPatientState);
    setErrors({});
  };

  const handleOpenAppointmentModal = () => {
    setAppointmentModalOpen(true);
  };

  const handleCloseAppointmentModal = () => {
    setAppointmentModalOpen(false);
    setErrors({});
    setNewAppointment(initialAppointmentState);
  };

  const handleOpenEditAppointmentModal = appointment => {
    setEditedAppointment(appointment);
    setEditAppointmentModalOpen(true);
  };

  const handleCloseEditAppointmentModal = () => {
    setEditAppointmentModalOpen(false);
    setEditedAppointment(initialAppointmentState);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const handleAppointmentInputChange = e => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  const handleEditAppointmentInputChange = e => {
    const { name, value } = e.target;
    setEditedAppointment({ ...editedAppointment, [name]: value });
  };

  const handleSubmit = async event => {
    console.log('New Patient:', newPatient);
    event.preventDefault();
    if (Validite()) {
      try {
        let imageUrl = '';
        if (imageFile) {
          imageUrl = await uploadPatientImage(imageFile);
        }

        const patientData = {
          ...newPatient,
          image: imageUrl,
        };
        await createPatient(patientData);
        setCreateModalOpen(false);
        setNewPatient(initialPatientState);
        setImagePreview(null);
        setImageFile(null);
      } catch (error) {
        console.error('Failed to create patient:', error);
      }
    }
  };

  const Validite = () => {
    let tempErrors = {
      patientname: '',
      species: '',
      breed: '',
      age: '',
      weight: '',
      gender: '',
      ownerfname: '',
      ownerlname: '',
      address: '',
      phone: '',
      email: '',
    };
    let isValid = true;

    const alphabeticRegex = /^[A-Za-z\s]+$/;
    const alphanumericRegex = /^[A-Za-z0-9\s]+$/;
    const numericRegex = /^\d+$/;
    const weightRegex = /^\d+(\.\d{1,2})?$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!newPatient.patientname) {
      tempErrors.patientname = 'Patient Name is required';
      isValid = false;
    } else if (!alphabeticRegex.test(newPatient.patientname)) {
      tempErrors.patientname = 'Patient Name should only contain alphabets';
      isValid = false;
    }

    if (!newPatient.species) {
      tempErrors.species = 'Species is required';
      isValid = false;
    } else if (!alphabeticRegex.test(newPatient.species)) {
      tempErrors.species = 'Species should only contain alphabets';
      isValid = false;
    }

    if (!newPatient.breed) {
      tempErrors.breed = 'Breed is required';
      isValid = false;
    } else if (!alphanumericRegex.test(newPatient.breed)) {
      tempErrors.breed = 'Breed can only contain alphabets and numbers';
      isValid = false;
    }

    if (!newPatient.age) {
      tempErrors.age = 'Age is required';
      isValid = false;
    } else if (!numericRegex.test(newPatient.age)) {
      tempErrors.age = 'Age should only contain numbers';
      isValid = false;
    }

    if (!newPatient.weight) {
      tempErrors.weight = 'Weight is required';
      isValid = false;
    } else if (!weightRegex.test(newPatient.weight)) {
      tempErrors.weight = 'Weight should be a valid number (e.g., 10 or 10.5)';
      isValid = false;
    }

    if (
      newPatient.gender === '' ||
      newPatient.gender === null ||
      newPatient.gender === undefined
    ) {
      tempErrors.gender = 'Gender is required';
      isValid = false;
    }

    if (!newPatient.ownerfname) {
      tempErrors.ownerfname = 'Owner First Name is required';
      isValid = false;
    } else if (!alphabeticRegex.test(newPatient.ownerfname)) {
      tempErrors.ownerfname = 'Owner First Name should only contain alphabets';
      isValid = false;
    }

    if (!newPatient.ownerlname) {
      tempErrors.ownerlname = 'Owner Last Name is required';
      isValid = false;
    } else if (!alphabeticRegex.test(newPatient.ownerlname)) {
      tempErrors.ownerlname = 'Owner Last Name should only contain alphabets';
      isValid = false;
    }

    if (!newPatient.address) {
      tempErrors.address = 'Address is required';
      isValid = false;
    } else if (!alphanumericRegex.test(newPatient.address)) {
      tempErrors.address = 'Address should contain alphabets and numbers';
      isValid = false;
    }

    if (!newPatient.phone) {
      tempErrors.phone = 'Phone is required';
      isValid = false;
    } else if (!phoneRegex.test(newPatient.phone)) {
      tempErrors.phone = 'Phone number should be 10 digits';
      isValid = false;
    }

    if (!newPatient.email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(newPatient.email)) {
      tempErrors.email = 'Invalid email format';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleAppointmentSubmit = async event => {
    console.log('New Appointment:', newAppointment);
    event.preventDefault();

    if (appointmentValidate()) {
      try {
        const createdAppointment = await createAppointment(newAppointment);
        setAppointments(prev => [...prev, createdAppointment]);
        setAppointmentModalOpen(false);
        setNewAppointment(initialAppointmentState);
      } catch (error) {
        console.error('Failed to create appointment:', error);
      }
    }
  };

  const generateTimeSlots = () => {
    const startTime = 9.5;
    const endTime = 16;
    const breakStart = 12.5;
    const breakEnd = 13.5;
    const interval = 0.5;
    const timeSlots = [];

    for (let time = startTime; time < endTime; time += interval) {
      if (time >= breakStart && time < breakEnd) continue;
      const hours = Math.floor(time);
      const minutes = time % 1 === 0 ? '00' : '30';
      const formattedTime = `${hours > 12 ? hours - 12 : hours}:${minutes} ${hours >= 12 ? 'PM' : 'AM'
        }`;
      timeSlots.push(formattedTime);
    }

    return timeSlots;
  };

  const timeSlotOptions = generateTimeSlots();

  const appointmentValidate = () => {
    let tempErrors = {
      patient: '',
      doctorID: '',
      appointmentDate: '',
      timeSlot: '',
      reason: '',
    };
    let isValid = true;

    if (!newAppointment.patient) {
      tempErrors.patient = 'Patient is required';
      isValid = false;
    }

    if (!newAppointment.doctorID) {
      tempErrors.doctorID = 'Doctor ID is required';
      isValid = false;
    }

    if (!newAppointment.appointmentDate) {
      tempErrors.appointmentDate = 'Appointment Date is required';
      isValid = false;
    }

    if (!newAppointment.timeSlot) {
      tempErrors.timeSlot = 'Time Slot is required';
      isValid = false;
    }

    const reasonPattern = /^[a-zA-Z0-9\s]+$/;
    if (!newAppointment.reason) {
      tempErrors.reason = 'Reason is required';
      isValid = false;
    } else if (!reasonPattern.test(newAppointment.reason)) {
      tempErrors.reason = 'Reason can only contain letters and numbers';
      isValid = false;
    }

    setErrors(tempErrors);
    console.log('Errors:', tempErrors);
    console.log('isValid:', isValid);

    return isValid;
  };

  const handleEditAppointmentSubmit = async (id, updatedData) => {
    try {
      handleCloseEditAppointmentModal();
      const updatedAppointment = await updateAppointment(id, updatedData);
      setAppointments(prev =>
        prev.map(appointment =>
          appointment._id === id ? updatedAppointment : appointment
        )
      );
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          marginTop: 4,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, marginBottom: { xs: 2, sm: 4 } }}>
          <Box
            onClick={handleOpenCreateModal}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: 3,
              borderRadius: 8,
              cursor: 'pointer',
              width: 200,
              height: 80,
              textAlign: 'center',
              backgroundColor: '#ffffff',
              border: '2px solid #1976d2', 
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', 
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)', 
              },
            }}
          >
            <PersonAddAltIcon
              sx={{
                color: '#1976d2',
                fontSize: 60, 
                mb: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: '#1976d2',
                fontWeight: 'bold',
              }}
            >
              {t('registerPatient')}
            </Typography>
          </Box>
          <Box
            onClick={handleOpenAppointmentModal}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: 3,
              borderRadius: 8,
              cursor: 'pointer',
              width: 200,
              height: 80,
              textAlign: 'center',
              backgroundColor: '#ffffff',
              border: '2px solid #d32f2f', 
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', 
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)', 
              },
            }}
          >
            <EventAvailableIcon
              sx={{
                color: '#d32f2f', 
                fontSize: 60,
                mb: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: '#d32f2f', 
                fontWeight: 'bold',
              }}
            >
              {t('createAppointment')}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant='h2'
          component='h2'
          marginBottom={2}
          fontSize={{ xs: 20, sm: 30 }}
        >
          {t('appointments')}
        </Typography>

        <GenericTable
          columns={columns}
          data={appointments}
          actions={['edit']}
          onRowClick={row => handleRowClick(row)}
          onEdit={(row, e) => {
            e.stopPropagation();
            handleOpenEditAppointmentModal(row);
          }}
        />
      </Container>

      {/* Patient Details Drawer */}
      <PatientDetails
        patientDetails={{
          patientData: selectedPatient,
          ownerData: selectedPatient?.owner,
        }}
        drawerOpen={drawerOpen}
        handleCloseDrawer={handleCloseDrawer}
      />

      {/* Create Patient Modal */}
      <Dialog open={createModalOpen} onClose={handleCloseCreateModal}>
        <DialogTitle> {t('registerPatient')}</DialogTitle>

        <DialogContent>
          <Typography>{t('patientDetails')}</Typography>
          <TextField
            margin='dense'
            label={t('patientName')}
            name='patientname'
            value={newPatient.patientname}
            onChange={handleInputChange}
            error={errors.patientname}
            helperText={errors.patientname}
            fullWidth
            required
          />
          <TextField
            margin='dense'
            label={t('species')}
            name='species'
            value={newPatient.species}
            onChange={handleInputChange}
            error={errors.species}
            helperText={errors.species}
            fullWidth
            required
          />
          <TextField
            margin='dense'
            label={t('breed')}
            name='breed'
            value={newPatient.breed}
            onChange={handleInputChange}
            error={errors.breed}
            helperText={errors.breed}
            fullWidth
            required
          />
          <TextField
            margin='dense'
            label={t('age')}
            name='age'
            value={newPatient.age}
            onChange={handleInputChange}
            error={errors.age}
            helperText={errors.age}
            fullWidth
            required
            type='number'
          />
          <input
            accept='image/*'
            type='file'
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id='patient-image-upload'
          />
          <label htmlFor='patient-image-upload'>
            <Button variant='outlined' component='span' color='primary'>
              {t('uploadImage')}
            </Button>
          </label>

          {imagePreview && (
            <div style={{ margin: '10px 0' }}>
              <Typography variant='body2'>Image Preview:</Typography>
              <img
                src={imagePreview}
                alt='Patient'
                width='100%'
                height='auto'
              />
            </div>
          )}

          <FormControl fullWidth margin='dense' required>
            <InputLabel id='gender-label'>{t('gender')}</InputLabel>
            <Select
              labelId='gender-label'
              name='gender'
              value={newPatient.gender || ''}
              onChange={handleInputChange}
              label={t('gender')}
            >
              <MenuItem value=''>{t('selectGender')}</MenuItem>
              <MenuItem value='Male'>{t('male')}</MenuItem>
              <MenuItem value='Female'>{t('female')}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin='dense'
            label={t('weight')}
            name='weight'
            value={newPatient.weight}
            onChange={handleInputChange}
            error={errors.weight}
            helperText={errors.weight}
            fullWidth
            required
          />

          <Typography variant='subtitle1' gutterBottom>
            {t('ownerDetails')}
          </Typography>

          <FormControl>
            <RadioGroup
              row
              value={isSameOwner ? 'same' : 'new'}
              onChange={e => setIsSameOwner(e.target.value === 'same')}
            >
              <FormControlLabel
                value='same'
                control={<Radio />}
                label={t('existingOwner')}
              />
              <FormControlLabel
                value='new'
                control={<Radio />}
                label={t('newOwner')}
              />
            </RadioGroup>
          </FormControl>
          {isSameOwner ? (
            <Autocomplete
              options={ownerOptions}
              getOptionLabel={option => option.label}
              onChange={(event, selectedOption) => {
                console.log('Selected Option:', selectedOption);
                if (selectedOption) {
                  const tst = ownerData.find(
                    owner => owner.ownerId === selectedOption.value
                  );
                  setNewPatient({
                    ...newPatient,
                    ownerId: tst.ownerId,
                    ownerfname: tst.firstName,
                    ownerlname: tst.lastName,
                    address: tst.address,
                    phone: tst.phone,
                    email: tst.email,
                  });
                }
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('selectOwner')}
                  placeholder='Select Owner'
                  required
                  margin='normal'
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
            />
          ) : (
            <>
              <TextField
                margin='dense'
                label='Owner First Name'
                name='ownerfname'
                value={newPatient.ownerfname}
                onChange={handleInputChange}
                error={errors.ownerfname}
                helperText={errors.ownerfname}
                fullWidth
                required
              />

              <TextField
                margin='dense'
                label='Owner Last Name'
                name='ownerlname'
                value={newPatient.ownerlname}
                onChange={handleInputChange}
                error={errors.ownerlname}
                helperText={errors.ownerlname}
                fullWidth
                required
              />
              <TextField
                margin='dense'
                label='Address'
                name='address'
                value={newPatient.address}
                onChange={handleInputChange}
                error={errors.address}
                helperText={errors.address}
                fullWidth
                required
              />

              <TextField
                margin='dense'
                label='Owner Email'
                name='email'
                value={newPatient.email}
                onChange={handleInputChange}
                error={errors.email}
                helperText={errors.email}
                fullWidth
                required
              />

              <TextField
                margin='dense'
                label='Owner Phone Number'
                name='phone'
                value={newPatient.phone}
                onChange={handleInputChange}
                error={errors.phone}
                helperText={errors.phone}
                fullWidth
                required
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal} color='primary'>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} color='primary'>
            {t('create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Appointment Modal */}
      <Dialog open={appointmentModalOpen} onClose={handleCloseAppointmentModal}>
        <DialogTitle>{t('createNewAppointment')}</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={patientOptions}
            getOptionLabel={option => option.label}
            onChange={(event, selectedOption) => {
              if (selectedOption) {
                setNewAppointment({
                  ...newAppointment,
                  patient: selectedOption.value,
                  patientName: selectedOption.label.split(' (')[0],
                });
              }
            }}
            renderInput={params => (
              <TextField
                {...params}
                label={t('selectPatient')}
                error={!!errors.patient}
                helperText={errors.patient}
                required
                placeholder='Select Patient'
                margin='normal'
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            sx={{
              '& .MuiAutocomplete-listbox': {
                maxHeight: 200,
                overflowY: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              '& .MuiAutocomplete-option': {
                padding: '10px',
                backgroundColor: 'transparent',
                '&[aria-selected="true"]': {
                  color: '#000',
                },
                '&:hover': {
                  backgroundColor: 'rgba(224, 224, 224, 0.9)',
                },
              },
            }}
          />
          <Autocomplete
            options={doctorOptions}
            getOptionLabel={option => option.label}
            onChange={(event, selectedOption) => {
              if (selectedOption) {
                setNewAppointment({
                  ...newAppointment,
                  doctorID: selectedOption.value,
                  doctorName: selectedOption.label.split(' (')[0],
                  doctor: selectedOption.value,
                });
              }
            }}
            renderInput={params => (
              <TextField
                {...params}
                label={t('selectDoctor')}
                error={!!errors.doctor}
                helperText={errors.doctor}
                required
                placeholder='Select Doctor'
                margin='normal'
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            sx={{
              '& .MuiAutocomplete-listbox': {
                maxHeight: 200,
                overflowY: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              '& .MuiAutocomplete-option': {
                padding: '10px',
                backgroundColor: 'transparent',
                '&[aria-selected="true"]': {
                  color: '#000',
                },
                '&:hover': {
                  backgroundColor: 'rgba(224, 224, 224, 0.9)',
                },
              },
            }}
          />

          <TextField
            margin='dense'
            type='date'
            name='appointmentDate'
            value={newAppointment.appointmentDate}
            onChange={handleAppointmentInputChange}
            error={errors.appointmentDate}
            helperText={errors.appointmentDate}
            fullWidth
            required
          />
          <FormControl fullWidth margin='dense' required>
            <InputLabel id='time-slot-label'>{t('selectTimeSlot')}</InputLabel>
            <Select
              labelId='time-slot-label'
              name='timeSlot'
              value={newAppointment.timeSlot || ''}
              onChange={handleAppointmentInputChange}
              label={t('selectTimeSlot')}
            >
              {timeSlotOptions.map((slot, index) => (
                <MenuItem key={index} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
            {errors.timeSlot && (
              <FormHelperText error>{errors.timeSlot}</FormHelperText>
            )}
          </FormControl>

          <TextField
            margin='dense'
            label={t('reason')}
            name='reason'
            value={newAppointment.reason}
            onChange={handleAppointmentInputChange}
            error={errors.reason}
            helperText={errors.reason}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAppointmentModal} color='primary'>
            {t('cancel')}
          </Button>
          <Button onClick={handleAppointmentSubmit} color='primary'>
            {t('create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Appointment Modal */}
      <Dialog
        open={editAppointmentModalOpen}
        onClose={handleCloseEditAppointmentModal}
      >
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={doctorOptions}
            getOptionLabel={option => option.label}
            value={
              editedAppointment.doctorID
                ? doctorOptions.find(
                  option => option.value === editedAppointment.doctorID
                ) || null
                : null
            }
            onChange={(event, selectedOption) => {
              if (selectedOption) {
                setEditedAppointment({
                  ...editedAppointment,
                  doctorID: selectedOption.value,
                  doctorName: selectedOption.label.split(' (')[0],
                  doctor: selectedOption.value,
                });
              }
            }}
            renderInput={params => (
              <TextField
                {...params}
                label='Select Doctor'
                error={!!errors.doctor}
                helperText={errors.doctor}
                required
                placeholder='Select Doctor'
                margin='normal'
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.value === value?.value
            }
            sx={{
              '& .MuiAutocomplete-listbox': {
                maxHeight: 200,
                overflowY: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              '& .MuiAutocomplete-option': {
                padding: '10px',
                backgroundColor: 'transparent',
                '&[aria-selected="true"]': {
                  color: '#000',
                },
                '&:hover': {
                  backgroundColor: 'rgba(224, 224, 224, 0.9)',
                },
              },
            }}
          />

          <TextField
            margin='dense'
            label='Appointment Date'
            type='datetime'
            name='appointmentDate'
            value={editedAppointment.appointmentDate}
            onChange={handleEditAppointmentInputChange}
            fullWidth
            required
            error={!!errors.appointmentDate}
            helperText={errors.appointmentDate}
          />

          <FormControl fullWidth margin='dense' required>
            <InputLabel id='time-slot-label'>Time Slot</InputLabel>
            <Select
              labelId='time-slot-label'
              name='timeSlot'
              value={editedAppointment.timeSlot || ''}
              onChange={handleEditAppointmentInputChange}
              error={!!errors.timeSlot}
              label='Select Time Slot'
            >
              {timeSlotOptions.map((slot, index) => (
                <MenuItem key={index} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
            {errors.timeSlot && (
              <FormHelperText error>{errors.timeSlot}</FormHelperText>
            )}
          </FormControl>

          <TextField
            margin='dense'
            label='Reason'
            name='reason'
            value={editedAppointment.reason}
            onChange={handleEditAppointmentInputChange}
            fullWidth
            required
            error={!!errors.reason}
            helperText={errors.reason}
          />
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name='status'
              value={editedAppointment.status}
              onChange={handleEditAppointmentInputChange}
              fullWidth
              required
            >
              <MenuItem value='Pending'>Pending</MenuItem>
              <MenuItem value='Prelims'>Prelims Done</MenuItem>
              <MenuItem value='Cancelled'>Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditAppointmentModal}>Cancel</Button>
          <Button
            onClick={() =>
              handleEditAppointmentSubmit(
                editedAppointment._id,
                editedAppointment
              )
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Container>
        <Typography variant='h5' textAlign='center' marginBottom={2}>
          {t('overviewOfAppointments')}
        </Typography>
        <Box
          display='flex'
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent='center'
          alignItems='center'
        >
          <Box>
            <BarChart rawData={appointments} />
          </Box>
          <Box>
            <PieChart rawData={appointments} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default NursePage;
