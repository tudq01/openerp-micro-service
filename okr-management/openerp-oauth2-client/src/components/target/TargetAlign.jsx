import { CardContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { Popper } from "@mui/base/Popper";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import NorthIcon from "@mui/icons-material/North";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useQuery } from "@tanstack/react-query";
import { request } from "api";
import dayjs from "dayjs";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import EyeAlign from "./EyeAlign";
const TargetAlign = ({ target }) => {
  const history = useHistory();
  const { data: keyResultTarget } = useQuery({
    queryKey: ["target-detail"],
    queryFn: async () => {
      const res = await request("GET", `/targets/${target.keyResult.targetId}`, null, null, null, {});
      return res.data;
    },
    enabled: !!target?.keyResult,
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  
  

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {target?.keyResult && (
            <>
              <div className="mb-5 cursor-pointer">
                <h3 className="text-lg font-semibold">Cascade</h3>
                <div className=" flex  items-center justify-between shadow-md rounded-lg w-full p-4 bg-[#f9f9f9] border-[1px]">
                  <div className="flex flex-row gap-3">
                    <div
                      className="w-10 h-10 bg-yellow-400 text-white flex justify-center items-center p-2 rounded"
                      onClick={() => {
                        history.push(`/target/key-result/${target?.keyResult?.id}`);
                      }}
                    >
                      {" "}
                      KR
                    </div>
                    <div className="flex flex-gap-2 flex-col">
                      <h5
                        className="text-lg"
                        onClick={() => {
                          history.push(`/target/key-result/${target?.keyResult?.id}`);
                        }}
                      >
                        {target?.keyResult?.title}
                      </h5>
                      <span>{`${keyResultTarget?.user?.firstName} ${keyResultTarget?.user?.lastName}`}</span>
                    </div>
                  </div>
                  <div onClick={handleClick}>
                    <VisibilityIcon />
                    <Popper open={open} anchorEl={anchorEl} placement="right" className="z-10 ml-3">
                      <div className="flex flex-col gap-2 w-[300px] h-[300px] bg-[#f9f9f9] shadow-md p-5">
                        <h3 className="text-gray-600 font-medium">KR Details</h3>
                        <div className="flex flex-row gap-2 ">
                          <div>Period</div>
                          <div className="font-bold">
                            {target?.period?.title}{" "}
                            {`( ${dayjs(target?.period?.fromDate).format("MMM DD")} - ${dayjs(
                              target?.period?.toDate
                            ).format("MMM DD")})`}
                          </div>
                        </div>
                        <div className="flex flex-row gap-2 ">
                          <div>Progress</div>
                          <div className="font-bold">{target?.keyResult?.progress} %</div>
                        </div>
                        <div className="flex flex-row gap-2 ">
                          <div>Objective</div>
                          <div className="font-bold">{target?.keyResult?.title}</div>
                        </div>
                      </div>
                    </Popper>
                  </div>
                </div>
                <div className="flex flex-row gap-3 mt-5">
                  <div>
                    <ArrowDownwardOutlinedIcon fontSize="large" color="default" />
                  </div>

                  <div className=" flex  items-center gap-3 justify-between shadow-md rounded-lg w-full p-4 bg-[#f9f9f9] border-[1px]">
                    <div className="flex flex-row gap-3">
                      <div
                        className="w-10 h-10 bg-green-600 text-white flex justify-center items-center p-2 rounded"
                        onClick={() => {
                          history.push(`/target/${target.id}`);
                        }}
                      >
                        OBJ
                      </div>
                      <div className="flex flex-gap-2 flex-col">
                        <h5
                          className="text-lg"
                          onClick={() => {
                            history.push(`/target/${target.id}`);
                          }}
                        >
                          {target?.title}
                        </h5>
                        <span>{`${target?.user?.firstName} ${target?.user?.lastName}`}</span>
                      </div>
                    </div>
                    <EyeAlign target={target} />
                  </div>
                </div>
              </div>
            </>
          )}
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} className="mt-4 cursor-pointer">
          {target?.parentTarget && (
            <>
              <div className="mt-5">
                <h3 className="text-lg font-semibold">Align</h3>
                <div className="flex  items-center  justify-between shadow-md rounded-lg w-full p-4 bg-[#f9f9f9] border-[1px]">
                  <div className="flex flex-row gap-3">
                    <div className="w-10 h-10 bg-red-600 text-white flex justify-center items-center p-2 rounded">
                      TA
                    </div>
                    <div className="flex flex-gap-2 flex-col">
                      <h5
                        className="text-lg"
                        onClick={() => {
                          history.push(`/target/${target?.parentTarget?.id}`);
                        }}
                      >
                        {target?.parentTarget?.title}
                      </h5>
                      <span>{`${target?.parentTarget?.user?.firstName} ${target?.parentTarget?.user?.lastName}`}</span>
                    </div>
                  </div>
                  <EyeAlign target={target?.parentTarget} />
                </div>
                <div className="flex flex-row gap-3 mt-5">
                  <div>
                    <NorthIcon fontSize="large" color="default" />
                  </div>

                  <div className=" flex  items-center gap-3 justify-between shadow-md rounded-lg w-full p-4 bg-[#f9f9f9] border-[1px]">
                    <div className="flex flex-row gap-3">
                      <div
                        className="w-10 h-10 bg-green-600 text-white flex justify-center items-center p-2 rounded"
                        onClick={() => {
                          history.push(`/target/${target.id}`);
                        }}
                      >
                        OBJ
                      </div>
                      <div className="flex flex-gap-2 flex-col">
                        <h5
                          className="text-lg"
                          onClick={() => {
                            history.push(`/target/${target.id}`);
                          }}
                        >
                          {target?.title}
                        </h5>
                        <span>{`${target?.user?.firstName} ${target?.user?.lastName}`}</span>
                      </div>
                    </div>
                    <EyeAlign target={target} />
                  </div>
                </div>
              </div>
            </>
          )}

          {target?.keyResults && (
            <>
              {target?.keyResults.map((item, index) => {
                return (
                  <div className="flex flex-row gap-3 mt-5 ml-10 cursor-pointer" key={item.id}>
                    <div>
                      <NorthIcon fontSize="large" color="default" />
                    </div>

                    <div className=" flex  items-center gap-3 flex-row shadow-md rounded-lg w-full p-4 bg-[#f9f9f9] border-[1px]">
                      <div className="w-10 h-10 bg-yellow-400 text-white flex justify-center items-center p-2 rounded">
                        KR
                      </div>
                      <div className="flex flex-gap-2 flex-col">
                        <h5
                          className="text-lg"
                          onClick={() => {
                            history.push(`/target/key-result/${item.id}`);
                          }}
                        >
                          {item?.title}
                        </h5>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TargetAlign;
