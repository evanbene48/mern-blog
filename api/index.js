import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from '../api/routes/user.route.js'
import authRoutes from '../api/routes/auth.route.js'


dotenv.config();

mongoose.connect(
    process.env.MONGO
)
.then(() =>{
    console.log('mongo db is connected');
})
.catch((err)=>{
    console.log(err)
})

const app = express();

//express.json is middleware function that is used to parse JSON data sent in the request body.
// It allows your Express application to handle JSON-encoded data.
app.use(express.json())

app.listen(3000, () => {
    console.log('Server is running on port 3000!!');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

