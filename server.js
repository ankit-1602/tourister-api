const dotenv=require('dotenv')
process.on('uncaughtException',err=>{
    console.log('Uncaught Exception...')
    console.log(err)
    process.exit(1)
})
dotenv.config({path:'./config.env'})
const mongoose=require('mongoose')
const app=require('./index')

const DB=process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true 
}).then(con=>{
    //console.log(con.connection)
    console.log("DB Connection successfull")
})

const PORT=process.env.PORT || 3000
const server=app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})

process.on('unhandledRejection',err=>{
    console.log('Unhandled Rejection..')
    console.log(err.name,err.message)
    server.close(()=>{
        process.exit(1)
    })
})