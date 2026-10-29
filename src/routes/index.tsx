import { Component, onMount, Switch, Match } from 'solid-js';
import { Header } from '../components/Header';
import { CharacterDrawer } from '../components/CharacterDrawer';
import { VitalsPanel } from '../components/VitalsPanel';
import { CharacteristicsGrid } from '../components/CharacteristicsGrid';
import { WeaponsPanel } from '../components/WeaponsPanel';
import { SkillsTab } from '../components/SkillsTab';
import { GrimoireTab } from '../components/GrimoireTab';
import { MythosCodexTab } from '../components/MythosCodexTab';
import { SocialWebTab } from '../components/SocialWebTab';
import { ChronicleTab } from '../components/ChronicleTab';
import { DiceModal } from '../components/DiceModal';
import { PanicModal } from '../components/PanicModal';
import { CreationWizardModal } from '../components/CreationWizardModal';
import { AgeAdjustmentModal } from '../components/AgeAdjustmentModal';
import { DevelopmentPhaseModal } from '../components/DevelopmentPhaseModal';
import { FinanceModal } from '../components/FinanceModal';
import { activeTab, initApp } from '../stores/characterStore';

export default function Home() {
  onMount(() => {
    initApp();
  });

  return (
    <div class="min-h-screen text-sepia-900 antialiased py-4 px-2 sm:px-6 md:px-8">
      <div class="max-w-7xl mx-auto">
        {/* Top Header */}
        <Header />

        {/* Multi-Character Slide-over Drawer */}
        <CharacterDrawer />

        {/* Global Interactive Dice Roller Modal */}
        <DiceModal />

        {/* Global 5F Acute Panic & Bout of Madness Modal */}
        <PanicModal />

        {/* Global Investigator Creation Wizard */}
        <CreationWizardModal />

        {/* Global Age Adjustment & EDU Improvement Modal */}
        <AgeAdjustmentModal />

        {/* Global Development Phase Resolution Modal */}
        <DevelopmentPhaseModal />

        {/* Global Finance & Wallet Modal */}
        <FinanceModal />

        {/* Main Content Sheet */}
        <main class="parchment-sheet p-4 sm:p-6 rounded-b-lg shadow-2xl border-t-0 min-h-[750px]">
          <Switch>
            <Match when={activeTab() === 'core'}>
              <div class="space-y-6">
                <VitalsPanel />
                <CharacteristicsGrid />
                <WeaponsPanel />
              </div>
            </Match>
            <Match when={activeTab() === 'skills'}>
              <SkillsTab />
            </Match>
            <Match when={activeTab() === 'grimoire'}>
              <GrimoireTab />
            </Match>
            <Match when={activeTab() === 'mythos'}>
              <MythosCodexTab />
            </Match>
            <Match when={activeTab() === 'contacts'}>
              <SocialWebTab />
            </Match>
            <Match when={activeTab() === 'chronicles'}>
              <ChronicleTab />
            </Match>
          </Switch>
        </main>
      </div>
    </div>
  );
}
