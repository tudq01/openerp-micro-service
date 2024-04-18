import {
    Backdrop,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Fade,
    Modal,
    TextField,
} from "@material-ui/core";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { makeStyles } from "@material-ui/core/styles";
import { request } from "api";
import { useEffect, useState } from "react";
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

const ModalEditHall = ({hallId ,isOpen, handleSuccess, handleClose }) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [totalFloor, setTotalFloor] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const ROOMS_status = ["UNDER_CONSTRUCTION", "NEW", "OPERATIONAL", "DOWNGRADE", "MAINTENANCE"];

  const updateHall = () => {
    request(
      "patch",
      `/halls/${hallId}`,
      (res) => {
        console.log("crean, domain ", res.data);
        successNoti("Update success", 3000);
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
    console.log('submit')
    updateHall();
  }; 

    const getHallDetail = (id) => {
      request(
        "get",
        `/halls/${id}`,
        (res) => {
          const item = res.data;
          setName(item.name);
          setDescription(item.description);
          setTotalFloor(item.totalFloor);
          setStatus(item.status);
          console.log(item)
          setLocation(item.location);
        },
        {
          onError: (error) => {
            errorNoti("Error create room", 3000);
          },
        }
      );
    };
    useEffect(() => {
      getHallDetail(hallId);
    }, [hallId]);


  return (
    <Modal
      className={classes.modal}
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <form onSubmit={handleSubmit}>
          <Card className={classes.card}>
            <CardHeader title="Edit hall" />
            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <TextField
                  required
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Hall name"
                />
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
                  status="number"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  label="Location"
                />
              </Box>
            </CardContent>
            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <TextField
                  status="number"
                  id="totalFloor"
                  value={totalFloor}
                  onChange={(e) => setTotalFloor(e.target.value)}
                  label="TotalFloor"
                />
              </Box>
            </CardContent>
            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                {/* <TextField id="status" value={status} onChange={(e) => setStatus(e.target.value)} label="Room status" /> */}
                <InputLabel id="demo-simple-select-label" style={{ paddingBottom: "3px", paddingLeft: "10px" }}>
                  status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
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

export default ModalEditHall;
