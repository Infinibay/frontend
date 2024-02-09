import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Link} from "@nextui-org/react";
import Image from "next/image";


const ModalWarning =() =>{
const {isOpen, onOpen, onClose} = useDisclosure();
  const [size, setSize] = React.useState('xl')

  const sizes = [ "xl", ];
  const handleOpen = (size) => {
    setSize(size)
    onOpen();
  }

  return (
    <>
    
    <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <Button key={size} onPress={() => handleOpen(size)}>Open {size}</Button>
        ))}  
      </div>
      <div className="flex flex-wrap gap-3">
      
      </div>
      <Modal
        size={size}
        isOpen={isOpen}
      >
        <ModalContent className='p-3 py-8 '>
        
            <>
              <ModalBody>
              

                  <div className="flex justify-around ">
                <h1 className="lg:text-4xl text-2xl font-semi-bold">List of  <span className="font-bold text-[#EC9430]">{`GPU'S`}</span> </h1>
                <Button
                        onPress={onClose}
                        className="mx-1 lg:px-16 px-8 rounded-2xl lg:py-6 py-3 text-black bg-transparent border-2"
                      >
                        Close
                      </Button>
                </div>
{/* cols */}
<div className="grid grid-cols-2 justify-center items-center border-2 rounded-3xl divide-x">


  {/* col-1 */}

  <div className="flex flex-col space-y-3   ">
    <div className="bg-black p-3 rounded-tl-3xl">
  <p className="text-2xl font-semibold  text-white "> {`GPU's`}</p>
  </div>

  
<p className="text-xl font-normal px-3"> Nvidia 3080</p>
<p className="text-xl font-normal px-3"> Nvidia 3080</p>
<p className="text-xl font-normal px-3"> Nvidia 3080</p>
<p className="text-xl font-normal px-3"> Nvidia 3080</p>
<p className="text-xl font-normal px-3"> Nvidia 3080</p>
<p className="text-xl font-normal px-3 pb-3"> Nvidia 3080</p>

  </div>

 {/* col-2 */}
 <div className="space-y-4 ">
 <div className="bg-black p-3 rounded-tr-3xl ">
  <p className="text-2xl font-semibold  text-white  "> Website Links</p>
  </div>
  <Link href="https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/">
    <p className="text-xs px-1 ">https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/</p>
</Link>
<Link href="https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/">
    <p className="text-xs px-1">https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/</p>
</Link>
<Link href="https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/">
    <p className="text-xs px-1">https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/</p>
</Link>
<Link href="https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/">
    <p className="text-xs px-1">https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/</p>
</Link>
<Link href="https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/">
    <p className="text-xs px-1 pb-3">https://www.nvidia.com/en-us/geforce/
graphics-cards/40-series/rtx-4080/</p>
</Link>
    </div>

</div>
            
                  
                  
              
              </ModalBody>
            </>
        
        </ModalContent>
      </Modal> 

    </>
  )
}

export default ModalWarning;