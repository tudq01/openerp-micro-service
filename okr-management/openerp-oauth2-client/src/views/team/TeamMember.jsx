import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import ModalAddMember from "components/modal/ModalAddMember";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { errorNoti, successNoti } from "utils/notification";

const TeamMember = () => {
  const [filterParams, setFilterParams] = useState({ page: 0, size: 5 });
  const [detailId, setDetail] = useState();
  const queryClient = useQueryClient();
  const history = useHistory();

  const router = useParams();
  const id = router.id;
  const name = router.name;

  const [openModalAddHall, setOpenModalAddHall] = useState(false);
  const handleCloseModal = () => {
    setOpenModalAddHall(false);
  };

  const { data } = useQuery({
    queryKey: ["team-members", id, filterParams],
    queryFn: async () => {
      // let successHandler = (res) => {
      //   setTarget(res);
      // };
      let errorHandlers = {
        onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000),
      };

      const res = await request("GET", `/teams/${id}/member`, null, errorHandlers, null, { params: filterParams });
      return res.data;
    },
    enabled: true,
  });

  function deleteHall(deletedId) {
    let successHandler = () => {
      successNoti("Delete successfully");
      queryClient.invalidateQueries(["team-members"]);
    };
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi "),
    };
    request("DELETE", `/teams/members/${deletedId}`, successHandler, errorHandlers);
  }

  const updateTeam = (deletedId, value) => {
    let successHandler = () => {
      successNoti("Update successfully");
      queryClient.invalidateQueries(["team-members"]);
    };
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi "),
    };
    request("patch", `/teams/members/${deletedId}`, successHandler, errorHandlers, value);
  };

  const columns = [
    { title: "Name", editable: "never", render: (row) => <>{`${row.user.firstName} ${row.user.lastName}`}</> },
    { title: "Email", field: "user.email", editable: "never" },
    { title: "Role", field: "role", lookup: { STAFF: "STAFF", MANAGER: "MANAGER", HEAD_MANAGER: "HEAD_MANAGER" } },
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

  return (
    <>
      <StandardTable
        title={`Team ${name}`}
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
                  Add member
                </Button>
              );
            },
            tooltip: "Add teams",
            isFreeAction: true,
          },
        ]}
        data={data?.members}
        totalCount={data?.totalItems}
        onChangePage={(page, size) => setFilterParams({ ...filterParams, page, size })}
        onSearchChange={(search) => setFilterParams({ page: 0, size: filterParams.size, name: search })}
        cellEditable={{
          onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
            return new Promise((resolve, reject) => {
              console.log(newValue);
              const submitData = { role: newValue };
              updateTeam(rowData.id, submitData);
              setTimeout(resolve, 1000);
            });
          },
        }}
      />
      <ModalAddMember isOpen={openModalAddHall} handleClose={handleCloseModal} />
    </>
  );
};

export default TeamMember;
