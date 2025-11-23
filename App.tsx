
import React, { useCallback, useEffect, useRef, useState } from 'react';
// FIX: Import Variants and AnimatePresence types from framer-motion to fix typing issues and enable animations.
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { AgentConsole } from './components/AgentConsole';
import { AgentFoundry } from './components/AgentFoundry';
import GroundedSearch from './components/GroundedSearch';
import ImageStudio from './components/ImageStudio';
import LiveConversation from './components/LiveConversation';
import LunaConsole from './components/LunaConsole';
import SpeechStudio from './components/SpeechStudio';
import VideoStudio from './components/VideoStudio';
// FIX: Removed AgentConsole and AgentFoundry from imports as they are not exported from Icons.tsx and are unused.
import CommandCore from './components/CommandCore';

import { ArrowUpCircleIcon, Bars3Icon, BeakerIcon, BellIcon, BellSlashIcon, CpuChipIcon, InformationCircleIcon, LinkIcon, MagnifyingGlassIcon, MicrophoneIcon, PhotoIcon, QuestionMarkCircleIcon, ShieldExclamationIcon, SpeakerWaveIcon, SpeakerXMarkIcon, TerminalIcon, VideoCameraIcon } from './components/Icons';
import ReadMe from './components/ReadMe';
import RedTeamOps from './components/RedTeamOps';
import SystemStatus from './components/SystemStatus';
import UpdateGuide from './components/UpdateGuide';
import WelcomeTour from './components/WelcomeTour';
import { useGlobalSoundEffects } from './hooks/useGlobalSoundEffects';
import { audioManager } from './services/audioManager';

type Tab = 'ReadMe' | 'Chat' | 'Command' | 'AgentConsole' | 'AgentFoundry' | 'Search' | 'Image' | 'Video' | 'Live' | 'Speech' | 'Update' | 'RedTeam';

const sidebarVariants: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 20,
      staggerChildren: 0.08,
      when: "beforeChildren",
    },
  },
};

const itemVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const mainVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};


// FIX: Removed React.FC type to resolve framer-motion typing issues.
const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ReadMe');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(true);
  const [isSfxMuted, setIsSfxMuted] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Activate the global sound effect listener
  useGlobalSoundEffects();

  useEffect(() => {
    // Load preferences
    setIsMusicMuted(localStorage.getItem('luna_music_muted') !== 'false');
    const savedSfxMuted = localStorage.getItem('luna_sfx_muted') !== 'false';
    setIsSfxMuted(savedSfxMuted);
    audioManager.setMuted(savedSfxMuted);


    // Preload sounds
    audioManager.loadSounds();

    // Check if tour has been completed
    const hasCompletedTour = localStorage.getItem('luna_ai_tour_completed');
    if (hasCompletedTour !== 'true') {
      setTimeout(() => setIsTourOpen(true), 500);
    }
  }, []);

  const handleFinishTour = () => {
    localStorage.setItem('luna_ai_tour_completed', 'true');
    setIsTourOpen(false);
  };

  // Effect to control audio playback
  useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.volume = 0.1;
      if (!isMusicMuted) {
        audioEl.play().catch(error => console.warn("Audio autoplay was prevented. User interaction might be needed.", error));
      } else {
        audioEl.pause();
      }
    }
  }, [isMusicMuted]);
  
  // Update audio manager and save preferences
  useEffect(() => {
    localStorage.setItem('luna_music_muted', String(isMusicMuted));
  }, [isMusicMuted]);

  useEffect(() => {
    audioManager.setMuted(isSfxMuted);
    localStorage.setItem('luna_sfx_muted', String(isSfxMuted));
  }, [isSfxMuted]);
  
  const toggleMusicMute = () => {
    setIsMusicMuted(prev => !prev);
  };

  const toggleSfxMute = () => {
    const nextState = !isSfxMuted;
    setIsSfxMuted(nextState);
    if (!nextState) {
        audioManager.playSound('buttonClick');
    }
  };

  const handleTabChange = (tab: Tab) => {
    audioManager.playSound('buttonClick');
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'ReadMe':
        return <ReadMe />;
      case 'Chat':
        return <LunaConsole />;
      case 'Command':
        return <CommandCore />;
      case 'AgentConsole':
        return <AgentConsole />;
      case 'AgentFoundry':
        return <AgentFoundry onAgentsUpdated={() => { /* Force re-render if needed */ }} />;
      case 'Search':
        return <GroundedSearch />;
      case 'Image':
        return <ImageStudio />;

      case 'Video':
        return <VideoStudio />;
      case 'Live':
        return <LiveConversation />;
      case 'Speech':
        return <SpeechStudio />;
      case 'Update':
        return <UpdateGuide />;
      case 'RedTeam':
        return <RedTeamOps />;
      default:
        return <ReadMe />;
    }
  }, [activeTab]);

  const NavItem = ({ tab, label, icon }: { tab: Tab, label: string, icon: React.ReactElement<{ className?: string }> }) => {
    const isActive = activeTab === tab;
    
    let activeClasses = '';
    let iconColor = '';
    
    if (isActive) {
      if (tab === 'ReadMe') {
        activeClasses = 'bg-blue-950/50 border-l-4 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
        iconColor = 'text-blue-400';
      } else if (tab === 'Chat') {
        activeClasses = 'bg-emerald-950/50 border-l-4 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
        iconColor = 'text-emerald-400';
      } else if (tab === 'Command') {
        activeClasses = 'bg-fuchsia-950/50 border-l-4 border-fuchsia-500 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.2)]';
        iconColor = 'text-fuchsia-400';
      } else if (tab === 'AgentConsole' || tab === 'AgentFoundry') {
        activeClasses = 'bg-purple-950/50 border-l-4 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
        iconColor = 'text-purple-400';
      } else if (tab === 'Update') {
        activeClasses = 'bg-yellow-950/50 border-l-4 border-yellow-500 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]';
        iconColor = 'text-yellow-400';
      } else if (tab === 'RedTeam') {
        activeClasses = 'bg-red-950/50 border-l-4 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
        iconColor = 'text-red-400';
      } else {
         activeClasses = 'bg-gray-800 border-l-4 border-gray-500 text-white shadow-[0_0_10px_rgba(107,114,128,0.2)]';
         iconColor = 'text-gray-300';
      }
    } else {
        activeClasses = 'text-gray-400 hover:bg-gray-900 hover:text-gray-200 border-l-4 border-transparent';
        iconColor = 'text-gray-500 group-hover:text-gray-300';
    }


    return (
      <motion.button
        variants={itemVariants}
        onClick={() => handleTabChange(tab)}
        className={`flex items-center space-x-3 p-3 w-full text-left transition-all duration-200 group ${activeClasses}`}
      >
        <div className={`transition-colors duration-200 ${iconColor}`}>
           {React.cloneElement(icon, { className: 'w-5 h-5' })}
        </div>
        <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-normal'}`}>{label}</span>
      </motion.button>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="flex flex-col px-4 py-6 relative border-b border-gray-800/50 bg-black/20">
          <div className="flex items-center space-x-3 mb-1">
               <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                   <span className="font-bold text-white text-lg">L</span>
               </div>
               <div>
                  <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                      LUNA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">AI</span>
                  </h1>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Operational Interface</p>
              </div>
          </div>
           
           <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-1">
              <button 
                onClick={() => { audioManager.playSound('buttonClick'); setIsTourOpen(true); }}
                className="text-gray-600 hover:text-cyan-400 transition-colors"
                aria-label="Start Tour"
              >
                <QuestionMarkCircleIcon className="w-4 h-4" />
              </button>
           </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
        <div data-tour-id="core-protocols">
            <p className="px-4 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Protocols</p>
            <NavItem tab="ReadMe" label="Documentation" icon={<InformationCircleIcon />} />
            <NavItem tab="Command" label="Command Core" icon={<LinkIcon />} />
            <NavItem tab="Chat" label="Chat Console" icon={<TerminalIcon />} />
            <NavItem tab="RedTeam" label="Red Team Ops" icon={<ShieldExclamationIcon />} />
        </div>
        
        <div data-tour-id="agent-ops">
            <p className="px-4 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Autonomy</p>
            <NavItem tab="AgentConsole" label="Agent Console" icon={<CpuChipIcon />} />
            <NavItem tab="AgentFoundry" label="Agent Foundry" icon={<BeakerIcon />} />
        </div>
        
        <div data-tour-id="studio-tools">
            <p className="px-4 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Generation</p>
            <NavItem tab="Search" label="Grounded Search" icon={<MagnifyingGlassIcon />} />
            <NavItem tab="Image" label="Image Studio" icon={<PhotoIcon />} />
            <NavItem tab="Video" label="Video Studio" icon={<VideoCameraIcon />} />
            <NavItem tab="Live" label="Live Conversation" icon={<MicrophoneIcon />} />
            <NavItem tab="Speech" label="Speech Studio" icon={<SpeakerWaveIcon />} />
        </div>
      </div>
      
      <div className="border-t border-gray-800 bg-black/20 p-4 space-y-4">
        <SystemStatus />
        <div data-tour-id="update-guide">
            <NavItem tab="Update" label="Update Guide" icon={<ArrowUpCircleIcon />} />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
             <div className="text-[10px] text-gray-600">v2.5.0-RELEASE</div>
             <div className="flex space-x-3">
                 <button 
                    onClick={toggleSfxMute} 
                    className={`transition-colors ${isSfxMuted ? 'text-gray-600' : 'text-gray-400 hover:text-white'}`}
                    aria-label={isSfxMuted ? 'Unmute sound effects' : 'Mute sound effects'}
                  >
                    {isSfxMuted ? <BellSlashIcon className="w-4 h-4" /> : <BellIcon className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={toggleMusicMute} 
                    className={`transition-colors ${isMusicMuted ? 'text-gray-600' : 'text-gray-400 hover:text-white'}`}
                    aria-label={isMusicMuted ? 'Unmute music' : 'Mute music'}
                  >
                    {isMusicMuted ? <SpeakerXMarkIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}
                  </button>
             </div>
        </div>
      </div>
    </>
  );


  return (
    <div className="flex h-screen bg-black font-mono overflow-hidden selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <AnimatePresence>
        {isTourOpen && <WelcomeTour onFinish={handleFinishTour} />}
        {isSidebarOpen && (
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/10/18/audio_db32a41d74.mp3" loop></audio>

      {/* Sidebar for Mobile */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-black border-r border-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        variants={sidebarVariants}
        initial="hidden"
        animate={isSidebarOpen ? 'visible' : 'hidden'}
      >
        <SidebarContent />
      </motion.div>

      {/* Sidebar for Desktop */}
      <motion.nav 
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="w-64 bg-black border-r border-gray-800 hidden md:flex flex-col flex-shrink-0 shadow-[5px_0_30px_rgba(0,0,0,0.5)] z-20"
      >
        <SidebarContent />
      </motion.nav>

      <main data-tour-id="main-content" className="flex-1 flex flex-col min-w-0 overflow-hidden bg-black relative">
         {/* Mobile Header */}
         <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-black/80 backdrop-blur z-10">
             <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-fuchsia-600 rounded flex items-center justify-center">
                   <span className="font-bold text-white text-xs">L</span>
               </div>
               <span className="font-bold text-white">LUNA NEXUS</span>
             </div>
             <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-2 text-gray-400 hover:text-white rounded-md"
                aria-label="Open sidebar"
              >
                <Bars3Icon className="w-6 h-6" />
             </button>
         </div>

         <div className="flex-1 overflow-hidden p-2 sm:p-4 md:p-6 relative">
             {/* Background decoration */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px]"></div>
             </div>

             <div className="relative w-full h-full z-10">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={mainVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full h-full"
                    >
                        {renderContent()}
                    </motion.div>
                 </AnimatePresence>
             </div>
         </div>
      </main>
    </div>
  );
};

export default App;
