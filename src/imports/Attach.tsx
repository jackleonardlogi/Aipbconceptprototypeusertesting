import svgPaths from "./svg-sou2kf4koy";

function IconOptionsFile() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/options+/File">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon/options+/File">
          <g id="Vector">
            <path d={svgPaths.pa00c700} fill="var(--fill-0, #222425)" />
            <path d={svgPaths.pc4dc300} fill="var(--fill-0, #222425)" />
            <path clipRule="evenodd" d={svgPaths.p4591c00} fill="var(--fill-0, #222425)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame34651081() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <IconOptionsFile />
      <p className="font-['Brown_Logitech_Pan:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#222425] text-[16px] text-nowrap whitespace-pre">Upload File</p>
    </div>
  );
}

function Attachments() {
  return (
    <div className="content-stretch flex gap-[4px] h-[32px] items-center relative rounded-[4px] shrink-0 w-full" data-name="Attachments">
      <Frame34651081 />
    </div>
  );
}

function IconSystemWindowsScreenshot() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/System/WindowsScreenshot">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon/System/WindowsScreenshot">
          <g id="Vector">
            <path clipRule="evenodd" d={svgPaths.p215f31c0} fill="var(--fill-0, #222425)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p3f1cf310} fill="var(--fill-0, #222425)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p2269f480} fill="var(--fill-0, #222425)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p3f7a5c00} fill="var(--fill-0, #222425)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p3be3a4f0} fill="var(--fill-0, #222425)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p85bd000} fill="var(--fill-0, #222425)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.pbd58180} fill="var(--fill-0, #222425)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p32293800} fill="var(--fill-0, #222425)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p3b7c9f00} fill="var(--fill-0, #222425)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame34651082() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <IconSystemWindowsScreenshot />
      <p className="font-['Brown_Logitech_Pan:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#222425] text-[16px] text-nowrap whitespace-pre">Take Screenshot</p>
    </div>
  );
}

function Attachments1() {
  return (
    <div className="content-stretch flex gap-[4px] h-[32px] items-center relative rounded-[4px] shrink-0 w-full" data-name="Attachments">
      <Frame34651082 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start max-h-[192px] overflow-clip relative shrink-0" data-name="Container">
      <Attachments />
      <Attachments1 />
    </div>
  );
}

function ProvidersList() {
  return (
    <div className="bg-[#f2f2f2] box-border content-stretch flex gap-[4px] items-end overflow-clip pl-[12px] pr-[14px] py-[8px] relative shrink-0" data-name="Providers List">
      <Container />
    </div>
  );
}

export default function Attach() {
  return (
    <div className="bg-[#f2f2f2] content-stretch flex flex-col items-start overflow-clip relative rounded-[16px] size-full" data-name="Attach">
      <ProvidersList />
    </div>
  );
}