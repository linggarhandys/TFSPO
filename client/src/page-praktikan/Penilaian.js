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

export default function Penilaian() {
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
    <div>
      <h1>Penilaian</h1>
    </div>
  );
}
