const path=require('path')
const express=require('express')
const morgan=require('morgan')
const rateLimit=require('express-rate-limit')
const helmet=require('helmet')
const mongoSanitize=require('express-mongo-sanitize')
const xss=require('xss-clean')
const hpp=require('hpp')

const AppError=require('./utils/appError')
const globalErrorHandler=require('./controllers/errorController')

const tourRouter=require('./routes/tourRoutes')
const userRouter=require('./routes/userRoutes')
const reviewRouter=require('./routes/reviewRoutes')

const app=express()

// GLOBAL MIDDLEWARE

//Serving static files
app.use(express.static(path.join(__dirname,'public')))

//Set Security http headers
app.use(helmet())

//Development Logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

//Limit request from the same IP
const limiter=rateLimit({
    max:100,
    windowMs:60*60*100,
    message:'Too many request from this IP. Please try again in an hour'
})

app.use('/api',limiter)

// Body parser : Reading data from body to req.body
app.use(express.json({limit:'10kb'}))

//Data Sanitisation against NoSQL query injection
app.use(mongoSanitize())

//Data sanitization against XSS
app.use(xss())

//Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
      ]
}))

//Test Middleware
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    //console.log(req.headers)
    next();
})



// Routes
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);


app.all('*',(req,res,next)=>{
   next(new AppError(`Can't find ${req.originalUrl} on the servere`,404));
})

app.use(globalErrorHandler);

module.exports=app;