import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import login, {
  getAllAdmin,
  registrasi,
  logoutToken,
} from "./routes/auth-routes.js";
import {
  addDataPenjualan,
  addProduk,
  addStok,
  editDatapenjualan,
  editproduk,
  getAllPenjualan,
  getAllProduk,
  getAllStok,
  getDetailPenjualan,
  getDetailTotalPenjualan,
  getProdukById,
  hapusProduk,
} from "./routes/store-wulan-routes.js";

const app = express();
app.use(express.json());

// untuk tabel admin
app.get("/api/admin", getAllAdmin);
app.post("/api/registrasi", registrasi);

// // menggunakan cookie
app.use(cookieParser());

app.use((req, res, next) => {
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

app.post("/api/login", login);

// tabel tambah / beli stok untuk admin
app.post("/api/tambahstok", addStok);
app.get("/api/tampilstok", getAllStok);

// untuk tabel produk
app.get("/api/produk", getAllProduk);
app.get("/api/tampil/:kode_barang", getProdukById);
app.post("/api/tambahproduk", addProduk);
app.put("/api/editproduk/:kode_barang", editproduk);
app.delete("/api/hapus/:kode_barang", hapusProduk);

// untuk tabel penjualan
app.get("/api/penjualan", getAllPenjualan);
app.post("/api/penjualan", addDataPenjualan);
app.put("/api/penjualan/:id_penjual", editDatapenjualan);

// untuk ERP antara tabel - tabel
app.get("/api/detailPenjualan", getDetailPenjualan);
app.get("/api/detailTotalJual", getDetailTotalPenjualan);

// untuk logout
app.get("/api/exit", logoutToken);

app.listen(3000, () => {
  console.log(`server sedang berjalan pada port 3000`);
});
