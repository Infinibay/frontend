"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Image } from "@nextui-org/react";

// Icons
import { CgAddR } from "react-icons/cg";
import { FaRegRegistered } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { LuUsers2 } from "react-icons/lu";
import { MdGridOn } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { FaLaptop } from "react-icons/fa";

// Utils
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import auth from '@/utils/auth';

const Sidebar = ({ userSideBar, setUserSidebar }) => {
  const [addNewDepart, setAddNewDepart] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const [departs, setDeparts] = useState([]);

  const router = useRouter();

  const handleLogout = () => {
    auth.logout();
    router.push('/auth/sign-in');
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal) {
      setDeparts((prev) => [...prev, inputVal]);
      setAddNewDepart(false);
      setInputVal("");
    }
  };

  const [isLinkOpen, setIsLinkOpen] = useState(true);
  const [isHover, setHoverr] = useState(true);
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div
      className={`sidebarGradient flex flex-col relative  h-full w-full pt-20
    `}
    >
      <div className="flex-1 ">
        <RxCrossCircled
          onClick={() => setUserSidebar((prev) => !prev)}
          className="w-8 h-8 lg:hidden -mt-12 float-right mr-6 text-white mb-12"
        />
        <Link href={"/"}>
          <Image
            className="4xl:w-[350px] 2xl:w-[250px]  md:w-[200px] w-[150px]  mx-auto"
            src="/images/sidebarLogo.png"
            width={1000}
            height={1000}
            alt="logo"
          />
        </Link>
        <ul className="pt-20   flex flex-col 4xl:gap-y-10  2xl:gap-y-8 xl:gap-y-6 md:gap-y-4 gap-y-3 text-white font-medium 4xl:text-4xl 2xl:text-2xl xl:text-xl md:text-base text-sm pr-10">
          <li className="">
            <Link
              href={"/dashboard"}
              className={`group w-full h-full sidebarList 4xl:py-3.5
                ${pathname === "/dashboard" && "bg-web_lightbrown"}
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 17"
                fill="none"
                className="4xl:w-[36px] 2xl:w-[26px] w-[26px] "
              >
                <path d="M1 18V16.8667H24V18H1ZM4.19819 15.7333C3.68108 15.7333 3.24941 15.5584 2.90318 15.2086C2.55619 14.8595 2.3827 14.424 2.3827 13.9019V2.8292C2.3827 2.30787 2.55619 1.87267 2.90318 1.5236C3.25016 1.17453 3.68183 1 4.19819 1H20.8018C21.3189 1 21.7506 1.17453 22.0968 1.5236C22.4438 1.87342 22.6173 2.309 22.6173 2.83033V13.903C22.6173 14.4243 22.4442 14.8595 22.0979 15.2086C21.7517 15.5577 21.3197 15.7326 20.8018 15.7333H4.19819ZM4.19819 14.6H20.8018C20.9742 14.6 21.1327 14.5271 21.2773 14.3813C21.4212 14.2362 21.4932 14.0764 21.4932 13.9019V2.8292C21.4932 2.65542 21.4212 2.496 21.2773 2.35093C21.1327 2.20587 20.9742 2.13333 20.8018 2.13333H4.19819C4.02582 2.13333 3.86732 2.20587 3.72268 2.35093C3.57879 2.496 3.50684 2.6558 3.50684 2.83033V13.903C3.50684 14.0768 3.57879 14.2362 3.72268 14.3813C3.86732 14.5271 4.02582 14.6 4.19819 14.6Z" fill="white" />
                <path d="M3.50684 14.6V2.13333M1 18V16.8667H24V18H1ZM4.19819 15.7333C3.68108 15.7333 3.24941 15.5584 2.90318 15.2086C2.55619 14.8595 2.3827 14.424 2.3827 13.9019V2.8292C2.3827 2.30787 2.55619 1.87267 2.90318 1.5236C3.25016 1.17453 3.68183 1 4.19819 1H20.8018C21.3189 1 21.7506 1.17453 22.0968 1.5236C22.4438 1.87342 22.6173 2.309 22.6173 2.83033V13.903C22.6173 14.4243 22.4442 14.8595 22.0979 15.2086C21.7517 15.5577 21.3197 15.7326 20.8018 15.7333H4.19819ZM4.19819 14.6H20.8018C20.9742 14.6 21.1327 14.5271 21.2773 14.3813C21.4212 14.2362 21.4932 14.0764 21.4932 13.9019V2.8292C21.4932 2.65542 21.4212 2.496 21.2773 2.35093C21.1327 2.20587 20.9742 2.13333 20.8018 2.13333H4.19819C4.02582 2.13333 3.86732 2.20587 3.72268 2.35093C3.57879 2.496 3.50684 2.6558 3.50684 2.83033V13.903C3.50684 14.0768 3.57879 14.2362 3.72268 14.3813C3.86732 14.5271 4.02582 14.6 4.19819 14.6Z" stroke="white" stroke-width="0.5" />
              </svg>
              <span>Computers</span>
            </Link>
          </li>
          <li
            onMouseOver={() => {
              setIsLinkOpen(true);
              setHoverr(true);
            }}
            className="group 4xl:text-4xl max-h-[320px] 4xl:max-h-[820px] overflow-y-auto "
          >
            <Link
              href={"/dashboard/departments"}
              className={`group w-full h-full sidebarList 4xl:py-3.5
              ${pathname === "/dashboard/departments" && "bg-web_lightbrown"}
              ${console.log(pathname, "pathname....")}
              `}
            >
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 17"
                  fill="none"
                  className="4xl:w-[36px] 2xl:w-[26px] w-[26px] "
                >
                  <path
                    d="M25.3125 7.55556C25.5469 7.55556 25.7764 7.59491 26.001 7.67361C26.2256 7.75231 26.4307 7.85561 26.6162 7.98351C26.8018 8.1114 26.9629 8.27373 27.0996 8.47049C27.2363 8.66724 27.3535 8.87384 27.4512 9.09028C27.5 9.22801 27.5977 9.4838 27.7441 9.85764C27.8906 10.2315 28.0615 10.6644 28.2568 11.1562C28.4521 11.6481 28.6475 12.1646 28.8428 12.7057C29.0381 13.2468 29.2236 13.7535 29.3994 14.2257C29.5752 14.6979 29.7168 15.1013 29.8242 15.4358C29.9316 15.7703 29.9902 15.9769 30 16.0556C30 16.3212 29.9072 16.5425 29.7217 16.7196C29.5361 16.8967 29.3164 16.9902 29.0625 17H12.1875C11.9336 17 11.7139 16.9115 11.5283 16.7344C11.3428 16.5573 11.25 16.331 11.25 16.0556C11.25 15.9375 11.2891 15.7506 11.3672 15.4948C11.4453 15.239 11.543 14.9635 11.6602 14.6684C11.7773 14.3733 11.8896 14.0929 11.9971 13.8273C12.1045 13.5616 12.1875 13.36 12.2461 13.2222H6.5625C6.30859 13.2222 6.08887 13.1337 5.90332 12.9566C5.71777 12.7795 5.625 12.5532 5.625 12.2778C5.625 12.1597 5.66406 11.9728 5.74219 11.717C5.82031 11.4612 5.91797 11.1858 6.03516 10.8906C6.15234 10.5955 6.26465 10.3151 6.37207 10.0495C6.47949 9.78385 6.5625 9.58218 6.62109 9.44444H0.9375C0.683594 9.44444 0.463867 9.3559 0.27832 9.17882C0.0927734 9.00174 0 8.77546 0 8.5C0 8.4213 0.0537109 8.2147 0.161133 7.88021C0.268555 7.54572 0.410156 7.14236 0.585938 6.67014C0.761719 6.19792 0.952148 5.69126 1.15723 5.15017C1.3623 4.60909 1.55762 4.08767 1.74316 3.58594C1.92871 3.0842 2.09473 2.65133 2.24121 2.28733C2.3877 1.92332 2.49023 1.66262 2.54883 1.50521C2.71484 1.0625 2.99316 0.703414 3.38379 0.427951C3.77441 0.152488 4.20898 0.00983796 4.6875 0H14.0625C14.2969 0 14.5264 0.0393518 14.751 0.118056C14.9756 0.196759 15.1807 0.300058 15.3662 0.427951C15.5518 0.555845 15.7129 0.718171 15.8496 0.914931C15.9863 1.11169 16.1035 1.31829 16.2012 1.53472L17.0508 3.77778H19.6875C19.9219 3.77778 20.1514 3.81713 20.376 3.89583C20.6006 3.97454 20.8057 4.07784 20.9912 4.20573C21.1768 4.33362 21.3379 4.49595 21.4746 4.69271C21.6113 4.88947 21.7285 5.09606 21.8262 5.3125L22.6758 7.55556H25.3125ZM7.32422 7.55556L8.17383 5.28299C8.33984 4.84028 8.61816 4.48119 9.00879 4.20573C9.39941 3.93027 9.83398 3.78762 10.3125 3.77778H15.0439L14.4434 2.16927C14.4238 2.11024 14.375 2.05122 14.2969 1.99219C14.2188 1.93316 14.1406 1.89873 14.0625 1.88889H4.6875C4.61914 1.88889 4.5459 1.9184 4.46777 1.97743C4.38965 2.03646 4.34082 2.09549 4.32129 2.15451L2.28516 7.55556H7.32422ZM12.9492 11.3333L13.7988 9.06076C13.9648 8.61806 14.2432 8.25897 14.6338 7.98351C15.0244 7.70804 15.459 7.56539 15.9375 7.55556H20.6689L20.0684 5.94705C20.0488 5.88802 20 5.82899 19.9219 5.76997C19.8438 5.71094 19.7656 5.6765 19.6875 5.66667H10.3125C10.2441 5.66667 10.1709 5.69618 10.0928 5.75521C10.0146 5.81424 9.96582 5.87326 9.94629 5.93229C9.60449 6.83738 9.26758 7.73756 8.93555 8.63281C8.60352 9.52807 8.26172 10.4282 7.91016 11.3333H12.9492ZM27.7148 15.1111L25.6934 9.72483C25.6738 9.6658 25.625 9.60677 25.5469 9.54774C25.4688 9.48872 25.3906 9.45428 25.3125 9.44444H15.9375C15.8691 9.44444 15.7959 9.47396 15.7178 9.53299C15.6396 9.59201 15.5908 9.65104 15.5713 9.71007L14.9561 11.3333L14.2529 13.2222C14.0186 13.8519 13.7793 14.4815 13.5352 15.1111H27.7148Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span>Departments</span>
            </Link>
            <ul
              className={`${isHover && !isLinkOpen && "group-hover:block hidden"
                } ${isLinkOpen && "group-hover:block"
                }  border-r 4xl:space-y-8 space-y-3 border-white/20 border-b rounded-br-2xl p-2 w-full h-full py-5 pl-12 `}
            >
              <Link
                href={"/dashboard/departments"}
                className="sidebarListDropdown group/dropdown"
              >
                <span>
                  <MdGridOn className="4xl:text-4xl 2xl:text-2xl text-white group-hover/dropdown:text-web_lightbrown" />
                </span>
                <span className="group-hover/dropdown:text-web_lightbrown">
                  Default
                </span>
              </Link>

              {addNewDepart && (
                <li className="sidebarListDropdown group/dropdown">
                  <span>
                    <CgAddR className="4xl:text-4xl 2xl:text-2xl text-white " />
                  </span>
                  <form onSubmit={handleSubmit} className="">
                    <input
                      onChange={(e) => setInputVal(e.target.value)}
                      type="text"
                      autoFocus
                      className="border-none outline-none bg-transparent max-w-[140px] "
                    />
                  </form>
                </li>
              )}

              {departs?.map((item, index) => (
                <li key={index} className="sidebarListDropdown group/dropdown">
                  <span>
                    <MdGridOn className="4xl:text-4xl 2xl:text-2xl text-white group-hover/dropdown:text-web_lightbrown" />
                  </span>
                  <Link
                    href={`/dashboard/departments?type=${item}`}
                    className="group-hover/dropdown:text-web_lightbrown"
                  >
                    {capitalizeFirstLetter(item)}
                  </Link>
                </li>
              ))}

              <li
                onClick={() => {
                  setInputVal("");
                  setAddNewDepart(true);
                }}
                className="sidebarListDropdown group/dropdown"
              >
                <span>
                  <CgAddR className="4xl:text-4xl 2xl:text-2xl text-white group-hover/dropdown:text-web_lightbrown" />
                </span>
                <span className="group-hover/dropdown:text-web_lightbrown">
                  Add
                </span>
              </li>

              {/* <li className="sidebarListDropdown group/dropdown">
                <span>
                  <CgAddR className="4xl:text-4xl 2xl:text-2xl text-white " />
                </span>
                <form onSubmit={handleSubmit} className="">
                  <input
                    onChange={(e) => setInputVal(e.target.value)}
                    type="text"
                    autoFocus
                    className="border-none outline-none bg-transparent"
                  />
                </form>
              </li> */}
            </ul>
          </li>
          <li className="group">
            <Link
              className={`group w-full h-full sidebarList 4xl:py-3.5 ${pathname === "/dashboard/users" && "bg-web_lightbrown"
                }`}
              href={"/dashboard/users"}
            >
              <span>
                <LuUsers2 className="4xl:text-4xl 2xl:text-2xl text-white" />
              </span>
              <span>Users</span>
            </Link>
          </li>
          <li className="group w-full h-full sidebarList 4xl:py-3.5">
            <span>
              <FaRegRegistered className="4xl:text-4xl 2xl:text-2xl text-white" />
            </span>
            <span>Registers</span>
          </li>

          <li className="group">
            <Link
              className={`group w-full h-full sidebarList 4xl:py-3.5 ${pathname === "/dashboard/settings" && "bg-web_lightbrown"
                }`}
              href={"/dashboard/settings"}
            >
              <span>
                <IoSettingsOutline className="4xl:text-4xl 2xl:text-2xl text-white" />
              </span>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* mt-[85px] 4xl:mt-[405px] */}
      <div
        onClick={handleLogout}
        className="text-white cursor-pointer p-4 pb-6 flex items-center gap-3"
      >
        <Image
          src="/images/signout.svg"
          alt="Sign Out"
          className="4xl:w-14 4xl:h-14 2xl:w-10 2xl:h-10 xl:h-9 xl:w-9 h-6 w-6 rounded-none text-white"
        />
        <p className="4xl:text-3xl 2xl:text-2xl xl:text-xl md:text-lg text-base">
          Sign Out
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
