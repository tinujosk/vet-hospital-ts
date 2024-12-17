import Owner from '../model/Owner.js';

export const getOwners = async (req, res) => {

  try {
    const owners = await Owner.find();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};