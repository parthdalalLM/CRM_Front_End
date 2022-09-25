import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { demoTicketData } from "../Demodata";
import ImgMediaCard from "./CardListView";

export function TabPanel(props) {
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({
  customerData,
  setAlertMessageData,
  ticketsData,
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Customers" {...a11yProps(0)} />
          <Tab label="Engineers" {...a11yProps(1)} />
          <Tab label="Tickets" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {customerData
          .filter((customer) => customer.userTypes === "CUSTOMER")
          .map((customer, index) => {
            return (
              <ImgMediaCard
                type="user"
                key={customer.userId}
                data={customer}
                index={index}
                setAlertMessageData={(data) => setAlertMessageData(data)}
              />
            );
          })}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {customerData
          .filter((customer) => customer.userTypes === "ENGINEER")
          .map((customer, index) => {
            return (
              <ImgMediaCard
                type="user"
                key={customer.userId}
                data={customer}
                index={index}
                setAlertMessageData={(data) => setAlertMessageData(data)}
              />
            );
          })}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {ticketsData.map((ticket, index) => {
          return (
            <ImgMediaCard
              type="ticket"
              key={ticket.id}
              data={ticket}
              index={index}
            />
          );
        })}
      </TabPanel>
    </Box>
  );
}
