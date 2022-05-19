import React, { Fragment, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./css/home.module.css";
import "dayjs/locale/id";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonIcon from "@mui/icons-material/Person";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import Announcement from "@mui/icons-material/Announcement";
import { IconButton } from "@mui/material";
import AssistantIcon from "@mui/icons-material/Assistant";

var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

export default function Profil() {
  ///  const user = getUser();
  // handle click event of logout button

  useEffect(() => {}, []);

  const userString = sessionStorage.getItem("accessToken");
  const userToken = JSON.parse(userString);
  const getUser = Object.values(userToken);

  function createData(Item, P1, P2, P3) {
    return { Item, P1, P2, P3 };
  }

  const rows = [
    createData(
      "Tugas Pendahuluan",
      getUser[6].toString(),
      getUser[7].toString(),
      getUser[8].toString()
    ),
    createData(
      "Praktikum",
      getUser[9].toString(),
      getUser[10].toString(),
      getUser[11].toString()
    ),
    createData(
      "Asistensi",
      getUser[12].toString(),
      getUser[13].toString(),
      getUser[14].toString()
    ),
    createData(
      "Laporan Resmi",
      getUser[15].toString(),
      getUser[16].toString(),
      getUser[17].toString()
    ),
  ];

  let navigate = useNavigate();
  async function handleProfil(event) {
    event.preventDefault();
    navigate("../profil", { replace: true });
  }

  async function handleProfil(event) {
    event.preventDefault();
    navigate("../profil", { replace: true });
  }

  async function handlePraktikum(event) {
    event.preventDefault();
    navigate("../praktikum", { replace: true });
  }

  async function handlePengumuman(event) {
    event.preventDefault();
    navigate("../pengumuman", { replace: true });
  }

  async function handlePengumpulan(event) {
    event.preventDefault();
    navigate("../pengumpulan", { replace: true });
  }

  async function handlePenilaian(event) {
    event.preventDefault();
    navigate("../penilaian", { replace: true });
  }

  return (
    <div className={styles.homewrapper}>
      <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
        <div className={styles.textwrapper}>
          <h1>Pendahuluan</h1>
          <p className={styles.teks}>
            Praktikum ini menggunakan dua media uji, 1) Motor MS 150 DC pada
            laboratorium Sistem Tertanam dan Siber-Fisik (ECS) dan 2) Heat
            Exchanger pada laboratorium Instrumentasi, Kontrol dan Optimisasi
            (ICO). Untuk media uji pertama (Motor DC), mahasiswa melakukan
            perancangan pengendalian kecepatan dan menganalisis respon dengan
            beberapa skenario gain kontrol. Sedangkan untuk praktikum kedua,
            mahasiswa melakukan analisa respon sistem pengendalian temperatur
            juga dengan beberapa skenario kontrol.
          </p>
        </div>
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
        <div className={styles.paddingcenterouter}>
          <div className={styles.paddingcentermiddle}>
            <p className={styles.navigasiteks}>Navigasi</p>
            <div className={styles.paddingcenterinner}>
              <div className={styles.paper}>
                <div className={styles.footer}>Profil</div>
                <div className={styles.icon}>
                  <IconButton onClick={handleProfil}>
                    <PersonIcon color="disabled" sx={{ fontSize: 120 }} />
                  </IconButton>
                </div>
              </div>

              <div className={styles.paper}>
                <div className={styles.footer}>Praktikum</div>
                <div className={styles.icon}>
                  <IconButton onClick={handlePraktikum}>
                    <AssignmentTurnedInIcon
                      className={styles.icon}
                      color="disabled"
                      sx={{ fontSize: 120 }}
                    />
                  </IconButton>
                </div>
              </div>

              <div className={styles.paper}>
                <div className={styles.footer}>Pengumuman</div>
                <div className={styles.icon}>
                  <IconButton onClick={handlePengumuman}>
                    <Announcement color="disabled" sx={{ fontSize: 120 }} />
                  </IconButton>
                </div>
              </div>

              <div className={styles.paper}>
                <div className={styles.footer}>Penilaian</div>
                <div className={styles.icon}>
                  <IconButton onClick={handlePenilaian}>
                    <AssistantIcon color="disabled" sx={{ fontSize: 120 }} />
                  </IconButton>
                </div>
              </div>

              <div className={styles.paper}>
                <div className={styles.footer}>Pengumpulan Berkas</div>
                <div className={styles.icon}>
                  <IconButton onClick={handlePengumpulan}>
                    <UploadFileIcon color="disabled" sx={{ fontSize: 120 }} />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  );
}
