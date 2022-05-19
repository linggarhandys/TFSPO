import React, { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import { IconButton, Paper } from "@mui/material";

const PengumumanView = () => {
  const [pengumuman, setPengumuman] = useState([]);
  const [show, setShow] = useState(true);

  //const url = "http://localhost:5000/pengumuman/db/";
  //const url1 = "http://localhost:5000/pengumuman/db";
  const url = "https://ui-spo-backend.herokuapp.com/pengumuman/db/";
  const url1 = "https://ui-spo-backend.herokuapp.com/pengumuman/db";

  const deletePengumuman = async (id) => {
    try {
      const deleteTodo = await axios.delete(url + id);

      setPengumuman(pengumuman.filter((pengumuman) => pengumuman.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const getPengumuman = async () => {
    try {
      // const response = await fetch(url1);
      // const jsonData = await response.json();

      const p = [
        {
          "id": 1,
          "description": "Laporan Praktikum 1 Wajib dikumpulkan sebelum tanggal 8 April 2022",
        },
        {
          "id": 2,
          "description": "Laporan Praktikum 2 Wajib dikumpulkan sebelum tanggal 22 Mei 2022",
        },
        {
          "id": 3,
          "description": "Briefing Praktikum 3 dilaksanakan pada tanggal 17 Mei 2022 Jam 20.00 via zoom",
        },
      ]

      // setPengumuman(jsonData);
      setPengumuman(p);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getPengumuman();
  }, []);

  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  const userString = sessionStorage.getItem("accessToken");
  const userToken = JSON.parse(userString);
  const getUser = Object.values(userToken);

  return (
    <Fragment>
      {" "}
      <table class="table mt-5 text-center">
        <tbody>
          {pengumuman.map((pengumuman) => (
            <tr key={pengumuman.id}>
              <td>
                {/* <Button onClick={() => setShow((prev) => !prev)}>Hide</Button> */}
                {show && (
                  <Box>
                    <Card sx={{ minWidth: 275, m: 1 }} elevation={10}>
                      <CardContent style={{position: "relative"}}>
                        <Typography variant="body2" style={{width: "90%"}}>
                          {pengumuman.description}
                        </Typography>
                        <div onClick={() => setShow((prev) => !prev)} style={{position: "absolute", right: 10, top: 10, cursor: "pointer"}}>
                          <VisibilityIcon />
                        </div>
                      </CardContent>
                      <CardActions>
                        {getUser[3].toString() == "Koordinator" ? (
                          <Button
                            variant="text"
                            color="error"
                            onClick={() => deletePengumuman(pengumuman.id)}
                          >
                            Delete
                          </Button>
                        ) : (
                          ""
                        )}
                      </CardActions>
                    </Card>
                  </Box>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default PengumumanView;
