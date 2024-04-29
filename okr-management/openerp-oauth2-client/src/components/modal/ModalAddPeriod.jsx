import { Box, Button, Card, CardActions, CardContent, CardHeader, Fade, Modal, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import dayjs from "dayjs";
import { Controller, FormProvider, useForm } from "react-hook-form";
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

const ModalAddPeriod = ({ isOpen, handleSuccess, handleClose }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const methods = useForm({
    resolver: zodResolver(
      z.object({
        title: z.string({ required_error: "This field is required" }).min(1, { message: "This field is required" }),
        fromDate: z.string().optional().nullable(),
        toDate: z.string().optional().nullable(),
      })
    ),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const save = async (values) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["target-period"]);
      successNoti("Add target successfully!", 3000);
      reset();
      handleClose();
    };

    let errorHandlers = {
      onError: (error) => errorNoti("Error create!", 3000),
    };

    request("post", `/targets/period`, successHandler, errorHandlers, values);
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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(save)}>
            <Card className={classes.card}>
              <CardHeader
                title={
                  <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    {"Add period"}
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
                        name={"title"}
                        render={({ field }) => (
                          <>
                            <TextField
                              {...field}
                              id="name"
                              value={field.value}
                              error={errors?.title ? true : false}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Title"
                              InputLabelProps={{ shrink: true }}
                            />
                          </>
                        )}
                      />
                      <div>{errors?.title?.message}</div>
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={8}></Grid>

                <Grid item xs={4}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                      <Controller
                        control={control}
                        name={"fromDate"}
                        render={({ field }) => (
                          <>
                            <TextField
                              {...field}
                              id="date"
                              label="From Date"
                              type="date"
                              value={field.value}
                              inputProps={{
                                max: methods.watch("toDate")
                                  ? dayjs(methods.watch("toDate")).endOf("d").format("YYYY-MM-DD")
                                  : null,
                              }}
                              error={errors?.title ? true : false}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </>
                        )}
                      />
                    </Box>
                  </CardContent>
                </Grid>

                <Grid item xs={4}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                      <Controller
                        control={control}
                        name={"toDate"}
                        render={({ field }) => (
                          <>
                            <TextField
                              {...field}
                              id="date"
                              label="To Date"
                              type="date"
                              inputProps={{
                                min: dayjs(methods.watch("fromDate")).format("YYYY-MM-DD"),
                              }}
                              value={field.value}
                              error={errors?.title ? true : false}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </>
                        )}
                      />
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={4}></Grid>
              </Grid>
              <CardActions className={classes.action}>
                <Button type="button" variant="contained" color="default">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
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

export default ModalAddPeriod;
