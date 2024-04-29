import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Chip, IconButton, Slider, Stack, TextField, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import clsx from "clsx";
import ModalUpdateTarget from "components/modal/ModalUpdateTarget";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { errorNoti, successNoti } from "utils/notification";
import * as z from "zod";
import TargetResult from "./TargetResult";
import { capitalizeWords, getColor } from "./TargetScreen";
import TargetComment from "./comment/TargetComment";

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
    // height: "100vh",
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

const TargetDetail = ({ isOpen, handleSuccess, handleClose }) => {
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
    // progress: z.string().optional().nullable(),
    fromDate: z.string().optional().nullable(),
    toDate: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    targetCategoryId: z.number().optional().nullable(),
    keyResults: z
      .array(
        z.object({
          id: z.number().optional().nullable(),
          title: z.string({ required_error: "This field is required" }).min(1, { message: "This field is required" }),
          // progress: z.string().optional().nullable(),
          progress: z.number({
            required_error: "This field is required",
            invalid_type_error: "This field is required",
          }),
          fromDate: z.string().optional().nullable(),
          toDate: z.string().optional().nullable(),
        })
      )
      .default([])
      .optional()
      .nullable(),
  });

  const keySchema = z.object({
    keyResults: z
      .array(
        z.object({
          title: z.string({ required_error: "This field is required" }).min(1, { message: "This field is required" }),
          // progress: z.string().optional().nullable(),
          progress: z.number({
            required_error: "This field is required",
            invalid_type_error: "This field is required",
          }),
          fromDate: z
            .string({ required_error: "This field is required" })
            .min(1, { message: "This field is required" }),
          toDate: z.string({ required_error: "This field is required" }).min(1, { message: "This field is required" }),
        })
      )
      .default([])
      .optional()
      .nullable(),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormState,
  });

  const keyResultMethods = useForm({
    resolver: zodResolver(keySchema),
    mode: "onChange",
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
        if (key === "keyResults") {
          keyResultMethods.setValue(key, value);
        }
        if (value) methods.setValue(key, value);
      });
    }
  }, [keyResultMethods, methods, target]);

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
    const data = values.keyResults.filter((item) => item.id < 0);

    let successHandler = (res) => {
      queryClient.invalidateQueries(["targets-detail"]);
      successNoti("Add key result successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti("Error create!", 3000),
    };

    request("post", `/targets/${id}/key-results`, successHandler, errorHandlers, data);
  };

  const removeKeyResult = (id) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["targets-detail"]);
      successNoti("Update target successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti("Error create!", 3000),
    };

    request("delete", `/targets/key-result/${id}`, successHandler, errorHandlers, {});
  };

  const updateKeyResult = (key, progress) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["target-detail"]);
      successNoti("Update key result successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti("Error update!", 3000),
    };

    //todo update path: target/key-result/key
    request("patch", `/targets/${key}/key-result`, successHandler, errorHandlers, { progress: progress });
  };

  const handleUpdateProgress = useCallback(
    debounce((key, progress) => updateKeyResult(key, progress), DEBOUNCE_TIMEOUT),
    []
  );

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const handleCloseModal = () => {
    setOpenModalUpdate(false);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(save)}>
          {target ? (
            <Card className={classes.card}>
              <CardHeader
                title={
                  <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <div className="font-bold text-xl text-gray-500">{"Objective Details"}</div>
                  </Grid>
                }
              />
              <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={4}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                      <Stack spacing={2} direction="row" alignItems={"center"}>
                        <Chip
                          variant="filled"
                          color="success"
                          label={"OBJ"}
                          size="medium"
                          className="w-14 h-14 text-lg"
                        />
                        <div className="flex flex-col gap2">
                          <Stack spacing={2} direction="row" alignItems={"center"}>
                            <Typography variant="h5" gutterBottom className="font-bold cursor-pointer">
                              {target.title}
                            </Typography>
                            <IconButton
                              variant="contained"
                              className="text-[#3f51b5]"
                              onClick={() => {
                                setOpenModalUpdate(true);
                              }}
                              size={"large"}
                            >
                              <EditIcon className="text-[26px]" />
                            </IconButton>
                          </Stack>
                          <div className="flex flex-row gap-3  text-md">
                            <div>{dayjs(target.fromDate).format("MMM Do")}</div>
                            <span>-</span>
                            <div>{dayjs(target.toDate).format("MMM Do")}</div>
                          </div>
                        </div>
                      </Stack>
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>
                  <Box display="flex" flexDirection="column" justifyContent="end" gridRowGap={10}>
                    <Chip label={`${target?.period?.title}`} color={"info"} className="p-5 text-lg" />
                    <Chip
                      label={capitalizeWords(target?.status)}
                      color={getColor(target?.status)}
                      className="p-5 text-lg"
                    />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <div className="flex flex-row gap-2 items-center pl-4">
                    <Slider
                      value={target.progress}
                      disabled
                      thumb={false}
                      marks={false}
                      valueLabelDisplay="auto"
                      min={0}
                      className="!h-5 text-[#1976d2] max-w-[300px] "
                      max={100}
                      step={1}
                    />
                    <div className={"text-[#1976d2] flex flex-row"}>
                      {`${target.progress}`}
                      <span>%</span>{" "}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={8}>
                  <CardContent>
                    <Box display="flex" flexDirection="row" justifyContent="end" gridColumnGap={150}>
                      <div className="flex flex-col gap-2">
                        <div className="text-sm">Type </div>
                        <div>{target?.type}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-sm">Category</div>
                        <div>{target?.targetType?.type}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-sm">Last update </div>
                        <div>{dayjs(target.updateAt).format("MMM DD, YYYY")}</div>
                      </div>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
              <CardActions className={classes.action}></CardActions>
            </Card>
          ) : null}

          <div className="mt-10">
            <Card className={clsx(classes.card)}>
              <CardHeader
                title={
                  <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <div className="font-bold text-xl text-gray-500">{"Key Result"}</div>
                  </Grid>
                }
              />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {keyResults?.map((item, index) => {
                    return (
                      <Grid
                        container
                        spacing={2}
                        key={index}
                        className="pl-10"
                        justifyContent="center"
                        alignItems={"center"}
                      >
                        <Grid item xs={3}>
                          <CardContent>
                            <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                              <Controller
                                control={control}
                                name={`keyResults.${index}.title`}
                                render={({ field }) => (
                                  <>
                                    {item.id < 0 ? (
                                      <TextField
                                        {...field}
                                        value={field.value}
                                        error={errors?.keyResults?.[index]?.title ? true : false}
                                        onChange={(value) => {
                                          field.onChange(value);
                                        }}
                                        label="Title"
                                      />
                                    ) : (
                                      <Stack spacing={2} direction="row" alignItems={"center"} key={id}>
                                        <Chip
                                          variant="filled"
                                          color="warning"
                                          label={"KR"}
                                          size="medium"
                                          sx={{ fontSize: "20px" }}
                                        />

                                        <Typography
                                          variant="h6"
                                          gutterBottom
                                          className="hover:underline cursor-pointer"
                                          onClick={() => {
                                            history.push(`/target/key-result/${id}`);
                                          }}
                                        >
                                          {field.value}
                                        </Typography>
                                      </Stack>
                                    )}
                                  </>
                                )}
                              />
                              <div>{errors?.keyResults?.[index]?.title?.message}</div>
                            </Box>
                          </CardContent>
                        </Grid>

                        <Grid item xs={3}>
                          <CardContent>
                            <Box
                              display="flex"
                              flexDirection="row"
                              justifyContent="center"
                              spacing={10}
                              className={`${item.id < 0 ? "gap-5" : "gap-3"}`}
                            >
                              <Controller
                                control={control}
                                name={`keyResults.${index}.fromDate`}
                                render={({ field }) => (
                                  <>
                                    {item.id < 0 ? (
                                      <TextField
                                        {...field}
                                        label="From Date"
                                        type="date"
                                        value={field.value}
                                        error={errors?.title ? true : false}
                                        onChange={(e) => {
                                          const data = e.target.value;
                                          methods.setValue(`keyResults.${index}.fromDate`, data ? data : null);
                                        }}
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                      />
                                    ) : (
                                      <div>{dayjs(field.value).format("MMM Do")}</div>
                                    )}
                                  </>
                                )}
                              />
                              <div>{errors?.keyResults?.[index]?.fromDate?.message}</div>
                              {item.id > 0 && <span>-</span>}

                              <Controller
                                control={control}
                                name={`keyResults.${index}.toDate`}
                                render={({ field }) => (
                                  <>
                                    {item.id < 0 ? (
                                      <TextField
                                        {...field}
                                        label="To Date"
                                        type="date"
                                        value={field.value}
                                        error={errors?.title ? true : false}
                                        onChange={(e) => {
                                          const data = e.target.value;
                                          methods.setValue(`keyResults.${index}.toDate`, data ? data : null);
                                        }}
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                      />
                                    ) : (
                                      <div>{dayjs(field.value).format("MMM Do")}</div>
                                    )}
                                  </>
                                )}
                              />

                              <div>{errors?.keyResults?.[index]?.toDate?.message}</div>
                            </Box>
                          </CardContent>
                        </Grid>

                        <Grid item xs={3}>
                          <CardContent>
                            <Box display="flex" flexDirection="column" justifyContent="center">
                              <Controller
                                control={control}
                                name={`keyResults.${index}.progress`}
                                render={({ field }) => (
                                  <>
                                    {item.id < 0 ? (
                                      <TextField
                                        {...field}
                                        type="number"
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                                        value={field.value}
                                        error={errors?.title ? true : false}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          methods.setValue(
                                            `keyResults.${index}.progress`,
                                            value ? parseInt(value) : ""
                                          );
                                        }}
                                        label="Progress"
                                      />
                                    ) : (
                                      <div className="flex flex-row gap-2 items-center">
                                        <Slider
                                          value={field.value}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            methods.setValue(`keyResults.${index}.progress`, value);
                                            handleUpdateProgress(item.id, value);
                                          }}
                                          valueLabelDisplay="auto"
                                          min={0}
                                          className="!h-4"
                                          max={100}
                                          step={1}
                                        />
                                        <div className={"text-[#1976d2] flex flex-row"}>
                                          {`${field.value}`}
                                          <span>%</span>{" "}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              />
                            </Box>
                          </CardContent>
                        </Grid>

                        <Grid item xs={3} className="pl-5">
                          <IconButton
                            variant="contained"
                            color="error"
                            onClick={() => {
                              remove(index);
                              if (item.id > 0) {
                                removeKeyResult(item.id);
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>

                        <Grid item xs={12}>
                          <Divider variant="middle" />
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
              <CardActions className={classes.action}>
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    append({
                      id: -1,
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
          </div>
        </form>
      </FormProvider>
      <TargetResult />
      <TargetComment owner={target?.user?.id} />
      <ModalUpdateTarget isOpen={openModalUpdate} handleClose={handleCloseModal} />
    </>
  );
};

export default TargetDetail;
