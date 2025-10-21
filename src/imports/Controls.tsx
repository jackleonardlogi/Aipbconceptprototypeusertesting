import svgPaths from "./svg-7seg0442f0";

function DeviderLine() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-0 py-[4px] relative shrink-0 w-full" data-name="Devider Line">
      <div className="bg-[#d9d9d9] h-px shrink-0 w-[166px]" />
    </div>
  );
}

function IconOptionsAdd() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/options+/Add">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon/options+/Add">
          <path clipRule="evenodd" d={svgPaths.p207da300} fill="var(--fill-0, #222425)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center p-[4px] relative rounded-[100px] shrink-0" data-name="Button">
      <IconOptionsAdd />
    </div>
  );
}

function AtomsToggle() {
  return (
    <div className="h-[16px] relative shrink-0 w-[28px]" data-name="Atoms/Toggle">
      <div className="absolute bg-[#d9d9d9] inset-0 rounded-[8px]" data-name="Rectangle" />
      <div className="absolute bg-white bottom-[12.5%] left-[7.14%] right-1/2 rounded-[8px] top-[12.5%]" data-name="Rectangle" />
    </div>
  );
}

function Frame34651085() {
  return (
    <div className="content-stretch flex gap-[4px] h-[24px] items-center justify-end relative shrink-0">
      <AtomsToggle />
    </div>
  );
}

function MultiSelect() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow h-[32px] items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Multi Select">
      <p className="font-['Brown_Logitech_Pan:Regular',_sans-serif] leading-[16px] not-italic opacity-80 relative shrink-0 text-[#222425] text-[12px] text-nowrap whitespace-pre">Multi-Select</p>
      <Frame34651085 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-name="Container">
      <Button />
      <MultiSelect />
    </div>
  );
}

export default function Controls() {
  return (
    <div className="bg-[#f2f2f2] relative size-full" data-name="Controls">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-center pb-[8px] pt-0 px-[12px] relative size-full">
          <DeviderLine />
          <Container />
        </div>
      </div>
    </div>
  );
}