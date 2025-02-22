import React, { Fragment, useEffect, useState } from "react";
import { Card, CardHeader, IconButton } from "@mui/material";
import { Build, Close, Done, Person } from "@mui/icons-material";
import { updateTicketById, updateUserInfo } from "../constants";
import Tooltip from "@mui/material/Tooltip";

export default function ImgMediaCard({
  type,
  data,
  handlePopupOpen,
  setSelectedTicketData,
  setAlertMessageData
}) {
  //const [alertMessage,setAlertMessage] = useState(null);
  const userDataFromStorage = JSON.parse(sessionStorage.getItem("userData"));

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
        })
        .catch((error) => {
          console.error("Error:", error);
          setAlertMessageData(error)
        });
  };

  return (
    <Card key={data.id} style={{ border: "1px solid #e3e3e3", margin: "4px" }}>
      <CardHeader
        avatar={type === "ticket" ? <Build /> : <Person />}
        action={
          <Fragment>
            {(type === "user" && data.userStatus === "PENDING") && (
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
            {(type === "user" && data.userStatus === "PENDING") && (
              <Tooltip title="Decline">
                <IconButton
                  aria-label="settings"
                  // disabled={(type==="user" && data.userStatus==="APPROVED") || (type==="ticket" && data.assignee)}
                  onClick={() => updateTicketorUser("DECLINED")}
                >
                  <Close color="error" />
                </IconButton>
              </Tooltip>
            )}
          </Fragment>
        }
        title={<h2>{data.title || data.name}</h2>}
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
              {data.description || data.email}
            </h4>
            <p>
              Status:<strong>{data.status || data.userStatus}</strong>{" "}
            </p>
            {data?.reporter && (
              <span>
                Reporter:<strong> {data.reporter}</strong>&nbsp;&nbsp;&nbsp;
              </span>
            )}
            {data?.assignee && (
              <span>
                Assignee:<strong> {data.assignee}</strong>
              </span>
            )}
          </div>
        }
      />
    </Card>
  );
}
