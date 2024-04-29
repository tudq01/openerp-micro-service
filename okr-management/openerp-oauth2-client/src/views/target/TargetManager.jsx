import { Avatar, Card, CardContent, CardHeader, Grid, Link, Typography } from "@material-ui/core";
import { useQuery } from "@tanstack/react-query";
import { request } from "api";
import { BiDetail } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { errorNoti } from "utils/notification";

export const errorHandlers = {
  onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000),
};

const TargetManager = () => {
  const history = useHistory();

  const { data } = useQuery({
    queryKey: ["your-manager"],
    queryFn: async () => {
      const res = await request("GET", `/users/your-manager`, null, errorHandlers, null, {});
      return res.data;
    },
    enabled: true,
  });

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Avatar style={{ background: "#ff7043" }}>
              <BiDetail size={32} />
            </Avatar>
          }
          title={<Typography variant="h5">Manager Info</Typography>}
        />
        <CardContent>
          <Grid container className={""}>
            <Grid item md={3} sm={3} xs={3} direction="column">
              <div className="flex flex-row gap-3 items-center">
                <FaRegUser size={18} />
                <Typography>Manager name</Typography>
              </div>
              <div className="flex flex-row gap-3 items-center">
                <HiOutlineMail size={18} />
                <Typography>Manager email</Typography>
              </div>
            </Grid>
            <Grid item md={8} sm={8} xs={8}>
              <Typography>
                <b>:</b> {data?.manager?.lastName + " " + data?.manager?.firstName}
              </Typography>
              <Typography>
                <div
                  style={{
                    display: "flex",
                    fontSize: "1rem",
                  }}
                >
                  <b>:&nbsp;</b>
                  {<Link href={`mailto:${data?.manager?.email}`}>{data?.manager?.email}</Link>}
                </div>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default TargetManager;
