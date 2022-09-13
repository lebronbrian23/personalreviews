const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json())

app.use(express.urlencoded({extended: false}))

app.use('/api/reviews',require('./routes/reviewRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))
