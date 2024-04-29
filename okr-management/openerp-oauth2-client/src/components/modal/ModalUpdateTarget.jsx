import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Fade, Modal } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import debounce from "lodash/debounce";
import { useCallback, useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
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

const DEBOUNCE_TIMEOUT = 500;
const initialFormState = { progress: 0, status: "NOT_STARTED", type: "PERSONAL" };

const ModalUpdateTarget = ({ isOpen, handleSuccess, handleClose }) => {
  const classes = useStyles();
  const router = useParams();
  const history = useHistory();
  const id = router.id;
  const queryClient = useQueryClient();

  const TARGET_STATUS = ["NOT_STARTED", "APPROVE", "REJECT", "IN_PROGRESS", "WAIT_REVIEW", "CLOSED"];
  const TARGET_TYPE = ["PERSONAL", "DEPARTMENT", "COMPANY"];

  const schema = z.object({
    title: z.string({ required_error: "This field is required" }).min(1, { message: "This field is required" }),
    progress: z.number({
      required_error: "This field is required",
      invalid_type_error: "This field is required",
    }),
    periodId: z.number({
      required_error: "This field is required",
      invalid_type_error: "This field is required",
    }),
    // progress: z.string().optional().nullable(),
    fromDate: z.string().optional().nullable(),
    toDate: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    targetCategoryId: z.number().optional().nullable(),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormState,
  });

  const { data: categories } = useQuery({
    queryKey: ["target-category"],
    queryFn: async () => {
      const res = await request("GET", `/targets/categories`, null, null, null, {});
      return res.data;
    },
    enabled: true,
  });

  const { data: target } = useQuery({
    queryKey: ["target-detail", id],
    queryFn: async () => {
      const res = await request("GET", `/targets/${id}`, null, null, null, {});
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

  const categoryOptions = categories?.length
    ? categories.map((item) => {
        return { label: item.type, value: item.id };
      })
    : [];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const save = async (values) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["targets-detail"]);
      successNoti("Add key result successfully!", 3000);
      //   handleClose()
    };

    let errorHandlers = {
      onError: (error) => errorNoti("Error create!", 3000),
    };

    request("patch", `/targets/${id}`, successHandler, errorHandlers, values);
  };

  const updateKeyResult = (key, progress) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["target-detail"]);
      successNoti("Update key result successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti("Error update!", 3000),
    };

    //todo update path
    request("patch", `/targets/${key}/key-result`, successHandler, errorHandlers, { progress: progress });
  };

  const handleUpdateProgress = useCallback(
    debounce((key, progress) => updateKeyResult(key, progress), DEBOUNCE_TIMEOUT),
    []
  );
  const { data: periods } = useQuery({
    queryKey: ["target-period-select"],
    queryFn: async () => {
      let errorHandlers = {
        onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000),
      };

      const res = await request("GET", `/targets/period`, null, errorHandlers, null, {
        params: { page: 0, size: 10 },
      });
      return res.data.periods;
    },
    enabled: true,
  });

  const userOptions = periods?.length
    ? periods.map((item) => {
        return { label: item.title, value: item.id };
      })
    : [];

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
                      <div className="font-bold text-xl">{"Objective Details"}</div>

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
                  <Grid item xs={4}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" justifyContent="center">
                        <Controller
                          control={control}
                          name={"periodId"}
                          render={({ field }) => (
                            <>
                              <InputLabel id="demo-simple-period" style={{ paddingBottom: "3px", paddingLeft: "10px" }}>
                                Period
                              </InputLabel>

                              <Select
                                labelId="demo-simple-period"
                                value={field.value ?? ""}
                                size="small"
                                label="Period"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                                displayEmpty
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
                        <div>{errors?.periodId?.message}</div>
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
                                value={dayjs(field.value).format("YYYY-MM-DD")}
                                inputProps={{
                                  max:  methods.watch("toDate")
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
                                value={dayjs(field.value).format("YYYY-MM-DD")}
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
                                value={field.value ?? ""}
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
                </Grid>
                <CardActions className={classes.action}>
                  <Button
                    type="button"
                    variant="contained"
                    color="default"
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
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

export default ModalUpdateTarget;
