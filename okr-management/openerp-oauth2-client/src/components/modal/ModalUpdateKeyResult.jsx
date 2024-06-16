import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Fade, Modal } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, TextField } from "@mui/material";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import FormItem from "components/form/FormItem";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { errorNoti, successNoti } from "utils/notification";
import * as z from "zod";

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
    width: "100%",
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

const ModalUpdateKR = ({ isOpen, handleClose, id }) => {
  const classes = useStyles();
  const router = useParams();

  const queryClient = useQueryClient();

  const TARGET_STATUS = ["NOT_STARTED", "APPROVE", "REJECT", "IN_PROGRESS", "WAIT_REVIEW", "CLOSED"];
  const TARGET_TYPE = ["PERSONAL", "DEPARTMENT", "COMPANY"];

  const schema = z.object({
    title: z.string({ required_error: "This field is required" }).min(1, { message: "This field is required" }),
    progress: z.number({
      required_error: "This field is required",
      invalid_type_error: "This field is required",
    }),
    weighted: z.number({
      required_error: "This field is required",
      invalid_type_error: "This field is required",
    }),
    fromDate: z.string().optional().nullable(),
    toDate: z.string().optional().nullable(),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormState,
  });

  const { data: target } = useQuery({
    queryKey: ["target-kr-detail", id],
    queryFn: async () => {
      const res = await request("GET", `/targets/key-result/${id}`, null, null, null, {});
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (target) {
      Object.entries(target).forEach(([key, value]) => {
        if (value) methods.setValue(key, value);
      });
    }
  }, [methods, target]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const save = async (values) => {
    let successHandler = () => {
      queryClient.invalidateQueries(["targets-kr-detail"]);
      queryClient.invalidateQueries(["target-detail", router.id]);
      // queryClient.invalidateQueries(["targets-detail",target.targetId]);
      successNoti("Update key result successfully!", 3000);
      //   handleClose()
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("patch", `/targets/key-result/${id}`, successHandler, errorHandlers, values);
  };

  return (
    <>
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
                      <div className="font-bold text-xl">{"Key Result Details"}</div>

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
                              <FormItem label="Title">
                                <TextField
                                  {...field}
                                  id="name"
                                  value={field.value}
                                  error={errors?.title ? true : false}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                />
                              </FormItem>
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
                          name={"progress"}
                          render={({ field }) => (
                            <>
                              <FormItem label="Progress">
                                <TextField
                                  {...field}
                                  id="progress"
                                  type="number"
                                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                                  value={field.value}
                                  error={errors?.title ? true : false}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    methods.setValue(`progress`, value ? parseInt(value) : "");
                                  }}
                                />
                              </FormItem>
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
                          name={"weighted"}
                          render={({ field }) => (
                            <>
                              <FormItem label="Weighted">
                                <TextField
                                  {...field}
                                  id="weighted"
                                  type="number"
                                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                                  value={field.value}
                                  error={errors?.title ? true : false}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    methods.setValue(`weighted`, value ? parseInt(value) : "");
                                  }}
                                />
                              </FormItem>
                            </>
                          )}
                        />
                      </Box>
                    </CardContent>
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={4}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" justifyContent="center">
                        <Controller
                          control={control}
                          name={"fromDate"}
                          render={({ field }) => (
                            <>
                              <FormItem label="From Date">
                                <TextField
                                  {...field}
                                  id="date"
                                  type="date"
                                  value={dayjs(field.value).format("YYYY-MM-DD")}
                                  inputProps={{
                                    max: methods.watch("toDate")
                                      ? dayjs(methods.watch("toDate")).endOf("d").format("YYYY-MM-DD")
                                      : null,
                                  }}
                                  error={errors?.title ? true : false}
                                  onChange={(value) => {
                                    console.log(value);
                                    field.onChange(value);
                                  }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </FormItem>
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
                              <FormItem label="To Date">
                                <TextField
                                  {...field}
                                  id="date"
                                  type="date"
                                  inputProps={{
                                    min: dayjs(methods.watch("fromDate")).format("YYYY-MM-DD"),
                                  }}
                                  value={dayjs(field.value).format("YYYY-MM-DD")}
                                  error={errors?.title ? true : false}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </FormItem>
                            </>
                          )}
                        />
                      </Box>
                    </CardContent>
                  </Grid>
                  <Grid item xs={4}></Grid>
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
                  <Button type="submit" variant="contained" color="primary" key={id} style={{ textTransform: "none" }}>
                    Update
                  </Button>
                </CardActions>
              </Card>
            </form>
          </FormProvider>
        </Fade>
      </Modal>
    </>
  );
};

export default ModalUpdateKR;
