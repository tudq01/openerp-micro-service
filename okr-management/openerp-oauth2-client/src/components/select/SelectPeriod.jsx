import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useQuery } from "@tanstack/react-query";
import { request } from "api";

import { errorNoti } from "utils/notification";

const SelectPeriod = ({ filterParams, setFilterParams }) => {
  const { data: periods } = useQuery({
    queryKey: ["target-period-select"],
    queryFn: async () => {
      let errorHandlers = {
        onError: (error) => errorNoti("Error loading data", 3000),
      };

      const res = await request("GET", `/targets/period`, null, errorHandlers, null, {
        params: { page: 0, size: 10 },
      });
      return res.data.periods;
    },
    enabled: true,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const userOptions = periods?.length
    ? periods.map((item) => {
        return { label: item.title, value: item.id };
      })
    : [];

  return (
    <Select
      labelId="demo-simple-select-1"
      value={filterParams.periodId ?? ""}
      placeholder="Select period"
      size="medium"
      onChange={(e) => {
        setFilterParams({ ...filterParams, periodId: e.target.value });
      }}
    >
      {userOptions.map((item) => (
        <MenuItem value={item.value} key={item.value} style={{ display: "block", padding: "8px" }}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectPeriod;
