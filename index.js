require('dotenv').config()
const express = require('express');
const app = express();
const cors = require("cors")
const mongoose = require('mongoose')
app.set('port', process.env.PORT || 3100) 
app.use(express.json())
app.use(cors())


// CONNECTING MONGO
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection

db.on('error', err => console.error(err))
db.once('open', () => console.log('Connected to Database'))

app.get('/', (req, res, next) =>{
    res.send('<h1>Hello world<h1>');
})

// Routes
const userRoute = require('./Routes/userRoute')
const productRoute = require('./Routes/productRoute')
const cartRoute = require('./Routes/cartRoute')
const orderRoute = require('./Routes/orderRoute')

app.use('/users', userRoute)
app.use('/products', productRoute)
app.use('/cart', cartRoute)
app.use('/order', orderRoute)


app.listen(app.get('port'), server =>{
    console.info(`Server listen on port ${app.get('port')}`);
})