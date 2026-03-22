const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, "public");
const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");

app.use(express.json());
app.use(express.static(publicDir));

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]", "utf8");
  }
}

function readUsers() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(usersFile, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  ensureDataFile();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  try {
    const verify = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(verify, "hex"));
  } catch {
    return false;
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

/** Cadastro */
app.post("/api/register", (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const senha = req.body?.senha;

  if (!email || !senha) {
    return res.status(400).json({ ok: false, message: "Email e senha são obrigatórios." });
  }
  if (senha.length < 6) {
    return res.status(400).json({ ok: false, message: "A senha deve ter pelo menos 6 caracteres." });
  }

  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ ok: false, message: "Este email já está cadastrado." });
  }

  users.push({ email, passwordHash: hashPassword(senha) });
  writeUsers(users);

  return res.status(201).json({ ok: true, message: "Conta criada com sucesso. Você já pode entrar." });
});

/** Login — só permite quem já se registrou */
app.post("/api/login", (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const senha = req.body?.senha;

  if (!email || !senha) {
    return res.status(400).json({ ok: false, message: "Email e senha são obrigatórios." });
  }

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Não encontramos este email. Faça o registro antes de entrar.",
    });
  }

  if (!verifyPassword(senha, user.passwordHash)) {
    return res.status(401).json({ ok: false, message: "Senha incorreta." });
  }

  return res.json({ ok: true, message: "Login realizado com sucesso!" });
});

app.listen(PORT, () => {
  ensureDataFile();
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Login: http://localhost:${PORT}/`);
  console.log(`Registro: http://localhost:${PORT}/register.html`);
});
