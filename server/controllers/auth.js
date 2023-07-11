import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// REGISTER USER
export const register = async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation
    } = req.body

    try {
        // generate new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user
        const newUser = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          picturePath,
          friends,
          location,
          occupation,
          viewedProfile: Math.floor(Math.random() * 10000),
          impressions: Math.floor(Math.random() * 10000)
        })

        // save user and respond
        const user = await newUser.save()
        return res.status(201).json(user)
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: err.message || "Something went wrong."
      })
    }
}