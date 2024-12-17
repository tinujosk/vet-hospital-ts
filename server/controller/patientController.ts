import Patient from '../model/Patient.js';
import Owner from '../model/Owner.js';
import cloudinary from '../configs/cloudinary.js';

export const createPatient = async (req, res) => {
  
  console.log('Creating patient with data:', req.body);

  try {
    const {
      patientname,
      species,
      breed,
      age,
      gender,
      weight,
      image,
      medicalHistory,
      ownerfname,
      ownerlname,
      address,
      phone,
      email,
    } = req.body;
    const existingOwner = await Owner.findOne({ email });
    console.log('Existing Owner:', existingOwner);

    let ownerData;
    if (existingOwner) {
      ownerData = existingOwner; //
      console.log('Existing Owner:', ownerData);
    } else {
      ownerData = new Owner({
        firstName: ownerfname,
        lastName: ownerlname,
        address,
        phone,
        email,
      });
      await ownerData.save();
      console.log('Created Owner:', ownerData);
    }

    const newPatient = new Patient({
      name: patientname,
      species,
      breed,
      age,
      gender,
      weight,
      medicalHistory,
      image,
      owner: ownerData._id,
    });

    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPatients = async (req, res) => {
  console.log('Fetching all patients...');
  try {
    const patients = await Patient.find().populate('owner');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('owner');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





export const updatePatient = async (req, res) => {
  console.log('Updating patient with data:', req.body);

  try {
      const { 
          name, 
          species, 
          breed, 
          age, 
          gender, 
          weight, 
          medicalHistory,
          owner 
      } = req.body;

 
      if (!req.params.id) {
          return res.status(400).json({ message: 'Patient ID is required' });
      }

      const patient = await Patient.findById(req.params.id).populate('owner');
      if (!patient) return res.status(404).json({ message: 'Patient not found' });

      // Update patient fields
      patient.name = name;
      patient.species = species;
      patient.breed = breed;
      patient.age = age;
      patient.gender = gender;
      patient.weight = weight;
      patient.medicalHistory = Array.isArray(medicalHistory) ? medicalHistory : patient.medicalHistory;

      if (owner) {
          const existingOwner = await Owner.findById(patient.owner);
          if (existingOwner) {
              existingOwner.firstName = owner.firstName;
              existingOwner.lastName = owner.lastName; 
              existingOwner.address = owner.address; 
              existingOwner.phone = owner.phone;
              existingOwner.email = owner.email; 
              await existingOwner.save();
          } else {
   
              const newOwner = new Owner({
                  firstName: owner.firstName,
                  lastName: owner.lastName,
                  address: owner.address,
                  phone: owner.phone,
                  email: owner.email,
              });
              await newOwner.save();
              patient.owner = newOwner._id;          }
      }

      await patient.save();
      res.status(200).json(patient);
  } catch (error) {
      console.error('Error updating patient:', error);
      res.status(500).json({ message: error.message });
  }
};

export const uploadImage = async (req, res) => {
  console.log('Uploading image:', req.file);
  try {
    const file = req.file.path;
    const result = await cloudinary.uploader.upload(file, {
      folder: 'patients',
    });
    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};