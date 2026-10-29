import { Component, For } from 'solid-js';
import { activeChar } from '../stores/characterStore';

export const SocialWebTab: Component = () => {
  return (
    <div class="space-y-4">
      <div class="p-4 bg-parchment-200 rounded border border-parchment-400">
        <h3 class="text-sm font-bold font-title text-sepia-900 mb-1">
          👥 人際網絡與精神錨點 (Social Web & Key Connection)
        </h3>
        <p class="text-xs text-sepia-700">
          包含非神話 NPC、贊助者、調查同伴與關鍵聯結
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <For each={activeChar.contacts}>
          {(contact) => (
            <div class="p-3 bg-parchment-50 rounded border border-parchment-300 shadow-xs">
              <div class="flex justify-between items-start">
                <h4 class="font-bold text-xs text-sepia-900 flex items-center gap-1.5">
                  <span>{contact.name}</span>
                </h4>
                <span class="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                  {contact.relation}
                </span>
              </div>
              <p class="text-xs text-sepia-800 mt-2 leading-relaxed">
                {contact.notes || contact.role}
              </p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
