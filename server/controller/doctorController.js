import Staff from '../model/Staff.js';

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Staff.find()
      .populate({
        path: 'user',
        match: { role: 'doctor' },
        select: 'email role',
      })
      .exec();

    const filteredDoctors = doctors.filter(doc => doc.user !== null);

    res.status(200).json(filteredDoctors);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error fetching doctors', details: error.message });
  }
};
