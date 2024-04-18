import { Route, Switch, useRouteMatch } from "react-router";
import TeamMember from "views/team/TeamMember";

export default function TeamRouter() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={TeamMember} path={`${path}/:name/:id`} exact />
      </Switch>
    </div>
  );
}
