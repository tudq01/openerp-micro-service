import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Chip, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import ModalAddTargetCompany from "components/modal/company/ModalAddTarget";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { formatDate } from "utils/date";
import { errorNoti, successNoti } from "utils/notification";
import { TARGET_STATUS } from "utils/StatusEnum";

export const capitalizeWords = (str) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
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

const initState = { type: "COMPANY", fromDate: null, toDate: null, page: 0, size: 5 };
const TargetCompanyScreen = () => {
  const [filterParams, setFilterParams] = useState(initState);
  const [detailId, setDetail] = useState();
  const queryClient = useQueryClient();
  const history = useHistory();

  const [openModalAddHall, setOpenModalAddHall] = useState(false);
  const handleCloseModal = () => {
    setOpenModalAddHall(false);
  };

  const { data } = useQuery({
    queryKey: ["user-targets", filterParams],
    queryFn: async () => {
      // let successHandler = (res) => {
      //   setTarget(res);
      // };
      let errorHandlers = {
        onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000),
      };

      const res = await request("GET", `/targets/me`, null, errorHandlers, null, { params: filterParams });
      return res.data;
    },
    enabled: true,
  });

  function deleteHall(deletedId) {
    let successHandler = () => {
      successNoti("Delete successfully");
      queryClient.invalidateQueries(["user-targets"]);
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

  return (
    <>
      <StandardTable
        title="Company Targets"
        hideCommandBar
        options={{
          selection: false,
          search: true,
          sorting: true,
          pageSize: filterParams.size,
          // searchText: filterParams.name,
          debounceInterval: 1000,
        }}
        page={filterParams.page}
        columns={columns}
        actions={[
          {
            icon: () => {
              return (
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
              );
            },
            isFreeAction: true,
          },
          {
            icon: () => {
              return (
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
              );
            },
            isFreeAction: true,
          },
          {
            icon: () => {
              return (
                <Button
                  onClick={() => {
                    setFilterParams(initState);
                    queryClient.invalidateQueries(["user-targets"]);
                  }}
                >
                  Reset
                </Button>
              );
            },
            tooltip: "Reset",
            isFreeAction: true,
          },
          {
            icon: () => {
              return (
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenModalAddHall(true);
                  }}
                  color="primary"
                >
                  Add target
                </Button>
              );
            },
            tooltip: "Add target",
            isFreeAction: true,
          },
        ]}
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
                        <Stack spacing={2} direction="row" alignItems={"center"} key={id} className="mb-3 w-[26.8%]">
                          <Chip variant="filled" color="warning" label={"KR"} size="small" />
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            className="hover:underline cursor-pointer"
                            onClick={() => {
                              history.push(`/target/${item.id}`);
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
                              <Typography variant="caption" component="div" color="text.primary" className="text-base">
                                {`${Math.round(item.progress)}%`}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                        <div className="w-[17%]">{formatDate(item.fromDate)}</div>
                        <div className="w-[17%]">{formatDate(item.toDate)}</div>
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
      <ModalAddTargetCompany isOpen={openModalAddHall} handleClose={handleCloseModal} />
    </>
  );
};

export default TargetCompanyScreen;
