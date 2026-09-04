import React, { useState } from 'react';
import { useSpectrumSimulation } from './hooks/useSpectrumSimulation';
import { TopBar } from './components/TopBar';
import { Sidebar, PageId } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Scan } from './pages/Scan';
import { Signals } from './pages/Signals';
import { History } from './pages/History';
import { Analytics } from './pages/Analytics';
import { Architecture } from './pages/Architecture';
import { Settings } from './pages/Settings';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const sim = useSpectrumSimulation();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard sim={sim} />;
      case 'scan':
        return <Scan sim={sim} />;
      case 'signals':
        return <Signals sim={sim} />;
      case 'history':
        return <History sim={sim} />;
      case 'analytics':
        return <Analytics sim={sim} />;
      case 'architecture':
        return <Architecture />;
      case 'settings':
        return <Settings sim={sim} />;
      default:
        return <Dashboard sim={sim} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-[#c8d6e5] flex flex-col antialiased selection:bg-[#00e5ff]/20 selection:text-[#00e5ff]">
      {/* Global Tactical Header */}
      <TopBar
        simTime={sim.simTime}
        isPaused={sim.isPaused}
        presentationMode={sim.presentationMode}
        onTogglePresentation={() => sim.setPresentationMode(!sim.presentationMode)}
        onStartDemo={sim.startJudgeDemo}
        onResetSimulation={sim.resetSimulation}
        onTogglePause={sim.togglePause}
        isDemoActive={sim.judgeDemo.isActive}
        activePhaseName={sim.judgeDemo.phaseName}
        scanMode={sim.scanMode}
        onToggleMode={sim.toggleScanMode}
      />

      {/* Main Workbench Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Hidden in Presentation Mode for max screen real estate during jury demo) */}
        {!sim.presentationMode && (
          <Sidebar
            currentPage={currentPage}
            onSelectPage={setCurrentPage}
            detectedCount={sim.signals.length}
            scanMode={sim.scanMode}
          />
        )}

        {/* Dynamic Page Container */}
        <main className={`flex-1 overflow-y-auto ${
          sim.presentationMode ? 'p-4 sm:p-6' : 'p-3 sm:p-5'
        }`}>
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
