import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAppSelector } from "../store";

interface PrivateRouteProps {
  children: any;
  path: string;
  exact: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  path,
  exact,
}) => {
  const { auth } = useAppSelector((state) => state);
  return (
    <Route exact path={path}>
      {auth.user ? children : <Redirect to="/login" />}
    </Route>
  );
  // return (
  //     <Route
  //       path={path}
  //       render={({ location }) =>
  //         auth.user ? (
  //           children
  //         ) : (
  //           <Redirect
  //             to={{
  //               pathname: "/login",
  //               state: { from: location }
  //             }}
  //           />
  //         )
  //       }
  //     />
  // );
};
