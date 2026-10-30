/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PlatformCommand, PlatformView } from './types';
import { MockAdapter } from './api/MockAdapter';
import { FIXTURES, FixtureMeta } from './fixtures';
import { VisualStyle } from './theme/tokens';
import { GameSlotType } from './components/GameSlot';

// Components
import { Header } from './components/Header';
import { DevPanel } from './components/DevPanel';
import { ScreenArchitectureGuide } from './components/ScreenArchitectureGuide';
import { ProposalsModal } from './components/ProposalsModal';

// Screens
import { NoTelegramScreen } from './screens/NoTelegramScreen';
import { PrivateChatScreen } from './screens/PrivateChatScreen';
import { SubscribeScreen } from './screens/SubscribeScreen';
import { ErrorScreen } from './screens/ErrorScreen';
import { GatheringScreen } from './screens/GatheringScreen';
import { GameSelectScreen } from './screens/GameSelectScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { PartyScreen } from './screens/PartyScreen';
import { FinishedScreen } from './screens/FinishedScreen';

// Sheets & Modals
import { TopupSheet } from './sheets/TopupSheet';
import { InviteSheet } from './sheets/InviteSheet';
import { SettingsSheet } from './sheets/SettingsSheet';
import { ReentryModal } from './sheets/ReentryModal';

export default function App() {
  const mockAdapter = useMemo(() => new MockAdapter(5), []);

  const [currentView, setCurrentView] = useState<PlatformView>(() => mockAdapter.getView());
  const [isLiveMock, setIsLiveMock] = useState(true);

  // Local navigation between G1 (Gathering) and G2 (Catalog) when game is not yet selected
  const [catalogSubView, setCatalogSubView] = useState<'gathering' | 'catalog'>('gathering');

  // Visual style: cozy (Tabletop), fiesta (Party), arcade (Modern Clean)
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('cozy');

  // Game slot override in G4 (Party)
  const [activeGameSlot, setActiveGameSlot] = useState<GameSlotType>('guesser');

  // Sheet & Modal states
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArchitectureGuideOpen, setIsArchitectureGuideOpen] = useState(false);
  const [isProposalsOpen, setIsProposalsOpen] = useState(false);

  // Theme state: follows view.prefs.theme
  const themePref = currentView.prefs.theme;
  const isLightMode = themePref === 'light' || (themePref === 'telegram' && true); // default clean light mode

  // Subscribe to mock updates
  useEffect(() => {
    if (!isLiveMock) return;
    const unsubscribe = mockAdapter.subscribe((updatedView) => {
      setCurrentView(updatedView);
    });
    return () => unsubscribe();
  }, [mockAdapter, isLiveMock]);

  // Synchronize document dark class
  useEffect(() => {
    if (!isLightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isLightMode]);

  // Command sender
  const handleSend = (cmd: PlatformCommand) => {
    if (cmd.type === 'GO_SELECT_GAME') {
      setCatalogSubView('catalog');
    } else if (cmd.type === 'BACK_TO_QR') {
      setCatalogSubView('gathering');
    }

    if (isLiveMock) {
      mockAdapter.send(cmd);
    } else {
      // In fixture mode, forward to mock adapter and return to live updates
      mockAdapter.setCustomView(currentView);
      mockAdapter.send(cmd);
      setIsLiveMock(true);
    }
  };

  // Fixture applying
  const handleApplyFixture = (fixture: FixtureMeta) => {
    setIsLiveMock(false);
    setCurrentView(fixture.view);
    // If fixture is G2 catalog fixture, sync catalog subview
    if (fixture.id.startsWith('g2_')) {
      setCatalogSubView('catalog');
    } else if (fixture.id.startsWith('g1_')) {
      setCatalogSubView('gathering');
    }
  };

  // Return to live mock
  const handleResetLiveMock = (playerCount = 5) => {
    mockAdapter.resetParty(playerCount);
    setIsLiveMock(true);
    setCatalogSubView('gathering');
    setCurrentView(mockAdapter.getView());
  };

  // Render main screen body
  const renderScreen = () => {
    // 1. System checks: context
    if (currentView.context === 'no_telegram') {
      return <NoTelegramScreen isLightMode={isLightMode} />;
    }

    if (currentView.context === 'private') {
      return (
        <PrivateChatScreen
          onClose={() => handleResetLiveMock(5)}
          isLightMode={isLightMode}
        />
      );
    }

    // 2. Channel subscription check
    if (!currentView.isChannelMember) {
      return (
        <SubscribeScreen
          channelUsername={currentView.channelUsername}
          isBusy={currentView.busy}
          onOpenChannel={() => handleSend({ type: 'OPEN_CHANNEL' })}
          onRecheck={() => handleSend({ type: 'RECHECK_CHANNEL' })}
          isLightMode={isLightMode}
        />
      );
    }

    // 3. Network or maintenance error check
    if (
      currentView.error &&
      (currentView.error.code === 'NETWORK' || currentView.error.code === 'MAINTENANCE')
    ) {
      return (
        <ErrorScreen
          error={currentView.error}
          onRetry={() => handleResetLiveMock(5)}
          isLightMode={isLightMode}
        />
      );
    }

    // 4. Room phases
    // G4: Playing (Party)
    if (currentView.room.phase === 'playing') {
      return (
        <PartyScreen
          view={currentView}
          send={handleSend}
          gameSlotOverride={activeGameSlot}
          isLightMode={isLightMode}
        />
      );
    }

    // G5: Finished
    if (currentView.room.phase === 'finished') {
      return (
        <FinishedScreen
          view={currentView}
          send={handleSend}
          visualStyle={visualStyle}
          isLightMode={isLightMode}
        />
      );
    }

    // G3: Lobby with game selected
    if (currentView.room.phase === 'lobby' && currentView.room.gameId) {
      return (
        <LobbyScreen
          view={currentView}
          send={handleSend}
          onOpenInvite={() => setIsInviteOpen(true)}
          visualStyle={visualStyle}
          isLightMode={isLightMode}
        />
      );
    }

    // G1 (Gathering) or G2 (Game Selection)
    if (catalogSubView === 'catalog') {
      return (
        <GameSelectScreen
          view={currentView}
          send={handleSend}
          onBackToQr={() => {
            setCatalogSubView('gathering');
            handleSend({ type: 'BACK_TO_QR' });
          }}
          onOpenTopup={() => setIsTopupOpen(true)}
          visualStyle={visualStyle}
          isLightMode={isLightMode}
        />
      );
    }

    // Default: G1 Gathering
    return (
      <GatheringScreen
        view={currentView}
        send={handleSend}
        onGoSelectGame={() => {
          setCatalogSubView('catalog');
          handleSend({ type: 'GO_SELECT_GAME' });
        }}
        visualStyle={visualStyle}
        isLightMode={isLightMode}
      />
    );
  };

  const isPartyActive = currentView.room.phase === 'playing';

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-start transition-colors duration-200 select-none ${
        isLightMode ? 'bg-[#f4f5f8] text-neutral-900' : 'bg-[#0a0a0d] text-neutral-100'
      }`}
    >
      {/* Phone container frame: 320px - 430px */}
      <div
        className={`w-full max-w-[430px] min-h-screen flex flex-col relative shadow-2xl transition-colors duration-200 border-x ${
          isLightMode
            ? 'bg-white border-neutral-200 shadow-neutral-300/40'
            : 'bg-neutral-950 border-neutral-900 shadow-black'
        }`}
      >
        {/* Global Platform Header (hidden only in Party screen where narrow bar replaces it) */}
        {!isPartyActive && (
          <Header
            view={currentView}
            onOpenTopup={() => setIsTopupOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            visualStyle={visualStyle}
            isLightMode={isLightMode}
          />
        )}

        {/* Main Routed Screen */}
        <main className="flex-1 flex flex-col w-full relative overflow-x-hidden">
          {renderScreen()}
        </main>

        {/* Top-Up Sheet */}
        <TopupSheet
          isOpen={isTopupOpen}
          onClose={() => setIsTopupOpen(false)}
          view={currentView}
          onBuyPackage={(packageId) => handleSend({ type: 'BUY_PACKAGE', packageId })}
          isLightMode={isLightMode}
        />

        {/* Invite Friends Sheet */}
        <InviteSheet
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          view={currentView}
          isLightMode={isLightMode}
        />

        {/* Settings Sheet */}
        <SettingsSheet
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          view={currentView}
          onSetTheme={(theme) => handleSend({ type: 'SET_PREFS', theme })}
          onToggleHaptics={(haptics) => handleSend({ type: 'SET_PREFS', haptics })}
          visualStyle={visualStyle}
          onSetVisualStyle={(style) => setVisualStyle(style)}
          isLightMode={isLightMode}
        />

        {/* Reentry Modal («Комната опустела») */}
        <ReentryModal
          isOpen={currentView.room.reentryDecisionNeeded}
          onDecision={(decision) => handleSend({ type: 'REENTRY', decision })}
          isLightMode={isLightMode}
        />

        {/* Screen Architecture Guide */}
        <ScreenArchitectureGuide
          isOpen={isArchitectureGuideOpen}
          onClose={() => setIsArchitectureGuideOpen(false)}
          onSelectFixture={handleApplyFixture}
          activeFixtureId={FIXTURES.find((f) => f.view === currentView)?.id}
          isLightMode={isLightMode}
        />

        {/* Extra Proposals Modal (Section 9) */}
        <ProposalsModal
          isOpen={isProposalsOpen}
          onClose={() => setIsProposalsOpen(false)}
          isLightMode={isLightMode}
        />

        {/* Collapsible DevPanel for Review and Fixtures */}
        <DevPanel
          currentView={currentView}
          isLiveMock={isLiveMock}
          onApplyFixture={handleApplyFixture}
          onResetLiveMock={handleResetLiveMock}
          onToggleHostAway={() => mockAdapter.toggleHostAway()}
          onSimulateOtherTakeover={() => mockAdapter.simulateOtherPlayerTakeover()}
          onAddPlayer={() => mockAdapter.addPlayer()}
          onRemovePlayer={() => mockAdapter.removePlayer()}
          onToggleAutoArrivals={() => mockAdapter.toggleAutoArrivals()}
          onAdjustBalance={(delta) => mockAdapter.adjustBalance(delta)}
          visualStyle={visualStyle}
          onSetVisualStyle={setVisualStyle}
          activeGameSlot={activeGameSlot}
          onSetGameSlot={setActiveGameSlot}
          onOpenArchitectureGuide={() => setIsArchitectureGuideOpen(true)}
          onOpenProposals={() => setIsProposalsOpen(true)}
          isLightMode={isLightMode}
          onToggleTheme={() =>
            handleSend({
              type: 'SET_PREFS',
              theme: isLightMode ? 'dark' : 'light',
            })
          }
        />
      </div>
    </div>
  );
}
