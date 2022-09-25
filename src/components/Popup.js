import { CloseOutlined } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  Divider,
  Typography,
  ListItemText,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Fragment, useEffect, useState } from "react";
import { getAllComments, getAllUsers } from "../constants";
import { demoComments, demoCustomerData } from "../Demodata";

export default function Popup({
  openLogin,
  handleLoginClose,
  type,
  selectedTicket,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState(null);
  const [ticketPriority, setTicketPriority] = useState(null);
  const [status, setStatus] = useState(null);
  const [description, setDescription] = useState(null);
  const [userTypes, setUserTypes] = useState(null);
  const [userData, setUserData] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [customersData, setCustomersData] = useState(demoCustomerData);
  const [commentsData, setCommentsData] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    setUserData(JSON.parse(sessionStorage.getItem("userData")));
    if (
      title !== selectedTicket?.title ||
      description !== selectedTicket?.description ||
      status !== selectedTicket?.status ||
      assignee !== selectedTicket?.assignee ||
      ticketPriority !== selectedTicket?.ticketPriority
    ) {
      setTitle(selectedTicket?.title);
      setDescription(selectedTicket?.description);
      setStatus(selectedTicket?.status);
      setTicketPriority(selectedTicket?.ticketPriority);
      setAssignee(selectedTicket?.assignee);
    } else if (selectedTicket != null) {
      setTitle(selectedTicket?.title);
      setDescription(selectedTicket?.description);
      setStatus(selectedTicket?.status);
      setTicketPriority(selectedTicket?.ticketPriority);
      setAssignee(selectedTicket?.assignee);
    } else {
      setTitle("");
      setDescription("");
      setStatus("");
      setTicketPriority("");
    }

    if (selectedTicket?.id) {
      fetch(getAllComments + `${selectedTicket.id}/comments`, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": userData?.accessToken,
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            if (result.length > 0) setCommentsData(result);
            // else setCommentsData(demoComments);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setCommentsData(demoComments);
          }
        );
    }
  }, [selectedTicket]);

  useEffect(() => {
    if (userData !== null) {
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
  }, []);
  const addNewComment = () => {
    const commentData = { content: newComment };
    fetch(getAllComments + `${selectedTicket.id}/comments`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        "x-access-token": userData?.accessToken,
      },
      body: JSON.stringify(commentData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setCommentsData([...commentsData, data]);
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error:", error);
        setNewComment("");
      });
  };
  return (
    <Dialog
      style={{
        background:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
      }}
      open={openLogin}
    >
      {type === "loginRegister" && (
        <Fragment>
          <DialogTitle>
            Login/Register
            {userData && userData.userId && (
              <CloseOutlined
                style={{ float: "right" }}
                onClick={() => {
                  setIsRegister(false);
                  setEmail("");
                  setName("");
                  setPassword("");
                  handleLoginClose({ actionType: "close" });
                }}
              />
            )}{" "}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To do any operations please Login or Register
            </DialogContentText>
            <Box component="form" autoComplete="off">
              {isRegister && (
                <TextField
                  autoFocus
                  error={name === ""}
                  margin="dense"
                  id="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  required
                  onChange={(event) => setName(event.target.value)}
                />
              )}

              <TextField
                autoFocus
                required
                error={userId === ""}
                margin="dense"
                id="userId"
                label="User Id"
                type="text"
                fullWidth
                variant="standard"
                onChange={(event) => setUserId(event.target.value)}
              />

              {isRegister && (
                <TextField
                  autoFocus
                  required
                  error={email === ""}
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                  onChange={(event) => setEmail(event.target.value)}
                />
              )}
              <TextField
                autoFocus
                required
                error={password === ""}
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                onChange={(event) => setPassword(event.target.value)}
              />
              {isRegister && (
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={assignee}
                    name="radio-buttons-group"
                    onChange={(event) => {
                      setUserTypes(event.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="ENGINEER"
                      control={<Radio />}
                      label="Engineer"
                    />
                    <FormControlLabel
                      value="CUSTOMER"
                      control={<Radio />}
                      label="Customer"
                    />
                  </RadioGroup>
                </FormControl>
              )}
              <br></br>
              {isRegister && (
                <Button
                  disabled={
                    userId === "" ||
                    email === "" ||
                    name === "" ||
                    password === "" ||
                    userTypes === ""
                  }
                  onClick={() => {
                    setIsRegister(false);
                    handleLoginClose({
                      actionType: "register",
                      userId: userId,
                      email: email,
                      password: password,
                      userTypes: userTypes,
                      name: name,
                    });
                  }}
                >
                  Register
                </Button>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            {!isRegister && (
              <Button
                disabled={userId === "" || password === ""}
                onClick={() => {
                  setIsRegister(false);
                  handleLoginClose({
                    actionType: "login",
                    userId: userId,
                    password: password,
                  });
                }}
              >
                Login
              </Button>
            )}
            {!isRegister && (
              <Button onClick={() => setIsRegister(true)}>Register</Button>
            )}
          </DialogActions>
        </Fragment>
      )}

      {(type === "createTicket" || type === "updateTicket") && (
        <Fragment>
          <DialogTitle>
            {" "}
            {type === "createTicket" ? "Create" : "Update"} Ticket
            <CloseOutlined
              style={{ float: "right" }}
              onClick={() => {
                handleLoginClose({ actionType: "close" });
              }}
            />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {type === "createTicket" ? "Create New" : "Update"} Ticket
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              value={title}
              variant="standard"
              onChange={(event) => setTitle(event.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              value={description}
              variant="standard"
              multiline
              onChange={(event) => setDescription(event.target.value)}
            />
            {type === "updateTicket" && (
              <TextField
                autoFocus
                required
                error={ticketPriority === ""}
                margin="dense"
                id="ticketPriority"
                label="Ticket Priority"
                type="number"
                fullWidth
                value={ticketPriority}
                variant="standard"
                onChange={(event) => setTicketPriority(event.target.value)}
              />
            )}
            {type === "updateTicket" && (
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Status
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue=""
                  name="radio-buttons-group"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
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
            {type === "updateTicket" && userData?.userTypes !== "CUSTOMER" && (
              <FormControl fullWidth>
                <InputLabel id="assignee-label">Assignee</InputLabel>
                <Select
                  labelId="assignee-label"
                  id="assignee"
                  value={assignee}
                  label="Assignee"
                  onChange={(event) => setAssignee(event.target.value)}
                >
                  {customersData.map((customer) => {
                    return (
                      <MenuItem key={customer.userId} value={customer.userId}>
                        {customer.userId}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}

            {type === "updateTicket" && (
              <Fragment>
                <List sx={{ width: "100%", padding: "20px" }}>
                  {commentsData.length > 0 && (
                    <Typography>Comments:</Typography>
                  )}
                  {commentsData.map((comment) => {
                    return (
                      <Fragment>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={comment.content}
                            secondary={
                              <Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                >
                                  {comment.commenterId}
                                </Typography>
                              </Fragment>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </Fragment>
                    );
                  })}
                </List>
                <TextField
                  id="outlined-multiline-static"
                  label="Add comment"
                  multiline
                  rows={4}
                  fullWidth
                  defaultValue=""
                  onChange={(event) => {
                    setNewComment(event.target.value);
                  }}
                />
                <Button
                  disabled={newComment === ""}
                  onClick={addNewComment}
                  style={{ float: "right" }}
                >
                  Add Comment
                </Button>
              </Fragment>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              disabled={title === "" || description === ""}
              onClick={() =>
                handleLoginClose({
                  actionType:
                    type === "createTicket" ? "createTicket" : "updateTicket",
                  title: title,
                  description: description,
                  id: selectedTicket?.id,
                  ticketPriority: ticketPriority,
                  status: status,
                })
              }
            >
              {type === "createTicket" ? "Create" : "Update"}
            </Button>
          </DialogActions>
        </Fragment>
      )}
    </Dialog>
  );
}
