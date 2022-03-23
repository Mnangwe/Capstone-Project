const express = require('express');
const router = express.Router();
const { authenticateToken, verifyAdmin } = require('../authGuard/auth');
const Cart = require('../Model/Cart');
const Product = require('../Model/Product')

async function getProduct(req, res, next) {
    let product
    try {
        product = await Product.findById(req.params.id)
      if(!product) res.status(404).json({ msg: 'Cannot find product'})
    }catch (err) {
      res.status(500).send({ msg: err.message })
    }

    res.product = product
    next()
}

//  CREATER A CART
router.post('/', [authenticateToken], async (req, res, next) => {
    // const product = await new Product.findById(req.params.id)
    const cart = new Cart(
        req.body
    )
    try {
        const newCart = await cart.save()
        res.status(200).send(newCart)
    }catch(err){
        res.status(500).send({msg : err.message})
    }
})

//  GET ALL CARTS
router.get('/', verifyAdmin, async (req, res) => {
    try{
        const carts = await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

//  GET USER CART
router.get('/:userId', authenticateToken, async (req, res) => {
    try{
        const cart = await Cart.findOne({userId: req.params.userId})
        if(cart == null) { return res.status(500).json({msg: "You have not added anything in cart"})}
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

// UPDATE A CART
router.put('/:id', authenticateToken, async (req, res) => {
    try{
        const updateCart = await Cart.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body
            }, 
            {
                new: true
            }
        )
        res.status(200).json(updateCart)
    }catch(err){
        res.status(500).json({msg: err.message})
    }

})

//  DELETE A CART
router.delete('/:id', authenticateToken, async (req, res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json({ msg: "Product has been deleted..."})
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})




module.exports = router;