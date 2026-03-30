import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import companyModel from '../models/companyModel.js';

const authController = {
  // GET /login
  showLogin(req, res) {
    res.render('auth/login', { title: 'Login' });
  },

  // GET /register
  showRegister(req, res) {
    res.render('auth/register', { title: 'Create Account' });
  },

  // POST /login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.getByEmail(email);
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }

      if (!user.is_active) {
        req.flash('error', 'Your account has been deactivated. Please contact support.');
        return res.redirect('/login');
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }

      // Store user in session (without password)
      req.session.user = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      };

      // If company user, also store company info
      if (user.role === 'company') {
        const company = await companyModel.getByUserId(user.id);
        if (company) {
          req.session.user.company_id = company.id;
          req.session.user.company_name = company.company_name;
        }
      }

      req.flash('success', `Welcome back, ${user.first_name}!`);

      // Redirect based on role
      if (user.role === 'admin') return res.redirect('/admin');
      if (user.role === 'company') return res.redirect('/company/dashboard');
      return res.redirect('/dashboard');

    } catch (err) {
      next(err);
    }
  },

  // POST /register
  async register(req, res, next) {
    try {
      const { email, password, first_name, last_name, phone, account_type } = req.body;

      // Check if email already exists
      const existingUser = await userModel.getByEmail(email);
      if (existingUser) {
        req.flash('error', 'An account with this email already exists.');
        return res.redirect('/register');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Create user
      const role = account_type === 'company' ? 'company' : 'user';
      const newUser = await userModel.create({
        email, password_hash, first_name, last_name, phone, role,
      });

      // If company, create company profile
      if (role === 'company') {
        const { company_name, industry, company_size, phone, website } = req.body;
        await companyModel.create({
          user_id: newUser.id,
          company_name: company_name || `${first_name}'s Company`,
          industry, company_size, phone, website,
        });
      }

      req.flash('success', 'Account created successfully! Please log in.');
      res.redirect('/login');

    } catch (err) {
      next(err);
    }
  },

  // POST /logout
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) console.error('Session destroy error:', err);
      res.redirect('/');
    });
  },
};

export default authController;
