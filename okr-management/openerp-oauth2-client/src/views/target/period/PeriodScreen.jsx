import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Chip, IconButton, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import ModalAddTarget from "components/modal/ModalAddTarget";
import dayjs from "dayjs";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { errorNoti, successNoti } from "utils/notification";

import { TextField } from "@material-ui/core";
import { debounce } from "lodash";
import ModalAddPeriod from "components/modal/ModalAddPeriod";

const PeriodScreen = () => {
  const [filterParams, setFilterParams] = useState({
    keyword: null,
    page: 0,
    size: 5,
    fromDate: null,
    toDate: null,
  });
  const [detailId, setDetail] = useState();
  const queryClient = useQueryClient();
  const history = useHistory();

  const [openModalAddHall, setOpenModalAddHall] = useState(false);
  const handleCloseModal = () => {
    setOpenModalAddHall(false);
  };

  const { data } = useQuery({
    queryKey: ["target-period", filterParams],
    queryFn: async () => {
      // let successHandler = (res) => {
      //   setTarget(res);
      // };
      let errorHandlers = {
        onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000),
      };

      const res = await request("GET", `/targets/period`, null, errorHandlers, null, { params: filterParams });
      return res.data;
    },
    enabled: true,
  });

  function deleteHall(deletedId) {
    let successHandler = () => {
      successNoti("Delete successfully");
      queryClient.invalidateQueries(["target-period"]);
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
        width: "30%",
      },
      render: (data) => {
        return (
          <>
            <Stack spacing={2} direction="row" alignItems={"center"}>
              <Chip variant="filled" color="success" label={"SESSION"} size="small" />
              <Typography
                variant="h6"
                gutterBottom
                className="hover:underline cursor-pointer"
                onClick={() => {
                  history.push(`/manager/period/${data.id}`);
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
      title: "From",
      field: "fromDate",
      cellStyle: {
        width: "16%",
      },
      render: (rowData) => <>{dayjs(rowData.fromDate).format("DD/MM/YYYY")}</>,
    },
    {
      title: "To",
      field: "toDate",
      cellStyle: {
        width: "16%",
      },
      render: (rowData) => <>{dayjs(rowData.toDate).format("DD/MM/YYYY")}</>,
    },
    {
      title: "",
      render: (contest) => (
        <>
          <IconButton
            variant="contained"
            color="success"
            onClick={() => {
              history.push(`/manager/period/${contest.id}`);
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

  return (
    <>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl text-600">Target Period</h1>
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
                setFilterParams({ page: 0, size: 5, fromDate: null, toDate: null });
                queryClient.invalidateQueries(["target-period"]);
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
          >
            Add period
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
          data={data?.periods}
          totalCount={data?.totalItems}
          onChangePage={(page, size) => setFilterParams({ ...filterParams, page, size })}
          onSearchChange={(search) => setFilterParams({ page: 0, size: filterParams.size, name: search })}
        />
        <ModalAddPeriod isOpen={openModalAddHall} handleClose={handleCloseModal} />
      </div>
    </>
  );
};

export default PeriodScreen;
