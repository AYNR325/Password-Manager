import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <>
      <nav className="flex justify-between  items-center p-5  ">
        <div className="logo font-bold text-white text-xl md:text-4xl">
          <Link>
            <span className="text-cyan-400"> &lt;</span>
            <span>Pass</span>
            <span className="text-cyan-400">OP/&gt;</span>
          </Link>
        </div>
        {/* <ul className="md:flex hidden gap-8 text-lg items-center mr-5 ">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/" className="hover:underline">
              Manage
            </Link>
          </li>
          <li>
            <Link to="/" className="hover:underline">
              Settings
            </Link>
          </li>
        </ul> */}
        <div className="flex text-2xl font-bold items-center mr-5 md:mr-20 hover:border rounded-2xl py-1 px-2 border-cyan-400">
          <button
            className="flex items-center gap-1"
            onClick={() => window.open("https://github.com/AYNR325")}
          >
            <lord-icon
              src="https://cdn.lordicon.com/sifiooif.json"
              trigger="hover"
              colors="primary:#66d7ee,secondary:#3a3347"
              style={{ width: "45px", height: "45px" }}
            ></lord-icon>
            <span className="hidden md:block">Github</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
