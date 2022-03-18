const express = require('express') ; 
const app = express() ; 
const morgan = require('morgan') ; 
const mongoose = require('mongoose')
const Productsroute = require('./routes/products');
const CategoryRoute = require('./routes/categories')
const userRoute = require('./routes/users');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const orderRoutes = require('./routes/orders')

//Middleware

app.use(express.json()) ; 
// app.use(authJwt()) ; 
app.use(errorHandler) ;
app.use(morgan('tiny')) ; 
app.use(express.urlencoded({extended:false})) ;
app.use('/public/uploads' , express.static(__dirname + '/public/uploads'))


/*  Routes  */

app.use('/products', Productsroute) ; 
app.use('/categories',CategoryRoute) ; 
app.use('/users',userRoute) ;
app.use('/orders',orderRoutes) ;


/*   Connection for the database  */

mongoose.connect('mongodb+srv://raghav:raghav@maincluster.b6mru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewURLParser:true,
    useUnifiedTopology : true   
})
        .then(()=>{
            console.log("Database is Connected") ;
        })
        .catch((err)=>{
            console.log("Sorry Unable to Connect")
        })

/* End for mongodb connect */


app.listen(5000, () => {
    console.log(`Server is running at http://localhost:${5000}`) ; 
})