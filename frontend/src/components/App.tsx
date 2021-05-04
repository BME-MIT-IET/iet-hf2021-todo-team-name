import React from "react";
import Switch from "react-bootstrap/esm/Switch";
import { BrowserRouter, Route } from "react-router-dom";
import { ClassProvider } from "./contexts/ClassProvider";
import Dashboard from "./Dashboard";
import { Login } from "./Login";
import { PrivateRoute } from "./PrivateRoute";
import { Register } from "./Register";

const App: React.FC = () => {
  return (
    <ClassProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>

          <PrivateRoute exact path="/">
            <Dashboard />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </ClassProvider>
  );
};

export default App;
