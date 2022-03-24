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
    res.send({
        message: "Welcome to Azabenathi API",
        user_routes: {
          user_register: {
            method: "POST",
            route: "/users",
            request_body: {
              fullname: "String",
              email: "String",
              phone_number: "String",
              password: "String",
              cart: "object",
            },
            result: {
              jwt: "String token",
            },
          },
          user_login: {
            method: "PATCH",
            route: "/users",
            request_body: {
              email: "String",
              password: "String",
            },
            result: {
              jwt: "String token",
            },
          },
          all_users: {
            method: "GET",
            route: "/users",
            result: {
              users: "Array",
            },
          },
          single_user: {
            method: "GET",
            route: "/users/:id",
            result: {
              user: "Object",
            },
          },
          update_user: {
            method: "PUT",
            request_body: {
              fullname: "String",
              email: "String",
              phone_number: "String",
              password: "String",
              img: "String *optional* (Must be hosted image. I can suggest to host on Post Image)",
              cart: "object",
            },
            route: "/users/:id",
            result: {
              user: "Object",
            },
          },
          delete_user: {
            method: "DELETE",
            route: "/users/:id",
            result: {
              message: "Object",
            },
          },
        },
        product_routes: {
          all_products: {
            method: "GET",
            route: "/products",
            headers: {
              authorization: "Bearer (JWT token)",
            },
            result: {
              product: "Array",
            },
          },
          single_product: {
            method: "GET",
            route: "/products/:id",
            headers: {
              authorization: "Bearer (JWT token)",
            },
            result: {
              product: "Object",
            },
          },
          create_product: {
            method: "POST",
            route: "/products/",
            headers: {
              authorization: "Bearer (JWT token)",
            },
            request_body: {
              title: "String",
              body: "String",
              img: "String *optional* (Must be hosted image. I can suggest to host on Post Image)",
            },
            result: {
              post: "Object",
            },
          },
          update_product: {
            method: "PUT",
            route: "/products/:id",
            headers: {
              authorization: "Bearer (JWT token)",
            },
            request_body: {
              title: "String *optional*",
              body: "String *optional*",
              img: "String *optional* (Must be hosted image. I can suggest to host on Post Image)",
            },
            result: {
              post: "Object",
            },
          },
          delete_post: {
            method: "DELETE",
            route: "/products/:id",
            result: {
              message: "Object",
            },
          },
        },
      });
    
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