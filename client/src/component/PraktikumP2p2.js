import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import VideoPlayer from "../component/VideoPlayer";
import { makeStyles } from "@mui/styles";
import { Grid, Box, Paper, Typography, Button } from "@mui/material";
import { Knob, Pointer, Value, Arc, Scale } from "rc-knob";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import "./styles/praktikum.css";
import SpeedDial from "@mui/material/SpeedDial";
import MobileStepper from "@mui/material/MobileStepper";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Knobp2p2 from "./Knobp2p2";
import Pengumpulan from "../page-praktikan/Pengumpulan";
import UploadData from "../page-praktikan/UploadData";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Download from "../page-praktikan/Download";

const useStyles = makeStyles((theme) => ({
  root: {},
  text: {},
  label: {
    display: "inline-block",
    float: "left",
    clear: "left",
    width: "250px",
    alignItems: "right",
  },
  input: {
    display: "inline - block",
    float: "left",
  },
  table: {},
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  gridContainer: {
    justifyContent: "left",
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
  component: { paddingTop: 20 },
  button: { marginTop: "20px" },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: "absolute",
  "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
    top: theme.spacing(5),
    left: theme.spacing(0),
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  alignItems: "center",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const labelStyle = {
  display: "inline-block",
  float: "left",
  clear: "left",
  width: "250",
  alignItems: "right",
};

const inputStyle = {
  display: "inline-block",
  float: "left",
};

const PraktikumP2p2 = () => {
  const [Mydata, setMydata] = useState([]);
  const [data, setData] = React.useState(() => {
    const stickyValue = window.localStorage.getItem("user");
    return stickyValue !== null ? JSON.parse(stickyValue) : {};
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const classes = useStyles();
  const size = 100;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const objArray = Mydata;
  let values = objArray.map((a) => a.x);

  const options = {
    boost: { enabled: true },
    title: {
      text: "PRAKTIKUM SPO",
    },
    series: [
      {
        data: values,
      },
    ],
  };

  const modePropotional = [
    {
      id: 1,
      content: "Kondisikan motor pada keadaan ‘on’",
    },
    { id: 2, content: "Posisikan setpoin pada sudut 200" },
    { id: 3, content: "Berikan gain proporsional sebesar 0.1" },
    { id: 4, content: "Berikan gain integral dan derivative nilai 0" },
    { id: 5, content: "Click ‘enter’" },
    { id: 6, content: "Perhatikan response sistem" },
    {
      id: 7,
      content:
        "Jika sistem sudah steady state (bisa steady state osilasi) rubah setpoin menjadi 300 (Jika tidak mengalami steady state atau tidak stabil setelah beberapa detik maka lanjutkan ke langka berikutnya).",
    },
    { id: 8, content: "Matikan motor dengan merubah switch menjadi ‘off'" },
    { id: 9, content: "Click ‘enter'" },
    {
      id: 10,
      content:
        "Ulangi langkah 1 sampai 9 dengan menggunakan gain proporsional 0.5 dan 1",
    },
    { id: 11, content: "Download hasil pembacaan pada bagian File Data" },
  ];

  const modePI = [
    {
      id: 1,
      content: "Kondisikan motor pada keadaan ‘on’",
    },
    { id: 2, content: "Posisikan setpoin pada sudut 200" },
    { id: 3, content: "Berikan gain proporsional sebesar 0.5" },
    { id: 4, content: "Berikan gain integral nilai 1" },
    { id: 5, content: "Berikan gain derivative nilai 0" },
    { id: 6, content: "Click ‘enter’" },
    { id: 7, content: "Perhatikan response sistem" },
    {
      id: 8,
      content:
        "Jika sistem sudah steady state (bisa steady state osilasi) rubah setpoin menjadi 300 (Jika tidak mengalami steady state atau tidak stabil setelah beberapa detik maka lanjutkan ke langka berikutnya).",
    },
    { id: 9, content: "Matikan motor dengan merubah switch menjadi ‘off'" },
    { id: 10, content: "Click ‘enter'" },
    {
      id: 11,
      content:
        "Ulangi langkah 1 sampai 10 dengan menggunakan gain integral 5 dan 10",
    },
    { id: 12, content: "Download hasil pembacaan pada bagian File Data" },
  ];

  const modePID = [
    {
      id: 1,
      content: "Kondisikan motor pada keadaan ‘on’",
    },
    { id: 2, content: "Posisikan setpoin pada sudut 200" },
    { id: 3, content: "Berikan gain proporsional sebesar 0.5" },
    { id: 4, content: "Berikan gain integral nilai 1" },
    { id: 5, content: "Berikan gain derivative nilai 2" },
    { id: 6, content: "Click ‘enter’" },
    { id: 7, content: "Perhatikan response sistem" },
    {
      id: 8,
      content:
        "Jika sistem sudah steady state (bisa steady state osilasi) rubah setpoin menjadi 300 (Jika tidak mengalami steady state atau tidak stabil setelah beberapa detik maka lanjutkan ke langka berikutnya).",
    },
    { id: 9, content: "Matikan motor dengan merubah switch menjadi ‘off'" },
    { id: 10, content: "Click ‘enter'" },
    {
      id: 11,
      content:
        "Ulangi langkah 2 sampai 8 dengan menggunakan gain integral 10 dan 20",
    },
    { id: 12, content: "Download hasil pembacaan pada bagian File Data" },
  ];

  const tableStyle = {
    padding: "0px",
    verticalAlign: "top",
  };

  const Content = ({ content }) => {
    return content.map((post) => (
      <div key={post.id}>
        <table
          style={{
            padding: "0px",
            verticalAlign: "text-top",
          }}
        >
          <tr>
            <th style={{ padding: "0px 15px" }}></th>
            <th></th>
          </tr>
          <tr>
            <td style={tableStyle}>
              <Typography verticalAlign="top">{post.id}.</Typography>
            </td>
            <td>
              <Typography verticalAlign="top" align="left">
                {post.content}
              </Typography>
            </td>
          </tr>
        </table>
      </div>
    ));
  };

  const steps = [
    {
      label: (
        <div>
          <Typography variant="h6" align="center">
            Langkah Percobaan
          </Typography>
          <Typography variant="h6" align="center">
            Mode Propotional
          </Typography>
          <Content content={modePropotional} />
        </div>
      ),
      description: "",
    },
    {
      label: (
        <div>
          <Typography variant="h6" align="center">
            Langkah Percobaan
          </Typography>
          <Typography variant="h6" align="center">
            Mode PI
          </Typography>
          <Content content={modePI} />
        </div>
      ),
      description: "",
    },
    {
      label: (
        <div>
          <Typography variant="h6" align="center">
            Langkah Percobaan
          </Typography>
          <Typography variant="h6" align="center">
            Mode PID
          </Typography>
          <Content content={modePID} />
        </div>
      ),
      description: "",
    },
  ];

  const maxSteps = steps.length;

  return (
    <>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} sm md lg>
          <Paper className={classes.paper}>
            <Box className={classes.wrapper}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  centered
                >
                  <Tab label="Input" {...a11yProps(0)} />
                  <Tab label="File Data" {...a11yProps(1)} />
                </Tabs>
              </Box>

              <TabPanel value={value} index={0}>
                <Knobp2p2 />
              </TabPanel>
            </Box>
            <TabPanel value={value} index={1}>
              {data.userrole === "Praktikan" ? <Download /> : <UploadData />}
            </TabPanel>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={9}>
          <Paper className={classes.paper}>
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={() => {
                    handleNext();
                  }}
                  disabled={activeStep === maxSteps - 1}
                >
                  Next
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={() => {
                    handleBack();
                  }}
                  disabled={activeStep === 0}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
            <Typography align="center">{steps[activeStep].label}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Paper className={classes.paper}>
            <VideoPlayer />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PraktikumP2p2;
