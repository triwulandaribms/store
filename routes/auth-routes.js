import conn from "../connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function login(req, res) {
  let data = await conn.query(
    `SELECT * FROM adminn WHERE email = '${req.body.email}'`
  );

  let cek;
  if (data.length > 0) {
    if (
      req.body.email === data[0].email &&
      (await bcrypt.compare(req.body.passwordd, data[0].passwordd))
    ) {
      cek = true;
    }

    if (cek === true) {
      const token = jwt.sign(data[0], "secret");
      res.cookie("token", token);
      res.send("berhasil login");

      // menggunakan localtsorage

      // if (data[0].role === "admin") {
      //   // location.href = "/admin";
      //   res.send(token);
      // } else {
      //   // location.href = "/";
      //   res.send(token);
      // }
    }
  } else {
    res.send("user belum ada");
  }
}

export async function getAllAdmin(_req, res) {
  const data = await conn.query(`SELECT * FROM adminn`);
  res.send(data);
}

export async function registrasi(req, res) {
  const data = await conn.query(
    `SELECT * FROM adminn WHERE email = '${req.body.email}'`
  );

  if (data.length === 1) {
    res.send("data tidak boleh sama");
  } else {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.passwordd, salt);
    await conn.query(
      `INSERT INTO adminn VALUES ('${req.body.id_admin}','${req.body.nama}','${req.body.email}','${hash}','${req.body.role}')`
    );
    res.send("berhasil registrasi");
  }
}
