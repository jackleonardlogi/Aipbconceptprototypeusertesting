import svgPaths from "./svg-14mnm9xekg";

function Component32X32WiredLink() {
  return (
    <div className="absolute left-0 size-[32px] top-0" data-name="32x32/Wired/Link">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="32x32/Wired/Link">
          <path clipRule="evenodd" d={svgPaths.p29980d80} fill="var(--fill-0, #595B5B)" fillRule="evenodd" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function AddButton() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Add Button">
      <Component32X32WiredLink />
    </div>
  );
}

function IconsBrandMic() {
  return (
    <div className="absolute left-0 size-[32px] top-0" data-name="icons/brand/Mic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="icons/brand/Mic">
          <path clipRule="evenodd" d={svgPaths.p3adfd3c0} fill="var(--fill-0, #595B5B)" fillRule="evenodd" id="shape" />
          <mask height="23" id="mask0_6018_1040" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="14" x="9" y="5">
            <path clipRule="evenodd" d={svgPaths.p3adfd3c0} fill="var(--fill-0, white)" fillRule="evenodd" id="shape_2" />
          </mask>
          <g mask="url(#mask0_6018_1040)"></g>
        </g>
      </svg>
    </div>
  );
}

function DictationButton() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Dictation Button">
      <IconsBrandMic />
    </div>
  );
}

function AddToPrompt() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Add to Prompt">
      <AddButton />
      <DictationButton />
    </div>
  );
}

function InputField() {
  return (
    <div className="content-stretch flex h-[32px] items-center relative shrink-0 w-[248px]" data-name="Input Field">
      <div className="flex flex-col font-['Brown_Logitech_Pan:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#595b5b] text-[16px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">Ask AI anything</p>
      </div>
    </div>
  );
}

function ChatGpt1() {
  return (
    <div className="mr-[-24px] relative shrink-0 size-[32px]" data-name="ChatGPT-1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="ChatGPT-1">
          <path d={svgPaths.p117e6800} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Provider() {
  return (
    <div className="bg-white box-border content-stretch flex items-center pl-0 pr-[24px] py-0 relative rounded-[100px] shrink-0" data-name="Provider">
      <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <ChatGpt1 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.p12414100} fill="var(--fill-0, white)" fillRule="evenodd" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function SendButton() {
  return (
    <div className="bg-[#814efa] relative rounded-[100px] shrink-0 size-[32px]" data-name="Send Button">
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-0 top-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "32", "--transform-inner-height": "32" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <Icon />
        </div>
      </div>
    </div>
  );
}

function ProviderControls() {
  return (
    <div className="box-border content-stretch flex gap-[4px] items-center p-[4px] relative rounded-[24px] shrink-0" data-name="Provider Controls">
      <Provider />
      <SendButton />
    </div>
  );
}

export default function PromptInput() {
  return (
    <div className="bg-[rgba(242,242,242,0.88)] relative rounded-[24px] size-full" data-name="Prompt Input">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center p-[8px] relative size-full">
          <AddToPrompt />
          <InputField />
          <ProviderControls />
        </div>
      </div>
    </div>
  );
}