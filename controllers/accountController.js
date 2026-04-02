import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import companyModel from '../models/companyModel.js';
 
const accountController = {
  // GET /account
  async showAccount(req, res, next) {
    try {
      const user = await userModel.getById(req.session.user.id);
      let company = null;
      if (user.role === 'company') {
        company = await companyModel.getByUserId(user.id);
      }
      res.render('account/index', {
        title: 'Account Settings',
        user,
        company,
      });
    } catch (err) {
      next(err);
    }
  },
 
  // POST /account/profile
  async updateProfile(req, res, next) {
    try {
      const { first_name, last_name, email, phone } = req.body;
 
      // Check if email is taken by another user
      const existing = await userModel.getByEmail(email);
      if (existing && existing.id !== req.session.user.id) {
        req.flash('error', 'This email is already in use by another account.');
        return res.redirect('/account');
      }
 
      const updated = await userModel.updateProfile(req.session.user.id, {
        first_name, last_name, email, phone
      });
 
      req.session.user.first_name = updated.first_name;
      req.session.user.last_name = updated.last_name;
      req.session.user.email = updated.email;
      req.session.user.phone = updated.phone;

 
      req.flash('success', 'Profile updated successfully.');
      res.redirect('/account');
    } catch (err) {
      next(err);
    }
  },
 
  // POST /account/password
  async changePassword(req, res, next) {
    try {
      const { current_password, new_password, confirm_password } = req.body;
 
      if (new_password !== confirm_password) {
        req.flash('error', 'New passwords do not match.');
        return res.redirect('/account');
      }
 
      if (new_password.length < 8) {
        req.flash('error', 'New password must be at least 8 characters.');
        return res.redirect('/account');
      }
 
      // Verify current password
      const user = await userModel.getByEmail(req.session.user.email);
      const isMatch = await bcrypt.compare(current_password, user.password_hash);
      if (!isMatch) {
        req.flash('error', 'Current password is incorrect.');
        return res.redirect('/account');
      }
 
      // Hash new password and update
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(new_password, salt);
      await userModel.updatePassword(user.id, password_hash);
 
      req.flash('success', 'Password changed successfully.');
      res.redirect('/account');
    } catch (err) {
      next(err);
    }
  },
 
  // POST /account/notifications
  async updateNotifications(req, res, next) {
    try {
      const email_notifications = req.body.email_notifications === 'on';
      const ticket_updates = req.body.ticket_updates === 'on';
      const consultation_updates = req.body.consultation_updates === 'on';
 
      await userModel.updateNotificationPrefs(req.session.user.id, {
        email_notifications,
        ticket_updates,
        consultation_updates,
      });
 
      req.flash('success', 'Notification preferences updated.');
      res.redirect('/account');
    } catch (err) {
      next(err);
    }
  },
 
  // POST /account/delete
  async deleteAccount(req, res, next) {
    try {
      const { confirm_email } = req.body;
 
      if (confirm_email !== req.session.user.email) {
        req.flash('error', 'Email does not match. Account was not deleted.');
        return res.redirect('/account');
      }
 
      // Prevent admin from deleting themselves
      if (req.session.user.role === 'admin') {
        req.flash('error', 'Admin accounts cannot be deleted from this page.');
        return res.redirect('/account');
      }
 
      await userModel.deleteAccount(req.session.user.id);
 
      req.session.destroy(() => {
        res.redirect('/');
      });
    } catch (err) {
      next(err);
    }
  },
};
 
export default accountController;