const path = require('path')
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 4000;

connectDB()

const app = express();

app.use(express.json())

app.use(express.urlencoded({extended: false}))

app.use('/api/reviews',require('./routes/reviewRoutes'))

app.use('/api/users',require('./routes/userRoutes'))

//serve frontend
if(process.env.NODE_ENV === 'production'){
    //app.use(express.static(path.join(__dirname, '../frontend/build')))
    //app.get('*' , (req , res ) => res.sendFile(path.resolve(__dirname,'../','frontend','build','index.html')))

    app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'),function (err) {
            if(err) {
                res.status(500).send(err)
            }
        });
    })

}else{
    app.get('/',(req ,res) => res.send('Run in production.'))
}
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))
