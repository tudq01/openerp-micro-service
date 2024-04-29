import { Route, Switch, useRouteMatch } from "react-router";
import UserManagerScreen from "views/manger-user/UserManagerScreen";
import TeamMember from "views/team/TeamMember";

export default function TeamRouter() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={TeamMember} path={`${path}/:name/:id`} exact />
        <Route component={UserManagerScreen} path={`${path}/setting`} exact />
      </Switch>
    </div>
  );
}
