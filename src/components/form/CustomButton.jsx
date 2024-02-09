import React from "react";

function Button({
  name,
  type,
  className,
  handleClick,
  newClass,
  loader,
  disabled,
  selectedPrev,
  selectedNext,
  customClass,
}) {
  return (
    <div className={customClass}>
      <button
        type={type}
        disabled={disabled}
        className={` font-medium sm:text-lg text-sm px-5 py-2 sm:px-8 rounded-2xl   capitalize  
        ${selectedPrev ? "!text-white btnGradientLightBlue" :"text-mweb_butnColor"}  ${selectedNext ? '!text-white btnGradientLightBlue' : 'text-mweb_butnColor' }`}
        onClick={handleClick}
      >
        {name}
      </button>
    </div>
  );
}

export default Button;
