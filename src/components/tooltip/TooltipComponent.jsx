import React from 'react'

const TooltipComponent = ({ param,htmlTag }) => {
    return (
        <div className=" relative group  ">
            <div className="dark:text-white    cursor-pointer font-extralight  !justify-start">
                {htmlTag}
            </div>
            <div className="absolute group-hover:block max-w-[320px]  whitespace-nowrap  bg-neutral-200 -left-2 hidden bottom-9   bg-dimGray/90 px-2 py-1 rounded-md ">
                <p className=" font-normal text-xs 4xl:text-3xl text-black ">
                    {param}
                </p>
            </div>
        </div>
    )
}

export default TooltipComponent