// import express from 'express';
// import mongoose from 'mongoose';
// import { connect } from './db/db.js';
// import teacher from './model/model.js';
// import cors from 'cors';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import crypto from 'crypto';

// // Initialize Express
// const app = express();
// connect();

// // Fixing CORS issue
// app.use(cors());
// app.use(express.json()); // for JSON parsing
// app.use(express.urlencoded({ extended: true })); // for form URL-encoded data

// // Serve static files from the `uploads` directory
// app.use("/uploads", express.static("uploads"));
// import { fileURLToPath } from 'url';

// // Get the current directory path from the URL
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// // Ensure `uploads` folder exists
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Storage configuration for `multer`
// const storage = multer.diskStorage({
//   destination: uploadDir,
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // JWT Secret Key for token signing
// const JWT_SECRET_KEY = crypto.randomBytes(64).toString('hex');

// // Middleware to check for JWT token in request headers
// const authenticateToken = (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1];  // Expect token in Authorization header

//   if (!token) {
//     return res.status(401).json({ error: "Access denied. No token provided." });
    
//   }

//   try {
//     // console.log(token);
//     const decoded = jwt.verify(token, JWT_SECRET_KEY);
//     req.user = decoded; // Store decoded user info in request
//     next();
//   } catch (error) {
//     res.status(403).json({ error: "Invalid or expired token." });
//   }
// };

// // Utility functions for reading and writing JSON files
// const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf-8"));
// const writeJSON = (filePath, data) =>
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

// // Paths for JSON storage
// const teachersFilePath = path.join(__dirname, "teachers.json");
// const loginFilePath = path.join(__dirname, "login.json");

// // Middleware to ensure JSON files exist
// const ensureJSONFile = (filePath) => (req, res, next) => {
//   if (!fs.existsSync(filePath)) {
//     fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
//   }
//   next();
// };

// // Routes
// // Signup Route
// app.post("/signup", ensureJSONFile(loginFilePath), (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ error: "Username and password are required" });
//   }

//   const users = readJSON(loginFilePath);

//   if (users.some((user) => user.username === username)) {
//     return res.status(400).json({ error: "Username already exists" });
//   }

//   // Hash the password before saving it
//   const hashedPassword = bcrypt.hashSync(password, 10);
//   const newUser = { username, password: hashedPassword };
//   users.push(newUser);
//   writeJSON(loginFilePath, users);

//   res.status(201).json({ message: "User created successfully", user: newUser });
// });

// // Login Route
// app.post("/login", ensureJSONFile(loginFilePath), (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ error: "Username and password are required" });
//   }

//   const users = readJSON(loginFilePath);
//   const user = users.find((u) => u.username === username);

//   if (user) {
//     // Compare the entered password with the hashed password
//     if (bcrypt.compareSync(password, user.password)) {
//       // Generate a JWT token
//       const token = jwt.sign({ username: user.username }, JWT_SECRET_KEY, { expiresIn: "1h" });
//       res.json({ message: "Login successful!", token });
//     } else {
//       res.status(401).json({ error: "Invalid credentials" });
//     }
//   } else {
//     res.status(401).json({ error: "Invalid credentials" });
//   }
// });

// // Teacher Routes

// // Create a new teacher
// app.post("/teacher", ensureJSONFile(teachersFilePath), authenticateToken, upload.single("image"), async (req, res) => {
//   try {
//     const { name, mail, password, age, department, address } = req.body;

//     if (!name || !mail || !password || !age || !department || !address) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const teachers = await teacher.find();

//     if (teachers.some((teacher) => teacher.mail === mail)) {
//       return res.status(400).json({ error: "Teacher with this email already exists" });
//     }

//     const newTeacher = new teacher({
//       name,
//       mail,
//       password,
//       age: Number(age),
//       department,
//       address,
//       image: req.file ? `http://localhost:9000/uploads/${req.file.filename}` : null,
//     });

//     await newTeacher.save();

//     res.status(201).json({ message: "Teacher added successfully", teacher: newTeacher });
//   } catch (error) {
//     console.error("Error adding teacher:", error);
//     res.status(500).json({ error: "Failed to add teacher" });
//   }
// });

// // Get All Teachers
// app.get("/teachers", ensureJSONFile(teachersFilePath), authenticateToken, async (req, res) => {
//   try {
//     const teachers = await teacher.find();
//     res.status(200).json(teachers);
//   } catch (error) {
//     console.error("Error fetching teachers:", error);
//     res.status(500).json({ error: "Failed to fetch teachers" });
//   }
// });

// // Get Teacher by Email
// app.get("/teacher/:mail", ensureJSONFile(teachersFilePath), authenticateToken, async (req, res) => {
//   try {
//     const teacherData = await teacher.findOne({ mail: req.params.mail });
//     // console.log(teacherData);

//     if (!teacherData) {
//       return res.status(404).json({ error: `No teacher with email: ${req.params.mail}` });
//     }

//     res.status(200).json(teacherData);
//   } catch (error) {
//     console.error("Error fetching teacher:", error);
//     res.status(500).json({ error: "Failed to fetch teacher" });
//   }
// });

// // Delete Teacher
// app.delete("/teacher/:mail/:password", ensureJSONFile(teachersFilePath), authenticateToken, async (req, res) => {
//   try {
//     const teacherData = await teacher.findOneAndDelete({ mail: req.params.mail, password: req.params.password });

//     if (!teacherData) {
//       return res.status(404).json({ error: "Invalid email or password. No teacher found." });
//     }

//     res.status(200).json({ message: "Teacher deleted successfully", teacher: teacherData });
//   } catch (error) {
//     console.error("Error deleting teacher:", error);
//     res.status(500).json({ error: "Failed to delete teacher" });
//   }
// });

// // Update Teacher
// app.put("/teacher/:mail", ensureJSONFile(teachersFilePath), authenticateToken, async (req, res) => {
//   try {
//     const teacherData = await teacher.findOne({ mail: req.params.mail });

//     if (!teacherData) {
//       return res.status(404).json({ error: "Teacher not found" });
//     }

//     const updatedData = req.body;
//     Object.assign(teacherData, updatedData);

//     await teacherData.save();

//     res.status(200).json({ message: "Teacher updated successfully", teacher: teacherData });
//   } catch (error) {
//     console.error("Error updating teacher:", error);
//     res.status(500).json({ error: "Failed to update teacher" });
//   }
// });

// // Start server
// app.listen(9000, () => {
//   console.log("Server running on port 9000");
// });

import express from 'express';
import mongoose from 'mongoose';
import { connect } from './db/db.js';
import teacher from './model/model.js';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Initialize Express
const app = express();
connect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static("uploads"));
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure `uploads` folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// JWT Secret Key for token signing
const JWT_SECRET_KEY = crypto.randomBytes(64).toString('hex');

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gulatimanya16@gmail.com', // Replace with your email
    pass: 'elma subt lnto yzca', // Replace with your email password
  },
});

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

// Utility functions for JSON files
const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeJSON = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

// Paths for JSON storage
const teachersFilePath = path.join(__dirname, "teachers.json");
const loginFilePath = path.join(__dirname, "login.json");

// Middleware to ensure JSON file existence
const ensureJSONFile = (filePath) => (req, res, next) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
  }
  next();
};
const otpStore = {};
// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
};
const sendOtpToEmail = (email, otp) => {
  transporter.sendMail({
    from: 'gulatimanya16@gmail.com', // Your email address
    to: email,
    subject: 'Your OTP for Signup',
    text: `Your OTP is: ${otp}`,
  }, (error, info) => {
    if (error) {
      console.error('Error sending OTP:', error);
    } else {
      console.log('OTP sent:', info.response);
    }
  });
};
const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
const saveOtpForVerification = (email, otp) => {
  otpStore[email] = { otp, createdAt: Date.now() };
};
const getStoredOtp = (email) => {
  const storedOtp = otpStore[email];
  if (storedOtp && Date.now() - storedOtp.createdAt < OTP_EXPIRY_TIME) {
    return storedOtp.otp;
  }
  return null;
};
const saveUser = (user) => {
  const users = readJSON(loginFilePath); // Read existing users from login.json
  const hashedPassword = bcrypt.hashSync(user.password, 10); // Hash the password
  const newUser = { username: user.username, password: hashedPassword };

  users.push(newUser); // Add the new user to the list
  writeJSON(loginFilePath, users); // Save the updated list back to the JSON file
};

// --- User Authentication Routes ---

// Backend: OTP generation route
app.post('/signup', (req, res) => {
  const { username } = req.body; // username is actually the email
  console.log(username);
  if (!username) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Logic to generate and send OTP to the email
  const otp = generateOTP(); // You'd need a function to generate the OTP
  sendOtpToEmail(username, otp); // Send OTP to the provided email

  // Save OTP temporarily in a session or database for later verification
  // Assuming you're storing OTP for 10 minutes or so
  saveOtpForVerification(username, otp);

  return res.status(200).json({ message: 'OTP sent successfully' });
});

// Example: OTP verification route
app.post('/verify-signup-otp', (req, res) => {
  const { username, otp } = req.body;

  if (!username || !otp) {
    return res.status(400).json({ error: 'Username and OTP are required' });
  }

  const storedOtp = getStoredOtp(username); // Retrieve OTP from session or database

  if (storedOtp === otp) {
    return res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }
});

// Example: Signup finalization (store user in login.json)
app.post('/signup/verify', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Logic to store the user data in login.json (or database)
  const user = { username, password };
  saveUser(user); // Store user data securely (hashed password, etc.)

  return res.status(200).json({ message: 'User signed up successfully' });
});

// Login Route (No OTP for login)
app.post("/login", ensureJSONFile(loginFilePath), (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Find the user by username
  const users = readJSON(loginFilePath);
  const user = users.find((u) => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    // Generate JWT token for the user
    const token = jwt.sign({ username }, JWT_SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Password Reset Request
app.post("/reset-password-request", (req, res) => {
  const { email } = req.body;
  const resetToken = crypto.randomBytes(32).toString("hex");
  transporter.sendMail({
    from: 'gulatimanya16@gmail.com',
    to: email,
    subject: "Password Reset Request",
    text: `Click the following link to reset your password: http://localhost:9000/reset-password/${resetToken}`,
  }).then(() => {
    req.app.locals[`${email}-reset-token`] = resetToken;
    res.status(200).json({ message: "Password reset email sent successfully" });
  }).catch((error) => {
    console.error("Error sending reset email:", error);
    res.status(500).json({ error: "Failed to send reset email" });
  });
});

// Reset Password
app.post("/reset-password/:token", (req, res) => {
  const { email, newPassword } = req.body;
  const { token } = req.params;
  const storedToken = req.app.locals[`${email}-reset-token`];
  if (storedToken === token) {
    const users = readJSON(loginFilePath);
    const user = users.find((u) => u.username === email);
    if (user) {
      user.password = bcrypt.hashSync(newPassword, 10);
      writeJSON(loginFilePath, users);
      res.status(200).json({ message: "Password reset successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } else {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

// --- Teacher Routes ---

// Create Teacher
app.post("/teacher", ensureJSONFile(teachersFilePath), authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name, mail, password, age, department, address } = req.body;
    if (!name || !mail || !password || !age || !department || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingTeacher = await teacher.findOne({ mail });
    if (existingTeacher) {
      return res.status(400).json({ error: "Teacher with this email already exists" });
    }
    const newTeacher = new teacher({
      name,
      mail,
      password,
      age,
      department,
      address,
      image: req.file ? `http://localhost:9000/uploads/${req.file.filename}` : null,
    });
    await newTeacher.save();
    res.status(201).json({ message: "Teacher added successfully", teacher: newTeacher });
  } catch (error) {
    console.error("Error adding teacher:", error);
    res.status(500).json({ error: "Failed to add teacher" });
  }
});

// Get All Teachers
app.get("/teachers", ensureJSONFile(teachersFilePath), authenticateToken, async (req, res) => {
  try {
    const teachers = await teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

// Get Teacher by Email
app.get("/teacher/:mail", ensureJSONFile(teachersFilePath), authenticateToken, async (req, res) => {
  try {
    const teacherData = await teacher.findOne({ mail: req.params.mail });
    if (teacherData) {
      res.status(200).json(teacherData);
    } else {
      res.status(404).json({ error: "Teacher not found" });
    }
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ error: "Failed to fetch teacher" });
  }
});

// Update Teacher
app.put("/teacher/:mail", ensureJSONFile(teachersFilePath), authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name, password, age, department, address } = req.body;
    const teacherData = await teacher.findOne({ mail: req.params.mail });
    if (!teacherData) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    teacherData.name = name || teacherData.name;
    teacherData.password = password || teacherData.password;
    teacherData.age = age || teacherData.age;
    teacherData.department = department || teacherData.department;
    teacherData.address = address || teacherData.address;
    if (req.file) {
      teacherData.image = `http://localhost:9000/uploads/${req.file.filename}`;
    }
    await teacherData.save();
    res.status(200).json({ message: "Teacher updated successfully", teacher: teacherData });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ error: "Failed to update teacher" });
  }
});

// Delete Teacher
// Delete Teacher
app.delete("/teacher/:mail/:password", ensureJSONFile(teachersFilePath), authenticateToken, async (req, res) => {
  try {
    const teacherData = await teacher.findOneAndDelete({ mail: req.params.mail, password: req.params.password });

    if (!teacherData) {
      return res.status(404).json({ error: "Invalid email or password. No teacher found." });
    }

    res.status(200).json({ message: "Teacher deleted successfully", teacher: teacherData });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ error: "Failed to delete teacher" });
  }
});

// Start Server
app.listen(9000, () => {
  console.log("Server running on port 9000");
});


