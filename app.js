const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

//Importing Routes
const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

//mongoose
mongoose.set("strictQuery", false);
mongoose.connect(
    'mongodb+srv://Admin:'+ 
    process.env.MONGO_ATLAS_PW +
    '@atlascluster.cbxabgr.mongodb.net/?retryWrites=true&w=majority', 
    {}
);
mongoose.Promise = global.Promise;

//morgan for Logging HTTP requests
app.use(morgan('dev'));

// making uploads folder publically visible/static
app.use('/uploads', express.static('uploads'));
//body-parser parsing the incoming request bodies in a middleware before you handle it
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Handling CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Access-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})
//Providing Routes
app.use('/products', productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

//Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    })
})

module.exports = app;