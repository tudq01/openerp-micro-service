import { Box, Button, Card, CardActions, CardContent, CardHeader, Fade, Modal, TextField } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { request } from "api";
import { useState } from "react";
import { errorNoti, successNoti } from "../utils/notification";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    minWidth: 400,
    padding: 10,
    width: "100vw",
    height: "100vh",
  },
  action: {
    display: "flex",
    justifyContent: "center",
  },
  error: {
    textAlign: "center",
    color: "red",
    marginTop: theme.spacing(2),
  },
  select: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
}));

const ModalAddHall = ({ isOpen, handleSuccess, handleClose }) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setlocation] = useState("");
  const [totalFloor, settotalFloor] = useState("");
  const [status, setstatus] = useState("");

  const handleChange = (event) => {
    setstatus(event.target.value);
  };
  const ROOMS_status = ["UNDER_CONSTRUCTION", "NEW", "OPERATIONAL", "DOWNGRADE", "MAINTENANCE"];

  const createHall = () => {
    request(
      "post",
      `/halls`,
      (res) => {
        console.log("crean, domain ", res.data);
        successNoti("Add success", 3000);
        handleSuccess(res.data);
      },
      {
        onError: (error) => {
          errorNoti("Error create room", 3000);
        },
      },
      { name: name, description: description, location: location, totalFloor: totalFloor, status: status }
    );
  };
  const handleSubmit = () => {
    createHall();
  };

  return (
    <Modal
      className={classes.modal}
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      // BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <form onSubmit={handleSubmit}>
          <Card className={classes.card}>
            <CardHeader
              title={
                <Grid container direction="row" justify="space-between" alignItems="center">
                  {"Add hall"}
                  <IconButton aria-label="close" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              }
            />
            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <TextField id="name" value={name} onChange={(e) => setName(e.target.value)} label="Room name" />
              </Box>
            </CardContent>

            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <TextField
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  label="Description"
                />
              </Box>
            </CardContent>
            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <TextField
                  id="location"
                  value={location}
                  onChange={(e) => {
                    setlocation(e.target.value);
                  }}
                  label="Location"
                />
              </Box>
            </CardContent>
            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <TextField
                  type="number"
                  id="totalFloor"
                  value={totalFloor}
                  onChange={(e) => settotalFloor(e.target.value)}
                  label="Total Floor"
                />
              </Box>
            </CardContent>
            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <InputLabel id="demo-simple-select" style={{ paddingBottom: "3px", paddingLeft: "10px" }}>
                  Status
                </InputLabel>

                <Select
                  labelId="demo-simple-select"
                  id="status"
                  value={status}
                  label="Status"
                  onChange={handleChange}
                  displayEmpty
                  style={{ padding: "5px 0 0 10px" }}
                >
                  {ROOMS_status.map((item) => (
                    <MenuItem value={item} key={item} style={{ display: "block", padding: "3px" }}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </CardContent>
            <CardActions className={classes.action}>
              <Button type="submit" variant="contained" color="primary">
                Add
              </Button>
            </CardActions>
          </Card>
        </form>
      </Fade>
    </Modal>
  );
};

export default ModalAddHall;
