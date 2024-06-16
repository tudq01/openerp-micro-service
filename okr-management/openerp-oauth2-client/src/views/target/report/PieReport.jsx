import { Box, CircularProgress, Stack, Typography } from "@mui/material";

const PieReport = ({ data, type, title }) => {
  const getReportData = (data) => {
    if (!data) return;
    const result = data.filter((item) => item.type === type);
    const allProgress = result.reduce((acc, item) => {
      return acc + item.progress;
    }, 0);
    const numOfObjective = result.length;
    const numOfKeyResult = result.reduce((acc, item) => {
      return acc + item.keyResults.length;
    }, 0);

    return { progress: result.length ? (allProgress / result.length).toFixed(1) : 0, numOfObjective, numOfKeyResult };
  };

  const result = getReportData(data);

  const getColor = (progress) => {
    if (progress > 70) return "success";
    if (progress < 40) return "error";
    return "primary";
  };

  const getStatus = (progress) => {
    if (progress < 40) return "At risk";
    return "On track";
  };

  return (
    <>
      {data && (
        <div className="flex flex-col gap-3 justify-center">
          <Stack direction="row" className="flex justify-center">
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                disableShrink
                variant="determinate"
                thickness={4}
                size={350}
                value={result.progress}
                color={getColor(result.progress)}
                style={{
                  width: "250px",
                  height: "250px",
                  borderRadius: "100%",
                  boxShadow: "inset 0 0 0px 23px #D3D3D3",
                  backgroundColor: "transparent",
                }}
              ></CircularProgress>
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="flex flex-col gap-1 justify-center items-center">
                  <Typography
                    variant="caption"
                    component="div"
                    color={getColor(result.progress)}
                    className="text-xl font-bold"
                  >
                    {`${result.progress} %`}
                  </Typography>
                  <Typography variant="caption" component="div" color={getColor(result.progress)} className="text-lg">
                    {getStatus(result.progress)}
                  </Typography>
                </div>
              </Box>
            </Box>
          </Stack>
          <div className="text-center text-2xl font-600">{title}</div>
          <div className="text-center text-xl ">
            <span className="font-bold"> OB</span>: {result.numOfObjective} <span className="font-bold">|</span>{" "}
            <span className="font-bold"> KR</span>: {result.numOfKeyResult}
          </div>
        </div>
      )}
    </>
  );
};

export default PieReport;
