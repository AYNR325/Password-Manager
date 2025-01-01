import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
function Manage() {
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    setpasswordArray(passwords);
    console.log(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const savePassword = async () => {
    // Check for empty fields
    if (form.site === "" || form.username === "" || form.password === "") {
      toast.warn("Please fill all the fields!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    if (isEditing) {
      // Editing an existing password
      try {
        console.log("Payload being sent:", {
          id: editId,
          newSite: form.site,
          newUsername: form.username,
          newPassword: form.password,
        });

        const response = await fetch("http://localhost:3000/", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editId,
            newSite: form.site,
            newUsername: form.username,
            newPassword: form.password,
          }),
        });

        const result = await response.json();
        console.log("Response from server:", response.status, result);
        toast.success("Password Edited Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } catch (error) {
        console.error("Error editing password:", error);
        toast.error("An error occurred while editing the password.", {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
        });
      }
    } else {
      // Adding a new password
      const newPassword = { ...form, id: uuidv4() };

      try {
        const response = await fetch("http://localhost:3000/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPassword),
        });

        if (response.ok) {
          toast.success("Saved Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error("Failed to save the password.", {
            position: "top-center",
            autoClose: 5000,
            theme: "dark",
          });
        }
      } catch (error) {
        console.error("Error saving password:", error);
        toast.error("An error occurred while saving the password.", {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
        });
      }
    }

    await getPasswords(); // Fetch updated passwords
    // Reset form state
    setform({ site: "", username: "", password: "" });
    setIsEditing(false);
    setEditId(null);
  };

  const copyText = (text) => {
    toast(" Copied to clipboard", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };
  const editPassword = (id) => {
    console.log("Edit Password:", id);
    const passwordToEdit = passwordArray.find((item) => item.id === id);
    setform(passwordToEdit);
    setpasswordArray(passwordArray.filter((item) => item.id !== id));
    setIsEditing(true);
    setEditId(id);
  };
  const deletePassword = async (id) => {
    console.log("Delete Password:", id);
    let c = confirm("Do you really want to delete this password?");
    if (c) {
      setpasswordArray(passwordArray.filter((item) => item.id !== id));
      let res = await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast.error(" Password Deleted!!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      {/* <div>Manage</div> */}{" "}
      <div className="min-h-[80vh]">
        <div className="flex flex-col items-center justify-center gap-8 ">
          <p className="text-center text-2xl md:text-4xl text-cyan-400 font-bold">
            Your own Password Manager
          </p>
          <div className="flex flex-col p-4 text-white gap-8 items-center">
            <input
              value={form.site}
              onChange={handleChange}
              placeholder="Enter website URL"
              className="rounded-full border border-cyan-500 w-[150%] p-4 py-1 text-black"
              type="text"
              name="site"
              id="site"
            />
            <div className="flex flex-col md:flex-row w-[150%] justify-between gap-8">
              <input
                value={form.username}
                onChange={handleChange}
                placeholder="Enter Username"
                className="rounded-full border border-cyan-500 w-full p-4 py-1 text-black"
                type="text"
                name="username"
                id="username"
              />
              <input
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-cyan-500 w-full p-4 py-1 text-black"
                type="password"
                name="password"
                id="password"
              />
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-cyan-400 hover:bg-cyan-300 rounded-full px-5 py-1 w-fit border border-cyan-900 font-bold text-xl text-slate-900 "
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            Save
          </button>
        </div>
        <div className="passwords mx-auto w-full max-w-7xl">
          <h2 className="font-bold text-2xl pt-5 pb-2 text-center">
            Your Passwords
          </h2>
          {passwordArray.length === 0 && (
            <div className="text-center"> No passwords to show</div>
          )}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full  overflow-hidden mb-10">
              <thead className=" text-white border border-cyan-400 ">
                <tr className="bg-slate-700">
                  <th className="py-2 border border-cyan-400">Site</th>
                  <th className="py-2 border border-cyan-400">Username</th>
                  <th className="py-2 border border-cyan-400">Password</th>
                  <th className="py-2 border border-cyan-400">Actions</th>
                </tr>
              </thead>
              <tbody className="border border-cyan-400">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-2 border border-cyan-400 text-center">
                        <div className="flex items-center justify-center ">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                              colors="primary:#30c9e8"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-cyan-400 text-center">
                        <div className="flex items-center justify-center ">
                          <span>{item.username}</span>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                              colors="primary:#30c9e8"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-cyan-400 text-center">
                        <div className="flex items-center justify-center ">
                          {/* <span>{"*".repeat(item.password.length)}</span> */}
                          <span>
                            {"*".repeat(
                              item.password ? item.password.length : 0
                            )}
                            {/* {item.password} */}
                          </span>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            <lord-icon
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                              colors="primary:#30c9e8"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="justify-center py-2 border border-cyan-400 text-center">
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => {
                            editPassword(item.id);
                          }}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/gwlusjdu.json"
                            trigger="hover"
                            colors="primary:#30c9e8"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => {
                            deletePassword(item.id);
                          }}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/skkahier.json"
                            trigger="hover"
                            colors="primary:#30c9e8"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Manage;
