import User from "../models/user.model.js";

import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res,next) => {
    const {username, email, password} = req.body;

    if (
        !username ||
        !email ||
        !password ||
        username === '' ||
        email === '' ||
        password === ''
      ) {
        // return res.status(400).json({message:"All fields are required"})
        next(errorHandler(400, 'All fields are required'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.json(
            {
            success: true,
            statusCode :200,
            message : 'Signup successful',
            }
        );
    } catch (error) {
        next(error)
        //below is the same as above ^
        // res.status(500).json({message:error.message})
    }
    
};


export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password || email === '' || password === '') {
      //mesti dikasih return, kalau enggak bakal
      //lanjut ke bawah
      next(errorHandler(400, 'All fields are required'));
      return;
      // return next(errorHandler(400, 'All fields are required'));
    }
  
    try {
      console.log("try-catch")
      const validUser = await User.findOne({ email });
      if (!validUser) {
        //mesti dikasih return, kalau enggak bakal
        //lanjut ke bawah
        next(errorHandler(404, 'User not found'));
        return;
      }

      console.log('test')
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        console.log('test')
        //mesti dikasih return, kalau enggak bakal
        //lanjut ke bawah
        next(errorHandler(400, 'Invalid password'));
        return;
      }

      //process.env.JWT_SECRET itu adalah
      //secret key untuk encrypt & decrypt id user di websitenya
      const token = jwt.sign(
        { id: validUser._id, isAdmin: validUser.isAdmin },
        process.env.JWT_SECRET
      );
  
      const { password: loko, ...rest } = validUser._doc;

    //   console.log(validUser._doc)
  
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } catch (error) {
      console.log("error")
      next(error);
    }
  };
