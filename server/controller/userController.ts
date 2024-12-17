import User from '../model/User.js';
import Staff from '../model/Staff.js';
import { sendPasswordEmail, sendResetEmail } from './emailServiceController.js';
import crypto from 'crypto';
import { API_URL } from '../constants.js';

const resetTokenStore = {};

export const createUser = async (req, res) => {
  try {
    const {
      email,
      role,
      password,
      firstName,
      lastName,
      specialization,
      phone,
    } = req.body;

    const newUser = new User({ email, role, password });
    const savedUser = await newUser.save();
    const newStaff = new Staff({
      firstName,
      lastName,
      specialization,
      phone,
      email,
      user: savedUser._id,
    });
    await newStaff.save();
    const emailResponse = await sendPasswordEmail(email, password);
    if (!emailResponse.success) {
      return res
        .status(500)
        .json({ message: 'User created but failed to send email' });
    }
    console.log('User created:', newUser);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res
      .status(500)
      .json({ error: 'Failed to create user "controller error messge"' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    // const UserData = await User.find();
    const staffData = await Staff.find().populate({
      path: 'user',
      select: 'email role',
    });

    if (staffData.length === 0) {
      console.log('No User found.');
    } else {
      console.log('Fetched User Data:');
    }

    res.status(200).json(staffData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to Get user Details' });
  }
};

export const getLoggedInUser = async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'User ID not provided' });
  }
  try {
    // const staffData = await Staff.findOne()
    //   .populate({
    //     path: 'user',
    //     select: '-password',
    //     match: { _id: userId },
    //   })
    //   .exec();

    // const staffData = await Staff.findOne({ user: userId })
    //   .populate({ path: 'user', select: '-password' }) // Populate `user` and exclude `password`
    //   .exec();

    const staffData = await Staff.findOne({ user: userId })
      .populate({ path: 'user', select: '-password' }) // Populate the `user` field and exclude the `password`
      .exec();

    if (!staffData) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staffData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

export const resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  if (!userId || !newPassword) {
    return res
      .status(400)
      .json({ message: 'User ID and new password are required' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password', error });
  }
};

export const sendForgotPasswordEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');

    resetTokenStore[resetToken] = {
      userId: user._id,
      expires: Date.now() + 3600000,
    };
    const resetLink = `${API_URL}/reset-password/${resetToken}`;
    await sendResetEmail(email, resetLink);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
};

export const resetPasswordWithToken = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: 'Token and new password are required' });
  }

  try {
    const tokenData = resetTokenStore[token];

    if (!tokenData || tokenData.expires < Date.now()) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired reset token' });
    }

    const { userId } = tokenData;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    delete resetTokenStore[token];

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password', error });
  }
};
