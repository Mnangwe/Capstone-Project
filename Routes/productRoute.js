const express = require('express');
const router = express.Router();
const Product = require('../Model/Product')
const { authenticateToken, verifyAuthorization, verifyAdmin } = require('../authGuard/auth');


//  CREATER A PRODUCT
router.post('/', verifyAdmin, async (req, res, next) => {
    console.log(req.body)
    const product = new Product(req.body)
    try {
        const newProduct = await product.save()
        res.status(200).send(newProduct)
        console.log("We sent the product")
    }catch(err){
        res.status(500).send({msg : err.message})
        console.log("We cannot send this product")
    }
})

//  GET ALL PRODUCTS
router.get('/', authenticateToken, async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    try{
        let products;
        if(qNew){
            products = await Product.find().sort({ createdAt: -1}).limit(5)
        }else if(qCategory){
            products = await Product.find({ 
                categories: {
                    $in: [qCategory],
                },
            })
        }else{
            products = await Product.find();
        }
        
        res.status(200).json(products)
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

//  GET A PRODUCT
router.get('/:id', verifyAuthorization, async (req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

// UPDATE A PRODUCT
router.put('/:id', verifyAdmin, async (req, res) => {
    try{
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body
            }, 
            {
                new: true
            }
        )
        res.status(200).json(updateProduct)
    }catch(err){
        res.status(500).json({msg: err.message})
    }

})

//  DELETE A PRODUCT
router.delete('/:id', verifyAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({ msg: "Product has been deleted..."})
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})


module.exports = router;