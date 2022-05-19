import React, { useState } from "react";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { Grid, Card, CardMedia } from "@mui/material";
import styles from "./style.module.css";
import tflogo from "./asset/img/logo tf.png";
import icologo from "./asset/img/Logo ICO.png";
import ecslogo from "./asset/img/Logo ECS.png";
import itslogo from "./asset/img/Logo ITS.png";
import praktikumlogo from "./asset/img/PRAKTIKUM SPO.png";
import { ThemeProvider, createTheme } from "@mui/system";
import Signup from "./Signup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import e from "cors";

const useStyles = makeStyles((theme) => ({
  root: {},
  hidden: { display: "none" },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  buttonwrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },

  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
    borderRadius: 10,
  },
  component: { paddingTop: 0 },
  button: { margin: "20px" },
}));

const theme = createTheme({
  palette: {
    background: {
      paper: "#000",
    },
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Login({ setUser, setData, setSignupAsisten }) {
  const [username, setUsername] = useState();
  const [userpassword, setUserpassword] = useState();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseSignup = () => setSignup(false);
  const [signup, setSignup] = useState(false);

  const classes = useStyles();

  const url = "http://localhost:5000/api/userlogin";
  const urlasisten = "http://localhost:5000/api/db/getasistenkelompok";
  const urlforasisten = "http://localhost:5000/api/db/getasistenkelompokfor";
  const urlgetjadwal = "http://localhost:5000/api/db/j4dwal";

  /*
  const url = "https://ui-spo-backend.herokuapp.com/api/userlogin";
  const urlforasisten =
    "https://ui-spo-backend.herokuapp.com/api/db/getasistenkelompokfor";
  const urlasisten =
    "https://ui-spo-backend.herokuapp.com/api/db/getasistenkelompok";
  const urlgetjadwal = "https://ui-spo-backend.herokuapp.com/api/db/j4dwal";
*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        url,
        {
          username,
          userpassword,
        },
        {
          headers: {
            "Access-Control-Allow-Origin":
              "https://riset.its.ac.id/praktikum/tf-spo/",
            //"http://localhost:3000/praktikum/tf-spo/",
          },
        }
      );

      window.localStorage.setItem("user", JSON.stringify(res.data));
      const user = JSON.parse(window.localStorage.getItem("user"));
      const kelompok = res.data.kelompok;
      const nama = res.data.nama;

      if (user.userrole == "Praktikan") {
        const response = await axios.post(urlasisten, { kelompok });
        window.localStorage.setItem("asisten", JSON.stringify(response.data));
        const jadwal = await axios.post(urlgetjadwal, { kelompok });
        window.localStorage.setItem("jadwal", JSON.stringify(jadwal.data));
      } else if (user.userrole == "Asisten") {
        const response = await axios.post(urlforasisten, { nama });
        window.localStorage.setItem("asisten", JSON.stringify(response.data));
        const jadwal = await axios.post(urlgetjadwal, { kelompok });
        window.localStorage.setItem("jadwal", JSON.stringify(jadwal.data));
      } else {
        const dummyasisten = {
          nama: "Linggar Handy Swandana",
          wa: "081486525130",
          line: "aldebaran_vc",
        };
        const dummyjadwal = {
          kelompok: "Kelompok 70",
          jadwal: "2022-01-27T12:01:00.000Z",
        };
        window.localStorage.setItem("asisten", JSON.stringify(dummyasisten));
        window.localStorage.setItem("jadwal", JSON.stringify(dummyjadwal));
      }

      /*if (user.userrole === "Koordinator") {
        const dummyasisten = {
          nama: "Linggar Handy Swandana",
          wa: "081486525130",
          line: "aldebaran_vc",
        };
        const dummyjadwal = {
          kelompok: "Kelompok 70",
          jadwal: "2022-01-27T12:01:00.000Z",
        };
        window.localStorage.setItem("asisten", JSON.stringify(dummyasisten));
        window.localStorage.setItem("jadwal", JSON.stringify(dummyjadwal));
      } else {
        const response = await axios.post(urlasisten, { kelompok });
        window.localStorage.setItem("asisten", JSON.stringify(response.data));
        const jadwal = await axios.post(urlgetjadwal, { kelompok });
        window.localStorage.setItem("jadwal", JSON.stringify(jadwal.data));
      }*/
      setUser(user);
      setData(user);
    } catch (err) {
      setMessage(err.message);
      handleOpen();
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSignup(true);
  };

  const handleSignupAsisten = () => {
    setSignupAsisten(true);
  };

  const handleClickAway = () => {
    setSignup(false);
  };

  <button className="submitButton" onClick={handleSignup}>
    Sign Up
  </button>;
  /* <button className="submitButton" onClick={handleSignupAsisten}>
            Sign Up Asisten
          </button>
          <button className="submitButton" onClick={handleSignup}>
    Sign Up
  </button>;
          */

  return (
    <div className={styles.logincontainer}>
      <Grid container>
        <Grid item xs={12} sm={12} md lg>
          <div className={styles.loginfont}>
            <div className={styles.judul1}>R-labSPO</div>
            <div className={styles.judul2}>
              Remote Laboratory Untuk Praktikum
            </div>
            <div className={styles.judul2}>Sistem Pengendalian Otomatis</div>
          </div>

          <div className={styles.loginparagrafcontainer}>
            <div className={styles.logo}>
              <img
                className={styles.loginparagrafimage}
                src={itslogo}
                alt="Logo ITS"
              />
            </div>
          </div>
          <div className={styles.loginparagrafdeskripsi}>
            <p className={styles.loginfontdeskripsi}>
              Efektivitas dan efisiensi proses produksi dapat dipengaruhi oleh
              perancangan sistem kontrol pada plant terkait. Oleh sebab itu,
              pemahaman terkait sistem kontrol sangat diperlukan dalam dunia
              kerja industri. Maka, melalui praktikum mata kuliah Sistem
              Pengendalian Otomatis (SPO), mahasiswa Teknik Fisika FTI-RS ITS
              ditempa agar mampu menjadi sumber daya manusia yang terampil dalam
              merancang dan mengoperasikan sistem pengendalian yang bekerja
              secara otomatis
            </p>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <div className={styles.paddingcenterouter}>
            <div className={styles.paddingcentermiddle}>
              <div className={styles.paddingcenterinner}>
                <Box
                  sx={{
                    bgcolor: "#032573",
                    boxShadow: 1,
                    borderRadius: 2,
                    p: 2,
                    minWidth: 300,
                  }}
                >
                  <Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <div className={styles.loginformfont1}>Log In</div>
                      <div className={styles.formlogin}>
                        <form>
                          <div className={styles.formform}>
                            <label>
                              <p className={styles.loginformfont2}>Username</p>
                              <input
                                className={styles.inputlogin}
                                type="text"
                                placeholder="username"
                                onChange={(e) => setUsername(e.target.value)}
                              />
                            </label>
                          </div>
                          <label>
                            <p className={styles.loginformfont2}>Password</p>
                            <input
                              className={styles.inputlogin}
                              type="password"
                              placeholder="password"
                              onChange={(e) => setUserpassword(e.target.value)}
                            />
                          </label>
                          <div>
                            <button
                              onClick={handleSubmit}
                              className={styles.loginbutton}
                            >
                              Login
                            </button>
                            <button
                              onClick={handleSignup}
                              className={styles.loginbutton}
                            >
                              Sign Up
                            </button>
                          </div>
                        </form>
                      </div>
                    </Grid>
                  </Grid>

                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={open}>
                      <Box sx={style}>
                        <Typography
                          id="transition-modal-description"
                          align="center"
                          sx={{ mt: 2 }}
                        >
                          Username belum terdaftar/tervalidasi!
                        </Typography>
                        <Typography
                          id="transition-modal-description"
                          align="center"
                          sx={{ mt: 2 }}
                        >
                          {message}
                        </Typography>
                      </Box>
                    </Fade>
                  </Modal>
                  <Modal
                    open={signup}
                    onClose={handleCloseSignup}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={signup}>
                      <Box sx={style}>
                        <Signup />
                      </Box>
                    </Fade>
                  </Modal>
                </Box>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item md={1} lg={1}></Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
        <div className={styles.loginfooter}>
          <div className={styles.row}>
            <div className={styles.boxloginlogo}>
              <div className={styles.loginlogocolumn}>
                <img
                  className={styles.loginlogo}
                  src={itslogo}
                  alt="Logo ITS"
                />
              </div>
              <div className={styles.loginlogocolumn}>
                <img className={styles.loginlogo} src={tflogo} alt="Logo TF" />
              </div>
              <div className={styles.loginlogocolumn}>
                <img
                  className={styles.loginlogo}
                  src={icologo}
                  alt="Logo ICO"
                />
              </div>
              <div className={styles.loginlogocolumn}>
                <img
                  className={styles.loginlogo}
                  src={ecslogo}
                  alt="Logo ECS"
                />
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  );
}
