import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Navbar() {

  return (
    <>
      <div className="p-3 bg-black">
        <nav className="flex justify-evenly ">
          <NavLink className={(e) => {return e.isActive?" bg-amber-200 border-2 rounded-md":""}} to="/"><ul className=" text-white text-2xl hover:bg-red-400 rounded p-1">Home   </ul></NavLink>
          <NavLink className={(e) => {return e.isActive?" bg-amber-200 border-2 rounded-md":""}} to="/login"><ul className=" text-white text-2xl hover:bg-red-400 rounded p-1">SignIn </ul></NavLink>
          <NavLink className={(e) => {return e.isActive?" bg-amber-200 border-2 rounded-md":""}} to="/register"><ul className=" text-white text-2xl hover:bg-red-400 rounded p-1">SignUp </ul></NavLink>
          <NavLink className={(e) => {return e.isActive?" bg-amber-200 border-2 rounded-md":""}} to="/user"><ul className=" text-white text-2xl hover:bg-red-400 rounded p-1">Profile</ul></NavLink>
        </nav>
      </div>
    </>
  );
}
