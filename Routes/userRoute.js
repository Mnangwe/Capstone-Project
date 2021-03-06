const express = require('express');
const router = express.Router();
const User = require('../Model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 
const { authenticateToken, verifyAuthorization, verifyAdmin } = require('../authGuard/auth');


//  CREATER A USER
router.post('/', async (req, res, next) => {
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt) 
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword

    })
    try {
        const newUser = await user.save()
        const accessToken = jwt.sign(JSON.stringify(newUser), process.env.JWT_TOKEN_SECRET)
        console.log({msg: 'Token has been created'})
        res.json({ jwt: accessToken, newUser})
        console.log({msg: 'Registered successful!'})
    }catch(err){
        res.status(500).send({msg : err.message})
    }
})

//  GET ALL USERS
router.get('/', verifyAdmin, async (req, res) => {
    const query = req.query.new

    try{
        const users = query ? await User.find().sort({_id:-1}).limit(5) : await User.find()
        
        res.status(200).json(users)
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

//  GET A USER FOR ADMIN
router.get('/:id', verifyAuthorization, async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const { password, ...others} = user._doc
        res.status(200).json(others)
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

// THE LOGED IN USER
router.get('/:id', verifyAuthorization, async (req, res) => {
    try{
        const user = await User.findById(req.user.id)
        console.log(req.user)
        // const { password, ...others} = user._doc
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

// GET USER STATS
// router.get('/stats', verifyAdmin, async (req, res) => {
    
// })

// UPDATE A USER PROFILE
router.put('/:id', verifyAuthorization , async (req, res) => {
    
    if(req.body.password) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt) 
    }
    
    try{
        const updateUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body
            }, 
            {
                new: true
            }
        )
        res.status(200).json({msg: "You just updated your profile", updateUser})
    }catch(err){
        res.status(500).json({msg: err.message})
    }

})

// UPDATE ROLES
router.put('/:id/role', verifyAdmin , async (req, res) => {
    try{
        const updateUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body
            }, 
            {
                new: true
            }
        )
        res.status(200).json(updateUser)
    }catch(err){
        res.status(500).json({msg: err.message})
    }

})

//  DELETE A USER
router.delete('/:id',verifyAuthorization, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({ msg: "You have removed your account"})
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

//  ADMIN REMOVING A USER
router.delete('/:id/user',verifyAdmin, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({ msg: "User has been deleted..."})
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

//  LOGIN IN
router.post('/login', async (req, res)=>{
    try{
        const user = await User.findOne({ email: req.body.email})

        if(!user) {
            return res.status(401).json({ msg: "Wrong credentials" })
        }
        let compared = await bcrypt.compare(req.body.password, user.password)
        if(compared){
            console.log(compared)
            const accessToken = jwt.sign(JSON.stringify(user), process.env.JWT_TOKEN_SECRET)
            console.log({msg: 'Token has been created'})
            res.json({ jwt: accessToken, user})
            console.log({msg: 'Successfully logged in!'})
            
        }else{
            return res.status(401).json({ msg: "Wrong password" })
        }

    }catch(err){
        res.status(500).json({ msg: err.message})
    }
})

module.exports = router;