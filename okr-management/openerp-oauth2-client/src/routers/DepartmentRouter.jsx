import { Route, Switch, useRouteMatch } from "react-router";
import DepartmentScreen from "views/department/DepartmentScreen";

import TeamScreen from "views/team/TeamScreen";

export default function DepartmentRouter() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={DepartmentScreen} exact path={`${path}/list`}></Route>
        <Route component={TeamScreen} path={`${path}/:id/teams`} exact />
      </Switch>
    </div>
  );
}
