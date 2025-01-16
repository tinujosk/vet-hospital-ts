import Medication from '../model/Medication.js';

export const getMedications = async (req, res) => {
  const { query } = req.query;
  try {
    const medications = await Medication.find({
      name: { $regex: query, $options: 'i' },
    }).limit(10);
    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
};
