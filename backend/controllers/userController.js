import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import OTPverify from "../models/UserOTPVerification.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "student407@milagrescollegekallianpur.edu.in",
    pass: "xbxhknhcfmfaffbq",
  },
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      phoneNo: user.phoneNo,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, phoneNo, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    phoneNo,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      phoneNo: user.phoneNo,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      phoneNo: user.phoneNo,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phoneNo = req.body.phoneNo || user.phoneNo;
    /* const userEmailExists = await User.findOne({ email: req.body.email });
    if (userEmailExists) {
      res.status(400); //bad request
      throw new Error("Email Already in Use");
    }*/
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phoneNo: updatedUser.phoneNo,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   Delete /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user By Id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phoneNo = req.body.phoneNo || user.phoneNo;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;
    user.isSeller = req.body.isSeller;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phoneNo: updatedUser.phoneNo,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const Register = (req, res) => {
  User.find({ email: req.body.email }).then((result) => {
    // console.table(result)
    if (result === null) {
      res.json({
        status: "FAILED",
        message: "User with the provided email already exists",
      });
    } else {
      const saltrounds = 10;
      bcrypt.hash(req.body.password, saltrounds, (err, hash) => {
        if (err) {
          res.status(401).json({
            error: err,
            mesage: "Problem while hashing",
          });
        } else {
          const users = new User({
            name: req.body.name,
            phoneNo: req.body.phoneNo,
            email: req.body.email,
            password: hash,
            verified: false,
          });
          users
            .save()
            .then((req) => {
              sendOTPVerificationEmail(req, res);
              console.log(res);
            })
            .catch((error) => {
              console.log(error);
              res.status(400).json({
                error: error,
                //   res.status(400).json({
                //  status:"FAILED",
                //  message:"An error occured while saving user account!",
              });
            });
        }
      });
    }
  });
};

const sendOTPVerificationEmail = async ({ id, name, email }, res) => {
  try {
    var otp = "";
    const randomchar =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      otp += randomchar.charAt(Math.random() * randomchar.length);
    }

    //mail options
    const mailOptions = {
      from: "student407@milagrescollegekallianpur.edu.in",
      to: email,
      subject: "Email verification",
      html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
      
          <h2>Welcome to <span style="color: green;"> <span><img src="../Logo.png" alt="My_Logo"/>Second Chance</span> .</h2>
            <h4>You are officially In ✔</h4>
            <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
       </div>
        `,
    };

    //hash the otp
    const saltrounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltrounds);
    const newOTPVerification = new OTPverify({
      userId: id,
      otp: hashedOTP,
      name: name,
      email: email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    //save otp record
    await newOTPVerification.save();
    const message = "Verification otp email sent";
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      id,
      email,
      message,
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    let { userId, otp } = req.body;
    let hashedOTP = "";
    let email = "";
    let uName = "";
    let { expiresAt } = [];
    if (!userId || !otp) {
      throw Error("Empty OTP");
    } else {
      const userOTPVerificationRecord = await OTPverify.find({ userId });
      //doubt
      if (userOTPVerificationRecord === null) {
        throw new Error("Account doesn't exist or user signed up already");
      } else {
        expiresAt = userOTPVerificationRecord[0];
        hashedOTP = userOTPVerificationRecord[0].otp;
        email = userOTPVerificationRecord[0].email;
        uName = userOTPVerificationRecord[0].name;
      }
      if (expiresAt != null && expiresAt < Date.now()) {
        await OTPverify.deleteMany({ userId });
        throw new Error("code expired");
      } else {
        const validOtp = await bcrypt.compare(otp, hashedOTP);
        if (!validOtp) {
          throw new Error("Invalid code passed");
        } else {
          //success
          await User.updateOne({ _id: userId }, { verified: true });

          const mail = {
            from: "student407@milagreskallianpur.edu",
            to: email,
            subject: "Email verification",
            html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
      
            <h2>Welcome to <span style="color: green;"> <img src="../Logo.png" alt="My_Logo"/>Second Chance</span> .</h2>
            <h4>You officially signed up ✔</h4>
            <p style="margin-bottom: 30px;"><span style ="color:blue">Successfully Verified!</span> Thankyou for Signing up!</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;"></h1>
       </div>
        `,
          };
          await transporter.sendMail(mail);
          await OTPverify.deleteMany({ userId });
          const message = "Verified!";
          res.status(200).json({ userId, message });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: err,
      message: err.mesage,
    });
  }
};

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  verifyOTP,
  Register,
};
