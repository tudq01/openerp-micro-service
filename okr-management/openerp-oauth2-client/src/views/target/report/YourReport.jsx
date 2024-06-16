import Grid from "@material-ui/core/Grid";
import dayjs from "dayjs";

const YourReport = ({ data, type }) => {
  const getRemainDay = () => {
    if (!data.length > 0) return 0;
    const today = dayjs();

    // Calculate the difference in days
    const daysRemaining = data[0].period.toDate.diff(today, "day");

    // Return the result, ensuring it is not negative
    const result = daysRemaining > 0 ? daysRemaining : 0;
    return result;
  };

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

    const krHit = result.reduce((acc, item) => {
      const kr = item.keyResults.filter((kr) => kr.progress > 70);
      return acc + kr.length;
    }, 0);
    const objHit = result.reduce((acc, item) => {
      if (item.progress > 70) return acc + 1;
      return acc;
    }, 0);
    const krDanger = result.reduce((acc, item) => {
      const kr = item.keyResults.filter((kr) => kr.progress <= 70);
      return acc + kr.length;
    }, 0);

    return {
      progress: result.length ? Math.round(allProgress / result.length) : 0,
      numOfObjective,
      numOfKeyResult,
      krHit,
      objHit,
      krDanger,
    };
  };

  const result = getReportData(data);

  return (
    <>
      {data && (
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <div className="shadow-md">
              <div className="flex flex-col gap-3 p-5">
                <div className="font-bold text-2xl">{result.progress} %</div>
                <div className="mt-2">Progress</div>
                <div className="text-md text-gray-500">The mean progress of Objectives within this session</div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            {" "}
            <div className="shadow-md">
              <div className="flex flex-col gap-3 p-5">
                <div className="font-bold text-2xl">{result.numOfObjective}</div>
                <div className="mt-2">Objectives</div>
                <div className="text-md text-gray-500">Total number of Objectives within the session.</div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="shadow-md">
              <div className="flex flex-col gap-3 p-5">
                <div className="font-bold text-2xl text-green-500">{result.objHit}</div>
                <div className="mt-2">Objectives hit</div>
                <div className="text-md text-gray-500">Total number of Objectives achieved so far.</div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="shadow-md">
              <div className="flex flex-col gap-3 p-5">
                <div className="font-bold text-2xl">{result.numOfKeyResult}</div>
                <div className="mt-2">Key Results</div>
                <div className="text-md text-gray-500">Total number of Key Results within the session.</div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="shadow-md">
              <div className="flex flex-col gap-3 p-5">
                <div className="font-bold text-2xl text-green-500">{result.krHit}</div>
                <div className="mt-2">Key Results hit</div>
                <div className="text-md text-gray-500">Total number of Key Results achieved so far.</div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="shadow-md">
              <div className="flex flex-col gap-3 p-5">
                <div className="font-bold text-2xl text-red-500">{result.krDanger}</div>
                <div className="mt-2">Key Results in danger</div>
                <div className="text-md text-gray-500">
                  Total number of Key Results that are not on track to be achieved.
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default YourReport;
