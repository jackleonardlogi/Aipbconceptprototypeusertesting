import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from "../../imports/svg-c05zer0b66";
import figmaSvgPaths from "../../imports/svg-aobs9oipl8";
import { Plus, User, Bot, Sparkles, Zap, Globe, Building, Code } from 'lucide-react';

// Figma image imports
import imgImage16 from "figma:asset/62af576d19b90ac771b35889cdb8b5772259f6c1.png";
import imgImage19 from "figma:asset/364c9a651e2e52fa8585ad25b606a0f716a05057.png";
import imgImage18 from "figma:asset/ad5e2355384560226faf21087843bb3df7b508cd.png";
import imgImage5 from "figma:asset/59019b45a44d09ad5fe7088b1ed3fff0947231d2.png";

export interface Provider {
  id: string;
  name: string;
  icon: React.ReactNode;
  selected?: boolean;
}

interface MultiSelectDropdownProps {
  providers?: Provider[];
  selectedProviders: string[];
  onSelectionChange: (selected: string[]) => void;
  isMultiSelect?: boolean;
  onMultiSelectToggle?: () => void;
  className?: string;
  maxHeight?: number;
  onAddProvider?: (provider: Provider) => void;
}

interface CustomProvider {
  id: string;
  name: string;
  url?: string;
  iconType: string;
}

// Individual icon components following the exact Figma design with official logos
function ChatGpt1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ChatGPT-1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ChatGPT-1">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0734a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#10A37F" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IconClaudeLogoMark() {
  return (
    <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="icon/Claude/LogoMark">
      <div className="absolute aspect-[2048/2048] bottom-[12.5%] left-1/2 top-[12.5%] translate-x-[-50%]" data-name="image 16">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage16} />
      </div>
    </div>
  );
}

function IconCopilotLogoMark() {
  return (
    <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="icon/Copilot/LogoMark">
      <div className="absolute aspect-[1024/1024] bottom-[12.5%] left-1/2 top-[12.5%] translate-x-[-50%]" data-name="image 19">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage19} />
      </div>
    </div>
  );
}

function IconGeminiLogoMark() {
  return (
    <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="icon/Gemini/LogoMark">
      <div className="absolute aspect-[1024/1024] bottom-[12.5%] left-1/2 top-[12.5%] translate-x-[-50%]" data-name="image 18">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage18} />
      </div>
    </div>
  );
}

function Midjourney() {
  return (
    <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="Midjourney">
      <div className="absolute inset-0 rounded-[4px]" data-name="image 5">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[4px] size-full" src={imgImage5} />
      </div>
    </div>
  );
}

function IconPerplexityLogoMark() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/Perplexity/LogoMark">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon/Perplexity/LogoMark">
          <circle cx="12" cy="12" r="10" fill="#20C997"/>
          <path d="M8 12.5c0-2.5 2-4.5 4.5-4.5S17 10 17 12.5s-2 4.5-4.5 4.5S8 15 8 12.5z" fill="white"/>
          <path d="M10.5 11.5L13 14l5-5" stroke="#20C997" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" fill="none" stroke="#20C997" strokeWidth="1"/>
        </g>
      </svg>
    </div>
  );
}

function Component16X16WiredValidate() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="16x16/Wired/Validate">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="16x16/Wired/Validate">
          <path clipRule="evenodd" d={svgPaths.pcef2900} fill="var(--fill-0, #814EFA)" fillRule="evenodd" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function IconsCheckbox({ isSelected = false }: { isSelected?: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons/Checkbox">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icons/Checkbox" opacity={isSelected ? "1" : "0"}>
          <path clipRule="evenodd" d={svgPaths.p3d91ff80} fill="var(--fill-0, #814EFA)" fillRule="evenodd" id="shape" />
          <mask height="18" id="mask0_4011_514" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="18" x="3" y="3">
            <path clipRule="evenodd" d={svgPaths.p3d91ff80} fill="var(--fill-0, white)" fillRule="evenodd" id="shape_2" />
          </mask>
          <g mask="url(#mask0_4011_514)"></g>
        </g>
      </svg>
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

function AtomsToggle({ isOn = false, onClick }: { isOn?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-[16px] relative shrink-0 w-[28px] transition-all duration-200"
      data-name="Atoms/Toggle"
      type="button"
    >
      <div 
        className={`absolute inset-0 rounded-[8px] transition-all duration-200 ${
          isOn ? 'bg-[#814EFA]' : 'bg-[#d9d9d9]'
        }`} 
        data-name="Rectangle" 
      />
      <motion.div 
        className="absolute bg-white rounded-[8px] top-[12.5%] bottom-[12.5%] w-[14px]"
        data-name="Rectangle"
        animate={{
          left: isOn ? '50%' : '7.14%',
          right: isOn ? '7.14%' : '50%'
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
      />
    </button>
  );
}

// Default providers matching the exact Figma design
const defaultProviders: Provider[] = [
  {
    id: 'chatgpt',
    name: 'Chat GPT',
    icon: <ChatGpt1 />,
    selected: true
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: <IconClaudeLogoMark />
  },
  {
    id: 'copilot',
    name: 'Copilot',
    icon: <IconCopilotLogoMark />
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: <IconGeminiLogoMark />
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    icon: <Midjourney />
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: <IconPerplexityLogoMark />
  }
];

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  providers = defaultProviders,
  selectedProviders,
  onSelectionChange,
  isMultiSelect = false,
  onMultiSelectToggle,
  onAddProvider,
  className = "",
  maxHeight = 192
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProviderName, setNewProviderName] = useState('');
  const [newProviderUrl, setNewProviderUrl] = useState('');
  const [selectedIconType, setSelectedIconType] = useState('sparkles');
  const [allProviders, setAllProviders] = useState<Provider[]>(providers);
  const containerRef = useRef<HTMLDivElement>(null);
  const addModalRef = useRef<HTMLDivElement>(null);

  // Handle provider selection
  const handleProviderToggle = (providerId: string) => {
    if (isMultiSelect) {
      // Multi-select mode
      if (selectedProviders.includes(providerId)) {
        // Don't allow deselecting all providers
        if (selectedProviders.length > 1) {
          onSelectionChange(selectedProviders.filter(id => id !== providerId));
        }
      } else {
        onSelectionChange([...selectedProviders, providerId]);
      }
    } else {
      // Single-select mode
      onSelectionChange([providerId]);
      setIsOpen(false);
    }
  };

  // Available icon options for custom providers
  const iconOptions = [
    { type: 'sparkles', icon: <Sparkles size={20} />, label: 'Sparkles' },
    { type: 'zap', icon: <Zap size={20} />, label: 'Lightning' },
    { type: 'bot', icon: <Bot size={20} />, label: 'Bot' },
    { type: 'globe', icon: <Globe size={20} />, label: 'Globe' },
    { type: 'building', icon: <Building size={20} />, label: 'Building' },
    { type: 'code', icon: <Code size={20} />, label: 'Code' },
    { type: 'user', icon: <User size={20} />, label: 'User' },
  ];

  // Generate icon component from type
  const generateIcon = (iconType: string) => {
    const iconOption = iconOptions.find(opt => opt.type === iconType);
    if (!iconOption) return <Sparkles size={24} />;
    
    return (
      <div className="relative shrink-0 size-[24px] rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
        {React.cloneElement(iconOption.icon as React.ReactElement, { size: 16, className: "text-primary" })}
      </div>
    );
  };

  // Handle add provider button
  const handleAddProvider = () => {
    setShowAddModal(true);
  };

  // Handle form submission
  const handleSubmitNewProvider = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProviderName.trim()) return;
    
    const newProvider: Provider = {
      id: newProviderName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: newProviderName.trim(),
      icon: generateIcon(selectedIconType)
    };
    
    // Add to local providers list
    setAllProviders(prev => [...prev, newProvider]);
    
    // Call parent callback if provided
    if (onAddProvider) {
      onAddProvider(newProvider);
    }
    
    // Reset form and close modal
    setNewProviderName('');
    setNewProviderUrl('');
    setSelectedIconType('sparkles');
    setShowAddModal(false);
  };

  // Handle modal close
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewProviderName('');
    setNewProviderUrl('');
    setSelectedIconType('sparkles');
  };

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      
      // Close add modal if clicking outside
      if (showAddModal && addModalRef.current && !addModalRef.current.contains(event.target as Node)) {
        closeAddModal();
      }
    };

    if (isOpen || showAddModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, showAddModal]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showAddModal) {
          closeAddModal();
        } else {
          setIsOpen(false);
        }
      }
    };

    if (isOpen || showAddModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, showAddModal]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200"
        style={{
          backgroundColor: 'var(--input-background)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
          fontFamily: 'Brown Logitech Pan, sans-serif',
          fontSize: 'var(--text-base)'
        }}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>
          {selectedProviders.length === 0 
            ? 'Select providers' 
            : `${selectedProviders.length} provider${selectedProviders.length === 1 ? '' : 's'} selected`
          }
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path 
              d="M6 9L12 15L18 9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </button>

      {/* Dropdown Content - Following exact Figma ProviderList structure */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8
            }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#f2f2f2] content-stretch flex flex-col items-start overflow-clip relative rounded-[16px] size-full"
            data-name="Provider List"
          >
            {/* Providers List */}
            <div className="bg-[#f2f2f2] relative rounded-tl-[16px] rounded-tr-[16px] shrink-0 w-full" data-name="Providers List">
              <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
                <div className="box-border content-stretch flex gap-[4px] items-end pb-0 pt-[8px] px-[12px] relative w-full">
                  <div 
                    className="basis-0 content-stretch flex flex-col grow items-start max-h-[192px] min-h-px min-w-px overflow-clip relative shrink-0" 
                    data-name="Container"
                  >
                    {/* ChatGPT Provider - Selected State */}
                    {allProviders.find(p => p.id === 'chatgpt') && (
                      <motion.button
                        onClick={() => handleProviderToggle('chatgpt')}
                        className="content-stretch flex h-[32px] items-center justify-between relative rounded-[4px] shrink-0 w-full hover:bg-black/5 transition-colors"
                        data-name="Provider"
                        type="button"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0,
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                      >
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                          <div className="relative shrink-0 size-[24px]" data-name="ChatGPT-1">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                              <g id="ChatGPT-1">
                                <path d={figmaSvgPaths.p1ab11dc0} fill={selectedProviders.includes('chatgpt') ? "#814efa" : "#222425"} id="Vector" />
                              </g>
                            </svg>
                          </div>
                          <p className={`leading-[14px] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre ${
                            selectedProviders.includes('chatgpt') 
                              ? "font-['Brown_Logitech_Pan:Bold',_sans-serif] text-[#814efa]" 
                              : "font-['Brown_Logitech_Pan:Regular',_sans-serif] text-[#222425]"
                          }`}>
                            Chat GPT
                          </p>
                        </div>
                        <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 size-[32px]">
                          {selectedProviders.includes('chatgpt') ? (
                            <div className="relative shrink-0 size-[12px]" data-name="16x16/Wired/Validate">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                                <g id="16x16/Wired/Validate">
                                  <path clipRule="evenodd" d={figmaSvgPaths.pcbc1580} fill="#814EFA" fillRule="evenodd" id="Shape" />
                                </g>
                              </svg>
                            </div>
                          ) : (
                            <div className="relative shrink-0 size-[24px]" data-name="Icons/Checkbox">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                                <g id="Icons/Checkbox" opacity="0">
                                  <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                                </g>
                              </svg>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    )}

                    {/* Claude Provider */}
                    {allProviders.find(p => p.id === 'claude') && (
                      <motion.button
                        onClick={() => handleProviderToggle('claude')}
                        className="content-stretch flex h-[32px] items-center justify-between relative rounded-[4px] shrink-0 w-full hover:bg-black/5 transition-colors"
                        data-name="Provider"
                        type="button"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.05,
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                      >
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                          <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="icon/Claude/LogoMark">
                            <div className="absolute aspect-[2048/2048] bottom-[12.5%] left-1/2 top-[12.5%] translate-x-[-50%]" data-name="image 16">
                              <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage16} />
                            </div>
                          </div>
                          <p className="font-['Brown_Logitech_Pan:Regular',_sans-serif] leading-[14px] not-italic relative shrink-0 text-[#222425] text-[14px] text-nowrap whitespace-pre">Claude</p>
                        </div>
                        <div className="relative shrink-0 size-[24px]" data-name="Icons/Checkbox">
                          {selectedProviders.includes('claude') ? (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g id="Icons/Checkbox">
                                <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                              </g>
                            </svg>
                          ) : (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g id="Icons/Checkbox" opacity="0">
                                <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                              </g>
                            </svg>
                          )}
                        </div>
                      </motion.button>
                    )}

                    {/* Copilot Provider */}
                    {allProviders.find(p => p.id === 'copilot') && (
                      <motion.button
                        onClick={() => handleProviderToggle('copilot')}
                        className="content-stretch flex h-[32px] items-center justify-between relative rounded-[4px] shrink-0 w-full hover:bg-black/5 transition-colors"
                        data-name="Provider"
                        type="button"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.1,
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                      >
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                          <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="icon/Copilot/LogoMark">
                            <div className="absolute aspect-[1024/1024] bottom-[12.5%] left-1/2 top-[12.5%] translate-x-[-50%]" data-name="image 19">
                              <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage19} />
                            </div>
                          </div>
                          <p className="font-['Brown_Logitech_Pan:Regular',_sans-serif] leading-[14px] not-italic relative shrink-0 text-[#222425] text-[14px] text-nowrap whitespace-pre">Copilot</p>
                        </div>
                        <div className="relative shrink-0 size-[24px]" data-name="Icons/Checkbox">
                          {selectedProviders.includes('copilot') ? (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g id="Icons/Checkbox">
                                <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                              </g>
                            </svg>
                          ) : (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g id="Icons/Checkbox" opacity="0">
                                <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                              </g>
                            </svg>
                          )}
                        </div>
                      </motion.button>
                    )}

                    {/* Gemini Provider */}
                    {allProviders.find(p => p.id === 'gemini') && (
                      <motion.button
                        onClick={() => handleProviderToggle('gemini')}
                        className="content-stretch flex h-[32px] items-center justify-between relative rounded-[4px] shrink-0 w-full hover:bg-black/5 transition-colors"
                        data-name="Provider"
                        type="button"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.15,
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                      >
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                          <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="icon/Gemini/LogoMark">
                            <div className="absolute aspect-[1024/1024] bottom-[12.5%] left-1/2 top-[12.5%] translate-x-[-50%]" data-name="image 18">
                              <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage18} />
                            </div>
                          </div>
                          <p className="font-['Brown_Logitech_Pan:Regular',_sans-serif] leading-[14px] not-italic relative shrink-0 text-[#222425] text-[14px] text-nowrap whitespace-pre">Gemini</p>
                        </div>
                        <div className="relative shrink-0 size-[24px]" data-name="Icons/Checkbox">
                          {selectedProviders.includes('gemini') ? (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g id="Icons/Checkbox">
                                <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                              </g>
                            </svg>
                          ) : (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g id="Icons/Checkbox" opacity="0">
                                <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                              </g>
                            </svg>
                          )}
                        </div>
                      </motion.button>
                    )}

                    {/* Midjourney Provider */}
                    {allProviders.find(p => p.id === 'midjourney') && (
                      <motion.button
                        onClick={() => handleProviderToggle('midjourney')}
                        className="content-stretch flex h-[32px] items-center justify-between relative rounded-[4px] shrink-0 w-full hover:bg-black/5 transition-colors"
                        data-name="Provider"
                        type="button"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.2,
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                      >
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                          <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="Midjourney">
                            <div className="absolute inset-0 rounded-[4px]" data-name="image 5">
                              <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[4px] size-full" src={imgImage5} />
                            </div>
                          </div>
                          <p className="font-['Brown_Logitech_Pan:Regular',_sans-serif] leading-[14px] not-italic relative shrink-0 text-[#222425] text-[14px] text-nowrap whitespace-pre">Midjourney</p>
                        </div>
                        <div className="relative shrink-0 size-[24px]" data-name="Icons/Checkbox">
                          {selectedProviders.includes('midjourney') ? (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g id="Icons/Checkbox">
                                <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                              </g>
                            </svg>
                          ) : (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g id="Icons/Checkbox" opacity="0">
                                <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                              </g>
                            </svg>
                          )}
                        </div>
                      </motion.button>
                    )}

                    {/* Perplexity Provider */}
                    {allProviders.find(p => p.id === 'perplexity') && (
                      <motion.button
                        onClick={() => handleProviderToggle('perplexity')}
                        className="content-stretch flex h-[32px] items-center justify-between relative rounded-[4px] shrink-0 w-full hover:bg-black/5 transition-colors"
                        data-name="Provider"
                        type="button"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.25,
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                      >
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                          <div className="relative shrink-0 size-[24px]" data-name="icon/Perplexity/LogoMark">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                              <g id="icon/Perplexity/LogoMark">
                                <path clipRule="evenodd" d={figmaSvgPaths.p13ac600} fill="#20808D" fillRule="evenodd" id="Vector" />
                              </g>
                            </svg>
                          </div>
                          <p className="font-['Brown_Logitech_Pan:Regular',_sans-serif] leading-[14px] not-italic relative shrink-0 text-[#222425] text-[14px] text-nowrap whitespace-pre">Perplexity</p>
                        </div>
                        <div className="relative shrink-0 size-[24px]" data-name="Icons/Checkbox">
                          {selectedProviders.includes('perplexity') ? (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g id="Icons/Checkbox">
                                <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                              </g>
                            </svg>
                          ) : (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                              <g id="Icons/Checkbox" opacity="0">
                                <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                              </g>
                            </svg>
                          )}
                        </div>
                      </motion.button>
                    )}

                    {/* Custom Providers */}
                    {customProviders.map((provider, index) => {
                      const isSelected = selectedProviders.includes(provider.id);
                      
                      return (
                        <motion.button
                          key={provider.id}
                          onClick={() => handleProviderToggle(provider.id)}
                          className="content-stretch flex h-[32px] items-center justify-between relative rounded-[4px] shrink-0 w-full hover:bg-black/5 transition-colors"
                          data-name="Provider"
                          type="button"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: (6 + index) * 0.05,
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                          }}
                        >
                          <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                            <div className="w-6 h-6 flex items-center justify-center">
                              {provider.icon}
                            </div>
                            <p className="font-['Brown_Logitech_Pan:Regular',_sans-serif] leading-[14px] not-italic relative shrink-0 text-[#222425] text-[14px] text-nowrap whitespace-pre">
                              {provider.name}
                            </p>
                          </div>
                          <div className="relative shrink-0 size-[24px]" data-name="Icons/Checkbox">
                            {isSelected ? (
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                                <g id="Icons/Checkbox">
                                  <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                                </g>
                              </svg>
                            ) : (
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                                <g id="Icons/Checkbox" opacity="0">
                                  <path clipRule="evenodd" d={figmaSvgPaths.p3d91ff80} fill="#814EFA" fillRule="evenodd" id="shape" />
                                </g>
                              </svg>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls section - Imported Figma design */}
            <div className="bg-[#f2f2f2] relative rounded-bl-[16px] rounded-br-[16px] shrink-0 w-full" data-name="Controls">
              <div className="flex flex-col justify-center size-full">
                <div className="box-border content-stretch flex flex-col items-start justify-center pb-[8px] pt-0 px-[12px] relative w-full">
                  {/* Divider Line */}
                  <div className="box-border content-stretch flex flex-col gap-[10px] items-start px-0 py-[4px] relative shrink-0 w-full" data-name="Devider Line">
                    <div className="bg-[#d9d9d9] h-px shrink-0 w-[166px]" />
                  </div>

                  {/* Container */}
                  <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-name="Container">
                    {/* Add Button */}
                    <button
                      className="box-border content-stretch flex gap-[8px] items-center p-[4px] relative rounded-[100px] shrink-0 bg-white border border-[#e6e6e6] hover:bg-gray-50 transition-colors"
                      data-name="Button"
                      type="button"
                      onClick={handleAddProvider}
                    >
                      <IconOptionsAdd />
                    </button>

                    {/* Multi Select */}
                    <div className="basis-0 content-stretch flex gap-[8px] grow h-[32px] items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Multi Select">
                      <p className="font-['Brown_Logitech_Pan:Regular',_sans-serif] leading-[16px] not-italic opacity-80 relative shrink-0 text-[#222425] text-[12px] text-nowrap whitespace-pre">
                        Multi-Select
                      </p>
                      <div className="content-stretch flex gap-[4px] h-[24px] items-center justify-end relative shrink-0">
                        <AtomsToggle 
                          isOn={isMultiSelect} 
                          onClick={onMultiSelectToggle}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Provider Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={closeAddModal}
            />
            
            {/* Modal */}
            <motion.div
              ref={addModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="relative w-full max-w-md mx-4 p-6 rounded-2xl backdrop-blur-xl border"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--elevation-md)'
              }}
            >
              {/* Header */}
              <div className="mb-6">
                <h3 
                  className="mb-2"
                  style={{ 
                    color: 'var(--foreground)',
                    fontFamily: 'Brown Logitech Pan, sans-serif',
                    fontSize: '18px',
                    fontWeight: '700'
                  }}
                >
                  Add Custom Provider
                </h3>
                <p 
                  className="caption"
                  style={{ 
                    color: 'var(--muted-foreground)',
                    fontFamily: 'Brown Logitech Pan, sans-serif'
                  }}
                >
                  Create a new AI provider for your collection
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitNewProvider} className="space-y-4">
                {/* Provider Name */}
                <div>
                  <label 
                    htmlFor="provider-name"
                    className="block mb-2"
                    style={{ 
                      color: 'var(--foreground)',
                      fontFamily: 'Brown Logitech Pan, sans-serif',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}
                  >
                    Provider Name *
                  </label>
                  <input
                    id="provider-name"
                    type="text"
                    value={newProviderName}
                    onChange={(e) => setNewProviderName(e.target.value)}
                    placeholder="e.g., Custom AI, My Bot"
                    className="w-full px-3 py-2 rounded-lg border outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--input-background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      fontFamily: 'Brown Logitech Pan, sans-serif',
                      fontSize: '14px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(129, 78, 250, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                {/* Provider URL (Optional) */}
                <div>
                  <label 
                    htmlFor="provider-url"
                    className="block mb-2"
                    style={{ 
                      color: 'var(--foreground)',
                      fontFamily: 'Brown Logitech Pan, sans-serif',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}
                  >
                    Website URL (Optional)
                  </label>
                  <input
                    id="provider-url"
                    type="url"
                    value={newProviderUrl}
                    onChange={(e) => setNewProviderUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-lg border outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--input-background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      fontFamily: 'Brown Logitech Pan, sans-serif',
                      fontSize: '14px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(129, 78, 250, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label 
                    className="block mb-3"
                    style={{ 
                      color: 'var(--foreground)',
                      fontFamily: 'Brown Logitech Pan, sans-serif',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}
                  >
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map((option) => (
                      <motion.button
                        key={option.type}
                        type="button"
                        onClick={() => setSelectedIconType(option.type)}
                        className="p-3 rounded-lg border transition-all flex flex-col items-center gap-1"
                        style={{
                          backgroundColor: selectedIconType === option.type ? 'var(--primary)' : 'var(--muted)',
                          borderColor: selectedIconType === option.type ? 'var(--primary)' : 'var(--border)',
                          color: selectedIconType === option.type ? 'var(--primary-foreground)' : 'var(--foreground)'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {React.cloneElement(option.icon as React.ReactElement, { 
                          size: 18,
                          color: selectedIconType === option.type ? 'white' : 'currentColor'
                        })}
                        <span 
                          className="text-xs"
                          style={{ 
                            fontFamily: 'Brown Logitech Pan, sans-serif',
                            color: selectedIconType === option.type ? 'white' : 'var(--muted-foreground)'
                          }}
                        >
                          {option.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="flex-1 px-4 py-2 rounded-lg border transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      fontFamily: 'Brown Logitech Pan, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newProviderName.trim()}
                    className="flex-1 px-4 py-2 rounded-lg border transition-all disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--primary)',
                      borderColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontFamily: 'Brown Logitech Pan, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    Add Provider
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiSelectDropdown;