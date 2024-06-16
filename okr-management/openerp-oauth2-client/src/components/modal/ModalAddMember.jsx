import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Fade, Modal } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { errorNoti, successNoti } from "utils/notification";
import * as z from "zod";

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
    overflowY: "scroll",
  },
  action: {
    display: "flex",
    justifyContent: "end",
    alignItems: "end",
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

const initialFormState = { progress: 0, status: "NOT_STARTED", type: "PERSONAL" };
export const ROLE = ["STAFF", "MANAGER", "HEAD_MANAGER"];

const ModalAddMember = ({ isOpen, handleSuccess, handleClose }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const router = useParams();
  const id = router.id;

  const methods = useForm({
    resolver: zodResolver(
      z.object({
        userId: z.string({ required_error: "This field is required" }).min(1, { message: "This field is required" }),
        role: z.string({ required_error: "This field is required" }).min(1, { message: "This field is required" }),
      })
    ),
    mode: "onChange",
    defaultValues: initialFormState,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const save = async (values) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["teams"]);
      successNoti("Add member successfully!", 3000);
      reset();
      handleClose();
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("post", `/teams/${id}/member`, successHandler, errorHandlers, values);
    //userId
    //role
  };

  const { data: users } = useQuery({
    queryKey: ["user-option"],
    queryFn: async () => {
      const res = await request("GET", `/user/get-all`, null, null, null, {});
      return res.data;
    },
    enabled: true,
  });

  const userOptions = users?.length
    ? users.map((item) => {
        return { label: item.email, value: item.id };
      })
    : [];

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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(save)}>
            <Card className={classes.card}>
              <CardHeader
                title={
                  <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    {"Add member"}
                    <IconButton aria-label="close" onClick={handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                }
              />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                      <Controller
                        control={control}
                        name={"userId"}
                        render={({ field }) => (
                          <>
                            <InputLabel id="demo-simple-select" style={{ paddingBottom: "3px", paddingLeft: "10px" }}>
                              User
                            </InputLabel>

                            <Select
                              labelId="demo-simple-select"
                              value={field.value ?? ""}
                              // readOnly
                              label="user"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                              displayEmpty
                              style={{ padding: "5px 0 0 10px" }}
                            >
                              {userOptions.map((item) => (
                                <MenuItem
                                  value={item.value}
                                  key={item.value}
                                  style={{ display: "block", padding: "8px" }}
                                >
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </>
                        )}
                      />
                      <div>{errors?.userId?.message}</div>
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={4}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                      <Controller
                        control={control}
                        name={"role"}
                        render={({ field }) => (
                          <>
                            <InputLabel id="demo-simple-select" style={{ paddingBottom: "3px", paddingLeft: "10px" }}>
                              Role
                            </InputLabel>

                            <Select
                              labelId="demo-simple-select"
                              id="role"
                              value={field.value ?? ""}
                              // readOnly
                              label="role"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                              displayEmpty
                              style={{ padding: "5px 0 0 10px" }}
                            >
                              {ROLE.map((item) => (
                                <MenuItem value={item} key={item} style={{ display: "block", padding: "8px" }}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </>
                        )}
                      />
                      <div>{errors?.role?.message}</div>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>

              <CardActions className={classes.action}>
                <Button
                  type="button"
                  variant="contained"
                  color="default"
                  style={{ textTransform: "none" }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>

                <Button type="submit" variant="contained" color="primary" style={{ textTransform: "none" }}>
                  Add
                </Button>
              </CardActions>
            </Card>
          </form>
        </FormProvider>
      </Fade>
    </Modal>
  );
};

export default ModalAddMember;
