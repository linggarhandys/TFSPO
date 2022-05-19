import React, { useState, useEffect } from "react";
import axios from "axios";
import { Knob, Pointer, Value, Arc, Scale } from "rc-knob";
import { makeStyles } from "@mui/styles";
import { Grid, Box, Paper, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { useTheme } from "@mui/material/styles";

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
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
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

const Knobp2p2 = () => {
  const [Setpoint, setSetpoint] = useState(200);
  const [propotional, setPropotional] = useState(0);
  const [integral, setIntegral] = useState(0);
  const [derivative, setDerivative] = useState(0);
  const [mode, setMode] = useState(0);

  const theme = useTheme();
  const classes = useStyles();
  const size = 100;

  const urlthingspeak =
    "https://api.thingspeak.com/update?api_key=KRBZ5PPPBY4F46WF&field2=0";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const field1 = "&field1=";
    const field3 = "&field3=";
    const field4 = "&field4=";
    const field5 = "&field5=";
    const field6 = "&field6=";
    const inputSet = Setpoint.toString();
    const urlthingspeak1 = field1.concat(inputSet);
    const inputSet2 = propotional.toString();
    const urlthingspeak2 = field3.concat(inputSet2);
    const inputSet3 = integral.toString();
    const urlthingspeak3 = field4.concat(inputSet3);
    const inputSet4 = derivative.toString();
    const urlthingspeak4 = field5.concat(inputSet4);
    const inputset5 = mode.toString();
    const urlthingspeak5 = field6.concat(inputset5);
    const urlget = urlthingspeak.concat(urlthingspeak1);
    const urlget1 = urlget.concat(urlthingspeak2);
    const urlget2 = urlget1.concat(urlthingspeak3);
    const urlget3 = urlget2.concat(urlthingspeak4);
    const urlget4 = urlget3.concat(urlthingspeak5);
    console.log(urlget4);

    try {
      axios.get(urlget4);
    } catch (err) {
      console.log(err);
    }
    console.log(Setpoint);
  };

  const handleMode = async () => {
    try {
      if (mode === 0) {
        setMode(1);
        /*        const urlget =
          "https://api.thingspeak.com/update?api_key=KRBZ5PPPBY4F46WF&field6=1";
        axios.get(urlget);*/
      } else {
        setMode(0);
        /* const urlget =
          "https://api.thingspeak.com/update?api_key=KRBZ5PPPBY4F46WF&field6=0";
        axios.get(urlget);*/
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <Box className={classes.wrapper}>
        <Typography align="center">Motor</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>OFF</Typography>
          <AntSwitch
            onChange={handleMode}
            label="Mode"
            labelPlacement="top"
            defaultChecked={false}
          />
          <Typography>ON</Typography>
        </Stack>
        <Typography variant="h4" align="center">
          Setpoint
        </Typography>
        <Knob
          size={size}
          angleOffset={220}
          angleRange={280}
          steps={10}
          min={200}
          max={360}
          snap={true}
          onChange={(value) => setSetpoint(Math.round(value / 10) * 10)}
        >
          <Scale
            steps={10}
            tickWidth={1}
            tickHeight={2}
            radius={(size / 2) * 0.8}
          />
          <circle
            r={size * 0.35}
            cx={size * 0.5}
            cy={size * 0.5}
            fill="#3d3a30"
          />
          ,
          <Pointer
            width={2}
            height={size * 0.35}
            radius={10}
            type="rect"
            color="#3d3a30"
          />
        </Knob>
        {Setpoint}
        <Box className="container">
          <label for="Propotional">Kp :&emsp;</label>
          <input
            type="number"
            id="Setpoint"
            onChange={(e) => setPropotional(e.target.value)}
            placeholder="0-20"
            min="0"
            max="20"
            step="0.0001"
          />
          <br />
          <label for="Integral">Ti :&emsp;</label>
          <input
            type="number"
            id="Setpoint"
            onChange={(e) => setIntegral(e.target.value)}
            placeholder="0-20"
            min="0"
            max="20"
            step="0.0001"
          />
          <br />
          <label for="Derivative">Td :&emsp;</label>
          <input
            type="number"
            id="Setpoint"
            placeholder="0-20"
            onChange={(e) => setDerivative(e.target.value)}
            min="0"
            max="20"
            step="0.0001"
          />
          <Box className={classes.wrapper}>
            <form onSubmit={handleSubmit}>
              <div>
                <button type="submit" className={classes.button}>
                  Enter
                </button>
              </div>
            </form>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Knobp2p2;
