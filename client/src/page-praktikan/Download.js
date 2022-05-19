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

const Download = ({}) => {
  const [statusFile, setstatusFile] = useState([]);
  const [file, setFile] = useState({ file1: null, file2: null, file3: null });
  const [inputfile, setInputFile] = useState({
    file1: null,
    file2: null,
    file3: null,
  });
  const [state, setState] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = React.useState(() => {
    const stickyValue = window.localStorage.getItem("user");
    return stickyValue !== null ? JSON.parse(stickyValue) : {};
  });
  const [kelompok, setKelompok] = useState(null);
  const [grup, setGrup] = useState();
  const [daftar, setDaftar] = React.useState({});
  const [target, setTarget] = useState();

  const urlgetkelompok = "http://localhost:5000/api/db/filekelompok";
  const urluploadfile = "http://localhost:5000/api/uploadfile";
  const url = "http://localhost:5000/api/download";

  //const urluploadfile = "https://ui-spo-backend.herokuapp.com/api/uploadfile";
  //const urlgetkelompok =
  //  "https://ui-spo-backend.herokuapp.com/api/db/filekelompok";
  const getFileStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/db/file");
      const jsonData = await response.json();

      setstatusFile(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const kolomRef = useRef([]);
  kolomRef.current = state.map((_, i) => kolomRef.current[i] ?? createRef());

  const userString = sessionStorage.getItem("accessToken");
  const userToken = JSON.parse(userString);
  const getUser = Object.values(userToken);

  useEffect(() => {
    console.log("target", target);
    handleOnDownload();
    setDaftar(() => {
      // getting stored value
      const saved = localStorage.getItem("asisten");
      const initialValue = JSON.parse(saved);
      return initialValue || "";
    });
    getFileStatus();
    setState(rows);
  }, [target]);

  function createData(Item, Column) {
    return { Item, Column };
  }

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleOnDownload = async (e) => {
    const link = document.createElement("a");
    link.target = "_blank";
    link.download = target;
    let urldownload = url + "/" + target;
    console.log(urldownload);
    axios
      .get(urldownload, {
        responseType: "blob",
      })
      .then((res) => {
        link.href = URL.createObjectURL(new Blob([res.data]));
        link.click();
      });
  };

  const handleConsole = () => {
    console.log(target);
  };

  const handleOnDownload2 = async (rows) => {
    rows.preventDefault();
    const kelompok = getUser[18].toString();
    const kolom = Number(rows.target[0].value) + 1;
    let target;

    const res = await axios.post(
      url,
      {
        kelompok,
        kolom,
      },
      {
        headers: {
          "Access-Control-Allow-Origin":
            "https://riset.its.ac.id/praktikum/tf-spo/",
          //"http://localhost:3000/praktikum/tf-spo/",
        },
      }
    );
    setTarget(res.data);
    console.log("res.data:", res.data);
  };

  const rows = [
    createData("Mode Proporsional", 6),
    createData("Mode PI", 15),
    createData("MODE PID", 7),
  ];

  const handleLog = (event) => {
    console.log(grup);
  };

  const Content = ({ content }) => {
    return content.map((post, key) => (
      <FormControlLabel
        value={post.kelompok}
        control={<Radio />}
        label={post.kelompok}
      />
    ));
  };

  const handleRadioChange = (event) => {
    setGrup(event.target.value);
  };

  const handleChangeFile = (event, i) => {
    i === 0
      ? setInputFile({ ...inputfile, file1: event })
      : i === 1
      ? setInputFile({ ...inputfile, file2: event })
      : setInputFile({ ...inputfile, file3: event });
  };

  return (
    <>
      <button onClick={handleConsole}>aaaa</button>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Item</StyledTableCell>
            <StyledTableCell align="center">Download</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.map((rows, i) => (
            <StyledTableRow key={rows.Item}>
              <StyledTableCell component="th" scope="row" align="center">
                {rows.Item}
              </StyledTableCell>
              <StyledTableCell align="center">
                <form onSubmit={handleOnDownload2}>
                  <input value={i} type="hidden" ref={kolomRef.current[i]} />
                  <button type="submit">Download</button>
                </form>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Download;
