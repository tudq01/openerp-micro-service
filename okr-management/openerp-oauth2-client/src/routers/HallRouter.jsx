

import { Route, Switch, useRouteMatch } from "react-router";

import RoomDetail from "views/HallDetail";
import HallScreen from "views/HallScreen";

export default function HallRouter() {
 let { path } = useRouteMatch();
 return (
   <div>
     <Switch>
       <Route component={HallScreen} exact path={`${path}/list`}></Route>
       <Route component={RoomDetail} path={`${path}/:id`} exact />
     </Switch>
   </div>
 );
}

