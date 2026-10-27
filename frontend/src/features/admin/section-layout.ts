"use client";

export { SECTION_IDS, SECTION_LABELS, isSectionId, type SectionId } from "@/features/admin/section-ids";

import {
  moveSectionBefore as moveSettingsBefore,
  moveSectionToEnd as moveSettingsToEnd,
  toggleSectionVisibility,
  usePortfolioSettings,
  visibleSectionIds as visibleFromSettings,
  type PortfolioSettingsState,
} from "@/features/admin/portfolio-settings";
import type { SectionId } from "@/features/admin/section-ids";

export type SectionLayout = {
  order: SectionId[];
  hidden: SectionId[];
};

export function visibleSectionIds(layout: SectionLayout | PortfolioSettingsState) {
  return layout.order.filter((id) => !layout.hidden.includes(id));
}

export function toggleSection(id: SectionId) {
  toggleSectionVisibility(id);
}

export function moveSectionBefore(id: SectionId, beforeId: SectionId) {
  moveSettingsBefore(id, beforeId);
}

export function moveSectionToEnd(id: SectionId) {
  moveSettingsToEnd(id);
}

export function useSectionLayout(): SectionLayout {
  const settings = usePortfolioSettings();
  return { order: settings.order, hidden: settings.hidden };
}

export function useVisibleSectionIds() {
  const settings = usePortfolioSettings();
  return visibleFromSettings(settings);
}
