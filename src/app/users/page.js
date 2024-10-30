"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Image,
  Tooltip,
  Divider,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  ModalFooter,
  Link,
  Checkbox,
  ModalHeader,
  Modal,
  ModalContent,
  ModalBody,
  Input,
  useDisclosure,
  Select,
  SelectItem,
  Switch,
  cn,
  Chip,
} from "@nextui-org/react";
import React from "react";
import { useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiSortAlt2 } from "react-icons/bi";
import { BiUpload } from "react-icons/bi";
import CreateVm from "@/components/dashboard/users/CreateVm";
import EditVm from "@/components/dashboard/users/EditVm";
import DeleteModal from "@/components/modal/DeleteModal";
// import DeleteModal from "@/components/dashboard/DeleteModal";

const rows = [
  {
    key: "1",
    name: "TonReic4321",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
];

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "role",
    label: "ROLE",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "actions",
    label: "ACTION",
  },
];

export default function App() {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [deleteMultiple, setDeleteMultiple] = useState(false);
  const [size, setSize] = React.useState("md");
  const sizes = ["xl"];

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [data, setData] = useState(datas);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleOpen = () => {
    setOpen(!open);
    setSize(size);
  };
  // const handleDeleteSelected = (comingId) => {
  //   if (comingId) {
  //     let filterData = data.filter((user) => user.id != comingId);
  //     setData(filterData);
  //     setSelectedKeys([]);
  //   }
  // };
  const handleDeleteSelected = (comingId) => {
    if (comingId) {
      let filterData = data.filter((user) => user.id != comingId);
      setData(filterData);
      setSelectedKeys([]);
    }
  };
  // const handleSelectedDelete = () => {
  //   const newSet = selectedKeys;
  //   const array = [...newSet];
  //   const result = data.filter((user) => !array.includes(user.id.toString()));
  //   setData(result);
  //   setSelectedKeys([]);
  //   if (selectedKeys === "all") {
  //     setData([]);
  //   }
  // };
  const handleSelectedDelete = () => {
    const newSet = selectedKeys;
    const array = [...newSet];
    const result = data.filter((user) => !array.includes(user.id.toString()));
    setData(result);
    setSelectedKeys([]);
    if (selectedKeys === "all") {
      setData([]);
    }
  };
  return (
    <div className="w-full container mx-auto">
      <div className="flex mt-10 items-center justify-between max-w-[92%] lg:max-w-[100%] mx-auto">
        <h2 className="4xl:text-5xl lg:text-3xl sm:text-2xl text-xl font-bold  ">
          All Users
        </h2>
        <div className="flex items-center gap-5">
          <CreateVm />
          <Dropdown
            classNames={{
              base: "bg-transparent w-full", // change arrow background
              content: "py-1 px-1 border border-default-200 ",
            }}
          >
            <DropdownTrigger>
              <Button
                className="bg-transparent font-semibold border border-web_darkgray/50 4xl:text-2xl 4xl:!py-6 "
                startContent={
                  <BiSortAlt2 className="text-web_lightBlue text-3xl 4xl:text-6xl" />
                }
              >
                <span className="mr-2  4xl:text-3xl">Sort by</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="new">
                <p className="4xl:text-3xl">Ascending</p>
              </DropdownItem>
              <DropdownItem key="new">
                <p className="4xl:text-3xl">Descending</p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <Divider className="my-4" />

      <div
        className=" mx-auto h-[65vh]  max-w-[92%] lg:max-w-[100%] overflow-y-scroll"
        id="userTable"
      >
        <Table
          isStriped
          selectionMode="multiple"
          defaultSelectedKeys={[]}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          removeWrapper
          aria-label="Example static collection table"
          classNames={{
            th: "bg-black  !rounded-none text-white text-base 4xl:py-5",
            tr: "!rounded-none ",
            thead: "",
            td: "5xl:!p-4",
            sortIcon: "5xl:!w-10 !h-20",
          }}
        >
          <TableHeader classNames="tableHead !rounded-t-lg">
            <TableColumn className="4xl:text-2xl py-4 4xl:py-5">
              Username
            </TableColumn>
            <TableColumn className="4xl:text-2xl py-4 4xl:py-5">
              Name
            </TableColumn>
            <TableColumn className="4xl:text-2xl py-4 4xl:py-5">
              Email
            </TableColumn>
            <TableColumn className="4xl:text-2xl py-4 4xl:py-5">
              Department
            </TableColumn>
            <TableColumn className="4xl:text-2xl py-4 4xl:py-5">
              Role
            </TableColumn>
            <TableColumn className="4xl:text-2xl py-4 4xl:py-5">
              Actions
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"Nothing here! ."}>
            {data.map((datas, index) => (
              <TableRow key={index + 1}>
                <TableCell>
                  <div className="flex items-center gap-2 justify-normal">
                    <div className="4xl:w-16 4xl:h-16 h-12 w-12">
                      <Image
                        src="/images/profileIcon.png"
                        alt="avatar"
                        width={1000}
                        height={1000}
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <h3 className="4xl:text-2xl font-medium">
                      {datas.userName}
                    </h3>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="4xl:text-2xl">{datas.name}</p>
                </TableCell>
                <TableCell>
                  <p className="4xl:text-2xl">{datas.email}</p>
                </TableCell>
                <TableCell>
                  <p className="4xl:text-2xl">{datas.vms}</p>
                </TableCell>
                <TableCell>
                  <p className="4xl:text-2xl">{datas.vmsAccess}</p>
                </TableCell>
                <TableCell>
                  {" "}
                  <div className="relative flex   items-center gap-2">
                    <div className="">
                      <EditVm />
                    </div>

                    <div className="">
                      <Tooltip
                        color="danger"
                        content={
                          <div className="max-w-[220px]  whitespace-nowrap  -left-2  bottom-9   px-2 py-1 rounded-md">
                            <p className=" font-normal text-xs 4xl:text-3xl text-black">
                              Delete User
                            </p>
                          </div>
                        }
                      >
                        <Button className="justify-start !w-10 h-10 p-0 !max-w-[20px] bg-transparent !outline-none !ring-transparent text-web_lightbrown 4xl:text-4xl text-lg cursor-pointer active:opacity-50">
                          <span
                            onClick={() => {
                              setCurrentId(datas.id);
                              handleOpen();
                            }}
                            className=" 4xl:text-4xl text-lg text-danger cursor-pointer active:opacity-50"
                          >
                            <RiDeleteBin5Line />
                          </span>
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end my-6 mr-9 ">
        <Button
          onClick={() => {
            handleOpen();
            setDeleteMultiple(true);
          }}
          className=" bg-[#E33F3F] text-white rounded-3xl 4xl:text-3xl 4xl:p-7 text-sm"
        >
          Delete Selected Users
        </Button>
      </div>

      {/* {selectedKeys.length > 0 && (
        <div className="py-5 bg-white w-full flex justify-end max-w-[94%] container mx-auto">
          <Button
            className="bg-red-500 capitalize text-white font-medium"
            // onClick={handleDeleteSelected2}
          >
            Delete selected users
          </Button>
        </div>
      )} */}
      <DeleteModal
        deleteMultiple={deleteMultiple}
        handleSelectedDelete={handleSelectedDelete}
        currentId={currentId}
        setCurrentId={setCurrentId}
        isOpen={open}
        onClose={handleOpen}
        size={sizes}
        handleDeleteSelected={handleDeleteSelected}
      />
      <Modal
        classNames={{
          body: "py-6",
          backdrop: "bg-web_darkBlue/20 backdrop-opacity-40",
          base: "border-[#292f46] bg-white max-w-[800px] w-full text-black",
          header: " text-black",
          footer: "",
          closeButton:
            "hover:text-web_lightbrown active:bg-web_darkbrown text-black !font-bold text-xl",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 sm:text-xl text-lg font-bold capitalize">
                Enter User Information
              </ModalHeader>
              <ModalBody>
                <div className="flexbox my-2">
                  <Input
                    classNames={{
                      label: "text-black font-semibold",
                      innerWrapper: "bg-transparent",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border",
                    }}
                    key="outside"
                    type="email"
                    label="First Name"
                    labelPlacement="outside"
                    placeholder="Enter your first name"
                  />
                  <Input
                    classNames={{
                      label: "text-black font-semibold",
                      innerWrapper: "bg-transparent",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border",
                    }}
                    key="outside"
                    type="email"
                    label="Last Name"
                    labelPlacement="outside"
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="flexbox my-2">
                  <Input
                    classNames={{
                      label: "text-black font-semibold",
                      innerWrapper: "bg-transparent",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border",
                    }}
                    key="outside"
                    type="email"
                    label="Username"
                    labelPlacement="outside"
                    placeholder="Enter your usernamee"
                  />
                  <Input
                    classNames={{
                      label: "text-black font-semibold",
                      innerWrapper: "bg-transparent",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border",
                    }}
                    key="outside"
                    type="email"
                    label="Email"
                    labelPlacement="outside"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flexbox my-2">
                  <Input
                    classNames={{
                      label: "text-black font-semibold",
                      innerWrapper:
                        "bg-transparent flex items-center fileInput",
                      inputWrapper:
                        "bg-transparent border-web_lightgray border max-w-[370px] w-full shadow-lg",
                    }}
                    key="outside"
                    type="file"
                    label="Display Picture"
                    labelPlacement="outside"
                    placeholder="Enter your username"
                    endContent={
                      <BiUpload className="text-2xl text-web_lightbrown pointer-events-none flex-shrink-0" />
                    }
                  />
                  <Select
                    labelPlacement="outside"
                    label="Select Operation System"
                    placeholder="Select Operation System"
                    className="max-w-[360px] w-full text-black font-semibold text-4xl"
                    classNames={{
                      base: "bg-transparent",
                      mainWrapper: "bg-transparent",
                      trigger: "bg-transparent rounded-xl shadow-lg",
                      // placeholder: "4xl:text-3xl",
                    }}
                    defaultSelectedKeys={["Window 11"]}
                  >
                    <SelectItem key="Window11" value="Window 11">
                      Window 11
                    </SelectItem>
                    <SelectItem key="Window10" value="Window 10">
                      Window 10
                    </SelectItem>
                  </Select>
                </div>
                <div className="flexbox my-2">
                  <Input
                    classNames={{
                      label: "text-black font-semibold",
                      innerWrapper: "bg-transparent",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border",
                    }}
                    key="outside"
                    type="number"
                    label="VMs No."
                    labelPlacement="outside"
                    placeholder="PC -245"
                  />
                  <Input
                    classNames={{
                      label: "text-black font-semibold",
                      innerWrapper: "bg-transparent",
                      inputWrapper:
                        "bg-transparent border-web_lightgray shadow-lg border",
                    }}
                    key="outside"
                    type="number"
                    label="License Key"
                    labelPlacement="outside"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                  />
                </div>
                <div className="flexbox my-2">
                  <div className="w-full">
                    <label
                      className="text-sm font-semibold text-black"
                      htmlFor=""
                    >
                      Install Recommended Applications{" "}
                    </label>
                    <div className="flexbox p-2 rounded-xl shadow-lg w-full border border-web_lightgray">
                      <Switch
                        classNames={{
                          base: cn(
                            "inline-flex flex-row-reverse w-full max-w-xl items-center text-black/50 text-sm capitalize",
                            "justify-between cursor-pointer rounded-xl gap-2 p-2",
                            "bg-transparent"
                          ),
                          wrapper:
                            "p-0 h-6 overflow-visible w-[70px] !bg-transparent border",
                          label: " !bg-transparent",
                          thumb: cn(
                            "w-6 h-6 border-2 shadow-lg",
                            //selected
                            "group-data-[selected=true]:ml-11 w-6 h-6 group-data-[selected=true]:bg-web_green bg-red-500",
                            // pressed
                            "group-data-[pressed=true]:w-10",
                            "group-data-[selected]:group-data-[pressed]:ml-9"
                          ),
                        }}
                        defaultSelected
                        size="sm"
                        color="success"
                        startContent={<span>Yes</span>}
                        endContent={<span>No</span>}
                      >
                        slack
                      </Switch>
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      className="text-sm font-semibold text-black"
                      htmlFor=""
                    >
                      Install Recommended Applications{" "}
                    </label>
                    <div className="flexbox p-2 rounded-xl shadow-lg w-full border border-web_lightgray">
                      <Switch
                        classNames={{
                          base: cn(
                            "inline-flex flex-row-reverse w-full max-w-xl items-center text-black/50 text-sm capitalize",
                            "justify-between cursor-pointer rounded-xl gap-2 p-2 ",
                            "bg-transparent"
                          ),
                          wrapper:
                            "p-0 h-6 overflow-visible w-[70px] !bg-transparent border",
                          label: " !bg-transparent",
                          thumb: cn(
                            "w-6 h-6 border-2 shadow-lg",
                            //selected
                            "group-data-[selected=true]:ml-11 w-6 h-6 group-data-[selected=true]:bg-web_green bg-red-500",
                            // pressed
                            "group-data-[pressed=true]:w-10",
                            "group-data-[selected]:group-data-[pressed]:ml-9"
                          ),
                        }}
                        defaultSelected
                        size="sm"
                        color="success"
                        startContent={<span>Yes</span>}
                        endContent={<span>No</span>}
                      >
                        Adobe Acrobat
                      </Switch>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="w-full bg-web_lightbrown text-white font-medium text-center "
                  color="danger"
                  onPress={onClose}
                >
                  Create VMs
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

const datas = [
  {
    id: 1,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Sales",
    vmsAccess: "yes",
  },
  {
    id: 2,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Marketing",
    vmsAccess: "yes",
  },
  {
    id: 3,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Softwares",
    vmsAccess: "yes",
  },
  {
    id: 4,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "IT",
    vmsAccess: "yes",
  },
  {
    id: 5,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Hardwares",
    vmsAccess: "yes",
  },
  {
    id: 6,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Sales",
    vmsAccess: "yes",
  },
  {
    id: 7,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Sales",
    vmsAccess: "yes",
  },
  {
    id: 8,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Sales",
    vmsAccess: "yes",
  },
  {
    id: 9,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Sales",
    vmsAccess: "yes",
  },
  {
    id: 10,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Sales",
    vmsAccess: "yes",
  },
  {
    id: 11,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Sales",
    vmsAccess: "yes",
  },
  {
    id: 12,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Sales",
    vmsAccess: "yes",
  },
  {
    id: 13,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Sales",
    vmsAccess: "yes",
  },
  {
    id: 14,
    userName: "TonReic4435",
    name: "Tony Reichert",
    email: "mailto:jonc001@gmail.com",
    vms: "Sales",
    vmsAccess: "yes",
  },
];
