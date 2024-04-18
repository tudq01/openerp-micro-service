import { Route, Switch, useRouteMatch } from "react-router";

import UserManagerScreen from "views/manger-user/UserManagerScreen";

export default function ManagerRouter() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={UserManagerScreen} exact path={`${path}/my-employee`}></Route>
      </Switch>
    </div>
  );
}
