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
      const validUser = await User.findOne({ email });
      if (!validUser) {
        //mesti dikasih return, kalau enggak bakal
        //lanjut ke bawah
        next(errorHandler(404, 'User not found'));
        return;
      }

      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
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
  
      const { password:pass, ...rest } = validUser._doc;

  
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } catch (error) {
      
      next(error);
    }
  };

export const google = async(req,res,next) =>{
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
      
    } else {
      //slice -8 means give me the laste 8 digits / string
      //example [10,20,30,40,50].slice(-2) = [40, 50]
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin},
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }

}