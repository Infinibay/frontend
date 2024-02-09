import { Button, Link } from "@nextui-org/react";

const Navigation = ({ prevUrl, nextUrl, nextBtn }) => {
  return (
    <div className="w-[70%] !bg-white z-10 4xl:mt-64 mt-10 rounded-r-full rounded-l-full border-2 border-web_borderGray flex flex-row justify-between">
      {prevUrl ? (
        <Button
          as={Link}
          href={prevUrl}
          className={`text-web_lightBlue uppercase 4xl:py-[30px]  4xl:text-3xl 4xl:ml-4  4xl:mx-2 font-semibold bg-transparent max-w-[180px]  w-full`}
        >
          previous
        </Button>
      ) : (
        <div className="w-full text-white">.</div>
      )}
      <Button
        as={Link}
        href={nextUrl}
        className="btnGradientLightBlue px-8 scale-[1.25] max-w-fit 4xl:max-w-[250px]  w-full ml-auto 4xl:rounded-full 4xl:py-[30px] 4xl:text-3xl 4xl:ml-2 "
      >
        {nextBtn || "Next"}
      </Button>
    </div>
  );
};

export default Navigation;
