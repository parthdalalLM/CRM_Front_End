import * as React from "react";
import { useEffect, useState } from "react";
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
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ImgMediaCard from "./CardListView";
import Login from "@mui/icons-material/Login";
import Snackbar from "@mui/material/Snackbar";
import { demoCustomerData, demoTicketData } from "../Demodata";
import Popup from "./Popup";
import { Dashboard } from "../pages/Dashbaord";
import { Profile } from "../pages/Profile";
import Radio from "@mui/material/Radio";
import { Navigate } from "react-router-dom";
import {
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";

import { Route, Link, BrowserRouter, Routes } from "react-router-dom";
import {
  Add,
  AssignmentTurnedIn,
  Message,
  Settings,
} from "@mui/icons-material";
import BasicTabs from "./Admintabs";
import {
  createNewTicket,
  getAllTickets,
  getAllUsers,
  signin,
  signup,
  updateTicketById,
} from "../constants";

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
    width: `calc(${theme.spacing(8)} + 1px)`,
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

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [ticketsData, setTicketsData] = useState(demoTicketData);
  const [customersData, setCustomersData] = useState(demoCustomerData);
  const [isTicketsLoaded, setisTicketsLoaded] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [selectedTicket, setSelectedTicket] = useState("");
  const [openLogin, setOpenLogin] = useState(false);
  const [statusFilter, setStatusFilter] = useState(
    window.location.href.split("/")[window.location.href.split("/").length - 1]
  );
  const [userData, setUserData] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [snackBarOpen, setSnackbarOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handlePopupOpen = (type) => {
    setPopupType(type);
    setOpenLogin(true);
  };

  const handlePopupClose = (data) => {
    const UserLoginInfo = JSON.parse(sessionStorage.getItem("userData"));
    console.log(data);
    if (data.actionType === "close") {
      setPopupType("");
      setOpenLogin(false);
    }
    if (data.actionType === "createTicket") {
      const ticketData = { title: data.title, description: data.description };
      fetch(createNewTicket, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          "x-access-token": UserLoginInfo?.accessToken,
        },
        body: JSON.stringify(ticketData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          if (!data.id) {
            setAlertMessage(data.message);
            setSnackbarOpen(true);
          } else {
            setAlertMessage(`Ticket created with id ${data.id}`);
            fetch(getAllTickets, {
              headers: {
                "Content-Type": "application/json",
                "x-access-token": userData?.accessToken,
              },
            })
              .then((res) => res.json())
              .then(
                (result) => {
                  setTicketsData(result);
                  setTimeout(() => {
                    setStatusFilter(statusFilter===""?"OPEN":"");
                  }, 1000);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                  setTicketsData(
                    demoTicketData.filter((ticket) => ticket.status === "OPEN")
                  );
                }
              );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setPopupType("");
      setOpenLogin(false);
    } else if (data.actionType === "updateTicket") {
      const ticketData = {
        title: data.title,
        description: data.description,
        ticketPriority: data.ticketPriority,
        status: data.status,
      };
      fetch(updateTicketById + `${data.id}`, {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          "x-access-token": UserLoginInfo?.accessToken,
        },
        body: JSON.stringify(ticketData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setAlertMessage(`Ticket updated Successfully.`);
          setSnackbarOpen(true);
          fetch(getAllTickets, {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": userData?.accessToken,
            },
          })
            .then((res) => res.json())
            .then(
              (result) => {
                setTicketsData(result);
                setTimeout(() => {
                  setStatusFilter(statusFilter===""?"OPEN":"");
                }, 1000);
              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {
                setTicketsData(
                  demoTicketData.filter((ticket) => ticket.status === "OPEN")
                );
              }
            );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      setPopupType("");
      setOpenLogin(false);
    } else if (data.actionType === "login") {
      const logindetails = { userId: data.userId, password: data.password };
      fetch(signin, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logindetails),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          if (!data.name) {
            setAlertMessage(data.message);
            setSnackbarOpen(true);
          } else {
            sessionStorage.setItem("userData", JSON.stringify(data));
            setUserData(data);
            setPopupType("");
            setOpenLogin(false);
          }
        })
        .catch((error) => {
          setSnackbarOpen(true);
          console.log(error);
          setAlertMessage(`Some error occured. Please retry`);
        });
    } else if (data.actionType === "register") {
      const signupdetails = {
        userId: data.userId,
        password: data.password,
        name: data.name,
        email: data.email,
        userType: data.userTypes,
      };
      fetch(signup, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupdetails),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          if (!data.name) {
            setAlertMessage(data.message);
            setSnackbarOpen(true);
          } else {
            setAlertMessage(
              `Registered Successfully ${data.name}, Please Refresh and Login to Continue.`
            );
            setSnackbarOpen(true);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setAlertMessage(
            "Some error occured while registering. Please retry."
          );
          setSnackbarOpen(true);
        });
    }
  };

  useEffect(() => {
    // const UserData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData !== null) {
      fetch(getAllTickets, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": userData?.accessToken,
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            setTicketsData(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setTicketsData(
              demoTicketData.filter((ticket) => ticket.status === "OPEN")
            );
          }
        );

      if (userData.userTypes === "ADMIN") {
        fetch(getAllUsers, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": userData?.accessToken,
          },
        })
          .then((res) => res.json())
          .then(
            (result) => {
              if (result.length > 0) setCustomersData(result);
              else setCustomersData(demoCustomerData);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setCustomersData(demoCustomerData);
            }
          );
      }
    } else {
      handlePopupOpen("loginRegister");
    }
  }, [userData]);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={alertMessage}
      />
      <BrowserRouter>
        <Popup
          openLogin={openLogin}
          handleLoginClose={handlePopupClose}
          type={popupType}
          selectedTicket={selectedTicket}
        />
        <CssBaseline />
        <AppBar className="App-header" position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              CRM
            </Typography>
            <IconButton
              color="inherit"
              aria-label="create ticket"
              onClick={() => {
                setSelectedTicket(null);
                handlePopupOpen("createTicket");
              }}
              edge="end"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <Add />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                handlePopupOpen("loginRegister");
              }}
              edge="end"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <Login />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            Welcome {userData?.name}
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {[
              { name: "Tickets", url: "/" },
              { name: "Dashboard", url: "/dashboard" },
              { name: "Profile", url: "/profile" },
              { name: "Messages", url: "/" },
            ].map((text, index) => (
              <ListItem
                key={text.name}
                disablePadding
                sx={{ display: "block" }}
              >
                <Link
                  to={text.url}
                  style={{ textDecoration: "none", color: "#757575" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {index % 2 === 0 ? <AssignmentTurnedIn /> : <Message />}
                    </ListItemIcon>
                    <ListItemText
                      primary={text.name}
                      sx={{ opacity: open ? 1 : 0 }}
                    ></ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["Settings"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {index % 2 === 0 ? <Settings /> : <Settings />}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div>
            <hr />
            <Routes>
              <Route
                path="/:status"
                element={
                  <React.Fragment>
                    <DrawerHeader />
                    {ticketsData.length > 0 && (
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                          Status
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          value={statusFilter}
                          name="radio-buttons-group"
                          onChange={(event) =>
                            setStatusFilter(event.target.value)
                          }
                        >
                          <FormControlLabel
                            value=""
                            control={<Radio />}
                            label="ALL"
                          />
                          <FormControlLabel
                            value="OPEN"
                            control={<Radio />}
                            label="OPEN"
                          />
                          <FormControlLabel
                            value="CLOSED"
                            control={<Radio />}
                            label="CLOSED"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                    {statusFilter === "" &&
                      ticketsData.length > 0 &&
                      ticketsData.map((ticket, index) => {
                        return (
                          <ImgMediaCard
                            key={ticket.id}
                            type="ticket"
                            data={ticket}
                            index={index}
                            handlePopupOpen={handlePopupOpen}
                            setSelectedTicketData={(ticketData) =>
                              setSelectedTicket(ticketData)
                            }
                          />
                        );
                      })}
                    {statusFilter !== "" &&
                      ticketsData.length > 0 &&
                      ticketsData
                        .filter((ticket) => ticket.status === statusFilter)
                        .map((ticket, index) => {
                          return (
                            <ImgMediaCard
                              key={ticket.id}
                              data={ticket}
                              type="ticket"
                              index={index}
                              handlePopupOpen={handlePopupOpen}
                              setSelectedTicketData={(ticketData) =>
                                setSelectedTicket(ticketData)
                              }
                            />
                          );
                        })}
                    {ticketsData.length === 0 && <div>No tickets Assigned</div>}

                    {userData?.userTypes === "ADMIN" && (
                      <BasicTabs
                        customerData={customersData}
                        ticketsData={ticketsData}
                        setAlertMessageData={(message) => {
                          setAlertMessage(message);
                          setSnackbarOpen(true);
                        }}
                      />
                    )}
                  </React.Fragment>
                }
              ></Route>
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    userData={userData}
                    openTicketsCount={
                      ticketsData.filter((ticket) => ticket.status === "OPEN")
                        .length
                    }
                    closedTicketsCount={
                      ticketsData.filter((ticket) => ticket.status === "CLOSED")
                        .length
                    }
                  />
                }
              />
              <Route exact path="/" element={<Navigate to="/OPEN" />} />
            </Routes>
          </div>
        </Box>
      </BrowserRouter>
    </Box>
  );
}
