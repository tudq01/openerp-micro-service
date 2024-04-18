import { Route, Switch, useRouteMatch } from "react-router";

import TargetDetail from "views/target/TargetDetail";
import TargetManager from "views/target/TargetManager";
import TargetScreen from "views/target/TargetScreen";
import TargetCompanyScreen from "views/target/company/TargetCompanyScreen";
import TargetTeamScreen from "views/target/team/TargetTeamScreen";
import TeamScreen from "views/target/team/TeamScreen";

export default function TargetRouter() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={TargetScreen} exact path={`${path}/list`}></Route>
        <Route component={TeamScreen} exact path={`${path}/team-okr`}></Route>
        <Route component={TargetCompanyScreen} exact path={`${path}/company`}></Route>
        <Route component={TargetTeamScreen} exact path={`${path}/team-member`}></Route>
        <Route component={TargetManager} path={`${path}/manager`} exact />
        <Route component={TargetDetail} path={`${path}/:id`} exact />
      </Switch>
    </div>
  );
}
