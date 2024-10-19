const express = require('express')
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt')
const {USERNAME, PASSWORD_HASH, JWT_SECRET } = require('../constants/constants')



const router = new express.Router()

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({message: 'Username and password are required'});
    }

    try {
        if (USERNAME !== username) {
            return res.status(401).send({message: 'Invalid username or password'});
        }

       bcrypt.compare(password, PASSWORD_HASH, (err, result)=>{
            if (err) {
                return res.status(500).json({ message: 'Error comparing password', error: err });
              }
          
              if (!result) {
                return res.status(401).json({ message: 'Invalid password' });
              }
              const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
              res.json({ token });
        })
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
});


module.exports = router;