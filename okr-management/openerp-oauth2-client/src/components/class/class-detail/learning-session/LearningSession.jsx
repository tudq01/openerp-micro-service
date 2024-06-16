import { Link } from "@material-ui/core/";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import ModalAddHall from "views/ModalAddHall";
import ModalEditHall from "views/ModalEditHall";
import { request } from "../../../../api";
import { errorNoti, successNoti } from "../../../../utils/notification";

function LearningSession({ id }) {
  const [halls, setHall] = useState({ content: [], totalElements: 0 });
  const [filterParams, setFilterParams] = useState({ name: "", page: 0, size: 20 });
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
      onError: (error) => errorNoti("Error loading data", 3000),
    };
    request("GET", `/halls`, successHandler, errorHandlers, null, { params: filterParams });
  }

  function deleteHall(deletedPermission) {
    let successHandler = () => {
      successNoti("Đã thu hồi quyền, xem kết quả ở bảng");
      setHall(halls.filter((permission) => permission !== deletedPermission));
    };
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi "),
    };
    request("DELETE", `/halls/${deletedPermission}`, successHandler, errorHandlers);
  }

  const columns = [
    {
      title: "Ma toa nha",
      field: "id",
      render: (rowData) => (
        <Link component={RouterLink} to={`/hall/${rowData["id"]}`}>
          {rowData["id"]}
        </Link>
      ),
    },
    { title: "Ten", field: "name" },
    { title: "Dia diem", field: "location" },
    { title: "Mo ta", field: "description" },
    { title: "Trạng thái", field: "status" },
    { title: "So tang", field: "totalFloor" },
    {
      title: "Edit",
      sorting: false,
      render: (rowData) => (
        <IconButton
          onClick={() => {
            setDetail(rowData["id"]);
          }}
          variant="contained"
          color="success"
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      title: "Delete",
      sorting: false,
      render: (rowData) => (
        <Button variant="outlined" onClick={() => deleteHall(rowData["id"])}>
          Revoke
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

  useEffect(() => {
    if (detailId) setOpenModalEditHall(true);
  }, [detailId]);

  return (
    <div>
      <StandardTable
        title="Danh sach toa nha"
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
    </div>
  );
}

export default LearningSession;
