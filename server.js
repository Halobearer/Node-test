const express = require('express');
const connectDB = require('./backend/config/db');
const dotenv = require('dotenv');
const {errorHandler} = require('./backend/middlewares/errorMiddleware');
const colors = require('colors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
dotenv.config();

const userRoutes = require('./backend/routes/userRoutes');
app.use('/api/users', userRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000 || 8000;
const server = app.listen(
    PORT, console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);
