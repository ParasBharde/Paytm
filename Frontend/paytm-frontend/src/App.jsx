import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/navbar";
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import Home from "./components/home";
import Profile from "./components/profile";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <> <Navbar /><Home /> </> ,
    },
    {
      path: "/login",
      element: <> <Navbar /><SignIn /></> ,
    },
    {
      path: "/register",
      element: <> <Navbar /><SignUp /></> ,
    },
    {
      path: "/user",
      element: <> <Navbar /><Profile/></> ,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
