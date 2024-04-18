import { LinearProgress } from "@mui/material";
import { Layout } from "layout";
import { drawerWidth } from "layout/sidebar/SideBar";
import { Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { useNotificationState } from "state/NotificationState";
import NotFound from "views/errors/NotFound";
import ClassRouter from "./ClassRouter";
import DepartmentRouter from "./DepartmentRouter";
import HallRouter from "./HallRouter";
import PrivateRoute from "./PrivateRoute";
import TargetRouter from "./TargetRouter";
import TeacherRouter from "./TeacherRouter";
import TeamRouter from "./TeamRouter";
import ManagerRouter from "./ManagerRouter";

const styles = {
  loadingProgress: {
    position: "fixed",
    top: 0,
    left: -drawerWidth,
    width: "calc(100% + 300px)",
    zIndex: 1202,
    "& div": {
      top: "0.5px",
    },
  },
};

function MainAppRouter(props) {
  const location = useLocation();
  const notificationState = useNotificationState();

  useEffect(() => {
    notificationState.open.set(false);
  }, [location.pathname, notificationState.open]);

  return (
    <Layout>
      <Suspense fallback={<LinearProgress sx={styles.loadingProgress} />}>
        <Switch>
          <Route component={() => <></>} exact path="/" />
          {/* <PrivateRoute component={DemoScreen} exact path="/demo" /> */}
          <PrivateRoute component={TeacherRouter} path="/teacher" />
          <PrivateRoute component={ClassRouter} path="/student" />
          <PrivateRoute component={HallRouter} path="/hall" />
          <PrivateRoute component={TargetRouter} path="/target" />
          <PrivateRoute component={DepartmentRouter} path="/department" />
          <PrivateRoute component={ManagerRouter} path="/manager" />
          <PrivateRoute component={TeamRouter} path="/team" />
          {/* <Route component={error} path="*" /> */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default MainAppRouter;
