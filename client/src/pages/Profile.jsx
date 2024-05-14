import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = useSelector(
    (state) => state.user.userData?.user || state.user.userData,
  );
  // console.log(user);
  const admin = useSelector((state) => state.user.userData.allUsers);

  // useEffect(() => {
  //   const fectchuser = async () => {
  //     const set = useSelector((state) => state.user.userData.allUsers);
  //     setAllUsers(set);
  //   };
  //   fectchuser();
  // }, [setAllUser]);
  const [allUsers, setAllUsers] = useState([]);
  console.log(allUsers);
  const [allUser, setAllUser] = useState([allUsers]);
  const [userFiles, setUserFiles] = useState([]);
  const [Documents, setDocuments] = useState([]);
  const [adminFiles, setAdminFiles] = useState([]);
  // console.log(Documents);

  const userId = user._id;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await axios.get(`http://localhost:6969/auth/getUsers`);
        console.log(result);
        setAllUsers(result.data.users);
      } catch (error) {
        console.log(error);
      }
    };

    const getUserFiles = async () => {
      try {
        const result = await axios.get(
          `http://localhost:6969/notes/getAllNotes`,
        );
        // console.log(result.data);
        setDocuments(result.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
    getUserFiles();
  }, [setAllUsers, user.isAdmin]);

  useEffect(() => {
    const getUserFiles = async () => {
      try {
        const result = await axios.get(
          `http://localhost:6969/notes/getFiles/${userId}`,
        );
        // console.log(result.data);
        setUserFiles(result.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUserFiles();
  }, [userId]);

  const deleteUser = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:6969/auth/deleteUser/${id}`,
      );
      console.log(result);
      const us = setAllUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User Deleted Successfully");

      // console.log(us, "us");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Delete User");
    }
  };

  const deleteFile = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:6969/notes/deleteNote/${id}`,
      );
      console.log(result);
      const us = setUserFiles((prev) => prev.filter((file) => file._id !== id));
      toast.success("File Deleted Successfully");

      console.log(us);
    } catch (error) {
      console.log(error);
      toast.error("Failed to Delete File");
    }
  };

  const GetUserNote = async (id) => {
    try {
      const result = await axios.get(
        `http://localhost:6969/auth/getUsersNote/${id}`,
      );
      console.log(result.data.notes);
      // setUserFiles(result.data.data);
      setAdminFiles(result.data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  const numberofUploads = userFiles.length;
  const numberofFiles = userFiles.reduce((count, file) => count + 1, 0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center border border-red-500 lg:h-heightWithoutNavbar lg:flex-row">
      <div className="flex w-full flex-col items-center justify-center border-[3px] border-green-500 py-4 lg:h-full lg:w-[40%]">
        <div className="grid h-[200px] w-[200px] place-content-center overflow-hidden rounded-full bg-gray-400 text-2xl font-black">
          {/* 200 x 200 */}
          <img src={user.profileImage} alt="userprofile" className="" />
        </div>
        <div className="">
          <div className=" my-2 flex flex-col items-center justify-center ">
            <h2 className="text-2xl font-black">
              <span>{user.firstName}</span> <span>{user.lastName}</span>
            </h2>
            <p className="mt-1 text-center">{user.userName}</p>
            <p className="mt-1 text-center">{user.userBio}</p>
          </div>
        </div>
        {/* counts */}
        <div className="flex items-center justify-center gap-4">
          <div className="grid h-[80px] w-[100px] place-content-center">
            <p className="text-center text-[12px] font-bold">
              No. of Uploads :
            </p>
            <p className="text-center text-5xl font-black">{numberofUploads}</p>
          </div>

          <span className="h-[60px] w-[1px] bg-gray-400" />
          <div className="grid h-[80px] w-[100px] place-content-center">
            <p className="text-center text-[12px] font-bold">No. of Files :</p>
            <p className="text-center text-5xl font-black">{numberofFiles}</p>
          </div>
        </div>
        {admin && user.isAdmin && (
          <h1 className="m-5 text-2xl font-semibold">
            Total users : {allUsers.length}
          </h1>
        )}
      </div>

      <div className="h-auto min-h-screen w-full overflow-scroll border-[3px] border-amber-500 p-5 lg:h-full  lg:w-[80%]">
        <h1 className="mb-3 text-xl font-black">My Documents :</h1>
        <div className="relative  grid grid-cols-1 gap-5 p-7 sm:grid-cols-2 md:grid-cols-3">
          {userFiles.map((file) => (
            <div
              key={file._id}
              className="g mb-3 flex  h-[75px] flex-wrap items-center justify-between rounded-xl border border-black px-4"
            >
              <a
                href={`http://localhost:6969/files/${file.files}`}
                className="  w-[30%] overflow-hidden text-ellipsis text-xl font-semibold capitalize"
                target="_blank"
              >
                {file.fileName}
              </a>
              <button
                onClick={() => deleteFile(file._id)}
                className="  whitespace-nowrap rounded-2xl bg-red-600 p-2 text-base font-semibold text-white"
              >
                Delete File
              </button>
              {/* <p className="absolute left- top-5 ">
                <embed
                  src={file}
                  type="application/pdf"
                  width="100%"
                  height="400px"
                />
              </p> */}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6 ">
          {admin && user.isAdmin && (
            <>
              <div className="">
                <h1 className="whitespace-nowrap text-3xl font-bold ">
                  Admin Access -
                </h1>
              </div>
              <br />

              {admin &&
                allUsers?.map((user) => (
                  <div className="">
                    <div
                      key={user._id}
                      className="flex  items-center justify-between overflow-hidden rounded-lg bg-slate-500 p-5 "
                    >
                      <p className="text-xl font-semibold">{user.userName}</p>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="whitespace-nowrap rounded-lg bg-red-600 p-3 font-semibold text-white"
                      >
                        Delete User
                      </button>
                      <button
                        onClick={() => GetUserNote(user._id)}
                        className=" hidden whitespace-nowrap rounded-lg bg-green-600 p-3 font-semibold text-white"
                      >
                        Manage Users Documents
                      </button>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
      <div className="div  p-5">
        <h1 className="mb-4 whitespace-nowrap text-3xl font-bold ">
          All Documents -{" "}
        </h1>

        {Documents.map((doc) => (
          <>
            <div key={doc._id} className=" flex  flex-col items-center ">
              {/* <p className="mb-2 w-full rounded-lg bg-slate-400 p-3 text-center text-xl font-semibold">
                {doc.fileName}
              </p> */}
              <a
                href={`http://localhost:6969/files/${doc.files}`}
                key={doc._id}
                className="mb-3 flex w-full items-center justify-between gap-3 rounded-xl border border-black p-3 px-4"
                target="_blank"
              >
                <p className="w-full font-semibold"> {doc.fileName}</p>
                {/* <p className="absolute left- top-5 ">
                  <embed
                    src={file}
                    type="application/pdf"
                    width="100%"
                    height="400px"
                  />
                </p> */}
              </a>
            </div>
          </>
        ))}
        <Link
          to="/search"
          className=" whitespace-nowrap text-lg font-bold text-blue-700"
        >
          Find out More Document ?
        </Link>
      </div>
    </div>
  );
};

export default Profile;
