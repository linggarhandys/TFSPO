import React, { Fragment, useEffect, useState, useRef, createRef } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axios from "axios";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { Box } from "@mui/system";
import UploadData from "./UploadData";
import styles from "./css/home.module.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(Item, Status, Upload) {
  return { Item, Status, Upload };
}

const Pengumpulan = ({}) => {
  const [statusFile, setstatusFile] = useState([]);
  const [inputfile, setInputFile] = useState({
    file1: null,
    file2: null,
    file3: null,
    file4: null,
    file5: null,
    file6: null,
  });
  const [state, setState] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = React.useState(() => {
    const stickyValue = window.localStorage.getItem("user");
    return stickyValue !== null ? JSON.parse(stickyValue) : {};
  });
  const [kelompok, setKelompok] = useState(null);
  const [grup, setGrup] = useState();
  const [name, setName] = useState();
  const [NRP, setNRP] = useState();
  const [role, setRole] = useState();

  const [daftar, setDaftar] = React.useState({});
  const [jadwal, setJadwal] = React.useState({});

  const Item = styled("div")(({ theme }) => ({
    ...theme.typography.header5,
    textAlign: "left",
  }));

  function createData(Item, Status, Upload) {
    return { Item, Status, Upload };
  }

  const userString = sessionStorage.getItem("accessToken");
  const userToken = JSON.parse(userString);
  const getUser = Object.values(userToken);

  const rows = [
    createData("Tugas Pendahuluan P1", getUser[6].toString(), 1),
    createData("Tugas Pendahuluan P2", getUser[7].toString(), 2),
    createData("Tugas Pendahuluan P3", getUser[8].toString(), 3),
    createData("Laporan Resmi P1", getUser[15].toString(), 4),
    createData("Laporan Resmi P2", getUser[16].toString(), 5),
    createData("Laporan Resmi P3", getUser[17].toString(), 6),
  ];

  const urlgetkelompok = "http://localhost:5000/api/db/filekelompok";
  const urluploadfile = "http://localhost:5000/api/uploadberkas";

  /*const urluploadfile = "https://ui-spo-backend.herokuapp.com/api/uploadfile";
  const urlgetkelompok =
    "https://ui-spo-backend.herokuapp.com/api/db/filekelompok";
  */

  const kolomRef = useRef([]);
  kolomRef.current = state.map((_, i) => kolomRef.current[i] ?? createRef());

  const getFileStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/db/file");
      const jsonData = await response.json();

      setstatusFile(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleOnSubmit = async (rows) => {
    rows.preventDefault();

    const kolom = rows.target.elements[1].value;
    let inputkolom;
    let fileinput;
    kolom === "Tugas Pendahuluan P1"
      ? (inputkolom = "tugaspendahuluanp1")
      : kolom === "Tugas Pendahuluan P2"
      ? (inputkolom = "tugaspendahuluanp2")
      : kolom === "Tugas Pendahuluan P3"
      ? (inputkolom = "tugaspendahuluanp3")
      : kolom === "Laporan Resmi P1"
      ? (inputkolom = "laporanresmip1")
      : kolom === "Laporan Resmi P2"
      ? (inputkolom = "laporanresmip2")
      : (inputkolom = "laporanresmip3");

    kolom === "Tugas Pendahuluan P1"
      ? (fileinput = inputfile.file1)
      : kolom === "Tugas Pendahuluan P2"
      ? (fileinput = inputfile.file2)
      : kolom === "Tugas Pendahuluan P3"
      ? (fileinput = inputfile.file3)
      : kolom === "Laporan Resmi P1"
      ? (fileinput = inputfile.file4)
      : kolom === "Laporan Resmi P2"
      ? (fileinput = inputfile.file5)
      : (fileinput = inputfile.file6);
    console.log(kolom);
    console.log(inputkolom);
    console.log(inputfile.file1);
    console.log(fileinput);
    try {
      const formData = new FormData();
      formData.append("file", fileinput);
      formData.append("nama", getUser[1]);
      formData.append("kolom", inputkolom);

      await axios.post(urluploadfile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("oke");
      console.log("uploading");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChangeFile = (event, i) => {
    i === 0
      ? setInputFile({ ...inputfile, file1: event })
      : i === 1
      ? setInputFile({ ...inputfile, file2: event })
      : i === 2
      ? setInputFile({ ...inputfile, file3: event })
      : i === 3
      ? setInputFile({ ...inputfile, file4: event })
      : i === 4
      ? setInputFile({ ...inputfile, file4: event })
      : i === 5
      ? setInputFile({ ...inputfile, file4: event })
      : setInputFile({ ...inputfile, file5: event });
  };

  const handleConsole = (e) => {
    e.preventDefault();
    console.log(inputfile);
  };

  useEffect(() => {
    setDaftar(() => {
      // getting stored value
      const saved = localStorage.getItem("asisten");
      const initialValue = JSON.parse(saved);
      return initialValue || "";
    });

    setState(rows);
  }, []);

  //<button onClick={handleRefresh}>Refresh</button>;

  return (
    <>
      <div className={styles.textwrapperborrow}>
        <Grid container>
          <Grid item xs sm m lg>
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              Pengumpulan Berkas Praktikum
            </Typography>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Item</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Upload</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.map((rows, i) => (
                <StyledTableRow key={rows.Item}>
                  <StyledTableCell component="th" scope="row" align="center">
                    {rows.Item}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {rows.Status}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <form onSubmit={handleOnSubmit}>
                      <input
                        key={i}
                        type="file"
                        onChange={(e) => handleChangeFile(e.target.files[0], i)}
                      />
                      <input
                        value={rows.Item}
                        type="hidden"
                        ref={kolomRef.current[i]}
                      />
                      <button type="submit">Upload</button>
                    </form>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </div>
    </>
  );
};

export default Pengumpulan;
