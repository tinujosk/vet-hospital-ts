import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { searchMedication } from '../services/medicationService';

const AddMedicationsForm = ({ isModalOpen, closeModal, setMedications }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [errors, setErrors] = useState({
    selectedMedicine: '',
    dosage: '',
    frequency: '',
    duration: '',
  });
  const { t } = useTranslation();

  const validate = () => {
    let tempErrors = {
      selectedMedicine: '',
      dosage: '',
      frequency: '',
      duration: '',
    };
    let isValid = true;

    if (!selectedMedicine) {
      tempErrors.selectedMedicine = t('pleaseSelectMedicine');
      isValid = false;
    }
    if (!dosage) {
      tempErrors.dosage = t('pleaseSelectDosage');
      isValid = false;
    }

    if (!frequency) {
      tempErrors.frequency = t('pleaseSelectFrequency');
      isValid = false;
    }

    if (!duration) {
      tempErrors.duration = t('pleaseSelectDuration');
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSearch = async e => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim()) {
      const response = await searchMedication(term);
      setMedicines(response);
    } else {
      setMedicines([]);
    }
  };

  const handleAddMedicine = () => {
    if (validate()) {
      const newMedication = {
        medication: selectedMedicine._id,
        name: selectedMedicine.name,
        price: selectedMedicine.price,
        dosage,
        frequency,
        duration,
      };

      setMedications(newMedication);
      setSelectedMedicine(null);
      setSearchTerm('');
      setDosage('');
      setFrequency('');
      setDuration('');
      closeModal();
    }
  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth='sm'>
      <DialogTitle>{t('addMedications')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={medicines}
              getOptionLabel={option => option.name}
              onInputChange={(event, value) => setSearchTerm(value)}
              inputValue={searchTerm}
              onChange={(event, newValue) => setSelectedMedicine(newValue)}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('searchMedicine')}
                  variant='outlined'
                  fullWidth
                  onChange={handleSearch}
                  placeholder={`${t('typeToSearch')}...`}
                  error={!!errors.selectedMedicine}
                  helperText={errors.selectedMedicine}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={t('dosage')}
              variant='outlined'
              fullWidth
              value={dosage}
              onChange={e => setDosage(e.target.value)}
              placeholder={t('e500mg')}
              error={!!errors.dosage}
              helperText={errors.dosage}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={t('frequency')}
              variant='outlined'
              fullWidth
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
              placeholder={t('eTwiceADay')}
              error={!!errors.frequency}
              helperText={errors.frequency}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={t('duration')}
              variant='outlined'
              fullWidth
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder={t('eForAWeek')}
              error={!!errors.duration}
              helperText={errors.duration}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='primary'
              onClick={handleAddMedicine}
              fullWidth
            >
              {t('addToPrescription')}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color='secondary'>
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMedicationsForm;
