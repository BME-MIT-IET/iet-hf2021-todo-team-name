import { combineReducers } from "@reduxjs/toolkit";
import classReducer from "./classes";
import issueReducer from "./issues";
import columnReducer from "./columns";
import userReducer from "./users";
import labelReducer from "./labels";
import searchIssueReducer from "./searchIssue";
import workspaceReducer from "./workspaces";

const rootReducer = combineReducers({
  classes: classReducer,
  issues: issueReducer,
  columns: columnReducer,
  auth: userReducer,
  labels: labelReducer,
  searchIssues: searchIssueReducer,
  workspaces: workspaceReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
