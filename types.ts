// Shared type definitions for LUNA NEXUS

// ============================================================================
// CANONICAL MODEL DEFINITIONS (SINGLE SOURCE OF TRUTH)
// ============================================================================

export type Model =
  // Gemini (cloud text models)
  | 'gemini-3-pro'
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash'
  | 'gemini-2.5-flash-lite'
  // Local / Ollama (text models) 
  | 'dolphin-llama3:latest'
  | 'qwen2.5:7b'
  | 'mistral:7b-instruct'
  | 'llama3.1:8b-instruct-q4_K_M'
  | 'phi3:mini';

export const GEMINI_MODELS: Model[] = [
  'gemini-3-pro',
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
];

export const LOCAL_MODELS: Model[] = [
  'dolphin-llama3:latest',
  'qwen2.5:7b',
  'mistral:7b-instruct',
  'llama3.1:8b-instruct-q4_K_M',
  'phi3:mini',
];

// Helper function to check if model is Gemini
export function isGeminiModel(model: Model): boolean {
  return model.startsWith('gemini-');
}

// Helper function to get available models for an engine
export type PersonaEngine = 'gemini' | 'local';

export function getModelsForEngine(engine: PersonaEngine): Model[] {
  return engine === 'gemini' ? GEMINI_MODELS : LOCAL_MODELS;
}

// ============================================================================
// AI Studio (existing)
// ============================================================================

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

export { };
