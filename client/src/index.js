import "./index.css";
import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import ChangePassword from "./Pages/ChangePassword/Change";
import VerifyEmail from "./Pages/VerifyEmail/VerifyEmail";
import ResetPassword from "./Pages/ResetPassword/Reset";
import UpdatePassword from "./Pages/UpdatePassword/UpdatePassword";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Selections from "./Pages/Selections/Selections";
import { ListingContextProvider } from "./Context/listing-context";
import NeedRoom from "./Pages/NeedRoom/NeedRoom";
import store from "./store/ReduxStore";
import { Provider } from "react-redux";
const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  // { DEPRECATED
  //   path: "/changePassword",
  //   element: <ChangePassword />,
  // },
  {
    path: "/updatePassword",
    element: <UpdatePassword />,
  },
  {
    path: "/resetPassword",
    element: <ResetPassword />,
  },
  {
    path: "/verifyEmail",
    element: <VerifyEmail />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/selections",
    element: <Selections />,
  },
  {
    path: "/need",
    element: <NeedRoom />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Provider store={store}>
      <Fragment>
        <ListingContextProvider>
          <RouterProvider router={router} />
        </ListingContextProvider>
        <ToastContainer />
      </Fragment>
    </Provider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
