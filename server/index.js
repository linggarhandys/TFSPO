const express = require("express");
const multer = require("multer");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const server = require("http").createServer(app);
const serveIndex = require("serve-index");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const path = require("path");
const dayjs = require("dayjs");

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    //"https://riset.its.ac.id"
    "http://localhost:3000"
    //"https://lucid-murdock-aadfea.netlify.app"
  ); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  cors({
    //origin: "https://riset.its.ac.id",
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

var corsOptions = {
  origin: "http://localhost:3000",
  //origin: "https://lucid-murdock-aadfea.netlify.app",
  //origin: "https://riset.its.ac.id",
  optionsSuccessStatus: 200,
  credentials: true,
};

//refresh token array tambahin ke pg juga
let refreshTokens = [];

var storage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname + "/public/uploads/"));
    },
    filename: function (req, file, cb) {
      let [filename, extension] = file.originalname.split(".");
      let nameFile =
        filename + "-" + dayjs().format("DDMMYYYY") + "." + extension;
      cb(null, nameFile);
    },
    limits: {
      fileSize: 10000000, // max file size 10MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(txt)$/)) {
        return cb(new Error("only upload files with txt format."));
      }
      cb(undefined, true); // continue with upload
    },
  }),
});

const fileFilter = (req, file, cb) => {
  if (["document/pdf"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./files");
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1000000, // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error("only upload files with pdf format."));
    }
    cb(undefined, true); // continue with upload
  },
});

const PORT = process.env.PORT || 5000;

//api refresh token
app.get("/", (req, res) => {
  res.send("Listening");
});

app.post("/api/refresh", (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //if everything is ok, create new access token, refresh token and send to user
});

//secretkeykey pake .env, generate token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
    expiresIn: "30s",
  });
};

//generate refresh
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshSecretKey");
};

app.post("/api/asistenlogout", cors(corsOptions), async (req, res) => {
  const { namaasisten } = req.body;
  const login = await pool.query(
    "UPDATE user_praktikum SET peerid='logout' WHERE nama=$1",
    [namaasisten]
  );
});

app.post("/api/userlogin", cors(corsOptions), async (req, res) => {
  const { username, userpassword } = req.body;
  const find = await pool.query(
    "SELECT * FROM user_praktikum WHERE username=$1 AND userpassword=$2",
    [username, userpassword]
  );
  const lower = await pool.query(
    "SELECT * FROM user_praktikum WHERE LOWER(username)=LOWER($1) AND userpassword=$2",
    [username, userpassword]
  );
  let data;
  if (find.rowCount !== 0) {
    data = find;
    if (data.rows[0].userrole === "Asisten") {
      const login = await pool.query(
        "UPDATE user_praktikum SET peerid='login' WHERE nama=$1",
        [data.rows[0].nama]
      );
    }
    const accessToken = generateAccessToken(data);
    const refreshToken = generateRefreshToken(data);
    refreshTokens.push(refreshToken);

    res.json({
      username: data.rows[0].username,
      nama: data.rows[0].nama,
      nrp: data.rows[0].nrp,
      userrole: data.rows[0].userrole,
      accessToken,
      refreshToken,
      tugaspendahuluanp1: data.rows[0].tugaspendahuluanp1,
      tugaspendahuluanp2: data.rows[0].tugaspendahuluanp2,
      tugaspendahuluanp3: data.rows[0].tugaspendahuluanp3,
      praktikump1: data.rows[0].praktikump1,
      praktikump2: data.rows[0].praktikump2,
      praktikump3: data.rows[0].praktikump3,
      asistensip1: data.rows[0].asistensip1,
      asistensip2: data.rows[0].asistensip2,
      asistensip3: data.rows[0].asistensip3,
      laporanresmip1: data.rows[0].laporanresmip1,
      laporanresmip2: data.rows[0].laporanresmip2,
      laporanresmip3: data.rows[0].laporanresmip3,
      kelompok: data.rows[0].kelompok,
    });
  } else if (lower.rowCount !== 0) {
    data = lower;
    if (data.rows[0].userrole === "Asisten") {
      const login = await pool.query(
        "UPDATE user_praktikum SET peerid='login' WHERE nama=$1",
        [data.rows[0].nama]
      );
    }
    const accessToken = generateAccessToken(data);
    const refreshToken = generateRefreshToken(data);
    refreshTokens.push(refreshToken);
    res.json({
      username: data.rows[0].username,
      nama: data.rows[0].nama,
      nrp: data.rows[0].nrp,
      userrole: data.rows[0].userrole,
      accessToken,
      refreshToken,
      tugaspendahuluanp1: data.rows[0].tugaspendahuluanp1,
      tugaspendahuluanp2: data.rows[0].tugaspendahuluanp2,
      tugaspendahuluanp3: data.rows[0].tugaspendahuluanp3,
      praktikump1: data.rows[0].praktikump1,
      praktikump2: data.rows[0].praktikump2,
      praktikump3: data.rows[0].praktikump3,
      asistensip1: data.rows[0].asistensip1,
      asistensip2: data.rows[0].asistensip2,
      asistensip3: data.rows[0].asistensip3,
      laporanresmip1: data.rows[0].laporanresmip1,
      laporanresmip2: data.rows[0].laporanresmip2,
      laporanresmip3: data.rows[0].laporanresmip3,
      kelompok: data.rows[0].kelompok,
    });
  } else {
    res.status(400).json("Username or password incorrect!");
  }
});

//verify token
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

//delete api, ga butuh tapi coba
app.delete("/api/users/:userId", verify, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.status(200).json("User has been deleted.");
  } else {
    res.status(403).json("You are not allowed to delete this user!");
  }
});

//logout api
app.post("/api/logout", verify, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("You logged out successfully.");
  console.log(req.body.token);
});

app.post("/db/user", async (req, res) => {
  try {
    const { username, userpassword, nama, nrp, userrole } = req.body;
    const newUser = await pool.query(
      "INSERT INTO user_praktikum(username, userpassword, nama, nrp, userrole) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [username, userpassword, nama, nrp, userrole]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { nama, nrp, email, username, userpassword, role } = req.body;
    const find = await pool.query(
      "SELECT * FROM user_praktikum WHERE username=$1",
      [username]
    );
    if (find.rowCount !== 0) {
      res.status(401).json("Username sudah terdaftar!");
    } else {
      const newUser = await pool.query(
        "INSERT INTO user_praktikum(username, userpassword, nama, nrp, email, userrole) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
        [username, userpassword, nama, nrp, email, role]
      );
      res.json(newUser.rows[0]);
      res.status(402).json("Pendaftaran berhasil!");
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/signup/dump/praktikan", async (req, res) => {
  try {
    const { nama, nrp, email, username, userpassword } = req.body;
    const find = await pool.query(
      "SELECT * FROM user_praktikum WHERE username=$1",
      [username]
    );
    if (find.rowCount !== 0) {
      res.status(403).json("Username sudah terdaftar!");
    } else {
      const newUser = await pool.query(
        "INSERT INTO daftarpraktikan(username, userpassword, nama, nrp, email) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [username, userpassword, nama, nrp, email]
      );

      res.status(202).json("Pendaftaran Praktikan berhasil!");
    }
    console.log("Pendaftaran Praktikan berhasil!");
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/api/signup/dump/praktikan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletePengumuman = await pool.query(
      "DELETE FROM daftarpraktikan WHERE user_id= $1",
      [id]
    );
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/api/signup/dump/asisten", async (req, res) => {
  try {
    const {
      nama,
      nrp,
      email,
      username,
      userpassword,
      kontakWA,
      kontakLine,
      userrole,
    } = req.body;
    const find = await pool.query(
      "SELECT * FROM user_praktikum WHERE username=$1",
      [username]
    );
    if (find.rowCount !== 0) {
      res.status(403).json("Username sudah terdaftar!");
    } else {
      const newUser = await pool.query(
        "INSERT INTO daftarasisten(username, userpassword, nama, nrp, kontak_wa, kontak_line, email) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [username, userpassword, nama, nrp, kontakWA, kontakLine, email]
      );
      const asisten = await pool.query(
        "INSERT INTO user_praktikum(username, userpassword, nama, nrp, email, userrole) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
        [username, userpassword, nama, nrp, email, userrole]
      );
      res.status(202).json("Pendaftaran berhasil!");
    }
    console.log(req.body);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/signup/dump/asisten", async (req, res) => {
  try {
    const allFiles = await pool.query(
      "SELECT * FROM daftarasisten ORDER BY nrp ASC"
    );
    res.json(allFiles.rows);
    console.log(req.headers);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/signup/dump/praktikan", async (req, res) => {
  try {
    const allFiles = await pool.query(
      "SELECT * FROM daftarpraktikan ORDER BY nrp ASC"
    );
    res.json(allFiles.rows);
    console.log(req.headers);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/db/getpraktikan", async (req, res) => {
  try {
    const allFiles = await pool.query(
      "SELECT * FROM user_praktikum WHERE userrole = 'Praktikan' ORDER BY kelompok ASC"
    );
    res.json(allFiles.rows);
    console.log(req.headers);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/db/getasisten", cors(corsOptions), async (req, res) => {
  try {
    const allFiles = await pool.query(
      "SELECT * FROM user_praktikum WHERE userrole = 'Asisten' ORDER BY kelompok ASC"
    );
    res.json(allFiles.rows);
    console.log(req.headers);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/db/getasistenkelompok", cors(corsOptions), async (req, res) => {
  try {
    const { kelompok } = req.body;
    const allFiles = await pool.query(
      "SELECT nama FROM daftarasisten WHERE kelompok1=$1 OR kelompok2=$1",
      [kelompok]
    );
    console.log(allFiles);
    const nama = allFiles.rows[0].nama;

    const allFiles1 = await pool.query(
      "SELECT * FROM daftarasisten WHERE nama=$1",
      [nama]
    );
    res.json({
      nama: allFiles1.rows[0].nama,
      line: allFiles1.rows[0].kontak_line,
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.post(
  "/api/db/getasistenkelompokfor",
  cors(corsOptions),
  async (req, res) => {
    try {
      const { nama } = req.body;
      const allFiles = await pool.query(
        "SELECT nama FROM user_praktikum WHERE nama=$1",
        [nama]
      );
      const nama1 = allFiles.rows[0].nama;

      const allFiles1 = await pool.query(
        "SELECT * FROM daftarasisten WHERE nama=$1",
        [nama1]
      );
      res.json({
        nama: allFiles1.rows[0].nama,
        line: allFiles1.rows[0].kontak_line,
      });
    } catch (err) {
      console.error(err.message);
    }
  }
);

app.post("/api/signup/pr4ktikan", async (req, res) => {
  try {
    const { username, userpassword, nama, nrp, email, userrole, kelompoka } =
      req.body;
    const find = await pool.query(
      "SELECT * FROM user_praktikum WHERE username=$1",
      [username]
    );
    if (find.rowCount !== 0) {
      res.status(403).json("Username sudah terdaftar!");
    } else {
      const deletefrom = await pool.query(
        "DELETE FROM daftarpraktikan WHERE nama=$1",
        [nama]
      );
      const passdata = await pool.query(
        "INSERT INTO user_praktikum(username, userpassword, nama, nrp, email, userrole, kelompok) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [username, userpassword, nama, nrp, email, userrole, kelompoka]
      );
      res.status(202).json("Praktikan Tervalidasi!");
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/signup/4sisten", async (req, res) => {
  try {
    const {
      username,
      userpassword,
      nama,
      nrp,
      email,
      userrole,
      kelompoka,
      kelompoka2,
    } = req.body;
    const updatefilepraktikum = await pool.query(
      "UPDATE file_p2 SET asisten=$1 WHERE kelompok=$2 OR kelompok=$3 RETURNING *",
      [nama, kelompoka, kelompoka2]
    );
    const find = await pool.query(
      "SELECT * FROM user_praktikum WHERE username=$1",
      [username]
    );
    if (find.rowCount !== 0) {
      const passdata = await pool.query(
        "UPDATE user_praktikum SET kelompok=$1 WHERE nama=$2 RETURNING *",
        [kelompoka, nama]
      );
      res.status(202).json("Kelompok Telah Di Update!");
    } else {
      const passdata = await pool.query(
        "INSERT INTO user_praktikum(username, userpassword, nama, nrp, email, userrole, kelompok) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [username, userpassword, nama, nrp, email, userrole, kelompoka]
      );
      res.status(202).json("Asisten Tervalidasi!");
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/api/db/jadwal", cors(corsOptions), async (req, res) => {
  try {
    const allFiles = await pool.query(
      "SELECT kelompok, jadwal AT TIME ZONE 'UTC' FROM jadwal ORDER BY jadwal_id ASC"
    );
    res.json(allFiles.rows);
    console.log(req.headers);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/db/j4dwal", cors(corsOptions), async (req, res) => {
  try {
    const { kelompok } = req.body;
    const allFiles = await pool.query(
      "SELECT kelompok,jadwal AT TIME ZONE 'UTC' FROM user_praktikum WHERE kelompok=$1",
      [kelompok]
    );
    res.json({
      kelompok: allFiles.rows[0].kelompok,
      jadwal: allFiles.rows[0].timezone,
    });
    res.json(allFiles.rows);
    console.log(req.headers);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/db/jadwal", cors(corsOptions), async (req, res) => {
  try {
    const { sqljadwal, kelompok } = req.body;
    const jadwal = dayjs(sqljadwal).format("DD-MM-YYYY HH:mm");
    const allFiles = await pool.query(
      "UPDATE jadwal SET jadwal=$1 WHERE kelompok=$2 RETURNING *",
      [sqljadwal, kelompok]
    );
    const update = await pool.query(
      "UPDATE user_praktikum SET jadwal=$1 WHERE kelompok=$2 RETURNING *",
      [sqljadwal, kelompok]
    );
    res.json(allFiles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/poststream", async (req, res) => {
  try {
    const { linkstream, nama } = req.body;
    const getnama = await pool.query(
      "SELECT kelompok1,kelompok2 FROM daftarasisten WHERE nama=$1",
      [nama]
    );
    const kelompok1 = getnama.rows[0].kelompok1;
    const kelompok2 = getnama.rows[0].kelompok2;
    const postLink = await pool.query(
      "UPDATE user_praktikum SET linkstream=$1 WHERE kelompok=$2 OR kelompok=$3",
      [linkstream, kelompok1, kelompok2]
    );
    res.json("Link berhasil dikirim!");
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/api/getstream", async (req, res) => {
  try {
    const { kelompok } = req.body;
    const passurl = await pool.query(
      "SELECT linkstream FROM user_praktikum WHERE kelompok=$1",
      [kelompok]
    );
    res.json({
      linkstream: passurl.rows[0].linkstream,
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/db/user", async (req, res) => {
  try {
    const allUser = await pool.query("SELECT * FROM user_praktikum");
    res.json(allUser.rows);
    console.log(req.headers);
  } catch (err) {
    console.error(err.message);
  }
});

//create pengumuman
app.post("/pengumuman/db", cors(corsOptions), async (req, res) => {
  try {
    const { description } = req.body;
    const newPengumuman = await pool.query(
      "INSERT INTO pengumuman (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newPengumuman.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all todo
app.get("/pengumuman/db", cors(corsOptions), async (req, res) => {
  try {
    const allPengumuman = await pool.query("SELECT * FROM pengumuman");
    res.json(allPengumuman.rows);
    console.log(req.headers);
  } catch (err) {
    console.error(err.message);
  }
});

//get file status
app.get("/db/file", async (req, res) => {
  try {
    // const allFiles = await pool.query(
    // "SELECT * FROM user_praktikum ORDER BY file_id ASC"
    // );
    //res.json(allFiles.rows);
    //console.log(req.headers);
  } catch (err) {
    console.error(err.message);
  }
});

//get praktikum
app.get("/api/statuspraktikum", async (req, res) => {
  try {
    const { username, userpassword } = req.body;
    const find = await pool.query(
      "SELECT * FROM user_praktikum WHERE username=$1 AND userpassword=$2",
      [username, userpassword]
    );

    if (find.rowCount !== 0) {
      const accessToken = generateAccessToken(find);
      const refreshToken = generateRefreshToken(find);
      refreshTokens.push(refreshToken);
      res.json({
        username: username,
        nama: find.rows[0].nama,
        nrp: find.rows[0].nrp,
        userrole: find.rows[0].userrole,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400).json("Username or password incorrect!");
    }
  } catch (err) {
    console.error(err.message);
  }
});

//get specific todo
app.get("/pengumuman/db/:id", cors(corsOptions), async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const pengumuman = await pool.query(
      "SELECT * FROM pengumuman WHERE id = $1",
      [id]
    );
    res.json(pengumuman.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update todo
app.put("/pengumuman/db/:id", cors(corsOptions), async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updatePengumuman = await pool.query(
      "UPDATE pengumuman SET description = $1 WHERE id = $2",
      [description, id]
    );

    res.json("Pengumuman updated!");
  } catch (err) {
    console.log(err.message);
  }
});

//update filedb
app.put("/db/file/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    //const updateFile = await pool.query(
    //"UPDATE file_mahasiswa SET status = $1 WHERE file_id = $2",
    // [status, id]
    //);

    res.json("File updated!");
  } catch (err) {
    console.log(err.message);
  }
});

//delete todo
app.delete("/pengumuman/db/:id", cors(corsOptions), async (req, res) => {
  try {
    const { id } = req.params;
    const deletePengumuman = await pool.query(
      "DELETE FROM pengumuman WHERE id= $1",
      [id]
    );
    res.json("Pengumuman deleted!");
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log("receive file");
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  res.send({
    code: 200,
    message: "ok",
  });
});

app.post("/api/db/filekelompok", async (req, res) => {
  try {
    const { nama } = req.body;
    const allFiles = await pool.query(
      "SELECT kelompok FROM file_p2 WHERE asisten = $1",
      [nama]
    );
    res.json(allFiles.rows);
    console.log(allFiles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post(
  "/api/uploadfile",
  storage.single("file"),
  async (req, res) => {
    try {
      const { kolom, kelompok } = req.body;
      const { path, mimetype, originalname } = req.file;
      let [filename, extension] = originalname.split(".");

      let nameFile =
        filename + "-" + dayjs().format("DDMMYYYY") + "." + extension;
      console.log(nameFile);
      let task = "UPDATE file_p2 SET " + kolom + "=$1 WHERE kelompok = $2";
      const updateFile = await pool.query(task, [nameFile, kelompok]);
      /* const file = new File({
        title,
        description,
        file_path: path,
        file_mimetype: mimetype
      });
      await file.save();*/
      res.send("Success");
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);

app.post("/api/download", async (req, res) => {
  try {
    const { kelompok, kolom } = req.body;
    let namakolom;
    console.log("kolom:", kolom);
    kolom === 1
      ? (namakolom = "file_1")
      : kolom == 2
      ? (namakolom = "file_2")
      : (namakolom = "file_3");
    console.log("namakolom:", namakolom);
    let task = "SELECT " + namakolom + " FROM file_p2 WHERE Kelompok = $1";

    const namaFile = await pool.query(task, [kelompok]);
    let kolomtarget = namaFile.rows[0][Object.keys(namaFile.rows[0])[0]]; // "a"
    res.send(kolomtarget);
  } catch (error) {
    res.status(400).send(error.message);
  }
  //  var file = path.join(
  //   __dirname + "/public/uploads/1st law review problems-13032022.pdf"
  //);
  // res.download(file);
});

app.get("/api/download/:file", (req, res, next) => {
  let file = path.join(__dirname + "/public/uploads/" + req.params.file);
  console.log(file);
  res.download(file);
});

app.get("api/getAllFiles", async (req, res) => {
  try {
    const files = await File.find({});
    const sortedByCreationDate = files.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.send(sortedByCreationDate);
  } catch (error) {
    res.status(400).send("Error while getting list of files. Try again later.");
  }
});

app.get("/api/download/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    res.set({
      "Content-Type": file.file_mimetype,
    });
    res.sendFile(path.join(__dirname, "..", file.file_path));
  } catch (error) {
    res.status(400).send("Error while downloading file. Try again later.");
  }
});

app.get("/api/uploads/:filename", async (req, res) => {
  const fileName = req.params.filename;
  const file = `${__dirname}/public/uploads/${fileName}`;
  res.download(file, "ayylmao");
});

app.get(
  "/api/download_modul/:filename",
  cors(corsOptions),
  async (req, res) => {
    try {
      const fileName = req.params.filename;
      const file = `${__dirname}/public/asset/modul/${fileName}`;
      console.log(file);
      res.download(file);
    } catch (err) {
      console.log(err.message);
    }
  }
);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
