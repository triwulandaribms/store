import express from "express";
import jwt from "jsonwebtoken";
import login, { getAllAdmin, registrasi } from "./routes/auth-routes.js";
import {
  addDataPenjualan,
  addStok,
  getAllPenjualan,
  getAllProduk,
  getAllStok,
  getDetailPenjualan,
  getProdukById,
} from "./routes/store-wulan-routes.js";

const app = express();
app.use(express.json());

const port = 3000;

// untuk tabel admin
app.get("/api/admin", getAllAdmin);
app.post("/api/registrasi", registrasi);

// menggunakan cookie
app.use(auth);
function auth(req, res, next) {
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
}

app.post("/api/login", login);

// untuk tabel produk
app.get("/api/produk", getAllProduk);
app.get("/api/tampil/:mi", getProdukById);

// untuk tabel penjualan
app.get("/api/penjualan", getAllPenjualan);
app.post("/api/penjualan", addDataPenjualan);

// untuk tabel tambah / beli stok
app.post("/api/tambahstok", addStok);
app.get("/api/tampilstok", getAllStok);
app.get("/api/tampilDetailPenjualan", getDetailPenjualan);

app.listen(port, () => {
  console.log(`server sedang berjalan pada port ${port}`);
});
