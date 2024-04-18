import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, CardHeader, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getDirtyFields } from "utils/date";
import { errorNoti, successNoti } from "utils/notification";
import * as z from "zod";

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

const TargetResult = () => {
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (target) {
      Object.entries(target).forEach(([key, value]) => {
        if (value) methods.setValue(key, value);
      });
    }
  }, [methods, target]);

  const save = async (values) => {
    const data = getDirtyFields(values, methods.formState.dirtyFields);
    console.log(data);
    let successHandler = (res) => {
      queryClient.invalidateQueries(["target-detail-result"]);
      successNoti("Add target judgement successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti("Error create!", 3000),
    };
    if (target?.id) {
      updateTargetResult(target.id, data);
    } else {
      request("post", `/targets/${id}/result`, successHandler, errorHandlers, data);
    }
  };

  const updateTargetResult = (resultId, values) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["target-detail-result"]);
      successNoti("Update target result successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => {
        console.log(error)
        errorNoti("Error update!", 3000)},
    };

    request("patch", `/targets/${resultId}/result`, successHandler, errorHandlers, values);
  };

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
                <Grid item xs={8}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                      <Controller
                        control={control}
                        name={"selfComment"}
                        render={({ field }) => (
                          <>
                            <TextField
                              {...field}
                              id="name"
                              value={field.value}
                              error={errors?.selfComment ? true : false}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Your comment"
                              InputLabelProps={{ shrink: true }}
                            />
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
                            <InputLabel
                              id="demo-simple-select-rank"
                              style={{ paddingBottom: "3px", paddingLeft: "10px" }}
                            >
                              Self Rank
                            </InputLabel>

                            <Select
                              labelId="demo-simple-select-rank"
                              id="your-rank"
                              value={field.value ?? ""}
                              // readOnly
                              label="Status"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                              displayEmpty
                              style={{ padding: "5px 0 0 10px" }}
                            >
                              {TARGET_RANK.map((item) => (
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
                <Grid item xs={8}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                      <Controller
                        control={control}
                        name={"managerComment"}
                        render={({ field }) => (
                          <>
                            <TextField
                              {...field}
                              id="name"
                              value={field.value}
                              error={errors?.managerComment ? true : false}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Manager comment"
                              InputLabelProps={{ shrink: true }}
                            />
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
                            <InputLabel
                              id="demo-simple-manager-rank"
                              style={{ paddingBottom: "3px", paddingLeft: "10px" }}
                            >
                              Manager Rank
                            </InputLabel>

                            <Select
                              labelId="demo-simple-manager-rank"
                              id="manager-rank"
                              value={field.value ?? ""}
                              // readOnly
                              label="Status"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                              displayEmpty
                              style={{ padding: "5px 0 0 10px" }}
                            >
                              {TARGET_RANK.map((item) => (
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

                <Grid item xs={4}></Grid>
              </Grid>
              <CardActions className={classes.action}>
                <Button type="button" variant="contained" color="default">
                  Reset
                </Button>
                <Button type="submit" variant="contained" color="primary">
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
