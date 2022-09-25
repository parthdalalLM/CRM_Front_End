import React, { Fragment, useEffect, useState } from "react";
import { Card, CardHeader, IconButton } from "@mui/material";
import { Build, Close, DateRange, Done, Person } from "@mui/icons-material";
import { updateTicketById, updateUserInfo } from "../constants";
import Tooltip from "@mui/material/Tooltip";

export default function ImgMediaCard({
  type,
  data,
  handlePopupOpen,
  setSelectedTicketData,
  setAlertMessageData,
}) {
  //const [alertMessage,setAlertMessage] = useState(null);
  const userDataFromStorage = JSON.parse(sessionStorage.getItem("userData"));
  const [cardUserdata, setCardUserData] = useState(data);
  // useEffect(()=>{
  //   if(alertMessage!=null){
  //     setAlertMessageData(alertMessage);
  //   }
  // },[alertMessage])

  const updateTicketorUser = (status) => {
    const userData = {
      name: data.name,
      userId: data.userId,
      email: data.email,
      userTypes: data.userTypes,
      userStatus: status,
    };
    fetch(updateUserInfo + `${data.userId}`, {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        "x-access-token": userDataFromStorage?.accessToken,
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setAlertMessageData(data.message);
        setCardUserData({ ...cardUserdata, userStatus: status });
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlertMessageData(error);
      });
  };

  return (
    <Card
      key={cardUserdata.id}
      style={{ border: "1px solid #e3e3e3", margin: "4px" }}
    >
      <CardHeader
        avatar={type === "ticket" ? <Build /> : <Person />}
        action={
          <Fragment>
            {type === "user" && cardUserdata.userStatus === "PENDING" && (
              <Tooltip title="Approve">
                <IconButton
                  aria-label="settings"
                  //disabled={(type==="user" && data.userStatus==="APPROVED") || (type==="ticket" && data.assignee)}
                  onClick={() => updateTicketorUser("APPROVED")}
                >
                  <Done color="primary" />
                </IconButton>
              </Tooltip>
            )}
            {type === "user" && cardUserdata.userStatus === "PENDING" && (
              <Tooltip title="Decline">
                <IconButton
                  aria-label="settings"
                  // disabled={(type==="user" && data.userStatus==="APPROVED") || (type==="ticket" && data.assignee)}
                  onClick={() => updateTicketorUser("REJECTED")}
                >
                  <Close color="error" />
                </IconButton>
              </Tooltip>
            )}
          </Fragment>
        }
        title={<h2>{cardUserdata.title || cardUserdata.name}</h2>}
        subheader={
          <div
            onClick={() => {
              if (type === "ticket") {
                setSelectedTicketData(data);
                handlePopupOpen("updateTicket");
              }
            }}
          >
            <h4
              style={{
                maxWidth: "60vw",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {cardUserdata.description || cardUserdata.email}
            </h4>
            <p>
              Status:
              <strong>{cardUserdata.status || cardUserdata.userStatus}</strong>{" "}
            </p>
            {cardUserdata?.reporter && (
              <span>
                Reporter:<strong> {cardUserdata.reporter}</strong>
                &nbsp;&nbsp;&nbsp;
              </span>
            )}
            {cardUserdata?.assignee && (
              <span>
                Assignee:<strong> {cardUserdata.assignee}</strong>
              </span>
            )}
          </div>
        }
      />
    </Card>
  );
}
