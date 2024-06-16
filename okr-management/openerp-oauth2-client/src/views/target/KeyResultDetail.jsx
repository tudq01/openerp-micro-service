import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Popper } from "@mui/base/Popper";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Chip, IconButton, Slider, Stack, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import clsx from "clsx";
import ModalKRToObjective from "components/modal/kr-to-team/ModalKRToObjective";
import ModalUpdateKR from "components/modal/ModalUpdateKeyResult";
import TargetAlign from "components/target/TargetAlign";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

const initialFormState = { progress: 0, status: "NOT_STARTED", type: "PERSONAL" };

const KeyResultDetail = ({ isOpen, handleSuccess, handleClose }) => {
  const classes = useStyles();
  const router = useParams();
  const history = useHistory();
  const id = router.id;
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

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

  const { data: keyResult } = useQuery({
    queryKey: ["key-result-detail", id],
    queryFn: async () => {
      const res = await request("GET", `/targets/key-result/${id}`, null, null, null, {});
      return res.data;
    },
    enabled: !!id,
  });

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const handleCloseModal = () => {
    setOpenModalUpdate(false);
  };

  const [openModalUpdateKR, setOpenModalUpdateKR] = useState(false);
  const handleCloseModalKR = () => {
    setOpenModalUpdateKR(false);
  };

  const [user, setUser] = useState(null);

  const { data: cascade } = useQuery({
    queryKey: ["option-cascade"],
    queryFn: async () => {
      const res = await request("GET", `/targets/cascade/${id}`, null, null, null, {});
      return res.data;
    },
    enabled: true,
  });

  const handleCascade = (keyResultId) => {
    if (!user) {
      errorNoti("Select user first", 3000);
      return;
    }
    let successHandler = (res) => {
      queryClient.invalidateQueries(["option-cascade"]);
      successNoti("Cascade successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("post", `/targets/cascade`, successHandler, errorHandlers, { keyResultId: keyResultId, userId: user });
  };

  const handleCascadeTeam = (keyResultId) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["option-cascade"]);
      successNoti("Cascade successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("post", `/targets/key-result/${keyResultId}/cascade-team`, successHandler, errorHandlers, { userId: user });
  };

  const handleRemoveCascade = (keyResultId) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["option-cascade"]);
      successNoti("Cascade remove successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("patch", `/targets/cascade/${keyResultId}`, successHandler, errorHandlers, null);
  };

  const handleConvertObj = (keyResultId) => {
    let successHandler = (res) => {
      successNoti("Cascade convert successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("post", `/targets/key-result/${keyResultId}/objective`, successHandler, errorHandlers, null).then((res) =>
      history.push(`/target/${res.data.id}`)
    );
  };

  return (
    <>
      {keyResult ? (
        <Card className={classes.card}>
          <CardHeader
            title={
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <div className="font-bold text-xl text-gray-500">{"Key Result Details"}</div>
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
                      label={"KR"}
                      size="medium"
                      className="w-14 h-14 text-lg bg-yellow-400 text-white"
                    />
                    <div className="flex flex-col gap2">
                      <Stack spacing={2} direction="row" alignItems={"center"}>
                        <Typography variant="h5" gutterBottom className="font-bold cursor-pointer">
                          {keyResult.title}
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
                        <div>{keyResult?.fromDate && dayjs(keyResult.fromDate).format("MMM Do")}</div>
                        <span>-</span>
                        <div>{keyResult?.toDate && dayjs(keyResult.toDate).format("MMM Do")}</div>
                      </div>
                    </div>
                  </Stack>
                </Box>
              </CardContent>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={2}>
              <div onClick={handleClick} className="flex justify-end">
                <MoreVertIcon />
                <Popper open={open} anchorEl={anchorEl} placement="bottom-end" className="z-10">
                  <div className="flex flex-col gap-2 w-[300px] h-[200px] bg-[#f9f9f9] shadow-md p-5 cursor-pointer">
                    <div className="flex flex-row gap-2 ">
                      <Button
                        variant="text"
                        color="primary"
                        startIcon={<EditIcon />}
                        style={{ textTransform: "none" }}
                        onClick={() => {
                          setOpenModalUpdateKR(true);
                        }}
                      >
                        Convert to Objective
                      </Button>
                      <div className="font-bold">
                        <span>{}</span>
                      </div>
                    </div>
                    <Divider variant="fullWidth" className="my-2" />
                  </div>
                </Popper>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="flex flex-row gap-2 items-center pl-6">
                <Slider
                  value={keyResult.progress}
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
                  {`${keyResult.progress}`}
                  <span>%</span>{" "}
                </div>
              </div>
            </Grid>

            <Grid item xs={8}>
              <CardContent>
                <Box display="flex" flexDirection="row" justifyContent="end" gridColumnGap={150}>
                  <div className="flex flex-col gap-2">
                    {/* <div className="text-sm">Type </div> */}
                    {/* <div>{keyResult?.type}</div> */}
                  </div>
                  <div className="flex flex-col gap-2">{/* <div>{keyResult?.targetType?.type}</div> */}</div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm">Last update </div>
                    <div>{dayjs(keyResult.updateAt).format("MMM DD, YYYY")}</div>
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
                <div className="font-bold text-xl text-gray-500">{"Key Result Cascade"}</div>
              </Grid>
            }
          />
          <Grid container spacing={2}>
            <Grid item xs={12} className="ml-5">
              <div className="flex flex-row gap-5 h-[45px]">
                <Select
                  labelId="demo-simple-select"
                  value={cascade?.user?.id ?? user ?? ""}
                  placeholder="Select user"
                  className="min-w-[200px] w-fit"
                  size="small"
                  onChange={(e) => {
                    setUser(e.target.value);
                  }}
                  displayEmpty
                  style={{ padding: "0px 0 0 0px" }}
                >
                  {userOptions.map((item) => (
                    <MenuItem value={item.value} key={item.value} style={{ display: "block", padding: "8px" }}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!!cascade?.user?.id}
                  style={{ textTransform: "none" }}
                  onClick={() => {
                    handleCascade(keyResult.id);
                  }}
                >
                  Cascade to Personal Objective
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!!cascade?.user?.id}
                  style={{ textTransform: "none" }}
                  onClick={() => {
                    handleCascadeTeam(keyResult.id);
                  }}
                >
                  Cascade to Team Objective
                </Button>
                <Button
                  variant="contained"
                  className="bg-red-500 text-white"
                  style={{ textTransform: "none" }}
                  onClick={() => {
                    handleRemoveCascade(keyResult.id);
                  }}
                >
                  Remove Cascade
                </Button>
              </div>
            </Grid>
          </Grid>
          <CardActions className={classes.action}></CardActions>
        </Card>
      </div>

      <div className="mt-10">
        <Card className={classes.card}>
          <CardHeader
            title={
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <div className="font-bold text-xl text-gray-500">{"Target Alignment"}</div>
              </Grid>
            }
          />
          <TargetAlign target={cascade} />
          <CardActions className={classes.action}></CardActions>
        </Card>
      </div>
      {openModalUpdate && <ModalUpdateKR isOpen={openModalUpdate} handleClose={handleCloseModal} id={id} />}
      {openModalUpdateKR && (
        <ModalKRToObjective
          isOpen={openModalUpdateKR}
          handleClose={handleCloseModalKR}
          onConfirm={() => {
            handleConvertObj(keyResult?.id);
          }}
        />
      )}
    </>
  );
};

export default KeyResultDetail;
