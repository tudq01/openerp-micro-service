import { Popper } from "@mui/base/Popper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import { useState } from "react";

const EyeAlign = ({ target }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  return (
    <div onClick={handleClick}>
      <VisibilityIcon />
      <Popper open={open} anchorEl={anchorEl} placement="right" className="z-10 ml-3">
        <div className="flex flex-col gap-2 w-[300px] h-[300px] bg-[#f9f9f9] shadow-md p-5">
          <h3 className="text-gray-600 font-medium">Objective Details</h3>
          <div className="flex flex-row gap-2 ">
            <div>Owner</div>
            <div className="font-bold">
              <span>{`${target?.user?.firstName} ${target?.user?.lastName}`}</span>
            </div>
          </div>
          <div className="flex flex-row gap-2 ">
            <div>Period</div>
            <div className="font-bold">
              {target?.period?.title}{" "}
              {`( ${dayjs(target?.period?.fromDate).format("MMM DD")} - ${dayjs(target?.period?.toDate).format(
                "MMM DD"
              )})`}
            </div>
          </div>
          <div className="flex flex-row gap-2 ">
            <div>Progress</div>
            <div className="font-bold">{target?.progress} %</div>
          </div>
          <div className="flex flex-row gap-2 ">
            <div>Objective</div>
            <div className="font-bold">{target?.title}</div>
          </div>
        </div>
      </Popper>
    </div>
  );
};

export default EyeAlign;
