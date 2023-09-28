import express from "express";
import conn from "./connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const router = express();
router.use(express.json());

const port = 3000;

// untuk tabel admin
router.get("/api/admin", async (_req, res) => {
  const data = await conn.query(`SELECT * FROM adminn`);
  res.send(data);
});

router.post("/api/registrasi", async (req, res) => {
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
});

// menggunakan cookie
router.use(cookieParser());
router.use((req, res, next) => {
  if (req.path === "/api/login" || req.path.startsWith("/assets")) {
    next();
  } else {
    let authorized = false;
    if (req.cookies.token) {
      try {
        req.me = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
        authorized = true;
      } catch (err) {
        res.setHeader("Cache-Control", "no-store");
        res.clearCookie("token");
      }
    }
    if (authorized) {
      if (req.path.startsWith("/login")) {
        res.redirect("/");
      } else {
        next();
      }
    } else {
      if (req.path.startsWith("/login")) {
        next();
      } else {
        if (req.path.startsWith("/api")) {
          res.status(401);
          res.send("Anda harus login terlebih dahulu.");
        } else {
          res.redirect("/login");
        }
      }
    }
  }
});

router.post("/api/login", async (req, res) => {
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
});

// untuk tabel produk
router.get("/api/produk", async (_req, res) => {
  const data = await conn.query(`SELECT * FROM produk`);
  res.send(data);
});

router.get("/api/tampil/:mi", async (req, res) => {
  const data = await conn.query(
    `SELECT * FROM produk WHERE nama_barang LIKE '%${req.params.mi}%'`
  );
  res.send(data);
});

// untuk tabel penjualan
router.get("/api/penjualan", async (_req, res) => {
  const data = await conn.query(
    `SELECT * FROM penjualan ORDER BY id_penjual ASC`
  );
  res.send(data);
});

router.post("/api/penjualan", async (req, res) => {
  const data = await conn.query(
    `SELECT * FROM penjualan WHERE id_penjual = '${req.body.id_penjual}'`
  );

  if (data.length === 1) {
    res.send("id tidak boleh sama");
  } else {
    await conn.query(
      `INSERT INTO penjualan VALUES ('${req.body.id_penjual}',${req.body.kode_barang}, ${req.body.jumlah_jual}, '${req.body.tanggal}')`
    );
    res.json({
      ...req.body,
      pesan: "berhasil dijual",
    });
  }
});

// untuk tabel tambah / beli stok
router.post("/api/tambahstok", async (req, res) => {
  const data = await conn.query(`SELECT * FROM tambahstok`);
  if (data.length >= 0) {
    await conn.query(`
    INSERT INTO tambahstok VALUES (${req.body.stok}, ${req.body.kode_barang})`);

    res.json({
      ...req.body,
      pesan: "berhasil membeli",
    });
  }
});

router.get("/api/tampilstok", async (_req, res) => {
  const data = await conn.query(`SELECT * FROM tambahstok`);
  res.send(data);
});

router.get("/api/gabung", async (_req, res) => {
  const data =
    await conn.query(`SELECT pro.kode_barang,pem.jumlah_jual, pro.nama_barang FROM produk pro 
                      INNER JOIN penjualan pem ON pro.kode_barang = pem.kode_barang WHERE pro.harga > 2500`);
  res.send(data);
});

router.listen(port, () => {
  console.log(`server sedang berjalan pada port ${port}`);
});
