import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import allReducers from "./application/reducers";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "./application/Middleware/epics/index";
import Socketmiddleware from "./application/Middleware/socketMiddleware";
import App from "./App";
import { withLazyComponent } from "./views/components/HOC/WithLazyComponent";
const AppComponnet = withLazyComponent(App);
const epicMiddleware = createEpicMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  allReducers,
  composeEnhancers(applyMiddleware(epicMiddleware, Socketmiddleware()))
);
epicMiddleware.run(rootEpic);
store.subscribe(() => {
  const client = store.getState().client;
  if (client) localStorage.setItem("user", JSON.stringify(client));
  else localStorage.clear();
});
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppComponnet />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
