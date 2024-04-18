import { Route, Switch, useRouteMatch } from "react-router";
import ClassScreen from "views/Class";
import ClassDetail from "views/ClassDetail";


export default function ClassRouter() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={ClassScreen} exact path={`${path}/class/list`}></Route>
        <Route component={ClassDetail} path={`${path}/class/:id`} exact />
       
      </Switch>
    </div>
  );
}
