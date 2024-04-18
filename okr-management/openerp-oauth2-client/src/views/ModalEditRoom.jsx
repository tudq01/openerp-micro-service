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
import MenuItem from "@mui/material/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { request } from "api";
import { useEffect, useState } from "react";
import { errorNoti, successNoti } from "../utils/notification";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

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

const ModalEditRoom = ({ roomId, isOpen, handleSuccess, handleClose }) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [floor, setFloor] = useState("");
  const [type, setType] = useState("");

  const handleChange = (event) => {
    setType(event.target.value);
  };
  const ROOMS_TYPE = ["LABORATORY", "CLASS", "SELF_STUDY"];

  const updateRoom = () => {
    request(
      "patch",
      `/rooms/${roomId}`,
      (res) => {
        console.log("crean, domain ", res.data);
        successNoti("Update success", 3000);
        // handleSuccess(res.data);
      },
      {
        onError: (error) => {
          errorNoti("Error create room", 3000);
        },
      },
      { name: name, description: description, capacity: capacity, floor: floor, type: type }
    );
  };

  const getRoomDetail = (id) => {
    request(
      "get",
      `/rooms/${id}`,
      (res) => {
        const item = res.data;
        setName(item.name);
        setDescription(item.description);
        setCapacity(item.capacity);
        setFloor(item.floor);
        setType(item.type);
      },
      {
        onError: (error) => {
          errorNoti("Error create room", 3000);
        },
      }
    );
  };
  useEffect(() => {
    getRoomDetail(roomId);
  }, [roomId]);

  const handleSubmit = () => {
    updateRoom();
  };

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
            <CardHeader title="Add room" />
            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <TextField
                  required
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Room name"
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
                  type="number"
                  id="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  label="Capacity"
                />
              </Box>
            </CardContent>
            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <TextField
                  type="number"
                  id="floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  label="Floor"
                />
              </Box>
            </CardContent>
            <CardContent>
              <Box display="flex" flexDirection="column" justifyContent="center">
                {/* <TextField id="type" value={type} onChange={(e) => setType(e.target.value)} label="Room Type" /> */}
                <InputLabel id="demo-simple-select-label" style={{ paddingBottom: "3px", paddingLeft: "10px" }}>
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="type"
                  value={type}
                  label="Type"
                  onChange={handleChange}
                  displayEmpty
                  style={{ padding: "5px 0 0 10px" }}
                >
                  {ROOMS_TYPE.map((item) => (
                    <MenuItem value={item} key={item} style={{ display: "block", padding: "3px" }}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </CardContent>
            <CardActions className={classes.action}>
              <Button type="submit" variant="contained" color="primary">
                Cap nhat
              </Button>
            </CardActions>
          </Card>
        </form>
      </Fade>
    </Modal>
  );
};

export default ModalEditRoom;
