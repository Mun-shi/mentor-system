const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../../routes/api/middleware/auth');
const { check, validationResult } = require('express-validator'); 

const PMENTOR = require('../models/PMENTOR');
const UHOD = require('../../../routes/api/models/UHOD');

// @route   GET api/profile/me
// @desk    get current users profile
// @access  private
router.get('/me', auth, async (req, res) => {
    try {
      const profile = await PMENTOR.findOne({user: req.user.id}).populate(
          'user',
          ['name','avatar']
      );
      if(!profile){
          return res.status(400).json({ msg: 'there is no profile for this user'});
      }
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');  
    }
});

// @route   POST api/profile
// @desk    Create or update users profile
// @access  private
router.post(
    '/',
    [
      auth,
     [
      check('name', 'name is required')
      .not()
      .isEmpty(),
      check('id', 'id is required')
      .not()
      .isEmpty(),
      check('mobno', 'mobile number is required')
      .not()
      .isEmpty(),
      check('email', 'email is required')
      .not()
      .isEmpty(),
      check('noOfStudent', 'number of student is required')
      .not()
      .isEmpty(),
      check('mentees', 'mentees is required')
      .not()
      .isEmpty()

     ]
  ],
   async (req, res) =>{
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const {
        name,
        id,
        mobno,
        email,
        noOfStudent,
        mentees
      } = req.body
     
     const profileFields = {};
     profileFields.user = req.user.id;
     if(name) profileFields.name = name;
     if(id) profileFields.id= id;
     if(mobno) profileFields.mobno = mobno;
     if(email) profileFields.email = email;
     if(noOfStudent) profileFields.noOfStudent = noOfStudent;
     if(mentees) profileFields.mentees = mentees;
    
    
     try {
        let profile = await PMENTOR.findOne({ user: req.user.id });
  
        if(profile) {
          //update
          profile= await PMENTOR.findOneAndUpdate(
          { user: req.user.id},
          { $set: profileFields},
          { new: true}
        );
        return res.json(profile);
          }
          //create
          profile = new PMENTOR(profileFields);
          
          await profile.save();
          res.json(profile); 
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error'); 
      }
      
   }
  );  

  
// @route   GET api/profile
// @desk    get all profiles 
// @access  public
router.get('/', async (req, res) => {
    try {
      const profiles = await PMENTOR.find().populate('user', ['name','avatar']);
      res.json(profiles);
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error');
    }
   
   });
   
   // @route   GET api/profile/user/:user_id
   // @desk    get profile by user id 
   // @access  public
   router.get('/user/:user_id', async (req, res) => {
     try {
       const profile = await PMENTOR.findOne({ user: req.params.user_id }).populate('user', ['name','avatar']);
   
       if(!profile) return res.status(400).json({ msg: 'there is no profile for this user' });
       res.json(profile);
     } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
         return res.status(400).json({ msg: 'profile not found' });
        }
        res.status(500).send('Server Error');
     }
    
    });
   
    // @route Delete api profiles
   // @desk  delete profile, user $posts  
   // @access  private
   router.delete('/',auth, async (req, res) => {
     try {
       //@todo - remove users posts
   
       // remove profile 
       await PMENTOR.findOneAndRemove( { user: req.user.id});
       //remove user
       await UHOD.findByIdAndRemove({_id: req.user.id });
   
       res.json({ msg: 'User deleted'});
     } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
     }
    
    });


    module.exports = router;