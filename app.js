require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loggerMiddleware = require("./middlewares/logger");
const errorHandler = require("./middlewares/logger");
const authenticateToken = require("./middlewares/auth");

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
console.log(PORT);

app.get("/", (req, res) => {
  res.send(`
    <h1>Curso Express.js</h1>
    <p>Aprendiendo Express.js</p>
    <p>Corre en el puerto ${PORT}</p>
    `);
});

app.get("/db-user", authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {}
  res.status(500).json({ error: "Error al obtener los usuarios" });
});

app.post("/register", authenticateToken, async (req, res) => {
  console.log(req.body);
  const { email, password, name } = req.body;
  const hasedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hasedPassword,
      name,
      role: "USER",
    },
  });

  res.status(201).json({
    message: "Usuario creado con éxito",
    user: newUser,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword)
    return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "4h",
    }
  );

  res.json({
    message: "Login successful",
    token,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
