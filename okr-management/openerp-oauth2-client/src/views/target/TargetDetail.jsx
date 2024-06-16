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
import FormItem from "components/form/FormItem";
import ModalUpdateKR from "components/modal/ModalUpdateKeyResult";
import ModalUpdateTarget from "components/modal/ModalUpdateTarget";
import TargetAlign from "components/target/TargetAlign";
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

// show reviewer
// show alignment
const TargetDetail = ({ isOpen, handleSuccess, handleClose }) => {
  const classes = useStyles();
  const router = useParams();
  const history = useHistory();
  const id = router.id;
  const queryClient = useQueryClient();
  const [kr, setKr] = useState(null);

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
    keyResultId: z.number().optional().nullable(),
    parentId: z.number().optional().nullable(),
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
          weighted: z.number({
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
          weighted: z.number({
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

  const { data: users } = useQuery({
    queryKey: ["user-option-cascade"],
    queryFn: async () => {
      const res = await request("GET", `/teams/members`, null, null, null, {});
      return res.data.members;
    },
    enabled: true,
  });

  const userOptions = users?.length
    ? users.map((item) => {
        return { label: item.user.email, value: item.userId };
      })
    : [];

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
        // if (key === "keyResults") {
        //   keyResultMethods.setValue(key, value);
        // }
        if (value) methods.setValue(key, value);
      });
      target.keyResults.forEach((item, index) => {
        methods.setValue(`keyResults.${index}.title`, item.title);
        methods.setValue(`keyResults.${index}.fromDate`, item.fromDate ? item.fromDate : null);
        methods.setValue(`keyResults.${index}.toDate`, item.toDate ? item.toDate : null);
        methods.setValue(`keyResults.${index}.progress`, item.progress);
        methods.setValue(`keyResults.${index}.weighted`, item.weighted);
      });
    }
  }, [keyResultMethods, methods, target]);

  const {
    control,
    handleSubmit,

    formState: { errors },
  } = methods;

  const { append, remove } = useFieldArray({ control, name: "keyResults" });

  const save = async (values) => {
    const weight = values.keyResults.reduce((acc, item) => acc + item.weighted, 0);

    if (weight > 100 && values.keyResults.length > 0) {
      errorNoti("Weight must sum up to 100!", 3000);
      return;
    }
    const data = values.keyResults.filter((item) => item.id < 0);
    if (data.length === 0) {
      return;
    }

    let successHandler = (res) => {
      queryClient.invalidateQueries(["targets-detail"]);
      successNoti("Add key result successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("post", `/targets/${id}/key-results`, successHandler, errorHandlers, data);
  };

  const removeKeyResult = (id) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["targets-detail"]);
      successNoti("Update target successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("delete", `/targets/key-result/${id}`, successHandler, errorHandlers, {});
  };

  const updateKeyResult = (key, progress) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["target-detail"]);
      successNoti("Update key result successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    //todo update path: target/key-result/key
    request("patch", `/targets/key-result/${key}`, successHandler, errorHandlers, { progress: progress });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdateProgress = useCallback(
    debounce((key, progress) => updateKeyResult(key, progress), DEBOUNCE_TIMEOUT),
    []
  );

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const handleCloseModal = () => {
    setOpenModalUpdate(false);
  };

  const [openModalKR, setOpenModalKR] = useState(false);
  const handleCloseModalKR = () => {
    setOpenModalKR(false);
  };

  const [user, setUser] = useState(null);

  const getCascade = async (id) => {
    const res = await request("GET", `/targets/cascade/${id}`, null, null, null, {});
    console.log(res.data.user.id);
    return res.data?.user?.id;
  };

  const handleCascade = (keyResultId) => {
    if (!user) {
      errorNoti("Select user first", 3000);
      return;
    }
    let successHandler = (res) => {
      queryClient.invalidateQueries(["targets-detail"]);
      successNoti("Cascade successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("post", `/targets/cascade`, successHandler, errorHandlers, { keyResultId: keyResultId, userId: user });
  };

  const handleRemoveCascade = (keyResultId) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["targets-detail"]);
      successNoti("Cascade remove successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("patch", `/targets/cascade/${keyResultId}`, successHandler, errorHandlers, null);
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
                            <div>{target?.fromDate && dayjs(target.fromDate).format("MMM Do")}</div>
                            <span>-</span>
                            <div>{target?.toDate && dayjs(target.toDate).format("MMM Do")}</div>
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
                  <div className="flex flex-row gap-2 items-center pl-6">
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
                <Grid item xs={2}>
                  {target?.team && (
                    <>
                      <Box display="flex" flexDirection="row" gridColumnGap={60}>
                        <div className="flex flex-col gap-2">
                          <div className="text-sm">Team </div>
                          <div>{target?.team?.name}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="text-sm">Department</div>
                          <div>{target?.team?.department?.name}</div>
                        </div>
                      </Box>
                    </>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <CardContent>
                    <Box display="flex" flexDirection="row" justifyContent="end" gridColumnGap={100}>
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
                <Grid item xs={12} className="ml-4">
                  {keyResults?.map((item, index) => {
                    return (
                      <Grid
                        container
                        spacing={2}
                        key={item.id}
                        className=""
                        justifyContent="start"
                        alignItems={"center"}
                      >
                        <Grid item xs={2}>
                          <CardContent>
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="start"
                              alignItems={"start"}
                              aria-label="Room"
                            >
                              <Controller
                                control={control}
                                name={`keyResults.${index}.title`}
                                render={({ field }) => (
                                  <>
                                    {item.id < 0 ? (
                                      <FormItem label="Title">
                                        <TextField
                                          {...field}
                                          value={field.value}
                                          error={errors?.keyResults?.[index]?.title ? true : false}
                                          onChange={(value) => {
                                            field.onChange(value);
                                          }}
                                        />
                                      </FormItem>
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
                                            history.push(`/target/key-result/${item.id}`);
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
                                      <FormItem label="From Date">
                                        <TextField
                                          {...field}
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
                                      </FormItem>
                                    ) : (
                                      <div>{field.value && dayjs(field.value).format("MMM Do")}</div>
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
                                      <FormItem label="To Date">
                                        <TextField
                                          {...field}
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
                                      </FormItem>
                                    ) : (
                                      <div>{field.value && dayjs(field.value).format("MMM Do")}</div>
                                    )}
                                  </>
                                )}
                              />

                              <div>{errors?.keyResults?.[index]?.toDate?.message}</div>
                            </Box>
                          </CardContent>
                          {openModalKR && kr && (
                            <ModalUpdateKR
                              id={kr}
                              isOpen={openModalKR}
                              handleClose={handleCloseModalKR}
                              key={item.id}
                            />
                          )}
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
                                      <FormItem label="Progress">
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
                                        />
                                      </FormItem>
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
                        <Grid item xs={2}>
                          <CardContent>
                            <Box display="flex" flexDirection="column" justifyContent="center">
                              <Controller
                                control={control}
                                name={`keyResults.${index}.weighted`}
                                render={({ field }) => (
                                  <>
                                    {item.id < 0 ? (
                                      <FormItem label="Weighted">
                                        <TextField
                                          {...field}
                                          type="number"
                                          InputProps={{ inputProps: { min: 0, max: 100 } }}
                                          value={field.value}
                                          error={errors?.keyResults?.[index]?.weighted ? true : false}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            methods.setValue(
                                              `keyResults.${index}.weighted`,
                                              value ? parseInt(value) : ""
                                            );
                                          }}
                                        />
                                      </FormItem>
                                    ) : (
                                      <div className="flex flex-row gap-2 items-center">
                                        Weight:
                                        <div className={"text-[#1976d2] flex flex-row"}>{`${field.value}`}</div>
                                      </div>
                                    )}
                                  </>
                                )}
                              />
                              <div>{errors?.keyResults?.[index]?.weighted?.message}</div>
                            </Box>
                          </CardContent>
                        </Grid>

                        <Grid item xs={1} className="flex flex-row gap-1">
                          <IconButton
                            key={item.id}
                            onClick={() => {
                              setOpenModalKR(true);
                              setKr(item.id);
                            }}
                            variant="contained"
                            color="success"
                          >
                            <EditIcon />
                          </IconButton>
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

                        {/* <Grid item xs={12} className="ml-5">
                          <div className="flex flex-row gap-5">
                            <Select
                              labelId="demo-simple-select"
                              value={target.keyResultId ?? ""}
                              placeholder="Select user"
                              className="min-w-[200px] w-fit"
                              // readOnly
                              size="small"
                              onChange={(e) => {
                                setUser(e.target.value);
                                console.log(e.target.value);
                              }}
                              displayEmpty
                              style={{ padding: "0px 0 0 0px" }}
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
                            <Button
                              variant="contained"
                              color="primary"
                             
                              style={{ textTransform: "none" }}
                              onClick={() => {
                                handleCascade(item.id);
                              }}
                            >
                              Cascade
                            </Button>
                            <Button
                              
                              variant="contained"
                              className="bg-red-500 text-white"
                              style={{ textTransform: "none" }}
                              onClick={() => {
                                // tao them man key result to remove cascade align
                                // dashboard
                                handleRemoveCascade(item.id);
                              }}
                            >
                              Remove Cascade
                            </Button>
                            <Button
                              variant="contained"
                              key={item.id}
                              className="bg-red-500 text-white"
                              style={{ textTransform: "none" }}
                              onClick={() => {
                                getCascade(item.id);
                              }}
                            >
                              Get Cascade
                            </Button>
                          </div>
                        </Grid> */}

                        <Grid item xs={12} className="mt-5">
                          <Divider variant="middle" />
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
              <CardActions className={classes.action}>
                <Button type="submit" variant="contained" color="primary" style={{ textTransform: "none" }}>
                  Update
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  style={{ textTransform: "none" }}
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
      {target?.type === "PERSONAL" && (
        <>
          <TargetResult employeeId={target?.user?.id} />
        </>
      )}
      <TargetComment owner={target?.user?.id} />
      {openModalUpdate && <ModalUpdateTarget isOpen={openModalUpdate} handleClose={handleCloseModal} />}
      <div className="mt-10">
        <Card className={classes.card}>
          <CardHeader
            title={
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <div className="font-bold text-xl text-gray-500">{"Target Alignment"}</div>
              </Grid>
            }
          />
          <TargetAlign target={target} />
          <CardActions className={classes.action}></CardActions>
        </Card>
      </div>
    </>
  );
};

export default TargetDetail;
