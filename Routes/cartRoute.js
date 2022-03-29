const express = require('express');
const router = express.Router();
const { authenticateToken, verifyAdmin } = require('../authGuard/auth');
const Cart = require('../Model/Cart');
const Product = require('../Model/Product')
const User = require('../Model/User')

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
router.post('/:id', [authenticateToken, getProduct], async (req, res, next) => {
    // const product = await new Product.findById(req.params.id)
    const cartProduct = await Product.findById(res.product._id)
    const userCart = await Cart.findOne({userId: req.user._id})
    // console.log(userCart)

    let userId = req.user._id
    let product_id = res.product._id;
    let name = res.product.name
    let categories = res.product.categories
    let price = res.product.price
    let image = res.product.image
    let quantity = 0
    
    if(req.body.quantity) {
        quantity += req.body.quantity
    }else{
        quantity += res.product.quantity
        }
    let cart

    if(userCart == null){
        cart = new Cart(
            {
                userId,
                product_id,
                name,
                categories,
                price,
                image,
                quantity
            }
        )
    }else if(userCart != null && req.user._id === userCart.userId){
        if(userCart.products.find(product => product.product_id == req.params.id)){
            console.log("Quantity1", quantity)
            cart = await Cart.findOneAndUpdate(
                req.params.id,
                {
                    $set:{
                        quantity: quantity
                    }
                },
                {
                    new: true
                }
                )
        }else{
            console.log("Quantity2", quantity)
            cart = await Cart.findOneAndUpdate(
                {
                    userId: req.user._id
                },
                {
                    $set:{
                        
                        product_id,
                        name,
                        categories,
                        price,
                        image,
                        quantity
                    }
                },
                {
                    new: true
                }
            )
        }
        
    }
    console.log("QuantityNew", quantity)
    try {
        cart.products.push({
            product_id,
            name,
            categories,
            price,
            image,
            quantity
        })
            
        const newCart = await cart.save()
        res.status(200).send(newCart)
        // console.log(req.body.quantity)
    }catch(err){
        res.status(500).send({msg : err.message})
    }
    
})

//  GET ALL CARTS
router.get('/', verifyAdmin, async (req, res) => {
    try{
        const carts = await Cart.find()
        res.status(200).json(carts)
        console.log(carts.length)
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

//  GET USER CART
router.get('/:userId', authenticateToken, async (req, res) => {
    try{
        const cart = await Cart.find({userId: req.params.userId})
        if(cart == null) { return res.status(500).json({msg: "You have not added anything in cart"})}
        res.status(200).json(cart[0])
        
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

router.delete('/single', authenticateToken, async(req, res, next)=>{
    try {
      const id = req.body
      const cart = await Cart.findByIdAndDelete({_id : ObjectId(id)});
      res.json({ message: "Deleted cart" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  //clears the user cart
  router.delete("/", authenticateToken, async (req, res, next) => {
    try {
      const cart = await Cart.deleteMany({ user_id: { $regex: req.user._id } });
      res.json({ message: "Deleted cart" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });




module.exports = router;