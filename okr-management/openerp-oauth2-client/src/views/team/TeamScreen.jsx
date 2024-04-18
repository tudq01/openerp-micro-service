import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { errorNoti, successNoti } from "utils/notification";

import { Link } from "@material-ui/core/";
import ModalAddTeam from "components/modal/ModalAddTeam";
import { Link as RouterLink } from "react-router-dom";

const TeamScreen = () => {
  const [filterParams, setFilterParams] = useState({ page: 0, size: 5 });
  const [detailId, setDetail] = useState();
  const queryClient = useQueryClient();
  const history = useHistory();

  const router = useParams();
  const id = router.id;

  const [openModalAddHall, setOpenModalAddHall] = useState(false);
  const handleCloseModal = () => {
    setOpenModalAddHall(false);
  };

  const { data } = useQuery({
    queryKey: ["teams", id, filterParams],
    queryFn: async () => {
      // let successHandler = (res) => {
      //   setTarget(res);
      // };
      let errorHandlers = {
        onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000),
      };

      const res = await request("GET", `/departments/${id}/teams`, null, errorHandlers, null, { params: filterParams });
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
    request("DELETE", `/teams/${deletedId}`, successHandler, errorHandlers);
  }

  const columns = [
    {
      title: "Id",
      field: "id",
      editable: "never",
      render: (rowData) => (
        <Link component={RouterLink} to={`/team/${rowData.name}/${rowData["id"]}`}>
          {rowData["id"]}
        </Link>
      ),
    },
    { title: "Name", field: "name" },
    {
      title: "",
      editable: "never",
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

  const updateTeam = (deletedId, value) => {
    let successHandler = () => {
      successNoti("Update successfully");
      queryClient.invalidateQueries(["teams"]);
    };
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi "),
    };
    request("patch", `/teams/${deletedId}`, successHandler, errorHandlers, value);
  };

  return (
    <>
      <StandardTable
        title="Teams"
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
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenModalAddHall(true);
                  }}
                  color="primary"
                >
                  Add team
                </Button>
              );
            },
            tooltip: "Add teams",
            isFreeAction: true,
          },
        ]}
        data={data?.teams}
        totalCount={data?.totalItems}
        onChangePage={(page, size) => setFilterParams({ ...filterParams, page, size })}
        onSearchChange={(search) => setFilterParams({ page: 0, size: filterParams.size, name: search })}
        cellEditable={{
          onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
            return new Promise((resolve, reject) => {
              const submitData = { name: newValue };
              updateTeam(rowData.id, submitData);
              setTimeout(resolve, 1000);
            });
          },
        }}
      />
      <ModalAddTeam isOpen={openModalAddHall} handleClose={handleCloseModal} />
    </>
  );
};

export default TeamScreen;
