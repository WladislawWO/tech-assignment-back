const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const { validationResult } = require('express-validator');

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors })
      }
      const { name, password } = req.body;
      const candidate = await User.findOne({ name });
      if(candidate) {
        return res.status(400).json({ message: 'User already exist '})
      }

      const hashPassword = bcrypt.hashSync(password, 7)
      const user = new User({ name, password: hashPassword })
      await user.save();

      const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '24h' });

      return res.json({ token, name: user.name })
    } catch(e) {
      return res.status(400);
    }
  }

  async login(req, res) {
    try {
      const { name, password } = req.body;
      const user = await User.findOne({ name })
      if(!user) {
        return res.status(400).json({ message: 'User not found'})
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if(!validPassword) {
        return res.status(400).json({ message: 'Incorrect user name or password'})
      }

      const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '24h' });
      return res.json({ token, name: user.name })

    } catch(e) {
      return res.status(400);
    }
  }

  async getUsers(req, res) {
    try {
      const { authorization } = req.headers;
      if(!authorization) {
        return res.json()
      }
      const token = jwt.verify(authorization.replace('Bearer ', ''), secretKey);
      
      const user = await User.findOne({ _id: token.id });
      res.json({ name: user.name })
    } catch(e) {
      if(e.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired'})
      }
      return res.status(400);
    }
  }
}

module.exports = new AuthController();