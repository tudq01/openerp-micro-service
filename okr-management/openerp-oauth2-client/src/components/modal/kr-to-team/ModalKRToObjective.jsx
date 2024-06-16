import { Button, Card, CardActions, CardHeader, Fade, Modal } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    minWidth: 400,
    padding: 10,
    width: "50%",
    height: "45vh",
    overflowY: "scroll",
  },
  action: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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

const ModalKRToObjective = ({ isOpen, handleClose, onConfirm }) => {
  const classes = useStyles();

  return (
    <>
      <Modal
        className={classes.modal}
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <Card className={classes.card}>
            <CardHeader
              title={
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                  <div className="font-bold text-xl">{"Convert to objective"}</div>

                  <IconButton aria-label="close" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              }
            />
            <Grid container spacing={2} justifyContent="center" className="p-5">
              <Grid item xs={12}>
                You are converting this Key Result into an Objective. It will remove the current key result and align
                objective as parent of new objective.
              </Grid>
              <Grid item xs={12}>
                The progress % will also be reset to zero. You can add new Key Results to this converted Objective and
                update the progress %.
              </Grid>
              <Grid item xs={12}>
                <div className="text-red-500">You should remove cascade to keep the cascade objectives.</div>
              </Grid>
            </Grid>
            <CardActions className={classes.action}>
              <Button
                type="button"
                variant="contained"
                color="default"
                onClick={() => {
                  handleClose();
                }}
                style={{ textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => {
                  onConfirm();
                  handleClose();
                }}
                style={{ textTransform: "none" }}
              >
                Continue
              </Button>
            </CardActions>
          </Card>
        </Fade>
      </Modal>
    </>
  );
};

export default ModalKRToObjective;
