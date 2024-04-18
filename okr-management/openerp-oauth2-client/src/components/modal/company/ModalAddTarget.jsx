import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Fade,
  Modal,
  TextField,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import dayjs from "dayjs";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
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

const initialFormState = { progress: 0, status: "NOT_STARTED", type: "COMPANY" };

const ModalAddTargetCompany = ({ isOpen, handleSuccess, handleClose }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const TARGET_STATUS = ["NOT_STARTED", "APPROVE", "REJECT", "IN_PROGRESS", "WAIT_REVIEW", "CLOSED"];
  const TARGET_TYPE = ["PERSONAL", "DEPARTMENT", "COMPANY"];

  const methods = useForm({
    resolver: zodResolver(
      z.object({
        title: z.string({ required_error: "message.required" }).min(1, { message: "message.required" }),
        progress: z.number({
          required_error: "message.required",
          invalid_type_error: "message.required",
        }),
        // progress: z.string().optional().nullable(),
        fromDate: z.string().optional().nullable(),
        toDate: z.string().optional().nullable(),
        status: z.string().optional().nullable(),
        type: z.string().optional().nullable(),
        targetCategoryId: z.number().optional().nullable(),
        keyResults: z
          .array(
            z.object({
              title: z.string({ required_error: "message.required" }).min(1, { message: "message.required" }),
              // progress: z.string().optional().nullable(),
              progress: z.number({
                required_error: "message.required",
                invalid_type_error: "message.required",
              }),
              fromDate: z.string().optional().nullable(),
              toDate: z.string().optional().nullable(),
            })
          )
          .default([])
          .optional()
          .nullable(),
      })
    ),
    mode: "onChange",
    defaultValues: initialFormState,
  });
  const keyResults = methods.watch("keyResults");

  const { data: categories } = useQuery({
    queryKey: ["target-category"],
    queryFn: async () => {
      const res = await request("GET", `/targets/categories`, null, null, null, {});
      return res.data;
    },
    enabled: true,
  });

  const categoryOptions = categories?.length
    ? categories.map((item) => {
        return { label: item.type, value: item.id };
      })
    : [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const { append, remove } = useFieldArray({ control, name: "keyResults" });

  const save = async (values) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["user-targets"]);
      successNoti("Add target successfully!", 3000);
      reset();
      handleClose();
    };

    let errorHandlers = {
      onError: (error) => errorNoti("Error create!", 3000),
    };

    request("post", `/targets`, successHandler, errorHandlers, values);
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
                    {"Add target"}
                    <IconButton aria-label="close" onClick={handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                }
              />
              <Grid container spacing={2}>
                <Grid item xs={8}>
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
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                      <Controller
                        control={control}
                        name={"progress"}
                        render={({ field }) => (
                          <>
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
                              label="Progress"
                            />
                          </>
                        )}
                      />
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

                <Grid item xs={4}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                      <Controller
                        control={control}
                        name={"status"}
                        render={({ field }) => (
                          <>
                            <InputLabel id="demo-simple-select" style={{ paddingBottom: "3px", paddingLeft: "10px" }}>
                              Status
                            </InputLabel>

                            <Select
                              labelId="demo-simple-select"
                              id="status"
                              value={field.value ?? ""}
                              // readOnly
                              label="Status"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                              displayEmpty
                              style={{ padding: "5px 0 0 10px" }}
                            >
                              {TARGET_STATUS.map((item) => (
                                <MenuItem value={item} key={item} style={{ display: "block", padding: "8px" }}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
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
                        name={"type"}
                        render={({ field }) => (
                          <>
                            <InputLabel id="select-type" style={{ paddingBottom: "3px", paddingLeft: "10px" }}>
                              Type
                            </InputLabel>

                            <Select
                              labelId="select-type"
                              value={"COMPANY"}
                              readOnly
                              label="Type"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                              displayEmpty
                              style={{ padding: "5px 0 0 10px" }}
                            >
                              {TARGET_TYPE.map((item) => (
                                <MenuItem value={item} key={item} style={{ display: "block", padding: "8px" }}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
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
                        name={"targetCategoryId"}
                        render={({ field }) => (
                          <>
                            <InputLabel id="select-cate" style={{ paddingBottom: "3px", paddingLeft: "10px" }}>
                              Category
                            </InputLabel>

                            <Select
                              labelId="select-cate"
                              value={field.value ?? ""}
                              label="Target Category"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                              displayEmpty
                              style={{ padding: "5px 0 0 10px" }}
                            >
                              {categoryOptions.map((item) => (
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
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={12}>
                  {keyResults?.length > 0 ? <h1 className="font-bold pl-4 text-xl">Key Result</h1> : null}
                  {keyResults?.map((_, index) => {
                    return (
                      <Grid container spacing={2} key={index} className="pl-10">
                        <Grid item xs={4}>
                          <CardContent>
                            <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                              <Controller
                                control={control}
                                name={`keyResults.${index}.title`}
                                render={({ field }) => (
                                  <>
                                    <TextField
                                      {...field}
                                      value={field.value}
                                      error={errors?.keyResults?.[index]?.title ? true : false}
                                      onChange={(value) => {
                                        field.onChange(value);
                                      }}
                                      label="Title"
                                    />
                                  </>
                                )}
                              />
                              <div>{errors?.keyResults?.[index]?.title?.message}</div>
                            </Box>
                          </CardContent>
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                          <CardContent>
                            <Box display="flex" flexDirection="column" justifyContent="center">
                              <Controller
                                control={control}
                                name={`keyResults.${index}.progress`}
                                render={({ field }) => (
                                  <>
                                    <TextField
                                      {...field}
                                      type="number"
                                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                                      value={field.value}
                                      error={errors?.title ? true : false}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        methods.setValue(`keyResults.${index}.progress`, value ? parseInt(value) : "");
                                      }}
                                      label="Progress"
                                    />
                                  </>
                                )}
                              />
                            </Box>
                          </CardContent>
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={4}>
                          <CardContent>
                            <Box display="flex" flexDirection="column" justifyContent="center">
                              <Controller
                                control={control}
                                name={`keyResults.${index}.fromDate`}
                                render={({ field }) => (
                                  <>
                                    <TextField
                                      {...field}
                                      label="From Date"
                                      type="date"
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

                        <Grid item xs={4}>
                          <CardContent>
                            <Box display="flex" flexDirection="column" justifyContent="center">
                              <Controller
                                control={control}
                                name={`keyResults.${index}.toDate`}
                                render={({ field }) => (
                                  <>
                                    <TextField
                                      {...field}
                                      label="To Date"
                                      type="date"
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
                        <Grid item xs={8} className="pl-5">
                          <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            Remove key result
                          </Button>
                        </Grid>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={12}>
                          <Divider variant="middle" />
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
              <CardActions className={classes.action}>
                <Button type="button" variant="contained" color="default">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Add
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    append({
                      title: "",
                      progress: 0,
                      fromDate: "",
                      toDate: "",
                    });
                  }}
                >
                  Add key result
                </Button>
              </CardActions>
            </Card>
          </form>
        </FormProvider>
      </Fade>
    </Modal>
  );
};

export default ModalAddTargetCompany;
