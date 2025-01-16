import Appointment from '../model/Appointment.js';

export const createAppointment = async (req, res) => {
  console.log('Creating appointment with data:', req.body);
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('patient')
      .populate('doctor')
      .populate('payment');

    return res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res
      .status(500)
      .json({ message: 'Failed to create appointment', error: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
    .populate('patient')
    .populate('prescription')
    .populate('doctor')
    .populate('payment');

    if (appointments.length === 0) {
      console.log('No appointments found.');
    } else {
      appointments.forEach((appointment, index) => {});
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('prescription')
      .populate('doctor');
    if (!appointment)
      return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  const { _id, ...updateData } = req.body;
  console.log('Updating appointment with ID:', _id);
  console.log('Update data:', updateData);

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    ).populate('patient')
    .populate('doctor');
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return res
      .status(500)
      .json({ message: 'Failed to update appointment', error: error.message });
  }
};
