import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { legacy_createStore } from "redux";
import { store } from "./store/store.js";

const globalStore = legacy_createStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={globalStore}>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
);
