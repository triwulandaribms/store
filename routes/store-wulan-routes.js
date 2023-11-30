import conn from "../connect.js";

// function untuk tabel tambahstok
export async function addStok(req, res) {
  try {
    const data = await conn.query(`SELECT * FROM tambahstok`);
    if (data.length >= 0) {
      await conn.query(`
                  INSERT INTO tambahstok VALUES (${req.body.stok}, ${req.body.kode_barang})`);

      res.status(201).json({
        ...req.body,
        pesan: "berhasil menambah stok",
      });
    }
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}

export async function getAllStok(_req, res) {
  try {
    const data = await conn.query(`SELECT * FROM tambahstok`);
    res.send(data);
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}

// function untuk tabel produk
export async function getAllProduk(_req, res) {
  try {
    const data = await conn.query(`SELECT * FROM produk`);
    res.send(data);
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}

export async function getProdukById(req, res) {
  try {
    const data = await conn.query(
      `SELECT * FROM produk WHERE kode_barang = ${req.params.kode_barang}`
    );
    res.send(data);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
}

export async function addProduk(req, res) {
  try {
    const data = await conn.query(
      `SELECT * FROM produk WHERE kode_barang = ${req.body.kode_barang}`
    );

    if (data.length === 1) {
      res.status(400).send("kode produk tidak boleh sama");
    } else {
      await conn.query(
        `INSERT INTO produk VALUES(${req.body.kode_barang}, '${req.body.nama_barang}', ${req.body.harga}, ${req.body.jumlah_persediaan} )`
      );

      res.status(201).json({
        ...req.body,
        pesan: "berhasil di tambah",
      });
    }
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}

export async function editproduk(req, res) {
  try {
    const data = await conn.query(
      `SELECT * FROM produk WHERE kode_barang = ${req.params.kode_barang} `
    );
    if (data.length === 1) {
      await conn.query(
        `UPDATE produk SET nama_barang = '${req.body.nama_barang}', harga = ${req.body.harga}, jumlah_persediaan = ${req.body.jumlah_persediaan} WHERE kode_barang = ${req.params.kode_barang}`
      );
    }
    res.status(201).send("berhasil mengupdate");
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}

export async function hapusProduk(req, res) {
  try {
    await conn.query(
      `DELETE FROM tambahstok WHERE kode_barang = ${req.params.kode_barang}`
    );

    await conn.query(
      `DELETE FROM produk WHERE kode_barang = ${req.params.kode_barang}`
    );

    res.status(400).send("berhasil menghapus");
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}

// function untuk tabel penjualan
export async function getAllPenjualan(_req, res) {
  try {
    const data = await conn.query(
      `SELECT * FROM penjualan ORDER BY id_penjual ASC`
    );
    res.send(data);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
}

export async function addDataPenjualan(req, res) {
  try {
    const data = await conn.query(
      `SELECT * FROM penjualan WHERE id_penjual = '${req.body.id_penjual}'`
    );

    await conn.query(
      `INSERT INTO penjualan VALUES ('${req.body.id_penjual}',${req.body.kode_barang}, ${req.body.jumlah_jual}, '${req.body.tanggal}')`
    );
    res.status(201).json({
      ...req.body,
      pesan: "berhasil dijual",
    });
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}

export async function editDatapenjualan(req, res) {
  try {
    const data = await conn.query(
      `SELECT * FROM penjualan WHERE id_penjual = '${req.params.id_penjual}'`
    );
    if (data.length === 1) {
      await conn.query(
        `UPDATE penjualan SET kode_barang = ${req.body.kode_barang}, jumlah_jual = ${req.body.jumlah_jual}, tanggal = '${req.body.tanggal}' WHERE id_penjual = '${req.params.id_penjual}'`
      );
      res.status(201).send("berhasil mengupdate");
    }
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}

// function untuk ERP antara tabel - tabel
export async function getDetailPenjualan(_req, res) {
  try {
    const data =
      await conn.query(`SELECT pro.nama_barang, pro.harga, pen.jumlah_jual, pen.tanggal FROM produk pro INNER JOIN penjualan pen
        ON pro.kode_barang = pen.kode_barang`);
    res.send(data);
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}

export async function getDetailTotalPenjualan(_req, res) {
  try {
    const data =
      await conn.query(`SELECT pro.kode_barang, pro.nama_barang, pro.harga, pen.jumlah_jual, SUM(pen.jumlah_jual * pro.harga) AS total FROM penjualan pen INNER JOIN produk pro
  ON pen.kode_barang = pro.kode_barang GROUP BY pro.kode_barang, pro.nama_barang`);
    res.send(data);
  } catch (error) {
    console.error("error during database operation:", error);
    res.status(500).send("terjadi kesalahan server");
  }
}
