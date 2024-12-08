const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");  // Import jwt package
const bcrypt = require("bcryptjs");   // Import bcrypt to hash passwords

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the `uploads` directory
app.use("/uploads", express.static("uploads"));

// Ensure `uploads` folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage configuration for `multer`
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Paths for JSON storage
const teachersFilePath = path.join(__dirname, "teachers.json");
const loginFilePath = path.join(__dirname, "login.json");

// Middleware to ensure JSON files exist
const ensureJSONFile = (filePath) => (req, res, next) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
  }
  next();
};

// Utility functions to read/write JSON data
const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeJSON = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");


// Secret key for JWT (you should store this securely, e.g., in environment variables)
const crypto = require("crypto");
const JWT_SECRET_KEY = crypto.randomBytes(64).toString('hex'); // Generates a random 64-byte hex string

// Middleware to check for JWT token in request headers
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];  // Expect token in Authorization header

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded; // Store decoded user info in request
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

// Routes
// Signup Route
app.post("/signup", ensureJSONFile(loginFilePath), (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const users = readJSON(loginFilePath);

    if (users.some((user) => user.username === username)) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password before saving it
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);
    writeJSON(loginFilePath, users);

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

// Login Route
app.post("/login", ensureJSONFile(loginFilePath), (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const users = readJSON(loginFilePath);
 // Find user by username
 const user = users.find((u) => u.username === username);

  if (user) {
    // Compare the entered password with the hashed password
    if (bcrypt.compareSync(password, user.password)) {
      // Generate a JWT token
      const token = jwt.sign({ username: user.username }, JWT_SECRET_KEY, { expiresIn: "1h" });
      res.json({ message: "Login successful!", token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Add Teacher
app.post("/teacher", ensureJSONFile(teachersFilePath),authenticateToken, upload.single("image"), (req, res) => {
  try {
    const { name, mail, password, age, department, address } = req.body;

    if (!name || !mail || !password || !age || !department || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const teachers = readJSON(teachersFilePath);

    if (teachers.some((teacher) => teacher.mail === mail)) {
      return res.status(400).json({ error: "Teacher with this email already exists" });
    }

    const newTeacher = {
      name,
      mail,
      password,
      age: Number(age),
      department,
      address,
      image: req.file ? `http://localhost:9000/uploads/${req.file.filename}` : null,
    };

    teachers.push(newTeacher);
    writeJSON(teachersFilePath, teachers);

    res.status(201).json({ message: "Teacher added successfully", teacher: newTeacher });
  } catch (error) {
    console.error("Error adding teacher:", error);
    res.status(500).json({ error: "Failed to add teacher" });
  }
});

// Get All Teachers
app.get("/", ensureJSONFile(teachersFilePath), authenticateToken, (req, res) => {
  try {
    const teachers = readJSON(teachersFilePath);
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

// Get Teacher by Email
app.get("/get/:mail", ensureJSONFile(teachersFilePath), authenticateToken, (req, res) => {
  try {
    const teachers = readJSON(teachersFilePath);
    const teacher = teachers.find((t) => t.mail === req.params.mail);

    if (!teacher) {
      return res.status(404).json({ error: `No teacher with email: ${req.params.mail}` });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ error: "Failed to fetch teacher" });
  }
});

// Delete Teacher
app.delete("/delete/:mail/:password", ensureJSONFile(teachersFilePath), authenticateToken,(req, res) => {
  try {
    // Read the current list of teachers from the JSON file
    const teachers = readJSON(teachersFilePath);

    // Find the index of the teacher matching the provided mail and password
    const teacherIndex = teachers.findIndex(
      (t) => t.mail === req.params.mail && t.password === req.params.password
    );

    // If no match is found, send a 404 response
    if (teacherIndex === -1) {
      return res.status(404).json({ error: "Invalid email or password. No teacher found." });
    }

    // Remove the teacher from the array
    const [deletedTeacher] = teachers.splice(teacherIndex, 1);

    // Write the updated list back to the JSON file
    writeJSON(teachersFilePath, teachers);

    // Send a success response with details of the deleted teacher
    res.status(200).json({
      message: "Teacher deleted successfully",
      teacher: {
        name: deletedTeacher.name,
        mail: deletedTeacher.mail,
        department: deletedTeacher.department,
      },
    });
  } catch (error) {
    // Log the error for debugging and send a 500 response
    console.error("Error deleting teacher:", error);
    res.status(500).json({ error: "Failed to delete teacher due to a server error." });
  }
});


// Update Teacher
app.put("/update/:mail", ensureJSONFile(teachersFilePath), authenticateToken, (req, res) => {
  try {
    console.log(req);
    const teachers = readJSON(teachersFilePath);
    const teacherIndex = teachers.findIndex(
      (t) => t.mail === req.params.mail
    );

    if (teacherIndex === -1) {
      return res.status(404).json({ error: "Invalid password" });
    }

    const updatedData = req.body;
    console.log(updatedData);
    teachers[teacherIndex] = {
      ...teachers[teacherIndex],
      ...updatedData,
    };

    writeJSON(teachersFilePath, teachers);

    res.status(200).json({ message: "Teacher updated successfully", teacher: teachers[teacherIndex] });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ error: "Failed to update teacher" });
  }
});

// Start the server
app.listen(9000, () => console.log("Server running on port 9000"));