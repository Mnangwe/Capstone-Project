const express = require('express');
const router = express.Router();
const { authenticateToken, verifyAdmin } = require('../authGuard/auth');
const Order = require('../Model/Order');


//  CREATER A ORDER
router.post('/', authenticateToken, async (req, res, next) => {
    const Order = new Order(req.body)
    try {
        const newOrder = await order.save()
        res.status(200).send(newOrder)
    }catch(err){
        res.status(500).send({msg : err.message})
    }
})

//  GET ALL ORDERS
router.get('/', verifyAdmin, async (req, res) => {
    try{
        const orders = await Order.find()
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

//  GET USER ORDERS
router.get('/:userId', authenticateToken, async (req, res) => {
    try{
        const orders = await Order.find({userId: req.params.userId})
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

// UPDATE A ORDER
router.put('/:id', verifyAdmin, async (req, res) => {
    try{
        const updateOrder = Order.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body
            }, 
            {
                new: true
            }
        )
        res.status(200).json(updateOrder)
    }catch(err){
        res.status(500).json({msg: err.message})
    }

})

//  DELETE A ORDER
router.delete('/:id', verifyAdmin, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json({ msg: "Product has been deleted..."})
    }catch(err){
        res.status(500).json({ msg: err.message })
    }
})

// GET MONTHLY INCOME
router.get('/income', verifyAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-1))

    try{
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth }}},
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
                
                $group: {
                    _id:"$month",
                    total: { $sum: "$sales"}
                }
                
            }
        ]);
        res.status(200).json(income)
    }catch(err){
        res.status(500).json({msg: err.message})
    }
})

module.exports = router;