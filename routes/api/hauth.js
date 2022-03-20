const express = require('express');
 const router = express.Router();
 const bcrypt = require('bcryptjs');
 const auth = require('../../routes/api/middleware/auth');
 const jwt = require('jsonwebtoken');
 const config = require('config');
 const { check,validationResult } = require('express-validator/check'); 

 const UHOD = require('../../routes/api/models/UHOD'); 

 // @route   GET api/auth    
 // @desk    test route
 // @access  public
 router.get('/', auth, async (req,res) => {
   try {
     const user = await UHOD.findById(req.user.id).select('-password');
     res.json(user);  
   } catch (err) {
     console.error(err.message);
     res.status(500).send('Server Error');  
   }  
 }); 

 // @route   POST api/auth
 // @desk    authenticate user & get token
 // @access  public
 router.post('/',[
 
  check('email','please include a valid email').isEmail(),
  check('password','password is required').exists()  
],
async(req,res) => {
 const errors = validationResult(req);
 if(!errors.isEmpty()){
     return res.status(400).json({ errors: errors.array()}); 
 }

 const { email,password} = req.body;

 try {
    let user = await UHOD.findOne( { email });

    if(!user){
       return res
       .status(400)
       .json({ errors: [{ msg: 'Invalid credentials'}] });
    }
 
 
   const isMatch = await bcrypt.compare(password, user.password);

   if(!isMatch) {
    return res
    .status(400)
    .json({ errors: [{ msg: 'Invalid credentials'}] });

   }
  
 

 const payload = {
     user: {
         id: user.id
     }
 };

 jwt.sign( 
     payload,
     config.get('jwtSecret'),
     {expiresIn: 360000},
     (err, token) => {
       if(err) throw err;
       res.json({ token });
     }
     );

 } catch (err) {
   console.error(err.massage);
   res.status(500).send('server error');   
 } 
}    
); 

 module.exports = router;