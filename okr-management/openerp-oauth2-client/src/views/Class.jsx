import React, { useEffect, useState } from "react";

import { StandardTable } from "erp-hust/lib/StandardTable";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import { useHistory } from "react-router-dom/cjs/react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

function ClassScreen() {
  const [classes, setClasses] = useState([]);
  const history = useHistory()
  useEffect(() => {
    setClasses([
      {
        id: 1,
        classCode: "DSA_BASIC_LAB",
        courseCode: "IT3230E",
        courseName: "Data and Algo",
        courseType: "TN",
        semester: "20202",
        status: "Approve",
      },
    ]);
    //         request("get", "/user/get-all", (res) => {
    //             setUsers(res.data);
    //         }).then();
  }, []);

  const columns = [
    {
      title: "Class Code",
      field: "id",
    },
    {
      title: "Class Code",
      field: "classCode",
    },
    {
      title: "Course Code",
      field: "courseCode",
    },
    {
      title: "Course Name",
      field: "courseName",
    },
    {
      title: "Course Type",
      field: "courseType",
    },
    {
      title: "Semester",
      field: "semester",
    },
    {
      title: "Status",
      field: "status",
      //   render: (rowData) => (
      //     <IconButton
      //       onClick={() => {
      //         demoFunction(rowData);
      //       }}
      //       variant="contained"
      //       color="success"
      //     >
      //       <EditIcon />
      //     </IconButton>
      //   ),
      // },
    },
    {
      title: "Edit",
      sorting: false,
        render: (rowData) => (
          <IconButton
            onClick={() => {
              history.push('/student/class/1')
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
        <IconButton
          onClick={() => {
            demoFunction(rowData);
          }}
          variant="contained"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const demoFunction = (user) => {
    alert("You clicked on User: " + user.id);
  };

  return (
    <div>
      <StandardTable
        title="Class List"
        columns={columns}
        data={classes}
        // hideCommandBar
        options={{
          selection: false,
          pageSize: 20,
          search: true,
          sorting: true,
        }}
      />
    </div>
  );
}

export default ClassScreen;
