import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Edit3,
  Copy,
  Trash2,
  Share2,
  Download,
  Star,
  Heart,
  Settings,
  Send,
  ExternalLink,
  ChevronDown,
  Mic,
  Plus,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import svgPaths from '../imports/svg-sou2kf4koy';
import IconOptionsUpload from '../imports/IconOptionsUpload';
import IconClaudeLogoMark from '../imports/IconClaudeLogoMark';
import IconsAiPromptBuilder from '../imports/IconsAiPromptBuilder';
import IconSystemRedo from '../imports/IconSystemRedo';
import IconOptionsArrowSmallNext from '../imports/IconOptionsArrowSmallNext';

interface ActionItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface RadialActionsMenuProps {
  version: 1 | 2;
}

const actions: ActionItem[] = [
  { id: 'copy', icon: <Copy size={16} />, label: 'Copy' },
  { id: 'edit', icon: <Edit3 size={16} />, label: 'Edit' },
  { id: 'star', icon: <Star size={16} />, label: 'Star' },
  { id: 'share', icon: <Share2 size={16} />, label: 'Share' },
  { id: 'ai-prompt', icon: <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ transform: 'scale(1.25)' }}><IconsAiPromptBuilder /></div></div>, label: 'AI Prompt' },
  { id: 'heart', icon: <Heart size={16} />, label: 'Like' },
  { id: 'download', icon: <Download size={16} />, label: 'Download' },
  { id: 'settings', icon: <Settings size={16} />, label: 'Settings' },
];

const RadialActionsMenu: React.FC<RadialActionsMenuProps> = ({ version }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['chatgpt']);
  const [showProviderSelector, setShowProviderSelector] = useState(false);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [aiPromptBubblePosition, setAiPromptBubblePosition] = useState({ x: 0, y: 0 });
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [promptWidth, setPromptWidth] = useState(460); // Start with min width
  const [isInlineLayout, setIsInlineLayout] = useState(true); // Track layout mode
  const [isDragging, setIsDragging] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [providerMenuView, setProviderMenuView] = useState<'main' | 'add'>('main');
  const [newProviderUrl, setNewProviderUrl] = useState('');
  const [newProviderName, setNewProviderName] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    providerId: string;
  } | null>(null);
  const [savedPromptContextMenu, setSavedPromptContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    promptId: string;
  } | null>(null);
  const [overlayActionsMenu, setOverlayActionsMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    type: 'close' | 'open';
  } | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [customProviders, setCustomProviders] = useState<Array<{
    id: string;
    name: string;
    url: string;
    icon: React.ReactNode;
    isApp: boolean;
  }>>([]);
  const [textWidth, setTextWidth] = useState(0); // Track text width for plus button positioning
  const [promptContainerHeight, setPromptContainerHeight] = useState(0); // Track container height for chip positioning
  const [isTextMultiline, setIsTextMultiline] = useState(false); // Track if text has wrapped to multiple lines
  const [hasFinishedTyping, setHasFinishedTyping] = useState(false); // Track if user has stopped typing
  const [savedPrompts, setSavedPrompts] = useState<Array<{
    id: string;
    label: string;
    text: string;
  }>>([]);
  const [originalPromptText, setOriginalPromptText] = useState<string | null>(null); // Track if text came from a saved prompt
  const [renamingPromptId, setRenamingPromptId] = useState<string | null>(null); // Track which prompt is being renamed
  const [renameValue, setRenameValue] = useState(''); // Track the new name being typed
  const [hoveredChipId, setHoveredChipId] = useState<string | null>(null); // Track which chip is being hovered
  const [isAddButtonHovered, setIsAddButtonHovered] = useState(false); // Track if add button is hovered
  const [showTemporaryChats, setShowTemporaryChats] = useState<Array<{
    providerId: string;
    providerName: string;
    url: string;
    promptText: string;
  }>>([]); // Track multiple temporary chat overlays (Version 2 only)
  const [chatStates, setChatStates] = useState<Record<string, {
    stage: 'typing' | 'sending' | 'responding' | 'complete';
    userMessage: string;
    aiResponse: string;
  }>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const recentDragRef = useRef<boolean>(false);
  const providerMenuRef = useRef<HTMLDivElement>(null);
  const promptContainerRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const versionChangingRef = useRef<boolean>(false);

  // Close all menus when version changes to ensure correct behavior
  useEffect(() => {
    versionChangingRef.current = true;
    setIsOpen(false);
    setAiChatOpen(false);
    setShowProviderSelector(false);
    setHoveredId(null);
    setAiPrompt('');
    setIsSending(false);
    setContextMenu(null);
    setShowAttachMenu(false);
    setSavedPromptContextMenu(null);
    setProviderMenuView('main');
    
    // Allow clicks again after a short delay to ensure clean state
    const timer = setTimeout(() => {
      versionChangingRef.current = false;
    }, 150);
    
    return () => clearTimeout(timer);
  }, [version]);

  // Note: Both versions now behave identically - clicking anywhere opens AI prompt directly

  // Helper function to adjust textarea height
  const adjustTextareaHeight = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    
    // Reset to single line height first
    textarea.style.height = '20px';
    
    // Get the scroll height (actual content height)
    const scrollHeight = textarea.scrollHeight;
    
    // Only expand if content is taller than single line
    if (scrollHeight > 20) {
      textarea.style.height = `${scrollHeight}px`;
      setIsTextMultiline(true);
    } else {
      setIsTextMultiline(false);
    }
  }, []);

  // Official AI Provider Logos using favicons
  const ChatGPTIcon = () => (
    <img 
      src="https://www.google.com/s2/favicons?domain=chat.openai.com&sz=64" 
      alt="ChatGPT"
      style={{
        width: '16px',
        height: '16px',
        borderRadius: '4px',
        objectFit: 'cover'
      }}
      onError={(e) => {
        // Fallback to a generic AI icon if favicon fails to load
        e.currentTarget.style.display = 'none';
        const parent = e.currentTarget.parentElement;
        if (parent) {
          parent.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#10A37F" />
              <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          `;
        }
      }}
    />
  );

  const PerplexityIcon = () => (
    <img 
      src="https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64" 
      alt="Perplexity"
      style={{
        width: '16px',
        height: '16px',
        borderRadius: '4px',
        objectFit: 'cover'
      }}
      onError={(e) => {
        // Fallback to a generic AI icon if favicon fails to load
        e.currentTarget.style.display = 'none';
        const parent = e.currentTarget.parentElement;
        if (parent) {
          parent.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#20C997" />
              <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          `;
        }
      }}
    />
  );

  const GrokIcon = () => (
    <img 
      src="https://www.google.com/s2/favicons?domain=x.com&sz=64" 
      alt="Grok"
      style={{
        width: '16px',
        height: '16px',
        borderRadius: '4px',
        objectFit: 'cover'
      }}
      onError={(e) => {
        // Fallback to a generic AI icon if favicon fails to load
        e.currentTarget.style.display = 'none';
        const parent = e.currentTarget.parentElement;
        if (parent) {
          parent.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#000000" />
              <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          `;
        }
      }}
    />
  );

  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="#814EFA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="#222425" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const BackIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M12 19l-7-7 7-7" stroke="#222425" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const DotsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="6" r="1.5" fill="#222425"/>
      <circle cx="12" cy="12" r="1.5" fill="#222425"/>
      <circle cx="12" cy="18" r="1.5" fill="#222425"/>
    </svg>
  );

  // Figma imported icons for attachment menu
  const IconSystemWindowsScreenshot = () => (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path clipRule="evenodd" d={svgPaths.p215f31c0} fill="#222425" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p3f1cf310} fill="#222425" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p2269f480} fill="#222425" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p3f7a5c00} fill="#222425" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p3be3a4f0} fill="#222425" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p85bd000} fill="#222425" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.pbd58180} fill="#222425" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p32293800} fill="#222425" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p3b7c9f00} fill="#222425" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );

  // Base AI providers with desktop app deep links
  const baseAiProviders = [
    { 
      id: 'chatgpt', 
      name: 'ChatGPT', 
      url: 'https://chat.openai.com', 
      icon: <ChatGPTIcon />, 
      isApp: false,
      desktopUrl: 'chatgpt://' // Deep link for ChatGPT desktop app
    },
    { 
      id: 'perplexity', 
      name: 'Perplexity', 
      url: 'https://www.perplexity.ai', 
      icon: <PerplexityIcon />, 
      isApp: false,
      desktopUrl: 'perplexity://' // Deep link for Perplexity desktop app
    },
    { 
      id: 'grok', 
      name: 'Grok', 
      url: 'https://x.com/i/grok', 
      icon: <GrokIcon />, 
      isApp: false,
      desktopUrl: 'grok://' // Deep link for Grok
    },
  ];

  // Combine base providers with custom providers
  const aiProviders = [...baseAiProviders, ...customProviders];

  const radius = 82; // Distance of action buttons from center
  const buttonSize = 48; // Width/height of action buttons (w-12 h-12)
  const tooltipGap = 3; // Desired gap between button edge and tooltip (3px)
  const estimatedTooltipHalfHeight = 12; // Estimated half-height of tooltip (for centering)
  const tooltipRadius = radius + (buttonSize / 2) + tooltipGap + estimatedTooltipHalfHeight; // Consistent distance for all tooltips

  const getPosition = (index: number) => {
    const angle = (index / actions.length) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const getTooltipPosition = (index: number) => {
    const angle = (index / actions.length) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * tooltipRadius,
      y: Math.sin(angle) * tooltipRadius,
    };
  };

  // Function to infer a concise label from prompt text
  const inferLabel = (text: string): string => {
    // Remove common question words and clean up
    const cleaned = text
      .replace(/^(what|how|why|when|where|who|can|could|please|explain|tell me|help|ask|chat|give me|show me)\s+/i, '')
      .trim();
    
    // Split into words
    const words = cleaned.split(/\s+/);
    
    // Take first 2-3 words, max 20 characters
    let label = words.slice(0, 3).join(' ');
    
    // Truncate if too long
    if (label.length > 20) {
      label = label.substring(0, 17) + '...';
    }
    
    // Capitalize first letter
    label = label.charAt(0).toUpperCase() + label.slice(1);
    
    // Remove trailing punctuation
    label = label.replace(/[?.!,;:]$/, '');
    
    return label || 'Saved Prompt';
  };

  // Function to add a new saved prompt
  const addSavedPrompt = () => {
    if (!aiPrompt.trim()) return;
    
    const newPromptId = `prompt-${Date.now()}`;
    const newPrompt = {
      id: newPromptId,
      label: '', // Start with empty label - user will type their own
      text: aiPrompt.trim()
    };
    
    // Add new prompt to the beginning of the array so it appears first
    setSavedPrompts(prev => [newPrompt, ...prev]);
    
    // Immediately enter rename mode for the new prompt
    setRenamingPromptId(newPromptId);
    setRenameValue('');
  };





  useEffect(() => {
    const handleGlobalClickMemo = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickingOnMenu = target.closest('[data-radial-menu]');
      const isClickingOnContextMenu = target.closest('[data-context-menu]');
      const isClickingOnSavedPromptContextMenu = target.closest('[data-saved-prompt-context-menu]');
      const isClickingOnOverlayActionsMenu = target.closest('[data-overlay-actions-menu]');
      const isClickingOnDotsIcon = target.closest('.IconOptionsDots');
      const isClickingOnVersionButton = target.closest('[data-version-button]');
      
      // Don't do anything if clicking on version button or if version is currently changing
      if (isClickingOnVersionButton || versionChangingRef.current) {
        return;
      }
      
      // Close context menu if clicking outside
      if (contextMenu && !isClickingOnContextMenu) {
        setContextMenu(null);
      }
      
      // Close saved prompt context menu if clicking outside (and not on the dots icon)
      if (savedPromptContextMenu && !isClickingOnSavedPromptContextMenu && !isClickingOnDotsIcon) {
        setSavedPromptContextMenu(null);
      }
      
      // Close overlay actions menu if clicking outside
      if (overlayActionsMenu && !isClickingOnOverlayActionsMenu) {
        setOverlayActionsMenu(null);
      }
      
      // Close attach menu if clicking outside
      const isClickingOnAttachMenu = target.closest('[data-attach-menu]');
      if (showAttachMenu && !isClickingOnAttachMenu) {
        setShowAttachMenu(false);
      }
      
      if (isClickingOnMenu || isDragging || isClickingOnContextMenu || isClickingOnAttachMenu) {
        return; // Don't close if clicking inside the menu or currently dragging
      }
      
      if (isOpen || aiChatOpen) {
        // Close everything if clicking outside
        setIsOpen(false);
        setAiChatOpen(false);
        setShowProviderSelector(false);
        setHoveredId(null);
        setAiPrompt('');
        setIsSending(false);
        setContextMenu(null);
      } else {
        // Don't open prompt UI if temporary overlays are open
        if (showTemporaryChats.length > 0) {
          return;
        }
        
        // Open AI prompt at click position (same behavior for both versions)
        setClickPosition({ x: e.clientX, y: e.clientY });
        setHasInteracted(true);
        setAiChatOpen(true);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 300);
      }
    };

    const handleEscapeMemo = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAttachMenu) {
          setShowAttachMenu(false);
        } else if (providerMenuView === 'add') {
          setProviderMenuView('main');
        } else if (showProviderSelector) {
          setShowProviderSelector(false);
        } else if (aiChatOpen) {
          closeAiChat();
        } else {
          closeMenu();
        }
      }
    };

    document.addEventListener('click', handleGlobalClickMemo);
    document.addEventListener('keydown', handleEscapeMemo);
    return () => {
      document.removeEventListener('click', handleGlobalClickMemo);
      document.removeEventListener('keydown', handleEscapeMemo);
    };
  }, [isOpen, aiChatOpen, isDragging, contextMenu, savedPromptContextMenu, overlayActionsMenu, providerMenuView, showProviderSelector, showAttachMenu, showTemporaryChats]);

  // Auto-focus input when AI chat opens
  useEffect(() => {
    if (aiChatOpen && !isOpen && inputRef.current) {
      // Delay to ensure DOM is ready and animations complete
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Set cursor to end of text if any exists
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [aiChatOpen, isOpen]);

  // Detect when user has finished typing (debounce)
  useEffect(() => {
    // Clear the finished typing flag immediately when text changes
    setHasFinishedTyping(false);
    
    // Clear any existing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // If there's no text, don't set the timer
    if (!aiPrompt.trim()) {
      return;
    }
    
    // Set a timer to mark as finished typing after 800ms of no changes
    typingTimerRef.current = setTimeout(() => {
      setHasFinishedTyping(true);
    }, 800);
    
    // Cleanup
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [aiPrompt]);

  // Dynamic width and layout calculation based on text content
  useEffect(() => {
    if (!aiChatOpen) return; // Only calculate when AI chat is open
    
    if (!aiPrompt) {
      setPromptWidth(460); // Min width when empty
      setIsInlineLayout(true); // Always inline when empty
      return;
    }

    // Debounce the width calculation to prevent excessive re-renders
    const timeoutId = setTimeout(() => {
      // Store current focus state to restore after layout change
      const wasInputFocused = document.activeElement === inputRef.current;

      // Create a temporary element to measure text width
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        context.font = '400 16px Brown Logitech Pan, sans-serif';
        const measuredTextWidth = context.measureText(aiPrompt).width;
        
        // Calculate the width of the last line for plus button positioning
        // This ensures the button doesn't go off screen when text wraps
        let lastLineWidth = measuredTextWidth;
        
        // If text contains newlines or might wrap, measure only the last line
        if (aiPrompt.includes('\n')) {
          // Has explicit line breaks - measure the last line after the last newline
          const lines = aiPrompt.split('\n');
          const lastLine = lines[lines.length - 1];
          lastLineWidth = context.measureText(lastLine).width;
        } else {
          // Check if text would wrap based on available width
          const maxWidth = isInlineLayout ? 460 : 600; // Approximate max text width
          if (measuredTextWidth > maxWidth) {
            // Text is wrapping - estimate last line width
            // Split by words and measure chunks to find where wrapping occurs
            const words = aiPrompt.split(' ');
            let currentLineWidth = 0;
            let lastLineStartIndex = 0;
            
            for (let i = 0; i < words.length; i++) {
              const wordWidth = context.measureText(words[i] + ' ').width;
              
              if (currentLineWidth + wordWidth > maxWidth) {
                // Word would wrap to next line
                lastLineStartIndex = i;
                currentLineWidth = wordWidth;
              } else {
                currentLineWidth += wordWidth;
              }
            }
            
            // Measure from the last line start to end
            const lastLineText = words.slice(lastLineStartIndex).join(' ');
            lastLineWidth = context.measureText(lastLineText).width;
          }
        }
        
        // Store text width for plus button positioning
        setTextWidth(lastLineWidth);
        
        // Calculate width with inline padding first - add extra buffer to prevent cutoff
        const inlinePadding = 160; // Increased padding for inline layout with controls + buffer
        const textBuffer = 8; // Additional buffer to prevent text cutoff
        const adjustedTextWidth = measuredTextWidth + textBuffer;
        
        const calculatedInlineWidth = Math.min(Math.max(adjustedTextWidth + inlinePadding, 460), 632);
        
        // Check if we've reached max width and need to check for line wrapping
        if (calculatedInlineWidth >= 632) {
          // At max width - check if text would wrap to multiple lines
          const availableTextWidth = 632 - inlinePadding; // Available space for text in inline mode
          const wouldWrapInline = adjustedTextWidth > availableTextWidth;
          
          if (wouldWrapInline) {
            // Switch to stacked layout but KEEP max width of 632px
            setIsInlineLayout(false);
            setPromptWidth(632); // Always stay at max width once reached
          } else {
            // Stay inline at max width
            setIsInlineLayout(true);
            setPromptWidth(632);
          }
        } else {
          // Haven't reached max width yet - stay inline
          setIsInlineLayout(true);
          setPromptWidth(calculatedInlineWidth);
        }

        // Restore focus after layout calculation if input was focused
        if (wasInputFocused && inputRef.current) {
          // Use requestAnimationFrame for smoother timing
          requestAnimationFrame(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              // Maintain cursor position at end
              const length = inputRef.current.value.length;
              inputRef.current.setSelectionRange(length, length);
            }
          });
        }
      }
    }, 50); // 50ms debounce

    return () => clearTimeout(timeoutId);
  }, [aiPrompt, aiChatOpen]);

  // Track prompt container height for chip positioning
  useEffect(() => {
    if (!aiChatOpen || !promptContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPromptContainerHeight(entry.contentRect.height);
      }
    });

    observer.observe(promptContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [aiChatOpen]);

  // Calculate drag constraints based on viewport
  useEffect(() => {
    if (!aiChatOpen) return;
    
    const updateConstraints = () => {
      const margin = 50; // Keep some margin from viewport edges
      const width = promptWidth;
      const height = 100; // Approximate height of prompt input
      
      setDragConstraints({
        left: -clickPosition.x + margin + width / 2,
        right: window.innerWidth - clickPosition.x - margin - width / 2,
        top: -clickPosition.y + margin + height / 2,
        bottom: window.innerHeight - clickPosition.y - margin - height / 2,
      });
    };

    updateConstraints();
    
    const debouncedUpdate = setTimeout(() => {
      window.addEventListener('resize', updateConstraints);
    }, 100);

    return () => {
      clearTimeout(debouncedUpdate);
      window.removeEventListener('resize', updateConstraints);
    };
  }, [aiChatOpen, clickPosition.x, clickPosition.y, promptWidth]);

  const closeMenu = () => {
    setIsOpen(false);
    setHoveredId(null);
  };

  const handleActionClick = (actionId: string) => {
    if (actionId === 'ai-prompt') {
      // Dismiss the radial menu and show AI input
      setIsOpen(false);
      setAiChatOpen(true);
      // Focus after state update and animation
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 250);
    } else {
      console.log(`${actionId} clicked`);
      closeMenu();
    }
  };

  const closeAiChat = () => {
    setAiChatOpen(false);
    setAiPrompt('');
    setShowProviderSelector(false);
    setProviderMenuView('main');
    setIsSending(false);
    setContextMenu(null);
    setShowAttachMenu(false);
    setOriginalPromptText(null); // Reset original prompt tracking
    setShowTemporaryChats([]); // Close all temporary chat overlays
    recentDragRef.current = false; // Reset drag tracking when closing
    setTimeout(() => {
      setIsOpen(false);
      setHoveredId(null);
    }, 400);
  };

  const closeTemporaryChat = (providerId: string) => {
    setShowTemporaryChats(prev => prev.filter(chat => chat.providerId !== providerId));
  };

  const closeAllTemporaryChats = () => {
    setShowTemporaryChats([]);
  };

  const toggleProvider = useCallback((providerId: string) => {
    setSelectedProviders(prev => {
      if (prev.includes(providerId)) {
        // Don't allow deselecting all providers
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== providerId);
      } else {
        if (isMultiSelectMode) {
          // Multi-select mode: add to selection
          return [...prev, providerId];
        } else {
          // Single-select mode: replace selection
          return [providerId];
        }
      }
    });
  }, [isMultiSelectMode]);

  // Robust clipboard copy function with fallback
  const copyToClipboard = (text: string): boolean => {
    // Method 1: Fallback using execCommand (more reliable in all contexts)
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      
      if (successful) {
        return true;
      }
    } catch (err) {
      console.error('Copy method failed:', err);
    }
    
    return false;
  };

  const sendMessage = async () => {
    if (!aiPrompt.trim() || isSending || selectedProviders.length === 0) return;

    setIsSending(true);

    // Beautiful send animation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const promptText = aiPrompt.trim();

    if (version === 2) {
      // Version 2: Show simulated chat overlays for each selected provider
      const chats = selectedProviders.map(providerId => {
        const provider = aiProviders.find(p => p.id === providerId);
        if (!provider) return null;

        return {
          providerId: provider.id,
          providerName: provider.name,
          url: provider.url,
          promptText: promptText
        };
      }).filter(Boolean) as Array<{ providerId: string; providerName: string; url: string; promptText: string }>;

      setShowTemporaryChats(chats);

      // Initialize chat states for auto-typing simulation
      const initialStates: Record<string, any> = {};
      chats.forEach(chat => {
        initialStates[chat.providerId] = {
          stage: 'typing',
          userMessage: '',
          aiResponse: ''
        };
      });
      setChatStates(initialStates);

      // Start auto-typing animation for each chat
      chats.forEach((chat, index) => {
        simulateChatInteraction(chat.providerId, chat.promptText, index * 200);
      });

      setIsSending(false);

      // Dismiss the prompt overlay when temporary chats open
      setAiChatOpen(false);
      setShowProviderSelector(false);
      setProviderMenuView('main');
    } else {
      // Version 1: Open each selected provider in a new tab
      selectedProviders.forEach(providerId => {
        const provider = aiProviders.find(p => p.id === providerId);
        if (provider) {
          try {
            window.open(provider.url, '_blank');
          } catch (error) {
            console.error(`Failed to open ${provider.name}:`, error);
          }
        }
      });

      // Reset after opening
      setTimeout(() => {
        closeAiChat();
        setIsSending(false);
      }, 300);
    }
  };

  // Simulate typing and sending in the chat interface
  const simulateChatInteraction = async (providerId: string, promptText: string, delay: number = 0) => {
    await new Promise(resolve => setTimeout(resolve, delay));

    // Stage 1: Auto-type the prompt
    const typingSpeed = 30; // ms per character
    for (let i = 0; i <= promptText.length; i++) {
      setChatStates(prev => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          stage: 'typing',
          userMessage: promptText.substring(0, i)
        }
      }));
      await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }

    // Stage 2: Click send (brief pause)
    await new Promise(resolve => setTimeout(resolve, 500));
    setChatStates(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        stage: 'sending'
      }
    }));

    // Stage 3: Show AI is responding
    await new Promise(resolve => setTimeout(resolve, 800));
    setChatStates(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        stage: 'responding'
      }
    }));

    // Stage 4: Type AI response
    const aiResponse = getSimulatedResponse(providerId, promptText);
    const responseTypingSpeed = 20;

    await new Promise(resolve => setTimeout(resolve, 600));

    for (let i = 0; i <= aiResponse.length; i++) {
      setChatStates(prev => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          stage: 'responding',
          aiResponse: aiResponse.substring(0, i)
        }
      }));
      await new Promise(resolve => setTimeout(resolve, responseTypingSpeed));
    }

    // Complete
    setChatStates(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        stage: 'complete'
      }
    }));
  };

  // Generate simulated AI responses
  const getSimulatedResponse = (providerId: string, prompt: string): string => {
    const responses: Record<string, string> = {
      'chatgpt': `I'll help you with that! Based on your request "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}", here's what I can suggest:\n\nThis is a simulated response from ChatGPT for demonstration purposes. In a real implementation, this would connect to OpenAI's API and provide actual AI-generated responses.`,
      'perplexity': `Searching for information about "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"...\n\nBased on current web sources, here's what I found:\n\nThis is a simulated Perplexity response for demonstration. Perplexity typically provides AI-powered answers with cited sources from across the web.`,
      'grok': `Hey! Let me address "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"...\n\nThis is a simulated Grok response for demonstration. Grok brings a unique perspective with real-time information and a bit of wit!`
    };

    return responses[providerId] || `Response to: ${prompt}`;
  };

  // Helper function to infer provider name from URL
  const inferProviderName = (url: string): string => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      let domain = urlObj.hostname;
      
      // Remove www. prefix
      domain = domain.replace(/^www\./, '');
      
      // Extract the main domain name (remove TLD)
      const parts = domain.split('.');
      const name = parts.length > 1 ? parts[0] : domain;
      
      // Capitalize first letter and handle common patterns
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return 'Custom Provider';
    }
  };

  // Helper function to get favicon URL
  const getFaviconUrl = (url: string): string => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      // Use Google's favicon service as a reliable source
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return '';
    }
  };

  const addCustomProvider = async () => {
    if (!newProviderUrl.trim()) return;
    
    // Normalize URL
    const normalizedUrl = newProviderUrl.trim().startsWith('http') 
      ? newProviderUrl.trim() 
      : `https://${newProviderUrl.trim()}`;
    
    // Infer name from URL
    const inferredName = inferProviderName(normalizedUrl);
    
    // Get favicon
    const faviconUrl = getFaviconUrl(normalizedUrl);
    
    // Create favicon icon component
    const FaviconIcon = () => (
      <img 
        src={faviconUrl} 
        alt={inferredName}
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          objectFit: 'cover'
        }}
        onError={(e) => {
          // Fallback to a generic icon if favicon fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="var(--primary)" />
              <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          `;
        }}
      />
    );

    const customProvider = {
      id: `custom-${Date.now()}`,
      name: inferredName,
      url: normalizedUrl,
      icon: <FaviconIcon />,
      isApp: false
    };

    // Add to custom providers list
    setCustomProviders(prev => [...prev, customProvider]);
    
    // Auto-select the new provider
    setSelectedProviders(prev => isMultiSelectMode ? [...prev, customProvider.id] : [customProvider.id]);
    
    // Reset form and go back to main view
    setNewProviderUrl('');
    setNewProviderName('');
    setProviderMenuView('main');
  };

  const removeProvider = useCallback((providerId: string) => {
    // Remove from selected providers
    setSelectedProviders(prev => {
      const filtered = prev.filter(id => id !== providerId);
      // Ensure at least one provider remains selected
      return filtered.length > 0 ? filtered : ['chatgpt'];
    });
    
    // Remove from custom providers if it's a custom provider
    if (providerId.startsWith('custom-')) {
      setCustomProviders(prev => prev.filter(p => p.id !== providerId));
    }
    
    setContextMenu(null);
  }, []);

  const removeSavedPrompt = useCallback((promptId: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== promptId));
    setSavedPromptContextMenu(null);
  }, []);

  const startRenaming = useCallback((promptId: string) => {
    const prompt = savedPrompts.find(p => p.id === promptId);
    if (prompt) {
      setRenamingPromptId(promptId);
      setRenameValue(prompt.label);
      setSavedPromptContextMenu(null);
    }
  }, [savedPrompts]);

  const finishRenaming = useCallback(() => {
    if (renamingPromptId) {
      // If no value was entered, use a default label based on the prompt text
      const finalLabel = renameValue.trim() || (() => {
        const prompt = savedPrompts.find(p => p.id === renamingPromptId);
        return prompt ? inferLabel(prompt.text) : 'Saved Prompt';
      })();
      
      setSavedPrompts(prev => 
        prev.map(p => 
          p.id === renamingPromptId 
            ? { ...p, label: finalLabel }
            : p
        )
      );
    }
    setRenamingPromptId(null);
    setRenameValue('');
  }, [renamingPromptId, renameValue, savedPrompts]);

  const cancelRenaming = useCallback(() => {
    setRenamingPromptId(null);
    setRenameValue('');
  }, []);

  const handleProviderRightClick = React.useCallback((e: React.MouseEvent, providerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get the provider menu's position
    const providerMenu = providerMenuRef.current;
    if (!providerMenu) return;
    
    const menuRect = providerMenu.getBoundingClientRect();
    const targetElement = e.currentTarget as HTMLElement;
    const targetRect = targetElement.getBoundingClientRect();
    
    // Position to the right of the provider menu, aligned with the clicked provider
    setContextMenu({
      visible: true,
      x: menuRect.right + 8, // 8px gap from the provider menu
      y: targetRect.top, // Align with the top of the clicked provider
      providerId
    });
  }, []);

  const handleSavedPromptRightClick = React.useCallback((e: React.MouseEvent, promptId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close other menus first
    setShowProviderSelector(false);
    setShowAttachMenu(false);
    setProviderMenuView('main');
    setContextMenu(null);
    
    const targetElement = e.currentTarget as HTMLElement;
    const targetRect = targetElement.getBoundingClientRect();
    
    // Position below the clicked chip
    setSavedPromptContextMenu({
      visible: true,
      x: targetRect.left,
      y: targetRect.bottom + 8, // 8px gap below the chip
      promptId
    });
  }, []);

  // File upload handler
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Process uploaded files
        Array.from(files).forEach(file => {
          console.log('File uploaded:', file.name, file.type, file.size);
          // In a real implementation, you would:
          // 1. Upload the file to your server
          // 2. Add file reference to the prompt/message
          // 3. Display file attachment in the UI
        });
        
        // For demo, just add file names to the prompt
        const fileNames = Array.from(files).map(f => f.name).join(', ');
        setAiPrompt(prev => prev ? `${prev} [Files: ${fileNames}]` : `[Files: ${fileNames}]`);
      }
    };
    input.click();
    setShowAttachMenu(false);
  };

  // Screenshot capture handler
  const handleScreenshotCapture = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: { 
            mediaSource: 'screen',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        
        // Create video element to capture frame
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        video.onloadedmetadata = () => {
          // Create canvas to capture screenshot
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            
            // Convert to blob
            canvas.toBlob(blob => {
              if (blob) {
                console.log('Screenshot captured:', blob.size, 'bytes');
                // In a real implementation, you would:
                // 1. Upload the screenshot to your server
                // 2. Add screenshot reference to the prompt/message
                // 3. Display screenshot thumbnail in the UI
                
                // For demo, just add screenshot indicator to prompt
                setAiPrompt(prev => prev ? `${prev} [Screenshot attached]` : '[Screenshot attached]');
              }
            }, 'image/png');
          }
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };
      } else {
        console.log('Screen capture not supported in this browser');
        alert('Screen capture is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.');
      }
    } catch (err) {
      console.log('Screenshot cancelled or failed:', err);
      // User likely cancelled the screen share dialog
    }
    
    setShowAttachMenu(false);
  };

  const detectedAiApps = [
    { name: 'ChatGPT Desktop', url: 'chatgpt://', detected: true },
    { name: 'Claude Desktop', url: 'claude://', detected: false },
    { name: 'Cursor', url: 'cursor://', detected: true },
    { name: 'GitHub Copilot', url: 'vscode://extension/github.copilot', detected: false }
  ];

  return (
    <>
      {/* Instruction Text - Only show if not interacted */}
      <AnimatePresence>
        {!hasInteracted && !aiChatOpen && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="px-6 py-3 backdrop-blur-xl border"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--elevation-sm)',
                color: 'var(--foreground)',
              }}
            >
              <p style={{ fontFamily: 'Brown Logitech Pan, sans-serif', color: 'var(--foreground)' }}>
                Click anywhere
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standalone AI Input Field - Replaces radial menu */}
      <AnimatePresence>
        {aiChatOpen && !isOpen && (
          <div className="fixed inset-0 z-50">
            <div 
              className="absolute"
              data-radial-menu
              style={{
                left: clickPosition.x,
                top: clickPosition.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Prompt Input Container - Dynamic Layout with Drag */}
              <motion.div
                ref={promptContainerRef}
                data-layer="Prompt Input"
                className="PromptInput"
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px', // 8px gap between input and chips
                  position: 'relative'
                }}
                initial={{ 
                  scale: 0.8,
                  opacity: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  scale: 1,
                  opacity: 1
                }}
                exit={{ 
                  scale: 0.8,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                drag
                dragConstraints={dragConstraints}
                dragElastic={0.1}
                dragMomentum={false}
                onDragStart={() => {
                  setIsDragging(true);
                  recentDragRef.current = true;
                  // Blur input to prevent cursor issues during drag
                  if (inputRef.current) {
                    inputRef.current.blur();
                  }
                }}
                onDragEnd={() => {
                  setIsDragging(false);
                  // Keep recent drag flag for a short time to prevent menu closing on drag end focus
                  setTimeout(() => {
                    recentDragRef.current = false;
                  }, 150);
                }}
                onPointerDown={(e) => {
                  // Allow dragging only if clicking on the container, not input elements or provider menu
                  const target = e.target as HTMLElement;
                  const isInputElement = target.tagName === 'INPUT' || 
                                       target.tagName === 'TEXTAREA' || 
                                       target.closest('input, textarea, button');
                  const isProviderMenu = target.closest('[data-provider-menu]');
                  const isChip = target.closest('[data-chip]');
                  
                  if (isInputElement || isProviderMenu || isChip) {
                    e.stopPropagation();
                    // Reset drag state if clicking on input elements, provider menu, or chips
                    setIsDragging(false);
                  }
                }}
                whileDrag={{
                  scale: 1.02,
                  zIndex: 100
                }}
                onAnimationComplete={() => {
                  // Focus input after animation completes
                  if (inputRef.current && !isDragging) {
                    inputRef.current.focus();
                  }
                }}
              >
                {/* Input Content Container */}
                <div
                  style={{
                    padding: '8px',
                    background: 'rgba(242.25, 242.25, 242.25, 0.88)',
                    borderRadius: 'var(--radius)',
                    flexDirection: isInlineLayout ? 'row' : 'column',
                    justifyContent: 'center',
                    alignItems: isInlineLayout ? 'center' : 'flex-start',
                    gap: '4px',
                    display: 'inline-flex',
                    border: isInputFocused ? '2px solid rgba(129, 78, 250, 0.5)' : '2px solid transparent',
                    boxShadow: isInputFocused ? '0 0 0 3px rgba(129, 78, 250, 0.2)' : 'var(--elevation-md)',
                    transition: 'border 0.2s ease-in-out, box-shadow 0.2s ease-in-out, width 0.3s ease-out',
                    width: promptWidth,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    overflow: 'visible' // Allow plus button to be visible even when extending beyond container
                  }}
                >
                <AnimatePresence mode="popLayout">
                  {isInlineLayout ? (
                    // INLINE LAYOUT - Text and controls on same line
                    <motion.div
                      key="inline"
                      layout
                      style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                        display: 'flex'
                      }}
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                        mass: 0.8,
                        opacity: { duration: 0.25, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.25, ease: "easeOut" }
                      }}
                    >
                      {/* Left Controls - Add Button & Microphone */}
                      <motion.div
                        layout
                        style={{
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: '4px',
                          display: 'flex',
                          flexShrink: 0
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.05,
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                          opacity: { duration: 0.2, ease: "easeOut" }
                        }}
                      >
                        {/* Add Button */}
                        <motion.div
                          data-layer="Add Button"
                          className="AddButton"
                          style={{
                            width: '32px',
                            height: '32px',
                            position: 'relative',
                            flexShrink: 0,
                            cursor: 'pointer',
                            borderRadius: '100px',
                            backgroundColor: 'transparent'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newShowAttachMenu = !showAttachMenu;
                            setShowAttachMenu(newShowAttachMenu);
                            // Close provider menu if opening attachment menu
                            if (newShowAttachMenu) {
                              setShowProviderSelector(false);
                              setProviderMenuView('main');
                            }
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            data-svg-wrapper
                            data-layer="32x32/Wired/Link"
                            className="X32WiredLink"
                            style={{
                              left: '0px',
                              top: '0px',
                              position: 'absolute'
                            }}
                          >
                            <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M22.6411 7.38415C23.1569 7.9 23.1689 8.40085 22.5855 9.21598L11.1769 20.6246C10.7863 21.0151 10.7863 21.6483 11.1769 22.0388C11.5674 22.4294 12.2005 22.4294 12.5911 22.0388L24.0553 10.5746L24.1533 10.4606C25.3317 8.86099 25.3317 7.24637 24.0553 5.96994C22.7789 4.69351 21.1643 4.69351 19.5646 5.87193L19.4507 5.96994L7.98642 17.4342C5.6065 19.7606 5.44681 23.009 7.82673 25.389C10.1472 27.7094 13.3335 27.6162 15.6224 25.4043L24.4052 16.6214C24.7958 16.2309 24.7958 15.5977 24.4052 15.2072C24.0147 14.8167 23.3816 14.8167 22.991 15.2072L14.3758 23.8235C12.8153 25.4197 10.8371 25.5709 9.24095 23.9748C7.69626 22.4301 7.80612 20.4947 9.24383 19.0059L20.8093 7.43976C21.6244 6.85639 22.1253 6.86831 22.6411 7.38415Z" fill="#222425"/>
                            </svg>
                          </div>
                        </motion.div>

                        {/* Dictation Button */}
                        <motion.div
                          data-layer="Dictation Button"
                          className="DictationButton"
                          style={{
                            width: '32px',
                            height: '32px',
                            position: 'relative',
                            borderRadius: '100px',
                            backgroundColor: 'transparent',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Close any open menus
                            setShowProviderSelector(false);
                            setShowAttachMenu(false);
                            setProviderMenuView('main');
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            data-svg-wrapper
                            data-layer="icons/brand/Mic"
                            className="IconsBrandMic"
                            style={{
                              left: '0px',
                              top: '0px',
                              position: 'absolute'
                            }}
                          >
                            <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M16.0146 5H16.1196C18.3289 5 20.1196 6.79072 20.1196 9V16.292C20.1196 18.5006 18.3286 20.292 16.1196 20.292H16.0146C13.8056 20.292 12.0146 18.5006 12.0146 16.292V9C12.0146 6.79072 13.8053 5 16.0146 5ZM13.1196 25.2915H15.1196V23.2211C11.7278 22.7357 9.11963 19.8178 9.11963 16.292H11.1196C11.1196 19.0527 13.3589 21.292 16.1196 21.292C18.8803 21.292 21.1196 19.0527 21.1196 16.292H23.1196C23.1196 19.8178 20.5114 22.7357 17.1196 23.2211V25.2915H19.1196V27.2915H13.1196V25.2915ZM16.1196 7C17.2243 7 18.1196 7.89528 18.1196 9V16.292C18.1196 17.3961 17.2239 18.292 16.1196 18.292H16.0146C14.9103 18.292 14.0146 17.3961 14.0146 16.292V9C14.0146 7.89528 14.9099 7 16.0146 7H16.1196Z" fill="#222425"/>
                            </svg>
                          </div>
                        </motion.div>
                      </motion.div>

                      {/* Text Input - Center */}
                      <motion.div
                        layout
                        style={{
                          flex: '1 1 0',
                          position: 'relative',
                          minHeight: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          overflow: 'visible' // Allow plus button to be visible
                        }}
                      >
                        <textarea
                          ref={inputRef}
                          value={aiPrompt}
                          onChange={(e) => {
                            setAiPrompt(e.target.value);
                            // If user modifies the text, clear the original prompt tracking
                            if (originalPromptText !== null && e.target.value !== originalPromptText) {
                              setOriginalPromptText(null);
                            }
                            // Adjust height immediately on change
                            adjustTextareaHeight(e.target as HTMLTextAreaElement);
                          }}
                          placeholder=""
                          className="bg-transparent border-none w-full resize-none outline-none focus:outline-none"
                          style={{
                            color: renamingPromptId !== null ? '#814EFA' : 'var(--foreground)',
                            fontSize: '16px',
                            fontFamily: 'Brown Logitech Pan, sans-serif',
                            fontWeight: '400',
                            lineHeight: '20px',
                            padding: '6px 2px',
                            caretColor: 'var(--primary)',
                            WebkitTextFillColor: renamingPromptId !== null ? '#814EFA' : 'var(--foreground)',
                            height: '20px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            cursor: isDragging ? 'grabbing' : 'text',
                            userSelect: isDragging ? 'none' : 'text'
                          }}
                          onKeyDown={(e) => {
                            // Handle Ctrl/Cmd + A for select all
                            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                              e.preventDefault();
                              e.stopPropagation();
                              // Explicitly select all text in the textarea
                              const target = e.target as HTMLTextAreaElement;
                              target.select();
                              return;
                            }
                            
                            // Allow copy/paste and other standard shortcuts
                            if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'z', 'y'].includes(e.key.toLowerCase())) {
                              // Let browser handle copy, paste, cut, undo, redo
                              return;
                            }
                            
                            if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          onFocus={() => {
                            setIsInputFocused(true);
                            setIsDragging(false); // Ensure drag is disabled when focusing
                            setShowProviderSelector(false); // Close provider menu when input gets focus
                            setProviderMenuView('main'); // Reset to main view
                          }}
                          onClick={() => {
                            // Also close on click to ensure it works even if focus doesn't fire
                            setShowProviderSelector(false);
                            setProviderMenuView('main');
                          }}
                          onBlur={() => setIsInputFocused(false)}
                          onPointerDown={(e) => {
                            e.stopPropagation(); // Prevent drag when clicking on input
                          }}
                          onContextMenu={(e) => {
                            e.stopPropagation(); // Allow right-click context menu for copy/paste
                          }}
                          autoComplete="off"
                          spellCheck="false"
                          disabled={isDragging}
                        />
                        {!aiPrompt && (
                          <div
                            data-layer="Ask AI anything"
                            className="AskAiAnything"
                            style={{
                              position: 'absolute',
                              top: '6px',
                              left: '0',
                              right: '0',
                              justifyContent: 'flex-start',
                              display: 'flex',
                              flexDirection: 'column',
                              color: 'var(--muted-foreground)',
                              fontSize: '16px',
                              fontFamily: 'Brown Logitech Pan, sans-serif',
                              fontWeight: '400',
                              lineHeight: '20px',
                              wordWrap: 'break-word',
                              pointerEvents: 'none',
                              opacity: 0.7
                            }}
                          >
                            Ask AI anything
                          </div>
                        )}
                        
                        {/* Plus Button - Appears at end of text when user stops typing */}
                        <AnimatePresence>
                          {aiPrompt && hasFinishedTyping && originalPromptText === null && (
                            <motion.div
                              data-layer="Add to Saved Prompts Container"
                              style={{
                                position: 'absolute',
                                left: `${textWidth + 6}px`,
                                top: '6px',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '3px',
                                pointerEvents: 'auto'
                              }}
                              onMouseEnter={() => setIsAddButtonHovered(true)}
                              onMouseLeave={() => setIsAddButtonHovered(false)}
                            >
                              {/* Tooltip */}
                              <AnimatePresence>
                                {isAddButtonHovered && (
                                  <motion.div
                                    data-layer="Frame 659"
                                    className="Frame659"
                                    initial={{ opacity: 0, y: 2, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 2, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    style={{
                                      position: 'absolute',
                                      bottom: '100%',
                                      left: '50%',
                                      transform: 'translateX(-50%) translateY(-6px)',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      display: 'flex',
                                      pointerEvents: 'none',
                                      zIndex: 10000
                                    }}
                                  >
                                    <div
                                      data-layer="Label"
                                      className="Label"
                                      style={{
                                        paddingLeft: '10px',
                                        paddingRight: '10px',
                                        paddingTop: '3px',
                                        paddingBottom: '3px',
                                        background: '#F4F4F4',
                                        overflow: 'hidden',
                                        borderRadius: 'var(--radius-tooltip)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px',
                                        display: 'flex',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                      }}
                                    >
                                      <div
                                        data-layer="Save Prompt"
                                        className="SavePrompt"
                                        style={{
                                          textAlign: 'center',
                                          color: 'var(--foreground)',
                                          fontSize: '12px',
                                          fontFamily: 'Brown Logitech Pan',
                                          fontWeight: '400',
                                          lineHeight: '16px',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        Save Prompt
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Button */}
                              <motion.div
                                data-layer="Button"
                                className="Button"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ 
                                  opacity: 1, 
                                  scale: 1,
                                  backgroundColor: renamingPromptId !== null ? '#814EFA' : '#595B5B'
                                }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  padding: '4px',
                                  borderRadius: '100px',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  gap: '8px',
                                  display: 'flex',
                                  cursor: 'pointer',
                                  boxShadow: renamingPromptId !== null ? '0 0 0 2px rgba(129, 78, 250, 0.3)' : 'none'
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  addSavedPrompt();
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                whileHover={{ 
                                  scale: 1.1, 
                                  backgroundColor: renamingPromptId !== null ? '#6D3FD4' : '#464748'
                                }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <div
                                  data-layer="Vector"
                                  className="Vector"
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    position: 'relative'
                                  }}
                                >
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 1V9M1 5H9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                  </svg>
                                </div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Right Controls */}
                      <motion.div
                        layout
                        style={{
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: '4px',
                          display: 'flex',
                          flexShrink: 0
                        }}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.08,
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                          opacity: { duration: 0.2, ease: "easeOut" }
                        }}
                      >
                        {/* Selected Providers Display */}
                        <motion.div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newShowProviderSelector = !showProviderSelector;
                            setShowProviderSelector(newShowProviderSelector);
                            if (newShowProviderSelector) {
                              setProviderMenuView('main'); // Always open to main view
                              // Close attachment menu if opening provider menu
                              setShowAttachMenu(false);
                            }
                          }}
                          onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          data-layer="Provider Dropdown"
                          className="ProviderDropdown"
                          style={{
                            height: '32px',
                            position: 'relative',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px'
                          }}
                        >
                          {selectedProviders.map((providerId, index) => {
                            const provider = aiProviders.find(p => p.id === providerId);
                            if (!provider) return null;
                            
                            return (
                              <motion.div
                                key={providerId}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 200, 
                                  damping: 35,
                                  delay: index * 0.03 
                                }}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: provider.isApp ? '4px' : '100px',
                                  background: 'var(--input-background)',
                                  border: `1px solid var(--border)`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'var(--foreground)',
                                  boxShadow: 'var(--elevation-sm)',
                                  position: 'relative',
                                  zIndex: index + 1,
                                  marginLeft: index > 0 ? '-18px' : '0'
                                }}
                              >
                                {React.cloneElement(provider.icon as React.ReactElement, { size: 16 })}
                              </motion.div>
                            );
                          })}
                        </motion.div>

                        {/* Send Button */}
                        <motion.button
                          onClick={sendMessage}
                          onPointerDown={(e) => e.stopPropagation()}
                          disabled={!aiPrompt.trim() || isSending}
                          data-svg-wrapper
                          data-layer="Primary button"
                          className="PrimaryButton"
                          style={{
                            position: 'relative',
                            border: 'none',
                            cursor: !aiPrompt.trim() || isSending ? 'not-allowed' : 'pointer',
                            background: 'transparent'
                          }}
                          animate={{ 
                            opacity: aiPrompt.trim() && !isSending ? 1 : 0.5,
                            rotate: isSending ? 360 : 0,
                          }}
                          transition={{ 
                            delay: aiPrompt.trim() ? 0 : 0.6,
                            opacity: { duration: 0.2, ease: "easeOut" },
                            rotate: { duration: 0.6, ease: "easeInOut" }
                          }}
                          whileHover={{ scale: (!aiPrompt.trim() || isSending) ? 1 : 1.05 }}
                          whileTap={{ scale: (!aiPrompt.trim() || isSending) ? 1 : 0.95 }}
                        >
                          <AnimatePresence mode="wait">
                            {isSending ? (
                              <motion.div
                                key="sending"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-center w-full h-full"
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="send"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="32.1196" width="32" height="32" rx="16" transform="rotate(90 32.1196 0)" fill="#814EFA"/>
                                  <path fillRule="evenodd" clipRule="evenodd" d="M10.3293 14.0941L10.4125 13.9999L16.1196 8.29282L21.8267 13.9999C22.2173 14.3904 22.2173 15.0236 21.8267 15.4141C21.4663 15.7746 20.899 15.8024 20.5067 15.4973L20.4125 15.4141L17.1196 12.122L17.1196 22.707C17.1196 23.2593 16.6719 23.707 16.1196 23.707C15.6068 23.707 15.1841 23.321 15.1264 22.8237L15.1196 22.707L15.1196 12.122L11.8267 15.4141C11.4663 15.7746 10.899 15.8024 10.5067 15.4973L10.4125 15.4141C10.0821 15.0837 10.0312 14.5795 10.26 14.1956L10.3293 14.0941Z" fill="white"/>
                                </svg>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    // STACKED LAYOUT - Text on top, controls below
                    <motion.div
                      key="stacked"
                      layout
                      style={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: '4px',
                        display: 'flex'
                      }}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                        mass: 0.8,
                        opacity: { duration: 0.25, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.25, ease: "easeOut" }
                      }}
                    >
                      {/* Input Field Section */}
                      <motion.div
                        layout
                        data-layer="Input Field"
                        className="InputField"
                        style={{
                          alignSelf: 'stretch',
                          paddingTop: '8px',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '10px',
                          display: 'inline-flex'
                        }}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: 0.1,
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                          opacity: { duration: 0.2, ease: "easeOut" }
                        }}
                      >
                        <div
                          style={{
                            flex: '1 1 0',
                            justifyContent: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            color: '#222425',
                            fontSize: '16px',
                            fontFamily: 'Brown Logitech Pan, sans-serif',
                            fontWeight: '400',
                            lineHeight: '20px',
                            wordWrap: 'break-word',
                            position: 'relative',
                            overflow: 'visible' // Allow plus button to overflow
                          }}
                        >
                          <textarea
                            ref={inputRef}
                            value={aiPrompt}
                            onChange={(e) => {
                              setAiPrompt(e.target.value);
                              // If user modifies the text, clear the original prompt tracking
                              if (originalPromptText !== null && e.target.value !== originalPromptText) {
                                setOriginalPromptText(null);
                              }
                              // Adjust height immediately on change
                              adjustTextareaHeight(e.target as HTMLTextAreaElement);
                            }}
                            placeholder=""
                            className="bg-transparent border-none w-full resize-none outline-none focus:outline-none"
                            style={{
                              color: renamingPromptId !== null ? '#814EFA' : 'var(--foreground)',
                              fontSize: '16px',
                              fontFamily: 'Brown Logitech Pan, sans-serif',
                              fontWeight: '400',
                              lineHeight: '20px',
                              padding: '0 2px',
                              caretColor: 'var(--primary)',
                              WebkitTextFillColor: renamingPromptId !== null ? '#814EFA' : 'var(--foreground)',
                              height: '20px',
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word',
                              overflow: 'hidden',
                              overflowWrap: 'break-word',
                              wordBreak: 'break-word',
                              cursor: isDragging ? 'grabbing' : 'text',
                              userSelect: isDragging ? 'none' : 'text'
                            }}
                            onKeyDown={(e) => {
                              // Handle Ctrl/Cmd + A for select all
                              if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                                e.preventDefault();
                                e.stopPropagation();
                                // Explicitly select all text in the textarea
                                const target = e.target as HTMLTextAreaElement;
                                target.select();
                                return;
                              }
                              
                              // Allow other copy/paste and standard shortcuts
                              if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'z', 'y'].includes(e.key.toLowerCase())) {
                                // Let browser handle copy, paste, cut, undo, redo
                                return;
                              }
                              
                              if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                                e.preventDefault();
                                sendMessage();
                              }
                            }}
                            onFocus={() => {
                              setIsInputFocused(true);
                              setIsDragging(false); // Ensure drag is disabled when focusing
                              setShowProviderSelector(false); // Close provider menu when input gets focus
                              setProviderMenuView('main'); // Reset to main view
                            }}
                            onClick={() => {
                              // Also close on click to ensure it works even if focus doesn't fire
                              setShowProviderSelector(false);
                              setProviderMenuView('main');
                            }}
                            onBlur={() => setIsInputFocused(false)}
                            onPointerDown={(e) => {
                              e.stopPropagation(); // Prevent drag when clicking on input
                            }}
                            onContextMenu={(e) => {
                              e.stopPropagation(); // Allow right-click context menu for copy/paste
                            }}
                            autoComplete="off"
                            spellCheck="false"
                            disabled={isDragging}
                          />
                          {!aiPrompt && (
                            <div
                              data-layer="Ask AI anything"
                              className="AskAiAnything"
                              style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                right: '0',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                color: 'var(--muted-foreground)',
                                fontSize: '16px',
                                fontFamily: 'Brown Logitech Pan, sans-serif',
                                fontWeight: '400',
                                lineHeight: '20px',
                                wordWrap: 'break-word',
                                pointerEvents: 'none',
                                opacity: 0.7
                              }}
                            >
                              Ask AI anything
                            </div>
                          )}
                          
                          {/* Plus Button - Should NOT appear here in stacked layout - it moves to controls section */}
                          <AnimatePresence>
                            {aiPrompt && !isTextMultiline && hasFinishedTyping && originalPromptText === null && (
                              <motion.div
                                data-layer="Add to Saved Prompts Container"
                                style={{
                                  position: 'absolute',
                                  left: `${textWidth + 6}px`,
                                  top: '0px',
                                  width: '18px',
                                  height: '18px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '3px',
                                  pointerEvents: 'auto'
                                }}
                                onMouseEnter={() => setIsAddButtonHovered(true)}
                                onMouseLeave={() => setIsAddButtonHovered(false)}
                              >
                                {/* Tooltip */}
                                <AnimatePresence>
                                  {isAddButtonHovered && (
                                    <motion.div
                                      data-layer="Frame 659"
                                      className="Frame659"
                                      initial={{ opacity: 0, y: 2, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 2, scale: 0.95 }}
                                      transition={{ duration: 0.15 }}
                                      style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%) translateY(-6px)',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        display: 'flex',
                                        pointerEvents: 'none',
                                        zIndex: 10000
                                      }}
                                    >
                                      <div
                                        data-layer="Label"
                                        className="Label"
                                        style={{
                                          paddingLeft: '10px',
                                          paddingRight: '10px',
                                          paddingTop: '3px',
                                          paddingBottom: '3px',
                                          background: '#F4F4F4',
                                          overflow: 'hidden',
                                          borderRadius: 'var(--radius-tooltip)',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          gap: '10px',
                                          display: 'flex',
                                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                        }}
                                      >
                                        <div
                                          data-layer="Save Prompt"
                                          className="SavePrompt"
                                          style={{
                                            textAlign: 'center',
                                            color: 'var(--foreground)',
                                            fontSize: '12px',
                                            fontFamily: 'Brown Logitech Pan',
                                            fontWeight: '400',
                                            lineHeight: '16px',
                                            whiteSpace: 'nowrap'
                                          }}
                                        >
                                          Save Prompt
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Button */}
                                <motion.div
                                  data-layer="Button"
                                  className="Button"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    backgroundColor: renamingPromptId !== null ? '#814EFA' : '#595B5B'
                                  }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.15 }}
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    padding: '4px',
                                    borderRadius: '100px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px',
                                    display: 'flex',
                                    cursor: 'pointer',
                                    boxShadow: renamingPromptId !== null ? '0 0 0 2px rgba(129, 78, 250, 0.3)' : 'none'
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addSavedPrompt();
                                  }}
                                  onPointerDown={(e) => e.stopPropagation()}
                                  whileHover={{ 
                                    scale: 1.1, 
                                    backgroundColor: renamingPromptId !== null ? '#6D3FD4' : '#464748'
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <div
                                    data-layer="Vector"
                                    className="Vector"
                                    style={{
                                      width: '10px',
                                      height: '10px',
                                      position: 'relative'
                                    }}
                                  >
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M5 1V9M1 5H9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                  </div>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Controls Section */}
                      <motion.div
                        layout
                        data-layer="Controls"
                        className="Controls"
                        style={{
                          alignSelf: 'stretch',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          display: 'inline-flex'
                        }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: 0.15,
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                          opacity: { duration: 0.2, ease: "easeOut" }
                        }}
                      >
                        {/* Left Controls - Add Button & Microphone */}
                        <motion.div
                          layout
                          style={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '4px',
                            display: 'flex',
                            flexShrink: 0
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: 0.1,
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                            opacity: { duration: 0.2, ease: "easeOut" }
                          }}
                        >
                          {/* Add Button */}
                          <motion.div
                            data-layer="Add Button"
                            className="AddButton"
                            style={{
                              width: '32px',
                              height: '32px',
                              position: 'relative',
                              cursor: 'pointer',
                              borderRadius: '100px',
                              backgroundColor: 'transparent'
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newShowAttachMenu = !showAttachMenu;
                              setShowAttachMenu(newShowAttachMenu);
                              // Close provider menu if opening attachment menu
                              if (newShowAttachMenu) {
                                setShowProviderSelector(false);
                                setProviderMenuView('main');
                              }
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div
                              data-svg-wrapper
                              data-layer="32x32/Wired/Link"
                              className="X32WiredLink"
                              style={{
                                left: '0px',
                                top: '0px',
                                position: 'absolute'
                              }}
                            >
                              <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M22.6411 7.38415C23.1569 7.9 23.1689 8.40085 22.5855 9.21598L11.1769 20.6246C10.7863 21.0151 10.7863 21.6483 11.1769 22.0388C11.5674 22.4294 12.2005 22.4294 12.5911 22.0388L24.0553 10.5746L24.1533 10.4606C25.3317 8.86099 25.3317 7.24637 24.0553 5.96994C22.7789 4.69351 21.1643 4.69351 19.5646 5.87193L19.4507 5.96994L7.98642 17.4342C5.6065 19.7606 5.44681 23.009 7.82673 25.389C10.1472 27.7094 13.3335 27.6162 15.6224 25.4043L24.4052 16.6214C24.7958 16.2309 24.7958 15.5977 24.4052 15.2072C24.0147 14.8167 23.3816 14.8167 22.991 15.2072L14.3758 23.8235C12.8153 25.4197 10.8371 25.5709 9.24095 23.9748C7.69626 22.4301 7.80612 20.4947 9.24383 19.0059L20.8093 7.43976C21.6244 6.85639 22.1253 6.86831 22.6411 7.38415Z" fill="#222425"/>
                              </svg>
                            </div>
                          </motion.div>

                          {/* Dictation Button */}
                          <motion.div
                            data-layer="Dictation Button"
                            className="DictationButton"
                            style={{
                              width: '32px',
                              height: '32px',
                              position: 'relative',
                              borderRadius: '100px',
                              backgroundColor: 'transparent',
                              cursor: 'pointer'
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Close any open menus
                              setShowProviderSelector(false);
                              setShowAttachMenu(false);
                              setProviderMenuView('main');
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div
                              data-svg-wrapper
                              data-layer="icons/brand/Mic"
                              className="IconsBrandMic"
                              style={{
                                left: '0px',
                                top: '0px',
                                position: 'absolute'
                              }}
                            >
                              <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M16.0146 5H16.1196C18.3289 5 20.1196 6.79072 20.1196 9V16.292C20.1196 18.5006 18.3286 20.292 16.1196 20.292H16.0146C13.8056 20.292 12.0146 18.5006 12.0146 16.292V9C12.0146 6.79072 13.8053 5 16.0146 5ZM13.1196 25.2915H15.1196V23.2211C11.7278 22.7357 9.11963 19.8178 9.11963 16.292H11.1196C11.1196 19.0527 13.3589 21.292 16.1196 21.292C18.8803 21.292 21.1196 19.0527 21.1196 16.292H23.1196C23.1196 19.8178 20.5114 22.7357 17.1196 23.2211V25.2915H19.1196V27.2915H13.1196V25.2915ZM16.1196 7C17.2243 7 18.1196 7.89528 18.1196 9V16.292C18.1196 17.3961 17.2239 18.292 16.1196 18.292H16.0146C14.9103 18.292 14.0146 17.3961 14.0146 16.292V9C14.0146 7.89528 14.9099 7 16.0146 7H16.1196Z" fill="#222425"/>
                              </svg>
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Right Controls */}
                        <motion.div
                          layout
                          data-layer="Frame 34651075"
                          className="Frame34651075"
                          style={{
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: '4px',
                            display: 'flex',
                            flex: 1
                          }}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: 0.12,
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                            opacity: { duration: 0.2, ease: "easeOut" }
                          }}
                        >
                          {/* Plus Button - Shows in controls section in stacked layout when user has finished typing */}
                          <AnimatePresence>
                            {aiPrompt && hasFinishedTyping && originalPromptText === null && (
                              <motion.div
                                data-layer="Add to Saved Prompts Container"
                                initial={{ opacity: 0, scale: 0.8, width: 0, marginRight: 0 }}
                                animate={{ 
                                  opacity: 1, 
                                  scale: 1,
                                  width: '18px',
                                  marginRight: '4px'
                                }}
                                exit={{ opacity: 0, scale: 0.8, width: 0, marginRight: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '3px',
                                  position: 'relative',
                                  flexShrink: 0
                                }}
                                onMouseEnter={() => setIsAddButtonHovered(true)}
                                onMouseLeave={() => setIsAddButtonHovered(false)}
                              >
                                  {/* Tooltip */}
                                  <AnimatePresence>
                                    {isAddButtonHovered && (
                                      <motion.div
                                        data-layer="Frame 659"
                                        className="Frame659"
                                        initial={{ opacity: 0, y: 2, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 2, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                          position: 'absolute',
                                          bottom: '100%',
                                          left: '50%',
                                          transform: 'translateX(-50%) translateY(-6px)',
                                          flexDirection: 'column',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          display: 'flex',
                                          pointerEvents: 'none',
                                          zIndex: 10000
                                        }}
                                      >
                                        <div
                                          data-layer="Label"
                                          className="Label"
                                          style={{
                                            paddingLeft: '10px',
                                            paddingRight: '10px',
                                            paddingTop: '3px',
                                            paddingBottom: '3px',
                                            background: '#F4F4F4',
                                            overflow: 'hidden',
                                            borderRadius: 'var(--radius-tooltip)',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '10px',
                                            display: 'flex',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                          }}
                                        >
                                          <div
                                            data-layer="Save Prompt"
                                            className="SavePrompt"
                                            style={{
                                              textAlign: 'center',
                                              color: 'var(--foreground)',
                                              fontSize: '12px',
                                              fontFamily: 'Brown Logitech Pan',
                                              fontWeight: '400',
                                              lineHeight: '16px',
                                              whiteSpace: 'nowrap'
                                            }}
                                          >
                                            Save Prompt
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>

                                  {/* Button */}
                                  <motion.div
                                    data-layer="Button"
                                    className="Button"
                                    animate={{ 
                                      backgroundColor: renamingPromptId !== null ? '#814EFA' : '#595B5B'
                                    }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      padding: '4px',
                                      borderRadius: '100px',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      gap: '8px',
                                      display: 'flex',
                                      cursor: 'pointer',
                                      boxShadow: renamingPromptId !== null ? '0 0 0 2px rgba(129, 78, 250, 0.3)' : 'none'
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      addSavedPrompt();
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    whileHover={{ 
                                      scale: 1.1, 
                                      backgroundColor: renamingPromptId !== null ? '#6D3FD4' : '#464748'
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <div
                                      data-layer="Vector"
                                      className="Vector"
                                      style={{
                                        width: '10px',
                                        height: '10px',
                                        position: 'relative',
                                        flexShrink: 0
                                      }}
                                    >
                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 1V9M1 5H9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                      </svg>
                                    </div>
                                  </motion.div>
                                </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Send To Container */}
                          <div
                            data-layer="Send To"
                            className="SendTo"
                            style={{
                              padding: '4px',
                              borderRadius: '24px',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              gap: '4px',
                              display: 'flex'
                            }}
                          >
                            {/* Provider Dropdown Container */}
                            <div
                              data-layer="Frame 34651074"
                              className="Frame34651074"
                              style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                display: 'flex'
                              }}
                            >
                              {/* Selected Providers Display */}
                              <motion.div
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const newShowProviderSelector = !showProviderSelector;
                                  setShowProviderSelector(newShowProviderSelector);
                                  if (newShowProviderSelector) {
                                    setProviderMenuView('main'); // Always open to main view
                                    // Close attachment menu if opening provider menu
                                    setShowAttachMenu(false);
                                  }
                                }}
                                onPointerDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                data-layer="Provider Dropdown"
                                className="ProviderDropdown"
                                style={{
                                  height: '32px',
                                  position: 'relative',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '4px'
                                }}
                              >
                                {selectedProviders.map((providerId, index) => {
                                  const provider = aiProviders.find(p => p.id === providerId);
                                  if (!provider) return null;
                                  
                                  return (
                                    <motion.div
                                      key={providerId}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ 
                                        type: "spring", 
                                        stiffness: 200, 
                                        damping: 35,
                                        delay: index * 0.03 
                                      }}
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: provider.isApp ? '4px' : '100px',
                                        background: 'var(--input-background)',
                                        border: `1px solid var(--border)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--foreground)',
                                        boxShadow: 'var(--elevation-sm)',
                                        position: 'relative',
                                        zIndex: index + 1,
                                        marginLeft: index > 0 ? '-18px' : '0'
                                      }}
                                    >
                                      {React.cloneElement(provider.icon as React.ReactElement, { size: 16 })}
                                    </motion.div>
                                  );
                                })}
                              </motion.div>
                            </div>

                            {/* Primary Send Button */}
                            <motion.button
                              onClick={sendMessage}
                              onPointerDown={(e) => e.stopPropagation()}
                              disabled={!aiPrompt.trim() || isSending}
                              data-svg-wrapper
                              data-layer="Primary button"
                              className="PrimaryButton"
                              style={{
                                position: 'relative',
                                border: 'none',
                                cursor: !aiPrompt.trim() || isSending ? 'not-allowed' : 'pointer',
                                background: 'transparent'
                              }}
                              animate={{ 
                                opacity: aiPrompt.trim() && !isSending ? 1 : 0.5,
                                rotate: isSending ? 360 : 0,
                              }}
                              transition={{ 
                                delay: aiPrompt.trim() ? 0 : 0.7,
                                opacity: { duration: 0.2, ease: "easeOut" },
                                rotate: { duration: 0.6, ease: "easeInOut" }
                              }}
                              whileHover={{ scale: (!aiPrompt.trim() || isSending) ? 1 : 1.05 }}
                              whileTap={{ scale: (!aiPrompt.trim() || isSending) ? 1 : 0.95 }}
                            >
                              <AnimatePresence mode="wait">
                                {isSending ? (
                                  <motion.div
                                    key="sending"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-center w-full h-full"
                                  >
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                                    />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="send"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect x="32.1196" width="32" height="32" rx="16" transform="rotate(90 32.1196 0)" fill="#814EFA"/>
                                      <path fillRule="evenodd" clipRule="evenodd" d="M10.3293 14.0941L10.4125 13.9999L16.1196 8.29282L21.8267 13.9999C22.2173 14.3904 22.2173 15.0236 21.8267 15.4141C21.4663 15.7746 20.899 15.8024 20.5067 15.4973L20.4125 15.4141L17.1196 12.122L17.1196 22.707C17.1196 23.2593 16.6719 23.707 16.1196 23.707C15.6068 23.707 15.1841 23.321 15.1264 22.8237L15.1196 22.707L15.1196 12.122L11.8267 15.4141C11.4663 15.7746 10.899 15.8024 10.5067 15.4973L10.4125 15.4141C10.0821 15.0837 10.0312 14.5795 10.26 14.1956L10.3293 14.0941Z" fill="white"/>
                                    </svg>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>

                {/* Saved Prompt Chips - Positioned below input with 8px gap */}
                <AnimatePresence>
                  {!isOpen && (
                    <motion.div
                      data-layer="Frame 34651095"
                      className="Frame34651095"
                      style={{
                        alignSelf: 'stretch',
                        width: '100%',
                        maxWidth: promptWidth,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: '8px',
                        display: 'inline-flex',
                        flexWrap: 'wrap',
                        alignContent: 'flex-start',
                        pointerEvents: 'auto',
                        paddingLeft: '0px'
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 25,
                        delay: 0.15
                      }}
                    >
                      {/* Dynamically Created Saved Prompts */}
                      {savedPrompts.map((prompt, index) => (
                        <motion.div
                          key={prompt.id}
                          data-layer="Saved Prompt"
                          data-state="Default"
                          data-chip
                          className="SavedPrompt"
                          style={{
                            height: '24px',
                            paddingLeft: renamingPromptId === prompt.id ? '8px' : '12px',
                            maxWidth: '140px',
                            background: 'rgba(244.57, 244.57, 244.57, 0.84)',
                            borderRadius: '100px',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '0px',
                            display: 'inline-flex',
                            cursor: renamingPromptId === prompt.id ? 'text' : 'pointer'
                          }}
                          initial={{ opacity: 0, scale: 0.8, x: -10 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            x: 0,
                            paddingRight: renamingPromptId === prompt.id ? '8px' : ((hoveredChipId === prompt.id || savedPromptContextMenu?.promptId === prompt.id) ? '0px' : '12px')
                          }}
                          exit={{ opacity: 0, scale: 0.8, x: -10 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 25,
                            delay: index * 0.05
                          }}
                          onClick={(e) => {
                            // Check if clicking on dots icon - if so, don't do anything
                            const target = e.target as HTMLElement;
                            if (target.closest('.IconOptionsDots')) {
                              return;
                            }
                            
                            if (renamingPromptId === prompt.id) {
                              e.stopPropagation();
                              return;
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            // Close any open menus immediately
                            setShowProviderSelector(false);
                            setShowAttachMenu(false);
                            setProviderMenuView('main');
                            setSavedPromptContextMenu(null);
                            // Set the prompt text and track that it came from a saved prompt
                            setAiPrompt(prompt.text);
                            setOriginalPromptText(prompt.text);
                            // Wait for React to update the DOM, then focus and position cursor
                            setTimeout(() => {
                              if (inputRef.current) {
                                // Ensure the value is set in the DOM
                                inputRef.current.value = prompt.text;
                                inputRef.current.focus();
                                // Position cursor at end
                                const length = inputRef.current.value.length;
                                inputRef.current.setSelectionRange(length, length);
                                // Scroll to end if needed
                                inputRef.current.scrollLeft = inputRef.current.scrollWidth;
                              }
                            }, 50);
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (renamingPromptId !== prompt.id) {
                              handleSavedPromptRightClick(e, prompt.id);
                            }
                          }}
                          onPointerDown={(e) => {
                            // Don't stop propagation on right-click (button 2)
                            if (e.button !== 2) {
                              e.stopPropagation();
                            }
                          }}
                          onHoverStart={() => setHoveredChipId(prompt.id)}
                          onHoverEnd={() => setHoveredChipId(null)}
                          whileHover={{ 
                            backgroundColor: renamingPromptId === prompt.id ? 'rgba(244.57, 244.57, 244.57, 0.84)' : 'rgba(234, 234, 234, 0.84)',
                            scale: renamingPromptId === prompt.id ? 1 : 1.02
                          }}
                          whileTap={{ scale: renamingPromptId === prompt.id ? 1 : 0.98 }}
                        >
                          {renamingPromptId === prompt.id ? (
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                // Handle Ctrl/Cmd + A for select all
                                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const target = e.target as HTMLInputElement;
                                  target.select();
                                  return;
                                }
                                
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  finishRenaming();
                                } else if (e.key === 'Escape') {
                                  e.preventDefault();
                                  cancelRenaming();
                                }
                              }}
                              onBlur={finishRenaming}
                              placeholder="Add a prompt title"
                              autoFocus
                              className="bg-transparent border-none outline-none"
                              style={{
                                color: '#222425',
                                fontSize: '14px',
                                fontFamily: 'Brown Logitech Pan',
                                fontWeight: '400',
                                lineHeight: '18px',
                                padding: '0',
                                width: 'auto',
                                minWidth: 'fit-content'
                              }}
                              size={renameValue ? renameValue.length : 18}
                              onClick={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <>
                              <div
                                data-layer="Saved Prompt Title in"
                                className="SavedPromptTitleIn"
                                style={{
                                  justifyContent: 'center',
                                  display: 'block',
                                  color: '#222425',
                                  fontSize: '14px',
                                  fontFamily: 'Brown Logitech Pan',
                                  fontWeight: '400',
                                  lineHeight: '18px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  flex: '1 1 0',
                                  minWidth: 0,
                                  maxWidth: '100%'
                                }}
                              >
                                {prompt.label}
                              </div>
                              <AnimatePresence>
                                {(hoveredChipId === prompt.id || savedPromptContextMenu?.promptId === prompt.id) && (
                                  <motion.div
                                    data-layer="icon/options+/Dots"
                                    className="IconOptionsDots"
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      position: 'relative',
                                      flexShrink: 0,
                                      cursor: 'pointer',
                                      borderRadius: '100px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: '24px' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      // Toggle menu: if already open for this prompt, close it; otherwise open it
                                      if (savedPromptContextMenu?.promptId === prompt.id) {
                                        setSavedPromptContextMenu(null);
                                      } else {
                                        handleSavedPromptRightClick(e, prompt.id);
                                      }
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <DotsIcon />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </motion.div>
                      ))}

                      {/* Rephrase Chip */}
                      <motion.div
                        data-layer="Saved Prompt"
                        data-state="Default"
                        data-chip
                        className="SavedPrompt"
                        style={{
                          height: '24px',
                          paddingLeft: '12px',
                          maxWidth: '140px',
                          background: 'rgba(244.57, 244.57, 244.57, 0.84)',
                          borderRadius: '100px',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: '0px',
                          display: 'inline-flex',
                          cursor: 'pointer'
                        }}
                        animate={{
                          paddingRight: (hoveredChipId === 'rephrase' || savedPromptContextMenu?.promptId === 'rephrase') ? '0px' : '12px'
                        }}
                        transition={{
                          paddingRight: { duration: 0.2 }
                        }}
                        onClick={(e) => {
                          // Check if clicking on dots icon - if so, don't do anything
                          const target = e.target as HTMLElement;
                          if (target.closest('.IconOptionsDots')) {
                            return;
                          }
                          
                          e.preventDefault();
                          e.stopPropagation();
                          // Close any open menus immediately
                          setShowProviderSelector(false);
                          setShowAttachMenu(false);
                          setProviderMenuView('main');
                          setSavedPromptContextMenu(null);
                          // Set the prompt text and track that it came from a preset
                          setAiPrompt('Rephrase the following text: ');
                          setOriginalPromptText('Rephrase the following text: ');
                          // Wait for React to update the DOM, then focus and position cursor
                          setTimeout(() => {
                            if (inputRef.current) {
                              // Ensure the value is set in the DOM
                              inputRef.current.value = 'Rephrase the following text: ';
                              inputRef.current.focus();
                              // Position cursor at end
                              const length = inputRef.current.value.length;
                              inputRef.current.setSelectionRange(length, length);
                              // Scroll to end if needed
                              inputRef.current.scrollLeft = inputRef.current.scrollWidth;
                            }
                          }, 50);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onHoverStart={() => setHoveredChipId('rephrase')}
                        onHoverEnd={() => setHoveredChipId(null)}
                        whileHover={{ 
                          backgroundColor: 'rgba(234, 234, 234, 0.84)',
                          scale: 1.02
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          data-layer="Saved Prompt Title in"
                          className="SavedPromptTitleIn"
                          style={{
                            justifyContent: 'center',
                            display: 'block',
                            color: '#222425',
                            fontSize: '14px',
                            fontFamily: 'Brown Logitech Pan',
                            fontWeight: '400',
                            lineHeight: '18px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flex: '1 1 0',
                            minWidth: 0,
                            maxWidth: '100%'
                          }}
                        >
                          Rephrase
                        </div>
                        <AnimatePresence>
                          {(hoveredChipId === 'rephrase' || savedPromptContextMenu?.promptId === 'rephrase') && (
                            <motion.div
                              data-layer="icon/options+/Dots"
                              className="IconOptionsDots"
                              style={{
                                width: '24px',
                                height: '24px',
                                position: 'relative',
                                flexShrink: 0,
                                cursor: 'pointer',
                                borderRadius: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: '24px' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Toggle menu: if already open for this prompt, close it; otherwise open it
                                if (savedPromptContextMenu?.promptId === 'rephrase') {
                                  setSavedPromptContextMenu(null);
                                } else {
                                  handleSavedPromptRightClick(e, 'rephrase');
                                }
                              }}
                              onPointerDown={(e) => e.stopPropagation()}
                              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <DotsIcon />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Summarise Chip */}
                      <motion.div
                        data-layer="Saved Prompt"
                        data-state="Default"
                        data-chip
                        className="SavedPrompt"
                        style={{
                          height: '24px',
                          paddingLeft: '12px',
                          maxWidth: '140px',
                          background: 'rgba(244.57, 244.57, 244.57, 0.84)',
                          borderRadius: '100px',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: '0px',
                          display: 'inline-flex',
                          cursor: 'pointer'
                        }}
                        animate={{
                          paddingRight: (hoveredChipId === 'summarise' || savedPromptContextMenu?.promptId === 'summarise') ? '0px' : '12px'
                        }}
                        transition={{
                          paddingRight: { duration: 0.2 }
                        }}
                        onClick={(e) => {
                          // Check if clicking on dots icon - if so, don't do anything
                          const target = e.target as HTMLElement;
                          if (target.closest('.IconOptionsDots')) {
                            return;
                          }
                          
                          e.preventDefault();
                          e.stopPropagation();
                          // Close any open menus immediately
                          setShowProviderSelector(false);
                          setShowAttachMenu(false);
                          setProviderMenuView('main');
                          setSavedPromptContextMenu(null);
                          // Set the prompt text and track that it came from a preset
                          setAiPrompt('Summarise the following text: ');
                          setOriginalPromptText('Summarise the following text: ');
                          // Wait for React to update the DOM, then focus and position cursor
                          setTimeout(() => {
                            if (inputRef.current) {
                              // Ensure the value is set in the DOM
                              inputRef.current.value = 'Summarise the following text: ';
                              inputRef.current.focus();
                              // Position cursor at end
                              const length = inputRef.current.value.length;
                              inputRef.current.setSelectionRange(length, length);
                              // Scroll to end if needed
                              inputRef.current.scrollLeft = inputRef.current.scrollWidth;
                            }
                          }, 50);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onHoverStart={() => setHoveredChipId('summarise')}
                        onHoverEnd={() => setHoveredChipId(null)}
                        whileHover={{ 
                          backgroundColor: 'rgba(234, 234, 234, 0.84)',
                          scale: 1.02
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          data-layer="Saved Prompt Title in"
                          className="SavedPromptTitleIn"
                          style={{
                            justifyContent: 'center',
                            display: 'block',
                            color: '#222425',
                            fontSize: '14px',
                            fontFamily: 'Brown Logitech Pan',
                            fontWeight: '400',
                            lineHeight: '18px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flex: '1 1 0',
                            minWidth: 0,
                            maxWidth: '100%'
                          }}
                        >
                          Summarise
                        </div>
                        <AnimatePresence>
                          {(hoveredChipId === 'summarise' || savedPromptContextMenu?.promptId === 'summarise') && (
                            <motion.div
                              data-layer="icon/options+/Dots"
                              className="IconOptionsDots"
                              style={{
                                width: '24px',
                                height: '24px',
                                position: 'relative',
                                flexShrink: 0,
                                cursor: 'pointer',
                                borderRadius: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: '24px' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Toggle menu: if already open for this prompt, close it; otherwise open it
                                if (savedPromptContextMenu?.promptId === 'summarise') {
                                  setSavedPromptContextMenu(null);
                                } else {
                                  handleSavedPromptRightClick(e, 'summarise');
                                }
                              }}
                              onPointerDown={(e) => e.stopPropagation()}
                              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <DotsIcon />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Attachment Menu */}
                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div
                      className="absolute"
                      style={{
                        bottom: '100%',
                        left: '0',
                        marginBottom: '8px',
                        zIndex: 25,
                        pointerEvents: 'auto'
                      }}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      data-attach-menu
                      onPointerDown={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div data-layer="Attach" className="Attach" style={{background: '#F2F2F2', overflow: 'hidden', borderRadius: 16, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                        <div data-layer="Providers List" className="ProvidersList" style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 14, background: '#F2F2F2', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 4, display: 'inline-flex'}}>
                          <div data-layer="Container" className="Container" style={{maxHeight: 192, overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                            {/* Upload */}
                            <motion.div 
                              data-layer="Attachments" 
                              className="Attachments" 
                              style={{alignSelf: 'stretch', height: 32, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'inline-flex', cursor: 'pointer'}}
                              onClick={handleFileUpload}
                              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div data-layer="Frame 34651081" className="Frame34651081" style={{justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
                                <div className="relative shrink-0 size-[24px]">
                                  <IconOptionsUpload />
                                </div>
                                <div data-layer="Title" className="Title" style={{color: '#222425', fontSize: 16, fontFamily: 'Brown Logitech Pan', fontWeight: '400', lineHeight: 20, wordWrap: 'break-word'}}>Upload</div>
                              </div>
                            </motion.div>
                            {/* Take Screenshot */}
                            <motion.div 
                              data-layer="Attachments" 
                              className="Attachments" 
                              style={{alignSelf: 'stretch', height: 32, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'inline-flex', cursor: 'pointer'}}
                              onClick={handleScreenshotCapture}
                              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div data-layer="Frame 34651081" className="Frame34651081" style={{justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
                                <IconSystemWindowsScreenshot />
                                <div data-layer="Title" className="Title" style={{color: '#222425', fontSize: 16, fontFamily: 'Brown Logitech Pan', fontWeight: '400', lineHeight: 20, wordWrap: 'break-word'}}>Take Screenshot</div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Provider Dropdown - Clean Design with Navigation */}
                <AnimatePresence>
                  {showProviderSelector && (
                    <motion.div
                      ref={providerMenuRef}
                      className="absolute"
                      style={{
                        width: '214px',
                        background: '#F2F2F2',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        display: 'inline-flex',
                        zIndex: 20,
                        bottom: '100%',
                        right: '0',
                        marginBottom: '8px',
                        pointerEvents: 'auto'
                      }}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      data-provider-menu
                      onPointerDown={(e) => {
                        // Prevent drag when interacting with the provider menu
                        e.stopPropagation();
                      }}
                    >
                    <AnimatePresence mode="wait">
                      {providerMenuView === 'main' ? (
                        <motion.div
                          key="main-view"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          style={{
                            width: '214px',
                            background: '#F2F2F2',
                            overflow: 'hidden',
                            borderRadius: '16px',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            display: 'inline-flex'
                          }}
                        >
                          {/* Providers List */}
                          <div style={{
                            alignSelf: 'stretch',
                            paddingTop: '8px',
                            paddingLeft: '12px',
                            paddingRight: '12px',
                            background: '#F2F2F2',
                            overflow: 'hidden',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-end',
                            gap: '4px',
                            display: 'inline-flex'
                          }}>
                            <div style={{
                              flex: '1 1 0',
                              maxHeight: '192px',
                              overflow: 'hidden',
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                              gap: '8px',
                              display: 'inline-flex'
                            }}>
                              {/* Dynamic Provider List */}
                              {aiProviders.map((provider) => (
                                <motion.div
                                  key={provider.id}
                                  style={{
                                    alignSelf: 'stretch',
                                    height: '32px',
                                    borderRadius: '4px',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    display: 'inline-flex',
                                    cursor: 'pointer'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleProvider(provider.id);
                                  }}
                                  onContextMenu={(e) => handleProviderRightClick(e, provider.id)}
                                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div style={{
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: '8px',
                                    display: 'flex',
                                    flex: 1
                                  }}>
                                    <div style={{
                                      width: '24px',
                                      height: '24px',
                                      position: 'relative',
                                      overflow: 'hidden',
                                      borderRadius: '100px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: '#F0F0F0'
                                    }}>
                                      {React.cloneElement(provider.icon as React.ReactElement, { size: 16 })}
                                    </div>
                                    <div style={{
                                      color: selectedProviders.includes(provider.id) ? '#814EFA' : '#222425',
                                      fontSize: '1rem',
                                      fontFamily: 'Brown Logitech Pan',
                                      fontWeight: selectedProviders.includes(provider.id) ? '700' : '400',
                                      lineHeight: '14px',
                                      wordWrap: 'break-word'
                                    }}>
                                      {provider.name}
                                    </div>
                                  </div>
                                  <div style={{
                                    width: '24px',
                                    height: '32px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexShrink: 0
                                  }}>
                                    {selectedProviders.includes(provider.id) && <CheckIcon />}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Controls Section */}
                          <div style={{
                            alignSelf: 'stretch',
                            paddingBottom: '8px',
                            paddingLeft: '12px',
                            paddingRight: '12px',
                            background: '#F2F2F2',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            display: 'flex'
                          }}>
                            {/* Divider Line */}
                            <div style={{
                              alignSelf: 'stretch',
                              paddingTop: '4px',
                              paddingBottom: '4px',
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                              gap: '10px',
                              display: 'flex'
                            }}>
                              <div style={{
                                width: '190px',
                                height: '1px',
                                background: '#D9D9D9'
                              }} />
                            </div>

                            {/* Container with Add Button and Multi-Select */}
                            <div style={{
                              alignSelf: 'stretch',
                              overflow: 'hidden',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              display: 'inline-flex'
                            }}>
                              {/* Add Button */}
                              <motion.div
                                style={{
                                  padding: '4px',
                                  borderRadius: '100px',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  gap: '8px',
                                  display: 'flex',
                                  cursor: 'pointer',
                                  backgroundColor: 'transparent'
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setProviderMenuView('add');
                                }}
                                onPointerDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div style={{
                                  width: '24px',
                                  height: '24px',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  borderRadius: '100px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <PlusIcon />
                                </div>
                              </motion.div>

                              {/* Multi Select */}
                              <div style={{
                                height: '32px',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                gap: '8px',
                                display: 'flex'
                              }}>
                                <div style={{
                                  width: '69px',
                                  color: '#595B5B',
                                  fontSize: '12px',
                                  fontFamily: 'Brown Logitech Pan',
                                  fontWeight: '400',
                                  lineHeight: '16px',
                                  wordWrap: 'break-word'
                                }}>
                                  Multi-Select
                                </div>
                                <div style={{
                                  height: '24px',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                  gap: '4px',
                                  display: 'flex'
                                }}>
                                  <motion.div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newMultiSelectMode = !isMultiSelectMode;
                                      setIsMultiSelectMode(newMultiSelectMode);
                                      
                                      // If switching to single-select mode and multiple providers are selected,
                                      // keep only the first selected provider
                                      if (!newMultiSelectMode && selectedProviders.length > 1) {
                                        setSelectedProviders([selectedProviders[0]]);
                                      }
                                    }}
                                    style={{
                                      width: '28px',
                                      height: '16px',
                                      position: 'relative',
                                      cursor: 'pointer'
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {/* Toggle Background */}
                                    <div style={{
                                      width: '28px',
                                      height: '16px',
                                      left: '0px',
                                      top: '0px',
                                      position: 'absolute',
                                      background: isMultiSelectMode ? '#814EFA' : '#D9D9D9',
                                      borderRadius: '8px',
                                      transition: 'background-color 0.2s ease'
                                    }} />
                                    {/* Toggle Handle */}
                                    <motion.div
                                      style={{
                                        width: '12px',
                                        height: '12px',
                                        position: 'absolute',
                                        background: 'white',
                                        borderRadius: '8px',
                                        top: '2px'
                                      }}
                                      animate={{
                                        left: isMultiSelectMode ? '14px' : '2px'
                                      }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                      }}
                                    />
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="add-view"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          style={{
                            alignSelf: 'stretch',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            display: 'flex'
                          }}
                        >
                          {/* Header Controls */}
                          <div style={{
                            alignSelf: 'stretch',
                            paddingTop: '12px',
                            paddingBottom: '8px',
                            paddingLeft: '12px',
                            paddingRight: '12px',
                            background: '#F2F2F2',
                            borderBottom: '1px #D9D9D9 solid',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            gap: '8px',
                            display: 'flex'
                          }}>
                            <div style={{
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              gap: '4px',
                              display: 'inline-flex'
                            }}>
                              <motion.div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setProviderMenuView('main');
                                }}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '100px',
                                  backgroundColor: 'transparent'
                                }}
                                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <BackIcon />
                              </motion.div>
                              <div style={{
                                color: '#222425',
                                fontSize: '14px',
                                fontFamily: 'Brown Logitech Pan',
                                fontWeight: '700',
                                lineHeight: '18px',
                                wordWrap: 'break-word'
                              }}>
                                Add
                              </div>
                            </div>
                          </div>

                          {/* Web Controls Section */}
                          <div style={{
                            alignSelf: 'stretch',
                            height: '116px',
                            paddingTop: '12px',
                            paddingLeft: '12px',
                            paddingRight: '12px',
                            background: '#F2F2F2',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            display: 'flex'
                          }}>
                            <div style={{
                              color: '#595B5B',
                              fontSize: '14px',
                              fontFamily: 'Brown Logitech Pan',
                              fontWeight: '700',
                              lineHeight: '16px',
                              wordWrap: 'break-word'
                            }}>
                              Web
                            </div>
                            <div style={{
                              alignSelf: 'stretch',
                              height: '24px',
                              paddingLeft: '8px',
                              paddingRight: '4px',
                              background: 'white',
                              borderRadius: '4px',
                              outline: '1px #F0F0F0 solid',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              gap: '10px',
                              display: 'inline-flex',
                              position: 'relative'
                            }}>
                              <input
                                type="text"
                                placeholder=""
                                value={newProviderUrl}
                                onChange={(e) => setNewProviderUrl(e.target.value)}
                                onKeyDown={(e) => {
                                  // Handle Ctrl/Cmd + A for select all
                                  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const target = e.target as HTMLInputElement;
                                    target.select();
                                    return;
                                  }
                                  
                                  // Handle Enter to add provider
                                  if (e.key === 'Enter' && newProviderUrl.trim()) {
                                    e.preventDefault();
                                    addCustomProvider();
                                  }
                                }}
                                className="flex-1 bg-transparent border-none outline-none"
                                style={{
                                  color: '#222425',
                                  fontSize: '14px',
                                  fontFamily: 'Brown Logitech Pan',
                                  fontWeight: '400',
                                  padding: '0'
                                }}
                              />
                              {!newProviderUrl && (
                                <div style={{
                                  opacity: 0.40,
                                  color: '#222425',
                                  fontSize: '14px',
                                  fontFamily: 'Brown Logitech Pan',
                                  fontWeight: '400',
                                  wordWrap: 'break-word',
                                  position: 'absolute',
                                  left: '8px',
                                  pointerEvents: 'none'
                                }}>
                                  https://
                                </div>
                              )}
                            </div>
                            <motion.button
                              onClick={addCustomProvider}
                              disabled={!newProviderUrl.trim()}
                              style={{
                                alignSelf: 'stretch',
                                height: '24px',
                                paddingLeft: '12px',
                                paddingRight: '12px',
                                paddingTop: '8px',
                                paddingBottom: '8px',
                                background: !newProviderUrl.trim() ? '#CCCCCC' : 'var(--primary)',
                                borderRadius: '4px',
                                outline: '1px #F0F0F0 solid',
                                outlineOffset: '-1px',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                                display: 'flex',
                                cursor: !newProviderUrl.trim() ? 'not-allowed' : 'pointer',
                                border: 'none'
                              }}
                              whileHover={{ scale: !newProviderUrl.trim() ? 1 : 1.02 }}
                              whileTap={{ scale: !newProviderUrl.trim() ? 1 : 0.98 }}
                            >
                              <div style={{
                                opacity: !newProviderUrl.trim() ? 0.20 : 1,
                                textAlign: 'center',
                                color: !newProviderUrl.trim() ? '#222425' : 'white',
                                fontSize: '14px',
                                fontFamily: 'Brown Logitech Pan',
                                fontWeight: '700',
                                lineHeight: '16px',
                                wordWrap: 'break-word'
                              }}>
                                Add
                              </div>
                            </motion.button>
                            <div style={{
                              alignSelf: 'stretch',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              gap: '8px',
                              display: 'inline-flex'
                            }}>
                              <div style={{
                                flex: '1 1 0',
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                gap: '10px',
                                display: 'inline-flex'
                              }}>
                                <div style={{
                                  alignSelf: 'stretch',
                                  height: '1px',
                                  background: '#D9D9D9'
                                }} />
                              </div>
                              <div style={{
                                color: '#595B5B',
                                fontSize: '12px',
                                fontFamily: 'Brown Logitech Pan',
                                fontWeight: '400',
                                lineHeight: '16px',
                                wordWrap: 'break-word'
                              }}>
                                or
                              </div>
                              <div style={{
                                flex: '1 1 0',
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                gap: '10px',
                                display: 'inline-flex'
                              }}>
                                <div style={{
                                  alignSelf: 'stretch',
                                  height: '1px',
                                  background: '#D9D9D9'
                                }} />
                              </div>
                            </div>
                          </div>

                          {/* Providers List Section */}
                          <div style={{
                            alignSelf: 'stretch',
                            paddingTop: '8px',
                            paddingBottom: '12px',
                            paddingLeft: '12px',
                            paddingRight: '12px',
                            background: '#F2F2F2',
                            overflow: 'hidden',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-start',
                            gap: '4px',
                            display: 'flex'
                          }}>
                            <div style={{
                              color: '#595B5B',
                              fontSize: '14px',
                              fontFamily: 'Brown Logitech Pan',
                              fontWeight: '700',
                              lineHeight: '16px',
                              wordWrap: 'break-word'
                            }}>
                              Supported Apps
                            </div>
                            <div style={{
                              alignSelf: 'stretch',
                              maxHeight: '192px',
                              overflow: 'hidden',
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                              alignItems: 'flex-start',
                              gap: '8px',
                              display: 'flex'
                            }}>
                              {/* ChatGPT App */}
                              <div style={{
                                alignSelf: 'stretch',
                                height: '32px',
                                borderRadius: '4px',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                display: 'inline-flex',
                                padding: '0 4px'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  <img 
                                    src="https://www.google.com/s2/favicons?domain=chat.openai.com&sz=64" 
                                    alt="ChatGPT"
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '4px',
                                      objectFit: 'cover'
                                    }}
                                  />
                                  <div style={{
                                    color: '#222425',
                                    fontSize: '16px',
                                    fontFamily: 'Brown Logitech Pan',
                                    fontWeight: '400',
                                    lineHeight: '20px',
                                    wordWrap: 'break-word'
                                  }}>
                                    ChatGPT
                                  </div>
                                </div>
                                <a
                                  href="https://openai.com/chatgpt/download/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: '#814EFA',
                                    fontSize: '12px',
                                    fontFamily: 'Brown Logitech Pan',
                                    fontWeight: '400',
                                    lineHeight: '16px',
                                    textDecoration: 'none',
                                    cursor: 'pointer'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.textDecoration = 'underline';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.textDecoration = 'none';
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Install
                                </a>
                              </div>

                              {/* Perplexity App */}
                              <div style={{
                                alignSelf: 'stretch',
                                height: '32px',
                                borderRadius: '4px',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                display: 'inline-flex',
                                padding: '0 4px'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  <img 
                                    src="https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64" 
                                    alt="Perplexity"
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '4px',
                                      objectFit: 'cover'
                                    }}
                                  />
                                  <div style={{
                                    color: '#222425',
                                    fontSize: '16px',
                                    fontFamily: 'Brown Logitech Pan',
                                    fontWeight: '400',
                                    lineHeight: '20px',
                                    wordWrap: 'break-word'
                                  }}>
                                    Perplexity
                                  </div>
                                </div>
                                <a
                                  href="https://www.perplexity.ai/hub/getting-started/download-perplexity"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: '#814EFA',
                                    fontSize: '12px',
                                    fontFamily: 'Brown Logitech Pan',
                                    fontWeight: '400',
                                    lineHeight: '16px',
                                    textDecoration: 'none',
                                    cursor: 'pointer'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.textDecoration = 'underline';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.textDecoration = 'none';
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Install
                                </a>
                              </div>

                              {/* Claude App */}
                              <div style={{
                                alignSelf: 'stretch',
                                height: '32px',
                                borderRadius: '4px',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                display: 'inline-flex',
                                padding: '0 4px'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  <div style={{
                                    width: '24px',
                                    height: '24px'
                                  }}>
                                    <IconClaudeLogoMark />
                                  </div>
                                  <div style={{
                                    color: '#222425',
                                    fontSize: '16px',
                                    fontFamily: 'Brown Logitech Pan',
                                    fontWeight: '400',
                                    lineHeight: '20px',
                                    wordWrap: 'break-word'
                                  }}>
                                    Claude
                                  </div>
                                </div>
                                <a
                                  href="https://claude.ai/download"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: '#814EFA',
                                    fontSize: '12px',
                                    fontFamily: 'Brown Logitech Pan',
                                    fontWeight: '400',
                                    lineHeight: '16px',
                                    textDecoration: 'none',
                                    cursor: 'pointer'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.textDecoration = 'underline';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.textDecoration = 'none';
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Install
                                </a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Radial Menu - Removed: Both versions now open AI prompt directly */}

      {/* Context Menu for Provider Removal */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            className="fixed z-[100]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            data-context-menu
          >
            <div data-layer="Remove" className="Remove" style={{background: '#F2F2F2', overflow: 'hidden', borderRadius: 16, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
              <div data-layer="Providers List" className="ProvidersList" style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 14, background: '#F2F2F2', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 4, display: 'inline-flex'}}>
                <div data-layer="Container" className="Container" style={{maxHeight: 192, overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                  <motion.div 
                    data-layer="Attachments" 
                    className="Attachments" 
                    style={{alignSelf: 'stretch', height: 32, paddingLeft: 8, paddingRight: 8, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex', cursor: 'pointer'}}
                    onClick={() => removeProvider(contextMenu.providerId)}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div data-layer="Title" className="Title" style={{color: '#222425', fontSize: 16, fontFamily: 'Brown Logitech Pan', fontWeight: '400', lineHeight: 20, wordWrap: 'break-word'}}>Remove</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Temporary Chat Overlays (Version 2 only) */}
      <AnimatePresence>
        {showTemporaryChats.length > 0 && version === 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{gap: 16}}>
            {showTemporaryChats.map((chat, index) => {
              // Calculate width based on number of chats
              const numChats = showTemporaryChats.length;
              const gap = 16; // 16px gap between chats
              const totalGaps = (numChats - 1) * gap;
              const availableWidth = window.innerWidth - 32; // 32px total padding (16px on each side)
              const chatWidth = Math.min(632, (availableWidth - totalGaps) / numChats);
              
              return (
                <div 
                  key={chat.providerId}
                  className="relative"
                  data-radial-menu
                  style={{
                    width: chatWidth,
                    maxWidth: '100%'
                  }}
                >
                  <motion.div
                    data-layer="Temporary Chat"
                    className="TemporaryChat"
                    style={{
                      width: '100%',
                      padding: 8,
                      background: 'rgba(242.25, 242.25, 242.25, 0.88)',
                      borderRadius: 24,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      gap: 4,
                      display: 'flex',
                      boxShadow: 'var(--elevation-md)'
                    }}
                    initial={{ 
                      scale: 0.8,
                      opacity: 0,
                      y: 20
                    }}
                    animate={{ 
                      scale: 1,
                      opacity: 1,
                      y: 0
                    }}
                    exit={{ 
                      scale: 0.8,
                      opacity: 0,
                      y: 20
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: index * 0.1
                    }}
                  >
                {/* Controls */}
                <div data-layer="Controls" className="Controls" style={{alignSelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex', gap: 8}}>
                  {/* Left: Back, Forward, Refresh */}
                  <div data-layer="Back, Forward, Refresh" className="BackForwardRefresh" style={{justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'flex', flexShrink: 0}}>
                    <motion.div 
                      style={{width: 32, height: 32, position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '100px'}}
                      animate={{ rotate: 180 }}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      whileTap={{ scale: 0.95, rotate: 180 }}
                    >
                      <div style={{width: 32, height: 32}}>
                        <IconOptionsArrowSmallNext />
                      </div>
                    </motion.div>
                    <motion.div 
                      style={{width: 32, height: 32, position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '100px'}}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div style={{width: 32, height: 32}}>
                        <IconOptionsArrowSmallNext />
                      </div>
                    </motion.div>
                    <motion.div 
                      style={{width: 32, height: 32, justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer', borderRadius: '100px'}}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Refresh - in a real implementation this would reload the iframe
                        console.log('Refresh clicked');
                      }}
                    >
                      <div style={{width: 24, height: 24}}>
                        <IconSystemRedo />
                      </div>
                    </motion.div>
                  </div>

                  {/* Center: URL Address Bar */}
                  <div style={{flex: 1, paddingLeft: 8, paddingRight: 8, paddingTop: 6, paddingBottom: 6, background: 'rgba(255, 255, 255, 0.8)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{flexShrink: 0}}>
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#222425" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12h20" stroke="#222425" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#222425" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div style={{
                      flex: 1,
                      color: '#222425',
                      fontSize: '14px',
                      fontFamily: 'Brown Logitech Pan',
                      fontWeight: '400',
                      lineHeight: '16px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {chat.url || 'https://'}
                    </div>
                  </div>

                  {/* Right: Export and Close */}
                  <div style={{height: 32, justifyContent: 'flex-start', alignItems: 'center', display: 'flex', gap: 4, flexShrink: 0}}>
                    <motion.div 
                      onClick={() => {
                        // Open in external browser
                        if (chat.url) {
                          window.open(chat.url, '_blank');
                        }
                      }}
                      onContextMenu={(e) => {
                        // Only show menu if there are multiple overlays
                        if (showTemporaryChats.length > 1) {
                          e.preventDefault();
                          e.stopPropagation();
                          setOverlayActionsMenu({
                            visible: true,
                            x: e.clientX,
                            y: e.clientY,
                            type: 'open'
                          });
                        }
                      }}
                      style={{width: 32, height: 32, position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '100px'}}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 8.667v4a1.333 1.333 0 0 1-1.333 1.333H3.333A1.333 1.333 0 0 1 2 12.667V5.333A1.333 1.333 0 0 1 3.333 4h4M10 2h4v4M6.667 9.333L14 2" stroke="#222425" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                    <motion.div 
                      onClick={() => closeTemporaryChat(chat.providerId)}
                      onContextMenu={(e) => {
                        // Only show menu if there are multiple overlays
                        if (showTemporaryChats.length > 1) {
                          e.preventDefault();
                          e.stopPropagation();
                          setOverlayActionsMenu({
                            visible: true,
                            x: e.clientX,
                            y: e.clientY,
                            type: 'close'
                          });
                        }
                      }}
                      style={{width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '100px'}}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4l8 8" stroke="#222425" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </div>
                </div>
                
                {/* AI Provider iframe - Actual Provider Website */}
                <div data-layer="AI Web UI" className="AiWebUi" style={{alignSelf: 'stretch', height: 518.60, position: 'relative', overflow: 'hidden', borderRadius: 16, backgroundColor: '#FFFFFF'}}>
                  <iframe
                    src={chat.url}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '16px'
                    }}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    title={`${chat.providerName} Interface`}
                  />
                  {/* Overlay message if iframe is blocked */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    padding: '24px',
                    pointerEvents: 'none',
                    opacity: 0
                  }}
                    className="iframe-fallback"
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '100px',
                      backgroundColor: '#F2F2F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {chat.providerId === 'chatgpt' ? <ChatGPTIcon /> : chat.providerId === 'perplexity' ? <PerplexityIcon /> : <GrokIcon />}
                    </div>
                    <div style={{
                      color: '#222',
                      fontSize: '16px',
                      fontFamily: 'Brown Logitech Pan',
                      fontWeight: '700',
                      textAlign: 'center'
                    }}>
                      Unable to embed {chat.providerName}
                    </div>
                    <div style={{
                      color: '#666',
                      fontSize: '14px',
                      fontFamily: 'Brown Logitech Pan',
                      textAlign: 'center',
                      maxWidth: '300px'
                    }}>
                      {chat.providerName} doesn't allow embedding. Your prompt has been copied to clipboard.
                    </div>
                    <motion.button
                      onClick={() => {
                        copyToClipboard(chat.promptText);
                        window.open(chat.url, '_blank');
                      }}
                      style={{
                        pointerEvents: 'auto',
                        padding: '12px 24px',
                        background: '#814EFA',
                        borderRadius: '12px',
                        border: 'none',
                        color: 'white',
                        fontSize: '14px',
                        fontFamily: 'Brown Logitech Pan',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={16} />
                      <span>Open {chat.providerName} in New Tab</span>
                    </motion.button>
                  </div>
                </div>
                <style>{`
                  .AiWebUi iframe:not([src]) ~ .iframe-fallback,
                  .AiWebUi iframe[src="about:blank"] ~ .iframe-fallback {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                  }
                `}</style>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Context Menu for Saved Prompt Actions */}
      <AnimatePresence>
        {savedPromptContextMenu && (
          <motion.div
            className="fixed z-[100]"
            style={{
              left: savedPromptContextMenu.x,
              top: savedPromptContextMenu.y,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            data-saved-prompt-context-menu
          >
            <div data-layer="Context Menu" className="ContextMenu" style={{background: '#F2F2F2', overflow: 'hidden', borderRadius: 16, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
              <div data-layer="Menu Items" className="MenuItems" style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 14, background: '#F2F2F2', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 4, display: 'inline-flex'}}>
                <div data-layer="Container" className="Container" style={{maxHeight: 192, overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                  {/* Rename Option */}
                  <motion.div 
                    data-layer="Rename" 
                    className="Rename" 
                    style={{alignSelf: 'stretch', height: 32, paddingLeft: 8, paddingRight: 8, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex', cursor: 'pointer'}}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      startRenaming(savedPromptContextMenu.promptId);
                    }}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div data-layer="Title" className="Title" style={{color: '#222425', fontSize: 16, fontFamily: 'Brown Logitech Pan', fontWeight: '400', lineHeight: 20, wordWrap: 'break-word'}}>Rename</div>
                  </motion.div>
                  {/* Remove Option */}
                  <motion.div 
                    data-layer="Remove" 
                    className="Remove" 
                    style={{alignSelf: 'stretch', height: 32, paddingLeft: 8, paddingRight: 8, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex', cursor: 'pointer'}}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeSavedPrompt(savedPromptContextMenu.promptId);
                    }}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div data-layer="Title" className="Title" style={{color: '#222425', fontSize: 16, fontFamily: 'Brown Logitech Pan', fontWeight: '400', lineHeight: 20, wordWrap: 'break-word'}}>Remove</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Menu for Overlay Actions (Close All / Open All in Browser) */}
      <AnimatePresence>
        {overlayActionsMenu && (
          <motion.div
            className="fixed z-[100]"
            style={{
              left: overlayActionsMenu.x,
              top: overlayActionsMenu.y,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            data-overlay-actions-menu
          >
            <div data-layer="Context Menu" className="ContextMenu" style={{background: '#F2F2F2', overflow: 'hidden', borderRadius: 16, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
              <div data-layer="Menu Items" className="MenuItems" style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 14, background: '#F2F2F2', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 4, display: 'inline-flex'}}>
                <div data-layer="Container" className="Container" style={{maxHeight: 192, overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                  {/* Close All Option - Only show when right-clicking close button */}
                  {overlayActionsMenu.type === 'close' && (
                    <motion.div 
                      data-layer="Close All" 
                      className="CloseAll" 
                      style={{alignSelf: 'stretch', height: 32, paddingLeft: 8, paddingRight: 8, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex', cursor: 'pointer'}}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        closeAllTemporaryChats();
                        setOverlayActionsMenu(null);
                      }}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div data-layer="Title" className="Title" style={{color: '#222425', fontSize: 16, fontFamily: 'Brown Logitech Pan', fontWeight: '400', lineHeight: 20, wordWrap: 'break-word'}}>Close all</div>
                    </motion.div>
                  )}
                  {/* Open All in Browser Option - Only show when right-clicking open button */}
                  {overlayActionsMenu.type === 'open' && (
                    <motion.div 
                      data-layer="Open All in Browser" 
                      className="OpenAllInBrowser" 
                      style={{alignSelf: 'stretch', height: 32, paddingLeft: 8, paddingRight: 8, borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex', cursor: 'pointer'}}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showTemporaryChats.forEach(chat => {
                          window.open(chat.url, '_blank');
                        });
                        setOverlayActionsMenu(null);
                      }}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div data-layer="Title" className="Title" style={{color: '#222425', fontSize: 16, fontFamily: 'Brown Logitech Pan', fontWeight: '400', lineHeight: 20, wordWrap: 'break-word'}}>Open all in browser</div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RadialActionsMenu;