import { Link } from "@material-ui/core/";
import Button from "@mui/material/Button";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useEffect, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import ModalAddHall from "views/ModalAddHall";
import ModalEditHall from "views/ModalEditHall";
import { request } from "../api";
import { errorNoti, successNoti } from "../utils/notification";

function HallScreen({ id }) {
  const [halls, setHall] = useState({ content: [], totalElements: 0 });
  const [filterParams, setFilterParams] = useState({ name: "", page: 0, size: 20 });
  const history = useHistory();

  const [detailId, setDetail] = useState();

  useEffect(getHalls, [filterParams]);

  function getHalls() {
    let successHandler = (res) => {
      setHall({
        content: res.data.halls,
        totalElements: res.data.totalItems,
      });
    };
    let errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000),
    };

    request("GET", `/halls`, successHandler, errorHandlers, null, { params: filterParams });
  }

  function deleteHall(deletedPermission) {
    let successHandler = () => {
      successNoti("Delete successfully");
      const item = halls.content.filter((item) => item.id !== deletedPermission);

      setHall({
        content: item,
        totalElements: item.length,
      });
    };
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi "),
    };
    request("DELETE", `/halls/${deletedPermission}`, successHandler, errorHandlers);
  }

  const columns = [
    {
      title: "Hall Code",
      field: "id",
      render: (rowData) => (
        <Link component={RouterLink} to={`/hall/${rowData["id"]}`}>
          {rowData["id"]}
        </Link>
      ),
    },
    { title: "Name", field: "name" },
    { title: "Location", field: "location" },
    { title: "Description", field: "description" },
    { title: "Status", field: "status" },
    { title: "Total floor", field: "totalFloor" },
    {
      title: "",
      sorting: false,
      render: (rowData) => (
        <Button
          variant="outlined"
          onClick={() => {
            setDetail(rowData["id"]);
            setOpenModalEditHall(true);
          }}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "",
      sorting: false,
      render: (rowData) => (
        <Button variant="outlined" onClick={() => deleteHall(rowData["id"])}>
          Delete
        </Button>
      ),
    },
  ];

  const [openModalAddHall, setOpenModalAddHall] = useState(false);
  const handleCloseModal = () => {
    setOpenModalAddHall(false);
  };

  const [openModalEditHall, setOpenModalEditHall] = useState(false);
  const handleCloseModalEdit = () => {
    setOpenModalEditHall(false);
  };

  const handleEditHall = (HallAdd) => {
    successNoti("Update Hall to hall successfully", 5000);
  };

  const handleAddHall = (HallAdd) => {
    successNoti("Add hall successfully", 5000);
    // const item = Halls.content.push(HallAdd);

    // setHalls({
    //   content: item,
    //   totalElements: item.length,
    // });
  };

  return (
    <>
      <StandardTable
        title="Hall List"
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
                  Add hall
                </Button>
              );
            },
            tooltip: "Add hall",
            isFreeAction: true,
          },
        ]}
        data={halls.content}
        totalCount={halls.totalElements}
        onChangePage={(page, size) => setFilterParams({ ...filterParams, page, size })}
        onSearchChange={(search) => setFilterParams({ page: 0, size: filterParams.size, name: search })}
      />
      <ModalAddHall isOpen={openModalAddHall} handleSuccess={handleAddHall} handleClose={handleCloseModal} />
      {detailId && (
        <ModalEditHall
          hallId={detailId}
          isOpen={openModalEditHall}
          handleSuccess={handleEditHall}
          handleClose={handleCloseModalEdit}
        />
      )}
    </>
  );
}

export default HallScreen;
