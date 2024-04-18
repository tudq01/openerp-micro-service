import React, { useEffect, useState } from "react";

import { request } from "../api";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { errorNoti, successNoti } from "../utils/notification";
import Button from "@mui/material/Button";
import { StandardTable } from "erp-hust/lib/StandardTable";
import ModalAddRoomToHall from "./ModalAddRoomToHall";
import ModalEditRoom from "./ModalEditRoom";

export default function RoomDetail() {
  const [filterParams, setFilterParams] = useState({ name: null, page: 0, size: 20, id: null });
  const [rooms, setrooms] = useState({ content: [], totalElements: 0 });
  const router = useParams();
  const id = router.id;
  const [detailId, setDetail] = useState();

  useEffect(getrooms, [filterParams, id]);
  // useEffect(() => {
  //   if (id)
  //     setFilterParams((prev) => {
  //       return { ...prev, hallId: id };
  //     });
  // }, [id]);

  function getrooms() {
    let successHandler = (res) => {
      setrooms({
        content: res.data.rooms,
        totalElements: res.data.totalItems,
      });
    };
    let errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000),
    };

    request("get", `/rooms`, successHandler, errorHandlers, null, { params: { ...filterParams, hallId: id } });
  }

  function deleteRoom(deletedPermission) {
    let successHandler = () => {
      successNoti("Delete successful");

      const item = rooms.content.filter((item) => item.id !== deletedPermission);

      setrooms({
        content: item,
        totalElements: item.length,
      });
    };
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi "),
    };
    request("DELETE", `/rooms/${deletedPermission}`, successHandler, errorHandlers);
  }

  const columns = [
    { field: "name", title: "Name" },
    { field: "description", title: "Description" },
    { field: "capacity", title: "Capacity" },
    { field: "floor", title: "Total Floor" },
    { field: "type", title: "Type" },
    {
      title: "",
      sorting: false,
      render: (rowData) => (
        <>
          <Button
            variant="outlined"
            onClick={() => {
              setDetail(rowData["id"]);
              setOpenModalEditRoom(true);
            }}
          >
            Edit
          </Button>
        </>
      ),
    },
    {
      title: "",
      sorting: false,
      render: (rowData) => (
        <>
          <Button variant="outlined" onClick={() => deleteRoom(rowData["id"])}>
            Delete
          </Button>
        </>
      ),
    },
  ];

 

  const [openModalAddRoom, setOpenModalAddRoom] = useState(false);
  const handleCloseModal = () => {
    setOpenModalAddRoom(false);
  };

  const [openModalEditRoom, setOpenModalEditRoom] = useState(false);
  const handleCloseModalEdit = () => {
    setOpenModalEditRoom(false);
  };

  const handleEditRoom = (roomAdd) => {
    successNoti("Add room to hall successfully", 5000);
  };

  const handleAddRoom = (roomAdd) => {
    successNoti("Add room to hall successfully", 5000);
    const item = rooms.content.push(roomAdd);

    setrooms({
      content: item,
      totalElements: item.length,
    });
  };

  return (
    <>
      <StandardTable
        title="Classroom List"
        hideCommandBar
        options={{
          selection: false,
          search: true,
          sorting: true,
          // pageSize: filterParams.size,
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
                    setOpenModalAddRoom(true);
                  }}
                  color="primary"
                >
                  Add room
                </Button>
              );
            },
            tooltip: "Export Result as Excel file",
            isFreeAction: true,
          },
        ]}
        data={rooms.content}
        totalCount={rooms.totalElements}
        onChangePage={(page, size) => setFilterParams({ ...filterParams, page, size })}
        onSearchChange={(search) => setFilterParams({ page: 1, size: filterParams.size, name: search })}
      />
      <ModalAddRoomToHall
        hallId={id}
        isOpen={openModalAddRoom}
        handleSuccess={handleAddRoom}
        handleClose={handleCloseModal}
      />
      {detailId && (
        <ModalEditRoom
          roomId={detailId}
          isOpen={openModalEditRoom}
          handleSuccess={handleEditRoom}
          handleClose={handleCloseModalEdit}
        />
      )}
    </>
  );
}
