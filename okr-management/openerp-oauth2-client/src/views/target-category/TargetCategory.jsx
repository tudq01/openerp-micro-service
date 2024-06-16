import DeleteIcon from "@mui/icons-material/Delete";

import { Button, IconButton } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { errorNoti, successNoti } from "utils/notification";

import ModalAddCategory from "components/modal/category/ModalAddCategory";

const TargetTypeScreen = () => {
  const [filterParams, setFilterParams] = useState({ page: 0, size: 20 });

  const queryClient = useQueryClient();
  const history = useHistory();

  const [openModalAddHall, setOpenModalAddHall] = useState(false);
  const handleCloseModal = () => {
    setOpenModalAddHall(false);
  };

  const { data } = useQuery({
    queryKey: ["target-categories", filterParams],
    queryFn: async () => {
      let errorHandlers = {
        onError: (error) => errorNoti("Error loading data", 3000),
      };

      const res = await request("GET", `/targets/categories`, null, errorHandlers, null, { params: filterParams });
      return res.data;
    },
    enabled: true,
  });

  function deleteHall(deletedId) {
    let successHandler = () => {
      successNoti("Delete successfully");
      queryClient.invalidateQueries(["target-categories"]);
    };
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi "),
    };
    request("DELETE", `/targets/categories/${deletedId}`, successHandler, errorHandlers);
  }

  const updateDepartment = (deletedId, value) => {
    let successHandler = () => {
      successNoti("Update successfully");
      queryClient.invalidateQueries(["target-categories"]);
    };
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi "),
    };
    request("patch", `/targets/categories/${deletedId}`, successHandler, errorHandlers, value);
  };

  const columns = [
    {
      title: "Id",
      field: "id",
      editable: "never",
      render: (rowData) => <>{rowData.id}</>,
    },
    { title: "Type", field: "type" },
    {
      title: "",
      editable: "never",
      render: (contest) => (
        <>
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
        title="Target Category"
        hideCommandBar
        options={{
          selection: false,
          search: true,
          sorting: true,
          pageSize: filterParams.size,

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
                  style={{ textTransform: "none" }}
                >
                  Add Category
                </Button>
              );
            },
            tooltip: "Add category",
            isFreeAction: true,
          },
        ]}
        data={data?.categories}
        totalCount={data?.totalItems}
        onChangePage={(page, size) => setFilterParams({ ...filterParams, page, size })}
        onSearchChange={(search) => setFilterParams({ page: 0, size: filterParams.size, name: search })}
        cellEditable={{
          onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
            return new Promise((resolve, reject) => {
              const submitData = { type: newValue };
              updateDepartment(rowData.id, submitData);
              setTimeout(resolve, 1000);
            });
          },
        }}
      />
      <ModalAddCategory isOpen={openModalAddHall} handleClose={handleCloseModal} />
    </>
  );
};

export default TargetTypeScreen;
