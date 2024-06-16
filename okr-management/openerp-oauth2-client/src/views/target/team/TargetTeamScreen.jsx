import { TextField } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Chip, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import ModalAddTargetTeam from "components/modal/team/ModalAddTeamTarget";
import SelectPeriod from "components/select/SelectPeriod";
import dayjs from "dayjs";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { debounce } from "lodash";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { formatDate } from "utils/date";
import { errorNoti, successNoti } from "utils/notification";
import { TARGET_STATUS } from "utils/StatusEnum";
import { caculateScore } from "../TargetScreen";
export const capitalizeWords = (str) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getColor = (status) => {
  switch (status) {
    case TARGET_STATUS.NOT_STARTED:
      return "default";
    case TARGET_STATUS.APPROVE:
      return "success";
    case TARGET_STATUS.REJECT:
      return "error";
    case TARGET_STATUS.IN_PROGRESS:
      return "primary";
    case TARGET_STATUS.WAIT_REVIEW:
      return "warning";
    case TARGET_STATUS.CLOSED:
      return "default";
    default:
      return "default";
  }
};

const initState = { periodId: null, keyword: null, userId: null, fromDate: null, toDate: null, page: 0, size: 5 };
const TargetTeamScreen = () => {
  const [filterParams, setFilterParams] = useState(initState);
  const [detailId, setDetail] = useState();
  const queryClient = useQueryClient();
  const history = useHistory();

  const [openModalAddHall, setOpenModalAddHall] = useState(false);
  const handleCloseModal = () => {
    setOpenModalAddHall(false);
  };

  const { data } = useQuery({
    queryKey: ["user-targets-teams", filterParams],
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
        params: { ...filterParams, teamId: res.data.teamId, type: "PERSONAL" },
      });
      return teams.data;
    },
    enabled: !!filterParams.periodId,
  });

  function deleteHall(deletedId) {
    let successHandler = () => {
      successNoti("Delete successfully");
      queryClient.invalidateQueries(["user-targets-teams"]);
      // const item = halls.content.filter((item) => item.id !== deletedPermission);

      // setHall({
      //   content: item,
      //   totalElements: item.length,
      // });
    };
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi "),
    };
    request("DELETE", `/targets/${deletedId}`, successHandler, errorHandlers);
  }

  const columns = [
    {
      title: "Title",
      field: "title",
      cellStyle: {
        width: "25%",
      },
      render: (data) => {
        return (
          <>
            <Stack spacing={2} direction="row" alignItems={"center"}>
              <Chip variant="filled" color="success" label={"OBJ"} size="small" />
              <Typography
                variant="h6"
                gutterBottom
                className="hover:underline cursor-pointer"
                onClick={() => {
                  history.push(`/target/${data.id}`);
                }}
              >
                {data.title}
              </Typography>
            </Stack>
          </>
        );
      },
    },
    {
      title: "Progress",
      field: "progress",
      cellStyle: {
        width: "12%",
      },
      render: (rowData) => (
        <>
          <Stack spacing={2} direction="row">
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                disableShrink
                variant="determinate"
                thickness={4}
                size={55}
                value={rowData.progress}
                color={`${rowData.progress === 100 ? "success" : "primary"}`}
              ></CircularProgress>
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" component="div" color="text.primary" className="text-base">
                  {`${Math.round(rowData.progress)}%`}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </>
      ),
    },
    {
      title: "From",
      field: "fromDate",
      cellStyle: {
        width: "11%",
      },
      render: (rowData) => <>{formatDate(rowData.fromDate)}</>,
    },
    {
      title: "To",
      field: "toDate",
      cellStyle: {
        width: "11%",
      },
      render: (rowData) => <>{formatDate(rowData.toDate)}</>,
    },
    {
      title: "Status",
      field: "status",
      cellStyle: {
        width: "12%",
      },
      render: (data) => (
        <>
          <Chip label={capitalizeWords(data.status)} color={getColor(data.status)} />
        </>
      ),
      // default,error,info,primary,secondary,success,warning
    },
    {
      title: "Owner",
      field: "owner",
      cellStyle: {
        width: "10%",
      },
      render: (data) => (
        <>
          <div>{data.user.email}</div>
        </>
      ),
      // default,error,info,primary,secondary,success,warning
    },
    {
      title: "Score",
      field: "score",
      cellStyle: {
        width: "15%",
      },
      render: (data) => (
        <>
          <Chip label={caculateScore(data)} color={getColor(data.status)} />
        </>
      ),
    },
    {
      title: "",
      cellStyle: {
        width: "8%",
      },
      render: (contest) => (
        <>
          <IconButton
            variant="contained"
            color="success"
            onClick={() => {
              history.push(`/target/${contest.id}`);
            }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            variant="contained"
            color="error"
            onClick={() => {
              deleteHall(contest.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleSearch = debounce((value) => setFilterParams({ ...filterParams, keyword: value }), 100);
  const { data: users } = useQuery({
    queryKey: ["user-option"],
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

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl text-600">Team Member Targets</h1>
          <SelectPeriod filterParams={filterParams} setFilterParams={setFilterParams} />
        </div>
        <div className="flex flex-row justify-between mb-6 ">
          <div className="flex flex-row gap-2 flex-wrap  h-10 ">
            <TextField
              size="medium"
              variant="outlined"
              value={filterParams.keyword || ""}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              InputProps={{
                endAdornment: <SearchIcon />,
              }}
            />

            <Select
              labelId="demo-simple-select"
              value={filterParams.userId ?? ""}
              placeholder="Select user"
              // readOnly
              size="small"
              onChange={(e) => {
                setFilterParams({ ...filterParams, userId: e.target.value });
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                closeOnSelect
                label="From Date"
                value={filterParams.fromDate ? dayjs(filterParams.fromDate) : null}
                inputProps={{ size: "small" }}
                componentsProps={{
                  actionBar: {
                    actions: ["clear"],
                  },
                }}
                onChange={(value) => {
                  const date = new Date(value);
                  date.setHours(0, 420, 0, 0);
                  setFilterParams({ ...filterParams, fromDate: date.toISOString() });
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                closeOnSelect
                label="To Date"
                value={filterParams.toDate ? dayjs(filterParams.toDate) : null}
                inputProps={{ size: "small" }}
                componentsProps={{
                  actionBar: {
                    actions: ["clear"],
                  },
                }}
                onChange={(value) => {
                  setFilterParams({ ...filterParams, toDate: dayjs(value).endOf("d").toISOString() });
                }}
              />
            </LocalizationProvider>
            <Button
              onClick={() => {
                setFilterParams((prev) => {
                  return { ...initState, periodId: prev.periodId };
                });
                queryClient.invalidateQueries(["user-targets-teams"]);
              }}
            >
              Reset
            </Button>
          </div>
          <Button
            className=""
            size="small"
            variant="contained"
            onClick={() => {
              setOpenModalAddHall(true);
            }}
            color="primary"
            style={{ textTransform: "none" }}
          >
            Add Target
          </Button>
        </div>
        <StandardTable
          hideCommandBar
          options={{
            selection: false,
            search: false,
            sorting: true,
            pageSize: filterParams.size,
            toolbar: false,
            // searchText: filterParams.name,
            debounceInterval: 1000,
          }}
          page={filterParams.page}
          columns={columns}
          data={data?.targets}
          totalCount={data?.totalItems}
          onChangePage={(page, size) => setFilterParams({ ...filterParams, page, size })}
          onSearchChange={(search) => setFilterParams({ page: 0, size: filterParams.size, name: search })}
          detailPanel={[
            {
              tooltip: "Show key result",
              cellStyle: {
                maxWidth: "20px",
              },
              render: (rowData) => {
                return (
                  <>
                    <div
                      style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px 20px 10px 88px" }}
                    >
                      {rowData.keyResults.map((item, id) => (
                        <div
                          key={id}
                          style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}
                        >
                          <Stack spacing={2} direction="row" alignItems={"center"} key={id} className="mb-3 w-[19.8%]">
                            <Chip variant="filled" color="warning" label={"KR"} size="small" />
                            <Typography
                              variant="subtitle1"
                              gutterBottom
                              className="hover:underline cursor-pointer"
                              onClick={() => {
                                history.push(`/target/key-result/${item.id}`);
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Stack>

                          <Stack spacing={2} direction="row" className="w-[12%]">
                            <Box sx={{ position: "relative", display: "inline-flex" }}>
                              <CircularProgress
                                disableShrink
                                variant="determinate"
                                thickness={4}
                                size={55}
                                value={item.progress}
                                color={`${item.progress === 100 ? "success" : "primary"}`}
                              ></CircularProgress>
                              <Box
                                sx={{
                                  top: 0,
                                  left: 0,
                                  bottom: 0,
                                  right: 0,
                                  position: "absolute",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  component="div"
                                  color="text.primary"
                                  className="text-base"
                                >
                                  {`${Math.round(item.progress)}%`}
                                </Typography>
                              </Box>
                            </Box>
                          </Stack>
                          <div className="w-[12%]">{formatDate(item.fromDate)}</div>
                          <div className="w-[12%]">{formatDate(item.toDate)}</div>
                        </div>
                        // <div key={id} style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                        //   <div className="font-bold text-green-400">{item.title}</div>
                        //   <div>{item.progress}</div>

                        // </div>
                      ))}
                    </div>
                  </>
                );
              },
            },
          ]}
        />
        <ModalAddTargetTeam isOpen={openModalAddHall} handleClose={handleCloseModal} />
      </div>
    </>
  );
};

export default TargetTeamScreen;
