import { Avatar, Card, CardContent, CardHeader, Divider, Grid, Link, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useParams } from "react-router";
import { BiDetail } from "react-icons/bi";
import { a11yProps, AntTab, AntTabs, TabPanel } from "../components/tab";
import { makeStyles } from "@material-ui/core/styles";
import LearningSession from "components/class/class-detail/learning-session/LearningSession";


const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
  grid: {
    paddingLeft: 56,
  },
  divider: {
    width: "90%",
    marginTop: 12,
    marginBottom: 12,
  },
  dividerGeneral: {
    backgroundColor: "black",
  },
  tabs: {
    backgroundColor: theme.palette.background.paper,
  },
}));

function ClassInfo() {
  const params = useParams();
  const classId = params.id;

  const [classInfo, setClassInfo] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const classStyles = useStyles();

  const handleChangeTab = (event, tabIndex) => {
    setActiveTab(tabIndex);
  };

  const tabNames = ["Thông tin chung", "Nội dung", "Bài tập trắc nghiệm", "DS sinh viên", "Bài tập", "Buổi học"];

  return (
    <>
      <AntTabs value={activeTab} onChange={handleChangeTab} scrollButtons="auto" variant="scrollable">
        {tabNames.map((label, idx) => (
          <AntTab key={label} label={label} {...a11yProps(idx)} />
        ))}
      </AntTabs>

      <TabPanel value={activeTab} index={0}>
        <Card className={classStyles.card}>
          <CardHeader
            avatar={
              <Avatar style={{ background: "#ff7043" }}>
                <BiDetail size={32} />
              </Avatar>
            }
            title={<Typography variant="h5">Thông tin lớp</Typography>}
          />
          <CardContent>
            <Grid container className={classStyles.grid}>
              <Grid item md={3} sm={3} xs={3} direction="column">
                <Typography>Class Code</Typography>
                <Typography>Course Code</Typography>
                <Typography>Course Name</Typography>
                <Typography>Class Type</Typography>
              </Grid>
              <Grid item md={8} sm={8} xs={8}>
                <Typography>
                  <b>:</b> {classInfo?.code}
                </Typography>
                <Typography>
                  <b>:</b> {classInfo?.courseId}
                </Typography>
                <Typography>
                  <b>:</b> {classInfo?.name}
                </Typography>
                <Typography>
                  <b>:</b> {classInfo?.classType}
                </Typography>
              </Grid>

              <div className={classStyles.divider}>
                <Divider variant="fullWidth" classStyles={{ root: classStyles.dividerGeneral }} />
              </div>

              <Grid item md={3} sm={3} xs={3}>
                <Typography>Teacher</Typography>
                <Typography>Email</Typography>
              </Grid>
              <Grid item md={8} sm={8} xs={8}>
                <Typography>
                  <b>:</b> {classInfo?.teacherName}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    fontSize: "1rem",
                  }}
                >
                  <b>:&nbsp;</b>
                  {<Link href={`mailto:${classInfo?.email}`}>{classInfo?.email}</Link>}
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <LearningSession id={1} />
      </TabPanel>
    </>
  );
}

export default ClassInfo;
