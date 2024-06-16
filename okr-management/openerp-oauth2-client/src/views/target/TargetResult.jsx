import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, CardHeader, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@mui/icons-material/Clear";
import { Avatar, IconButton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import FormItem from "components/form/FormItem";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import randomColor from "randomcolor";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getDirtyFields } from "utils/date";
import { errorNoti, successNoti } from "utils/notification";
import * as z from "zod";
const bgColor = randomColor({
  luminosity: "dark",
  hue: "random",
});
dayjs.extend(advancedFormat);
const useStyles = makeStyles((theme) => ({
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
}));

const DEBOUNCE_TIMEOUT = 500;

const TargetResult = (employeeId) => {
  const classes = useStyles();
  const router = useParams();
  const history = useHistory();
  const id = router.id;
  const queryClient = useQueryClient();

  const TARGET_RANK = ["A", "B", "C", "D"];

  const schema = z.object({
    selfComment: z.string().optional().nullable(),
    selfRank: z.string().optional().nullable(),
    managerComment: z.string().optional().nullable(),
    managerRank: z.string().optional().nullable(),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { data: target } = useQuery({
    queryKey: ["target-detail-result", id],
    queryFn: async () => {
      const res = await request("GET", `/targets/${id}/result`, null, null, null, {});
      if (!res.data) return null;
      return res.data[0];
    },
    enabled: !!id,
  });

  const { data: managers } = useQuery({
    queryKey: ["your-manager", employeeId],
    queryFn: async () => {
      const res = await request("GET", `/users/your-manager`, null, null, null, { params: employeeId });
      return res.data;
    },
    enabled: true,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = methods;

  useEffect(() => {
    if (target) {
      Object.entries(target).forEach(([key, value]) => {
        if (value) methods.setValue(key, value);
      });
    }
  }, [methods, target]);

  const save = async (values) => {
    const data = getDirtyFields(values, dirtyFields);
    console.log(data);
    let successHandler = (res) => {
      reset();
      queryClient.invalidateQueries(["target-detail-result"]);
      successNoti("Add target judgement successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };
    if (target?.id) {
      updateTargetResult(target.id, data);
    } else {
      request("post", `/targets/${id}/result`, successHandler, errorHandlers, values); // user k dc viet vao phan nhan xet cua admin
    }
  };

  const updateTargetResult = (resultId, values) => {
    let successHandler = (res) => {
      reset();
      queryClient.invalidateQueries(["target-detail-result"]);
      successNoti("Update target result successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("patch", `/targets/${resultId}/result`, successHandler, errorHandlers, values);
  };
  // show manager to detail screen
  return (
    <>
      <div className="mt-10">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(save)}>
            <Card className={classes.card}>
              <CardHeader
                title={
                  <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <div className="font-bold text-xl text-gray-500">{"Target Result"}</div>
                  </Grid>
                }
              />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div className="pl-4 flex flex-col gap-3 flex-start">
                    <span>Manager</span>
                    <div className="flex flex-row gap-2 items-center">
                      <IconButton disableRipple component="span" aria-haspopup="true" sx={{ p: 1 }}>
                        <Avatar alt="account button" sx={{ width: 36, height: 36, background: bgColor }}>
                          {managers?.manager?.lastName?.split(" ").pop().substring(0, 1).toLocaleUpperCase()}
                        </Avatar>
                      </IconButton>
                      <span>{managers?.manager?.firstName + " " + managers?.manager?.lastName}</span>
                    </div>
                  </div>
                </Grid>

                <Grid item xs={8}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                      <Controller
                        control={control}
                        name={"selfComment"}
                        render={({ field }) => (
                          <>
                            <FormItem label="Your comment">
                              <TextField
                                {...field}
                                id="name"
                                value={field.value}
                                error={errors?.selfComment ? true : false}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                InputLabelProps={{ shrink: true }}
                              />
                            </FormItem>
                          </>
                        )}
                      />
                      <div>{errors?.selfComment?.message}</div>
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={4}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                      <Controller
                        control={control}
                        name={"selfRank"}
                        render={({ field }) => (
                          <>
                            <FormItem label="Self Rank">
                              <Select
                                labelId="demo-simple-select-rank"
                                id="your-rank"
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                                endAdornment={
                                  methods.watch("selfRank") && (
                                    <IconButton
                                      className="mr-6"
                                      size="small"
                                      onClick={() => {
                                        methods.setValue("selfRank", null);
                                      }}
                                    >
                                      <ClearIcon fontSize="small" />
                                    </IconButton>
                                  )
                                }
                                displayEmpty
                                style={{ padding: "5px 0 0 10px" }}
                              >
                                {TARGET_RANK.map((item) => (
                                  <MenuItem value={item} key={item} style={{ display: "block", padding: "8px" }}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormItem>
                          </>
                        )}
                      />
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={8}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                      <Controller
                        control={control}
                        name={"managerComment"}
                        render={({ field }) => (
                          <>
                            <FormItem label="Manager comment">
                              <TextField
                                {...field}
                                id="name"
                                value={field.value}
                                error={errors?.managerComment ? true : false}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                InputLabelProps={{ shrink: true }}
                              />
                            </FormItem>
                          </>
                        )}
                      />
                      <div>{errors?.managerComment?.message}</div>
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={4}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                      <Controller
                        control={control}
                        name={"managerRank"}
                        render={({ field }) => (
                          <>
                            <FormItem label="Manager Rank">
                              <Select
                                labelId="demo-simple-manager-rank"
                                id="manager-rank"
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                                endAdornment={
                                  methods.watch("managerRank") && (
                                    <IconButton
                                      className="mr-6"
                                      size="small"
                                      onClick={() => {
                                        methods.setValue("managerRank", null);
                                      }}
                                    >
                                      <ClearIcon fontSize="small" />
                                    </IconButton>
                                  )
                                }
                                displayEmpty
                                style={{ padding: "5px 0 0 10px" }}
                              >
                                {TARGET_RANK.map((item) => (
                                  <MenuItem value={item} key={item} style={{ display: "block", padding: "8px" }}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
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
                <Button type="button" variant="contained" color="default" style={{ textTransform: "none" }}>
                  Reset
                </Button>
                <Button type="submit" variant="contained" color="primary" style={{ textTransform: "none" }}>
                  {target ? "Update" : "Add"}
                </Button>
              </CardActions>
            </Card>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default TargetResult;
