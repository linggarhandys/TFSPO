import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {
  Link as RouterLink,
  Route,
  MemoryRouter,
  Routes,
} from "react-router-dom";
import PropTypes from "prop-types";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Logout from "@mui/icons-material/Logout";
import Profilpraktikan from "./page-praktikan/Profil-praktikan";
import Login from "./Login";
import PersonIcon from "@mui/icons-material/Person";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Praktikum from "./page-praktikan/Praktikum";
import Pengumpulan from "./page-praktikan/Pengumpulan";
import Pengumuman from "./page-praktikan/Pengumuman";
import Overview_P1 from "./page-praktikan/Overview";
import useToken from "./useToken";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Testpage from "./testpage.js";
import Signup from "./Signup";
import Validasi from "./page-praktikan/Validasi";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PraktikumP1p1 from "./component/PraktikumP1p1";
import Signupasisten from "./Signupasisten";
import logo from "./asset/img/logo tf.png";
import itslogo from "./asset/img/Logo ITS.png";
import Home from "./page-praktikan/Home.js";
import HomeIcon from "@mui/icons-material/Home";
import AssistantIcon from "@mui/icons-material/Assistant";
import Penilaian from "./page-praktikan/Penilaian";
import UploadData from "./page-praktikan/UploadData";
import Download from "./page-praktikan/Download";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// ListItemLink.propTypes = {
//   icon: PropTypes.element,
//   primary: PropTypes.string.isRequired,
//   to: PropTypes.string.isRequired,
// };

export default function Sidebar() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const { user, setUser } = useToken();
  const [data, setData] = React.useState(() => {
    const stickyValue = window.localStorage.getItem("user");
    return stickyValue !== null ? JSON.parse(stickyValue) : {};
  });
  const [signup, setSignup] = React.useState(false);
  const [signupasisten, setSignupAsisten] = React.useState(false);
  const { userData, setUserData } = useToken();
  const [isLoading, setIsLoading] = React.useState(true);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loggedin, setLoggedin] = React.useState(false);
  const openIcon = Boolean(anchorEl);

  const refreshToken = async () => {
    try {
      const res = await axios.post("/refresh", { token: user.refreshToken });
      setUser({
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const userString = sessionStorage.getItem("accessToken");
  //const userToken = JSON.parse(userString);
  //const getUser = Object.values(userToken);
  //const url = "http://localhost:5000/api/asistenlogout";

  /*const handleLogout = () => {
    if (getUser[3].toString() === "Asisten") {
      const namaasisten = getUser[1].toString();
      console.log(namaasisten);
      const response = axios.post(url, { namaasisten });
      setUser({ ...null });
      localStorage.clear();
    } else {
      setUser({ ...null });
      localStorage.clear();
    }
  };*/

  const handleLogout = () => {
    setUser({ ...null });
    localStorage.clear();
  };

  const handleLoading = () => {
    setIsLoading(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toggleButton = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    if (open) {
      setOpen((prev) => !prev);
    }
  };

  React.useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
    window.addEventListener("load", handleLoading);
    return () => window.removeEventListener("load", handleLoading);
  }, []);

  //if (isLoading) {
  // return <>Loading...</>;
  //}

  function ListItemLink(props) {
    const { icon, primary, to, index } = props;

    const renderLink = React.useMemo(
      () =>
        React.forwardRef(function Link(itemProps, ref) {
          return <RouterLink to={to} ref={ref} {...itemProps} />;
        }),
      [to]
    );

    return (
      <li>
        {console.log("indexx", index, currentIndex)}
        <ListItem button component={renderLink}>
          {icon ? (
            <ListItemIcon
              onClick={() => setCurrentIndex(index)}
              style={{ color: currentIndex == index ? "#b8bbbf" : "#5d5f61" }}
            >
              {icon}
            </ListItemIcon>
          ) : null}
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    );
  }

  const changeIndex = (i) => {
    console.log("changeIndex called => ", i)
    setCurrentIndex(i)
  }

  return (
    <MemoryRouter initialEntries={["/"]} initialIndex={0}>
      {user ? (
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <ClickAwayListener onClickAway={handleClickAway}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleButton}
                  edge="start"
                  sx={{
                    marginRight: "36px",
                    ...(open && { display: "none" }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </ClickAwayListener>
              <img
                src={itslogo}
                alt="Logo ITS"
                style={{ width: "3.5vw", height: "3vw", marginRight: "2vw" }}
              />
              <img
                src={logo}
                alt="Logo"
                style={{ width: "3vw", height: "3vw" }}
              />
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleClick}
                  sx={{ ml: 2 }}
                >
                  <AccountCircle sx={{ width: 40, height: 40 }} />
                </IconButton>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={openIcon}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem>
                  <Avatar /> Status
                </MenuItem>
                <MenuItem>
                  <Avatar /> Nama
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" onClick={handleLogout} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            {data.userrole === "Koordinator" ? (
              <List>
                <ListItemLink
                  to="home"
                  primary="Halaman Depan"
                  icon={<HomeIcon/>}
                  index={0}
                />
                <ListItemLink
                  to="testpage"
                  primary="Profil"
                  icon={<PersonIcon />}
                  index={1}
                />
                <ListItemLink
                  to="profil"
                  primary="Profil"
                  icon={<PersonIcon />}
                  index={1}
                />

                <ListItemLink
                  to="validasi"
                  primary="Validasi"
                  icon={<FactCheckIcon />}
                  index={2}
                />

                <ListItemLink
                  to="pengumuman"
                  primary="Pengumuman"
                  icon={<AnnouncementIcon />}
                  index={3}
                />
                <ListItemLink
                  to="praktikum"
                  primary="Praktikum"
                  icon={<AssignmentTurnedInIcon />}
                  index={4}
                />
                <ListItemLink
                  to="penilaian"
                  primary="Penilaian"
                  icon={<AssistantIcon />}
                  index={5}
                />
                <ListItemLink
                  to="pengumpulan"
                  primary="Pengumpulan"
                  icon={<UploadFileIcon />}
                  index={6}
                />
              </List>
            ) : (
              <List>
<<<<<<< HEAD
                <ListItemLink
                  index={0}
                  to="home"
                  primary="Home"
                  icon={<HomeIcon />}
                />
=======
                <ListItemLink index={0} to="home" primary="Home" icon={<HomeIcon changeIndex={(i) => changeIndex(i)}  />} />
>>>>>>> 7d61cb63755001be5b0cdec7ce98fee4cc85fd1b
                <ListItemLink
                  to="profil"
                  primary="Profil"
                  icon={<PersonIcon />}
                  index={1}
                />
                <ListItemLink
                  to="pengumuman"
                  primary="Pengumuman"
                  icon={<AnnouncementIcon />}
                  index={2}
                />
                <ListItemLink
                  to="praktikum"
                  primary="Praktikum"
                  icon={<AssignmentTurnedInIcon />}
                  index={3}
                />
                <ListItemLink
                  to="pengumpulan"
                  primary="Pengumpulan"
                  icon={<UploadFileIcon />}
                  index={4}
                />
              </List>
            )}
            <Divider />
          </Drawer>

          <Box
            height="100vh"
            width="100vw"
            display="flex"
            flexDirection="column"
          >
            <Box
              component="main"
              sx={{ flexGrow: 1, p: 3, backgroundColor: "#e9e6fc" }}
            >
              <DrawerHeader />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="home/" element={<Home changeIndex={(i) => changeIndex(i)} />} />
                <Route path="/" element={<Home changeIndex={(i) => changeIndex(i)} />} />
                <Route path="/profil" element={<Profilpraktikan />} />
                <Route path="/penilaian" element={<Penilaian />} />

                <Route path="pengumpulan" element={<Pengumpulan />} />
                <Route path="pengumuman" element={<Pengumuman />} />
                <Route path="praktikum" element={<Praktikum />} />
                <Route path="/upload" element={<UploadData />} />
                <Route path="/pengumpulan" element={<Download />} />
                <Route path="/pengumuman" element={<Pengumuman />} />
                <Route path="/praktikum" element={<Praktikum />} />
                <Route path="/overviewp1" element={<Overview_P1 />} />
                <Route path="/testpage" element={<Testpage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/validasi" element={<Validasi />} />
                <Route path="/signupasisten" element={<Signupasisten />} />
                <Route
                  path="/praktikump1/percobaan1"
                  element={<PraktikumP1p1 />}
                />
              </Routes>
            </Box>
          </Box>
        </Box>
      ) : signupasisten ? (
        <Signupasisten setSignupAsisten={setSignupAsisten} />
      ) : (
        <Login
          setUser={setUser}
          setData={setData}
          setSignupAsisten={setSignupAsisten}
        />
      )}
    </MemoryRouter>
  );
}
