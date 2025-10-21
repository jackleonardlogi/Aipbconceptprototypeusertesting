import imgClaudeLogo from "figma:asset/4fed876760c87d1b1fafdc09a44e4b3d8b8fb8fa.png";

export default function IconClaudeLogoMark() {
  return (
    <div className="bg-[#D46C4D] overflow-clip relative rounded-[4px] size-full" data-name="icon/Claude/LogoMark">
      <div className="absolute aspect-[2048/2048] bottom-[12.5%] left-1/2 top-[12.5%] translate-x-[-50%]" data-name="image 16">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgClaudeLogo} />
      </div>
    </div>
  );
}