import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getPatients, updatePatient } from '../services/patientService';
import PatientDetails from '../components/PatientDetails';
import GenericTable from '../components/GenericTable';
import Loading from '../components/Loading';

const columns = [
  { headerName: 'Patient Name', field: 'name' },
  { headerName: 'Species', field: 'species' },
  { headerName: 'Age', field: 'age' },
  { headerName: 'Owner First Name', field: 'owner.firstName' },
  { headerName: 'Owner Last Name', field: 'owner.lastName' },
  { headerName: 'Owner Phone', field: 'owner.phone' },
];

function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleRowClick = patient => {
    setSelectedPatient(patient);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedPatient(null);
  };

  const handleUpdatePatient = async updatedPatient => {
    try {
      await updatePatient(updatedPatient._id, updatedPatient);
      const updatedPatients = await getPatients();
      setPatients(updatedPatients);
    } catch (error) {
      console.error('Failed to update patient:', error);
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
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        variant='h2'
        component='h2'
        marginBottom={2}
        fontSize={{ xs: 20, sm: 30 }}
      >
        {t('registeredPatients')}
      </Typography>
      <Container
        maxWidth='lg'
        sx={{
          marginTop: 4,
        }}
      >
        <GenericTable
          columns={columns}
          data={patients}
          onRowClick={row => handleRowClick(row)}
        />
      </Container>
      {selectedPatient && (
        <PatientDetails
          patientDetails={{
            patientData: selectedPatient,
            ownerData: selectedPatient.owner,
          }}
          drawerOpen={drawerOpen}
          handleCloseDrawer={handleCloseDrawer}
          handleUpdatePatient={handleUpdatePatient}
          editMode={true}
        />
      )}
    </Box>
  );
}

export default PatientPage;
