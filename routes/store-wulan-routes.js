import conn from "../connect.js";

export async function getAllProduk(_req, res) {
  const data = await conn.query(`SELECT * FROM produk`);
  res.send(data);
}

export async function getProdukById(req, res) {
  const data = await conn.query(
    `SELECT * FROM produk WHERE nama_barang LIKE '%${req.params.mi}%'`
  );
  res.send(data);
}

export async function getAllPenjualan(_req, res) {
  const data = await conn.query(
    `SELECT * FROM penjualan ORDER BY id_penjual ASC`
  );
  res.send(data);
}

export async function addDataPenjualan(req, res) {
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
}

export async function addStok(req, res) {
  const data = await conn.query(`SELECT * FROM tambahstok`);
  if (data.length >= 0) {
    await conn.query(`
                INSERT INTO tambahstok VALUES (${req.body.stok}, ${req.body.kode_barang})`);

    res.json({
      ...req.body,
      pesan: "berhasil membeli",
    });
  }
}

export async function getAllStok(_req, res) {
  const data = await conn.query(`SELECT * FROM tambahstok`);
  res.send(data);
}

export async function getDetailPenjualan(_req, res) {
  const data =
    await conn.query(`SELECT pro.nama_barang, pro.harga, pen.jumlah_jual, pen.tanggal FROM produk pro INNER JOIN penjualan pen
        ON pro.kode_barang = pen.kode_barang`);
  res.send(data);
}
