const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../../routes/api/middleware/auth');
const { check, validationResult } = require('express-validator'); 

const PSTUD = require('../models/PSTUD');
const UHOD = require('../../../routes/api/models/UHOD');
const { route } = require('express/lib/application');

// @route   GET api/profile/me
// @desk    get current users profile
// @access  private
router.get('/me', auth, async (req, res) => {
    try {
      const profile = await PSTUD.findOne({user: req.user.id}).populate(
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
      check('regNo', 'register number is required')
      .not()
      .isEmpty(),
      check('rollNo', 'roll number is required')
      .not()
      .isEmpty(),
      check('semester', 'semester is required')
      .not()
      .isEmpty(),
    
     ]
  ],
   async (req, res) =>{
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const {
        name,
        regNo,
        rollNo,
        semester,
      } = req.body
     
     const profileFields = {};
     profileFields.user = req.user.id;
     if(name) profileFields.name = name;
     if(regNo) profileFields.regNo= regNo;
     if(rollNo) profileFields.rollNo = rollNo;
     if(semester) profileFields.semester = semester;
    
    
    
     try {
        let profile = await PSTUD.findOne({ user: req.user.id });
  
        if(profile) {
          //update
          profile= await PSTUD.findOneAndUpdate(
          { user: req.user.id},
          { $set: profileFields},
          { new: true}
        );
        return res.json(profile);
          }
          //create
          profile = new PSTUD(profileFields);
          
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
      const profiles = await PSTUD.find().populate('user', ['name','avatar']);
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
       const profile = await PSTUD.findOne({ user: req.params.user_id }).populate('user', ['name','avatar']);
   
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
       await PSTUD.findOneAndRemove( { user: req.user.id});
       //remove user
       await UHOD.findByIdAndRemove({_id: req.user.id });
   
       res.json({ msg: 'User deleted'});
     } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
     }
    
    });


    module.exports = router;