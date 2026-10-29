import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

// 5F Acute Panic & Bout State
export interface PanicState {
  fiveF: string;
  fiveFDesc: string;
  symptom: string;
  symptomDesc: string;
  durationRounds: number;
  phobiaMania: string;
}

export const [isPanicModalOpen, setIsPanicModalOpen] = createSignal(false);
export const [isSanityRecoveryOpen, setIsSanityRecoveryOpen] = createSignal(false);

export const [activePanic, setActivePanic] = createStore<PanicState>({
  fiveF: '',
  fiveFDesc: '',
  symptom: '',
  symptomDesc: '',
  durationRounds: 0,
  phobiaMania: '',
});
