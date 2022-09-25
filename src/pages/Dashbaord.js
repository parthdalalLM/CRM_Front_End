import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { Fragment } from "react";
import gradient from "../assets/gradient.png";
import { Link } from "react-router-dom";
export function Dashboard({ userData, openTicketsCount, closedTicketsCount }) {
  return (
    <Fragment>
      <CssBaseline />
      <Link to="/OPEN">
        {" "}
        <ActionAreaCard
          title="Open Requests"
          description={openTicketsCount}
        ></ActionAreaCard>
      </Link>
      <Link to="/CLOSED">
        {" "}
        <ActionAreaCard
          title="Closed Requests"
          description={closedTicketsCount}
        />
      </Link>
    </Fragment>
  );
}

export default function ActionAreaCard({ title, description }) {
  return (
    <Card style={{ marginTop: "50px" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="20"
          image={gradient}
          alt="gradient"
        />
        <CardContent style={{ backgroundImage: gradient }}>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
