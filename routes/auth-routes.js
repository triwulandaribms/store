import conn from "../connect.js";
import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

export async function getAllAdmin(_req, res) {
  try {
    const data = await conn.query(`SELECT * FROM adminn`);
    res.send(data);
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}

export async function registrasi(req, res) {
  const domains = ["gmail.com"];

  const data = await conn.query(
    `SELECT * FROM adminn WHERE email = '${req.body.email}'`
  );

  if (data.length === 1) {
    res.status(400).send("email sudah pernah digunakan");
  } else {
    const emaill = req.body.email.split("@");
    const password = req.body.passwordd;

    if (emaill.length === 2) {
      const name = emaill[0];
      const domain = emaill[1];

      if (name && name.trim() !== "") {
        if (domain === domains[0]) {
          if (
            password.length === 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/.test(password) &&
            (password.match(/[A-Z]/g) || []).length === 1
          ) {
            // const salt = await bcrypt.genSalt();
            // const hash = await bcrypt.hash(req.body.passwordd, salt);
            await conn.query(
              `INSERT INTO adminn VALUES ('${req.body.id_admin}','${req.body.nama}','${req.body.email}','${req.body.passwordd}','${req.body.role}')`
            );
            res.send("registrasi berhasil.");
          } else {
            res.json({
              pesan: "isi password sesuai dengan ketentuan sebagai berikut :",
              pertama: "8 karakter Alphanumeric",
              kedua: "setidaknya mengandung 1 huruf kapital",
              ketiga: "tidak boleh mengandung special karakter",
            });
          }
        } else {
          res.status(400).send("Domain email tidak valid");
        }
      } else {
        res.status(400).send("nama pengguna harus diisi");
      }
    } else {
      res.status(400).send("panjang bagian !==2");
    }
  }
}

export default async function login(req, res) {
  const data = await conn.query(
    `SELECT * FROM adminn WHERE email = '${req.body.email}'`
  );

  let cek;
  if (data.length > 0) {
    if (
      (req.body.email === data[0].email && req.body.passwordd,
      data[0].passwordd)
    ) {
      cek = true;
    }

    console.log(cek);

    console.log("Input Email:", req.body.email);
    console.log("Database Email:", data[0].email);

    if (cek === true) {
      const token = jwt.sign(data[0], process.env.SECRET_KEY);
      res.cookie("token", token);
      res.send("berhasil login");
      console.log(token);
    } else {
      res.status(401);
      res.send("email atau password salah");
    }
  } else {
    res.status(401);
    res.send("data admin tidak ditemukan");
  }
}

export async function logoutToken(_req, res) {
  res.clearCookie("token");
  res.send("token berhasil dihapus");
}
