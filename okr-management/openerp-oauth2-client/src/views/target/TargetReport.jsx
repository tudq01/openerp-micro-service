import { useQuery } from "@tanstack/react-query";
import { request } from "api";

import { Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FacebookCircularProgress } from "components/common/progressBar/CustomizedCircularProgress";
import SelectPeriod from "components/select/SelectPeriod";
import { useState } from "react";
import { errorNoti } from "utils/notification";
import PieReport from "./report/PieReport";
import YourReport from "./report/YourReport";

const TargetReportScreen = () => {
  const [filterParams, setFilterParams] = useState({
    periodId: null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["user-targets-report", filterParams],
    queryFn: async () => {
      let errorHandlers = {
        onError: (error) => errorNoti("Error loading data", 3000),
      };

      const res = await request("GET", `/targets/report`, null, errorHandlers, null, { params: filterParams });

      return res.data;
    },
    enabled: !!filterParams.periodId,
  });

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <FacebookCircularProgress />
        </div>
      ) : (
        <div className="flex flex-col gap-3 cursor-pointer">
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl text-600">Target Report</h1>
            <SelectPeriod filterParams={filterParams} setFilterParams={setFilterParams} />
          </div>
          <div className="flex flex-row justify-center mb-6 ">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <PieReport data={data} type="COMPANY" title="Company OKRs" />
              </Grid>
              <Grid item xs={4}>
                <PieReport data={data} type="DEPARTMENT" title="Team OKRs" />
              </Grid>
              <Grid item xs={4}>
                <PieReport data={data} type="PERSONAL" title="My OKRs" />
              </Grid>
            </Grid>
          </div>
          <Divider variant="middle" className="mt-5 mb-5" />
          <h1 className="text-2xl text-600 ">Company Target</h1>
          <YourReport data={data} type="COMPANY" />
          <Divider variant="middle" className="mt-5 mb-5" />
          <h1 className="text-2xl text-600 ">Team Target</h1>
          <YourReport data={data} type="DEPARTMENT" />
          <Divider variant="middle" className="mt-5 mb-5" />
          <h1 className="text-2xl text-600 ">Your Target</h1>
          <YourReport data={data} type="PERSONAL" />
        </div>
      )}
    </>
  );
};

export default TargetReportScreen;
