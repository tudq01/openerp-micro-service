import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Fade, Modal } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, TextField } from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import FormItem from "components/form/FormItem";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { errorNoti, successNoti } from "utils/notification";
import { capitalizeWords } from "views/target/TargetScreen";
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

const ModalUpdateTarget = ({ isOpen, handleClose }) => {
  const classes = useStyles();
  const router = useParams();

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
    fromDate: z.string().optional().nullable(),
    teamId: z.number().optional().nullable(),
    toDate: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    targetCategoryId: z.number().optional().nullable(),
    keyResultId: z.number().optional().nullable(),
    parentId: z.number().optional().nullable(),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormState,
  });

  const { data: targetCategory } = useQuery({
    queryKey: ["target-category"],
    queryFn: async () => {
      const res = await request("GET", `/targets/categories`, null, null, null, { page: 0, size: 20 });
      return res?.data?.categories;
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

  const categoryOptions = targetCategory?.length
    ? targetCategory.map((item) => {
        return { label: item.type, value: item.id };
      })
    : [];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const save = async (values) => {
    let successHandler = () => {
      queryClient.invalidateQueries(["targets-detail"]);
      successNoti("Update key result successfully!", 3000);
      //   handleClose()
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("patch", `/targets/${id}`, successHandler, errorHandlers, values);
  };

  const { data: periods } = useQuery({
    queryKey: ["target-period-select"],
    queryFn: async () => {
      let errorHandlers = {
        onError: () => errorNoti("Error loading data", 3000),
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

  const [keyword, setKeyword] = useState(null);
  const { data: parentTarget } = useQuery({
    queryKey: ["user-targets-teams-member", keyword],
    queryFn: async () => {
      // let successHandler = (res) => {
      //   setTarget(res);
      // };
      let errorHandlers = {
        onError: (error) => errorNoti("Error loading data", 3000),
      };

      const res = await request("GET", `/teams/me`, null, errorHandlers, null, {});
      if (!res.data?.teamId) return [];

      const teams = await request("GET", `/targets/team`, null, errorHandlers, null, {
        params: {
          periodId: target.periodId,
          keyword: keyword,
          page: 0,
          size: 5,
          teamId: res.data.teamId,
          type: "DEPARTMENT",
        },
      });
      return teams.data.targets;
    },
    enabled: !!target,
  });

  const parentOptions = parentTarget?.length
    ? parentTarget.map((item) => {
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
                        <FormItem label="Title">
                          <Controller
                            control={control}
                            name={"title"}
                            render={({ field }) => (
                              <>
                                <TextField
                                  {...field}
                                  size="small"
                                  id="name"
                                  value={field.value}
                                  error={errors?.title ? true : false}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                />
                              </>
                            )}
                          />
                          <div>{errors?.title?.message}</div>
                        </FormItem>
                      </Box>
                    </CardContent>
                  </Grid>
                  <Grid item xs={4}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" justifyContent="center">
                        <FormItem label="Period">
                          <Controller
                            control={control}
                            name={"periodId"}
                            render={({ field }) => (
                              <>
                                <Select
                                  labelId="demo-simple-period"
                                  value={field.value ?? ""}
                                  size="small"
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                  displayEmpty
                                >
                                  {userOptions?.map((item) => (
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
                        </FormItem>
                      </Box>
                    </CardContent>
                  </Grid>
                  <Grid item xs={4}>
                    {target?.type === "PERSONAL" && (
                      <>
                        <CardContent>
                          <Box display="flex" flexDirection="column" justifyContent="center">
                            <FormItem label="Align Target">
                              <Controller
                                control={control}
                                name={"parentId"}
                                render={({ field }) => (
                                  <>
                                    <Select
                                      labelId="parent"
                                      value={field.value ?? ""}
                                      size="small"
                                      endAdornment={
                                        <IconButton
                                          className="mr-6"
                                          size="small"
                                          onClick={() => {
                                            methods.setValue("parentId", null);
                                          }}
                                        >
                                          <ClearIcon fontSize="small" />
                                        </IconButton>
                                      }
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                      }}
                                      displayEmpty
                                    >
                                      {parentOptions?.map((item) => (
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
                              <div>{errors?.parentId?.message}</div>
                            </FormItem>
                          </Box>
                        </CardContent>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" justifyContent="center">
                        <FormItem label="Progress">
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
                                />
                              </>
                            )}
                          />
                        </FormItem>
                      </Box>
                    </CardContent>
                  </Grid>
                  <Grid item xs={8}></Grid>
                  <Grid item xs={4}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" justifyContent="center">
                        <FormItem label="From Date">
                          <Controller
                            control={control}
                            name={"fromDate"}
                            render={({ field }) => (
                              <>
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
                                    field.onChange(value);
                                  }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </>
                            )}
                          />
                        </FormItem>
                      </Box>
                    </CardContent>
                  </Grid>

                  <Grid item xs={4}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" justifyContent="center">
                        <FormItem label="To Date">
                          <Controller
                            control={control}
                            name={"toDate"}
                            render={({ field }) => (
                              <>
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
                              </>
                            )}
                          />
                        </FormItem>
                      </Box>
                    </CardContent>
                  </Grid>
                  <Grid item xs={4}></Grid>

                  <Grid item xs={4}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" justifyContent="center">
                        <FormItem label="Status">
                          <Controller
                            control={control}
                            name={"status"}
                            render={({ field }) => (
                              <>
                                <Select
                                  labelId="demo-simple-select"
                                  id="status"
                                  value={field.value ?? ""}
                                  // readOnly

                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                  displayEmpty
                                  style={{ padding: "5px 0 0 10px" }}
                                >
                                  {TARGET_STATUS.map((item) => (
                                    <MenuItem value={item} key={item} style={{ display: "block", padding: "8px" }}>
                                      {capitalizeWords(item)}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </>
                            )}
                          />
                        </FormItem>
                      </Box>
                    </CardContent>
                  </Grid>
                  <Grid item xs={4}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" justifyContent="center">
                        <FormItem label="Type">
                          <Controller
                            control={control}
                            name={"type"}
                            render={({ field }) => (
                              <>
                                <Select
                                  labelId="select-type"
                                  value={field.value ?? ""}
                                  disabled
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                  displayEmpty
                                  style={{ padding: "5px 0 0 10px" }}
                                >
                                  {TARGET_TYPE.map((item) => (
                                    <MenuItem value={item} key={item} style={{ display: "block", padding: "8px" }}>
                                      {capitalizeWords(item)}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </>
                            )}
                          />
                        </FormItem>
                      </Box>
                    </CardContent>
                  </Grid>
                  <Grid item xs={4}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" justifyContent="center">
                        <FormItem label="Category">
                          <Controller
                            control={control}
                            name={"targetCategoryId"}
                            render={({ field }) => (
                              <>
                                <Select
                                  labelId="select-cate"
                                  value={field.value ?? ""}
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
                                      {capitalizeWords(item.label)}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </>
                            )}
                          />
                        </FormItem>
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
                    style={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary" style={{ textTransform: "none" }}>
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
