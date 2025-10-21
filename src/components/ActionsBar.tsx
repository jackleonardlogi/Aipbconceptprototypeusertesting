import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Search,
  Sparkles,
  Calculator,
  Calendar,
  Mail,
  Music,
  Terminal,
  Send,
  User,
  Bot,
  ArrowLeft,
  Clock,
  Globe2,
  Brain,
  MessageSquare,
  Copy,
  Check,
  Loader2,
  X,
  Zap,
  Plus
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

interface AiProvider {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

// Official AI Provider Logos
const ChatGPTIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0734a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#10A37F"/>
  </svg>
);

const ClaudeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 18h4.5L19 6.5l1.8-1.8c.8-.8.8-2 0-2.8-.8-.8-2-.8-2.8 0L16.5 3.5 5 15v3zm13.5-13.5L18 6l-1.5 1.5L15 6l1.5-1.5z" fill="#CD5C08"/>
    <circle cx="12" cy="12" r="8" fill="none" stroke="#CD5C08" strokeWidth="1.5"/>
    <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#CD5C08" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const aiProviders: AiProvider[] = [
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chat.openai.com', icon: <ChatGPTIcon />, color: '#10A37F' },
  { id: 'claude', name: 'Claude', url: 'https://claude.ai', icon: <ClaudeIcon />, color: '#CD5C08' }
];

const ActionsBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState<'search' | 'chat'>('search');
  const [currentProvider, setCurrentProvider] = useState<AiProvider | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate results based on search
  const getResults = (): ActionItem[] => {
    const query = searchValue.toLowerCase().trim();
    const results: ActionItem[] = [];

    // Calculator
    const mathPattern = /^[\d\+\-\*\/\(\)\.\s]+$/;
    if (mathPattern.test(query) && query.length > 1) {
      try {
        const result = eval(query);
        if (!isNaN(result) && isFinite(result)) {
          results.push({
            id: 'calc',
            title: result.toString(),
            subtitle: `${query} =`,
            icon: <Calculator size={16} />,
            badge: 'Math',
            action: () => copyToClipboard(result.toString())
          });
        }
      } catch {}
    }

    // Time
    if (query.includes('time') || query === 'now') {
      const time = new Date().toLocaleTimeString();
      results.push({
        id: 'time',
        title: time,
        subtitle: 'Current time',
        icon: <Clock size={16} />,
        action: () => copyToClipboard(time)
      });
    }

    // Date
    if (query.includes('date') || query === 'today') {
      const date = new Date().toLocaleDateString();
      results.push({
        id: 'date',
        title: date,
        subtitle: 'Today\'s date',
        icon: <Calendar size={16} />,
        action: () => copyToClipboard(date)
      });
    }

    // Apps
    const apps = [
      { name: 'calendar', title: 'Calendar', url: 'https://calendar.google.com', icon: <Calendar size={16} /> },
      { name: 'mail', title: 'Mail', url: 'https://mail.google.com', icon: <Mail size={16} /> },
      { name: 'music', title: 'Music', url: 'https://open.spotify.com', icon: <Music size={16} /> }
    ];

    apps.forEach(app => {
      if (!query || app.name.includes(query) || app.title.toLowerCase().includes(query)) {
        results.push({
          id: app.name,
          title: app.title,
          subtitle: 'Open application',
          icon: app.icon,
          action: () => {
            window.open(app.url, '_blank');
            closeActionsBar();
          }
        });
      }
    });

    // AI Chat - always show for questions or when search is empty
    const isQuestion = /^(what|how|why|when|where|who|can|could|please|explain|tell me|help|ask|chat)/.test(query) || query.includes('?');
    
    if (isQuestion || !query || results.length === 0) {
      aiProviders.forEach(provider => {
        results.push({
          id: `ai-${provider.id}`,
          title: `Chat with ${provider.name}`,
          subtitle: query ? `Ask: "${query.substring(0, 40)}${query.length > 40 ? '...' : ''}"` : 'Start AI conversation',
          icon: provider.icon,
          badge: 'AI',
          action: () => startChat(provider, query)
        });
      });
    }

    // Fallback: web search
    if (query && results.filter(r => !r.badge?.includes('AI')).length === 0) {
      results.unshift({
        id: 'search',
        title: `Search "${query}"`,
        subtitle: 'Google Search',
        icon: <Search size={16} />,
        action: () => {
          window.open(`https://google.com/search?q=${encodeURIComponent(query)}`, '_blank');
          closeActionsBar();
        }
      });
    }

    return results;
  };

  const startChat = (provider: AiProvider, initialQuery?: string) => {
    setCurrentProvider(provider);
    setViewMode('chat');
    setMessages([]);
    
    if (initialQuery && initialQuery.trim()) {
      setTimeout(() => sendMessage(initialQuery), 300);
    } else {
      setTimeout(() => chatInputRef.current?.focus(), 300);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentProvider || !content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `I understand you're asking about "${content}". This is a demo conversation - in the real app, ${currentProvider.name} would provide detailed responses.`,
        `That's an interesting question! ${currentProvider.name} would analyze "${content}" and give you comprehensive insights.`,
        `Great question about "${content}". ${currentProvider.name} is designed to help with exactly these kinds of queries.`
      ];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200);

    // Open external provider
    const url = `${currentProvider.url}?q=${encodeURIComponent(content)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId('copied');
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const closeActionsBar = () => {
    setIsOpen(false);
    setViewMode('search');
    setCurrentProvider(null);
    setMessages([]);
    setSearchValue('');
    setIsLoading(false);
    setCopiedId(null);
  };

  const backToSearch = () => {
    setViewMode('search');
    setCurrentProvider(null);
    setMessages([]);
    setSearchValue('');
    setIsLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const openActionsBar = () => {
    setIsOpen(true);
    setViewMode('search');
    setSearchValue('');
    setCurrentProvider(null);
    setMessages([]);
    setIsLoading(false);
    setCopiedId(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTyping = e.target instanceof HTMLInputElement || 
                       e.target instanceof HTMLTextAreaElement ||
                       (e.target instanceof HTMLElement && e.target.contentEditable === 'true');

      if (e.key === ' ' && !isTyping) {
        e.preventDefault();
        openActionsBar();
      }
      
      if (e.key === 'Escape') {
        if (viewMode === 'chat') {
          backToSearch();
        } else {
          closeActionsBar();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const results = getResults();

  return (
    <>
      <CommandDialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            closeActionsBar();
          }
        }}
      >
        <div 
          className="backdrop-blur-xl border"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.5)', 
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          {viewMode === 'search' ? (
            <Command>
              <CommandInput
                ref={inputRef}
                placeholder="Search, calculate, ask AI..."
                value={searchValue}
                onValueChange={setSearchValue}
                style={{ color: 'var(--foreground)' }}
              />
              <CommandList>
                <CommandEmpty>
                  <div className="py-6 text-center">
                    <Search size={24} className="mx-auto mb-2 opacity-40" />
                    <p style={{ color: 'var(--muted-foreground)' }}>No results found</p>
                  </div>
                </CommandEmpty>

                {results.length > 0 && (
                  <CommandGroup>
                    {results.map((result) => (
                      <CommandItem
                        key={result.id}
                        onSelect={() => result.action()}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <div 
                          className="flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                            color: 'var(--foreground)'
                          }}
                        >
                          {result.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span style={{ color: 'var(--foreground)' }}>{result.title}</span>
                            {result.badge && (
                              <Badge 
                                className="text-xs backdrop-blur-md border"
                                style={{
                                  backgroundColor: 'rgba(129, 78, 250, 0.5)',
                                  borderColor: 'rgba(129, 78, 250, 0.3)',
                                  color: 'white'
                                }}
                              >
                                {result.badge}
                              </Badge>
                            )}
                            {copiedId && (
                              <Badge className="text-xs">
                                <Check size={10} className="mr-1" />
                                Copied
                              </Badge>
                            )}
                          </div>
                          <div className="caption" style={{ color: 'var(--muted-foreground)' }}>
                            {result.subtitle}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          ) : (
            <div className="flex flex-col h-[500px]">
              {/* Chat Header with glassmorphism */}
              <div 
                className="flex items-center gap-3 px-4 py-4 border-b backdrop-blur-xl"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  background: 'linear-gradient(135deg, rgba(129, 78, 250, 0.5) 0%, rgba(129, 78, 250, 0.3) 100%)',
                  color: 'white'
                }}
              >
                <motion.button
                  onClick={backToSearch}
                  className="p-2 rounded-full backdrop-blur-md border transition-all"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={16} />
                </motion.button>

                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md border"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {currentProvider?.icon && React.cloneElement(currentProvider.icon as React.ReactElement, { size: 20 })}
                </div>

                <div className="flex-1">
                  <h3 style={{ color: 'white' }}>{currentProvider?.name}</h3>
                  <p className="caption" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    AI Assistant Chat
                  </p>
                </div>

                <motion.button
                  onClick={closeActionsBar}
                  className="p-2 rounded-full backdrop-blur-md border transition-all"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 py-4">
                  {messages.length === 0 && !isLoading && (
                    <div className="text-center py-8">
                      <div 
                        className="w-16 h-16 mx-auto mb-4 rounded-full backdrop-blur-xl border flex items-center justify-center"
                        style={{ 
                          background: `linear-gradient(135deg, ${currentProvider?.color || 'var(--primary)'} 0%, rgba(129, 78, 250, 0.8) 100%)`,
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {currentProvider?.icon && React.cloneElement(currentProvider.icon as React.ReactElement, { size: 24 })}
                      </div>
                      <h4 style={{ color: 'var(--foreground)' }}>
                        Chat with {currentProvider?.name}
                      </h4>
                      <p className="caption mt-2" style={{ color: 'var(--muted-foreground)' }}>
                        Ask questions and get AI responses
                      </p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`flex items-start gap-3 max-w-[75%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-md border"
                          style={{ 
                            backgroundColor: message.type === 'user' 
                              ? 'rgba(129, 78, 250, 0.5)' 
                              : 'rgba(255, 255, 255, 0.5)',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: message.type === 'user' ? 'white' : 'var(--foreground)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {message.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div
                          className="px-4 py-3 rounded-lg backdrop-blur-md border"
                          style={{
                            backgroundColor: message.type === 'user' 
                              ? 'rgba(129, 78, 250, 0.5)' 
                              : 'rgba(255, 255, 255, 0.5)',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: message.type === 'user' ? 'white' : 'var(--foreground)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div 
                            className="caption mt-2 opacity-70"
                            style={{ 
                              color: message.type === 'user' ? 'rgba(255, 255, 255, 0.8)' : 'var(--muted-foreground)'
                            }}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: 'var(--foreground)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <Bot size={14} />
                        </div>
                        <div
                          className="px-4 py-3 rounded-lg flex items-center gap-2 backdrop-blur-md border"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: 'var(--foreground)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <Loader2 size={14} className="animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div 
                className="px-4 py-4 border-t backdrop-blur-xl"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                }}
              >
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const message = formData.get('message') as string;
                    if (message?.trim()) {
                      sendMessage(message.trim());
                      (e.target as HTMLFormElement).reset();
                    }
                  }}
                  className="flex gap-3"
                >
                  <input
                    ref={chatInputRef}
                    name="message"
                    placeholder="Ask anything..."
                    className="flex-1 px-4 py-3 rounded-lg backdrop-blur-md border outline-none transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'var(--foreground)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(129, 78, 250, 0.5)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(129, 78, 250, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    }}
                    onKeyDown={(e) => {
                      // Handle Ctrl/Cmd + A for select all
                      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                        e.preventDefault();
                        e.stopPropagation();
                        // Explicitly select all text in the input
                        const target = e.target as HTMLInputElement;
                        target.select();
                        return;
                      }
                      
                      // Allow other copy/paste and standard shortcuts
                      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'z', 'y'].includes(e.key.toLowerCase())) {
                        // Let browser handle copy, paste, cut, undo, redo
                        return;
                      }
                    }}
                    onContextMenu={(e) => {
                      // Allow right-click context menu for copy/paste
                      e.stopPropagation();
                    }}
                    disabled={isLoading}
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-3 rounded-lg backdrop-blur-md border flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(129, 78, 250, 0.5) 0%, rgba(129, 78, 250, 0.3) 100%)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      minWidth: '3rem',
                      boxShadow: '0 4px 16px rgba(129, 78, 250, 0.3)'
                    }}
                    whileHover={{ 
                      scale: isLoading ? 1 : 1.05,
                      boxShadow: '0 6px 20px rgba(129, 78, 250, 0.4)'
                    }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          )}
        </div>
      </CommandDialog>

      {/* Hint */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 px-4 py-3 rounded-xl pointer-events-none z-40 backdrop-blur-xl border"
            style={{
              background: 'linear-gradient(135deg, rgba(129, 78, 250, 0.5) 0%, rgba(129, 78, 250, 0.3) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(129, 78, 250, 0.3)'
            }}
          >
            <div className="flex items-center gap-2">
              <kbd 
                className="px-2 py-1 rounded text-xs backdrop-blur-md border"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.25)', 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                Space
              </kbd>
              <span className="text-sm" style={{ color: 'white' }}>Actions</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActionsBar;