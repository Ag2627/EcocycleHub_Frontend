import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "./redux/store/store.js";
import './styles.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from "react-redux";
const GOOGLE_CLIENT_ID="250623611250-kkbf8l9hpkk0d080c952qc8pns87tugb.apps.googleusercontent.com"
ReactDOM.createRoot(document.getElementById("root")).render(

    <Provider store={store}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>,
    </Provider>

);
