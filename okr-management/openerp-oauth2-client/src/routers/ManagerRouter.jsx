import PeriodDetailScreen from "components/modal/PeriodDetailScreen";
import { Route, Switch, useRouteMatch } from "react-router";

import PeriodScreen from "views/target/period/PeriodScreen";

export default function ManagerRouter() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={PeriodScreen} exact path={`${path}/period`}></Route>
        <Route component={PeriodDetailScreen} exact path={`${path}/period/:id`}></Route>
      </Switch>
    </div>
  );
}
