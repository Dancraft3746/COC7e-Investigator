import { Component, For, Show } from 'solid-js';
import {
  isDrawerOpen,
  setIsDrawerOpen,
  rosterSummaries,
  activeChar,
  switchCharacter,
  createNewCharacter,
  duplicateCurrentCharacter,
  deleteCurrentCharacter,
} from '../stores/characterStore';

export const CharacterDrawer: Component = () => {
  return (
    <Show when={isDrawerOpen()}>
      <div class="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
        <div class="w-full max-w-md bg-[#FAF5EB] h-full shadow-2xl border-l-2 border-[#8C6D46] p-5 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header */}
            <div class="flex items-center justify-between border-b-2 border-sepia-800 pb-3 mb-4">
              <div>
                <h2 class="text-lg font-bold font-title text-sepia-900">
                  📁 調查員名冊庫 (Roster)
                </h2>
                <p class="text-xs text-sepia-700">
                  本機 IndexedDB 持久化 • 支援無限多角色存檔
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                class="w-7 h-7 rounded bg-sepia-800 text-parchment-100 flex items-center justify-center font-bold hover:bg-sepia-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Actions */}
            <div class="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={createNewCharacter}
                class="bg-eldritch-green hover:bg-opacity-90 text-amber-100 px-3 py-2 rounded text-xs font-bold shadow flex items-center justify-center gap-1 cursor-pointer transition"
              >
                <span>➕ 創建新調查員</span>
              </button>
              <button
                onClick={duplicateCurrentCharacter}
                class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 px-3 py-2 rounded text-xs font-bold shadow flex items-center justify-center gap-1 cursor-pointer transition"
              >
                <span>📑 複製當前角色</span>
              </button>
            </div>

            {/* Roster Character List */}
            <div class="space-y-3">
              <For each={rosterSummaries()}>
                {(char) => {
                  const isActive = () => char.id === activeChar.id;
                  return (
                    <div
                      class={`p-3 rounded border transition ${
                        isActive()
                          ? 'bg-amber-100/70 border-eldritch-gold shadow-md ring-1 ring-eldritch-gold'
                          : 'bg-parchment-50 border-parchment-400 hover:bg-parchment-200'
                      }`}
                    >
                      <div class="flex items-start justify-between">
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="font-bold text-sm text-sepia-900">
                              {char.name}
                            </span>
                            <Show when={isActive()}>
                              <span class="px-1.5 py-0.2 bg-eldritch-gold text-stone-900 font-bold text-[10px] rounded">
                                當前作用中
                              </span>
                            </Show>
                          </div>
                          <p class="text-xs text-sepia-700 mt-0.5">
                            {char.job} • {char.age} 歲
                          </p>
                          <div class="flex items-center gap-3 mt-1.5 text-xs font-mono font-bold">
                            <span class="text-red-800">
                              ❤️ HP: {char.hp}/{char.maxHP}
                            </span>
                            <span class="text-purple-900">
                              🧠 SAN: {char.san}
                            </span>
                          </div>
                        </div>

                        {/* Switch / Delete Buttons */}
                        <div class="flex flex-col gap-1 items-end">
                          <Show
                            when={!isActive()}
                            fallback={
                              <span class="text-xs text-amber-800 font-bold mt-2">
                                正在遊玩
                              </span>
                            }
                          >
                            <button
                              onClick={() => switchCharacter(char.id)}
                              class="bg-sepia-800 hover:bg-sepia-900 text-parchment-100 text-xs px-2.5 py-1 rounded font-bold cursor-pointer transition"
                            >
                              切換
                            </button>
                          </Show>
                          <Show when={rosterSummaries().length > 1}>
                            <button
                              onClick={() => {
                                if (confirm(`確定要刪除調查員【${char.name}】嗎？`)) {
                                  deleteCurrentCharacter(char.id);
                                }
                              }}
                              class="text-[11px] text-red-800 hover:underline cursor-pointer mt-1"
                            >
                              刪除
                            </button>
                          </Show>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </div>

          {/* Footer */}
          <div class="pt-4 border-t border-parchment-400 text-center">
            <p class="text-[11px] text-sepia-700">
              所有數據透過瀏覽器 IndexedDB 本機安全隔離儲存。
            </p>
          </div>
        </div>
      </div>
    </Show>
  );
};
