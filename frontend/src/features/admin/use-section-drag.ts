"use client";

import { useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { isSectionId, type SectionId } from "@/features/admin/section-ids";
import {
  getPortfolioSettings,
  moveSectionBefore,
  moveSectionToEnd,
} from "@/features/admin/portfolio-settings";

const SCOPE_SELECTOR = '[data-drop-scope="sidebar"]';

function sectionAt(clientX: number, clientY: number) {
  const row = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>(SCOPE_SELECTOR);
  const id = row?.dataset.sectionId;
  return id && isSectionId(id) ? id : null;
}

export function useSectionDrag() {
  const [dragId, setDragId] = useState<SectionId | null>(null);
  const [overId, setOverId] = useState<SectionId | null>(null);

  function onHandlePointerDown(event: ReactPointerEvent<HTMLButtonElement>, id: SectionId) {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    setDragId(id);
    setOverId(id);

    function cleanup() {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onCancel);
      setDragId(null);
      setOverId(null);
    }

    function onMove(ev: PointerEvent) {
      const next = sectionAt(ev.clientX, ev.clientY);
      if (next) setOverId(next);
    }

    function onUp(ev: PointerEvent) {
      const target = sectionAt(ev.clientX, ev.clientY);
      cleanup();
      if (!target || target === id) return;
      const order = getPortfolioSettings().order;
      const from = order.indexOf(id);
      const to = order.indexOf(target);
      if (from < to) {
        const after = order[to + 1];
        if (after) moveSectionBefore(id, after);
        else moveSectionToEnd(id);
      } else {
        moveSectionBefore(id, target);
      }
    }

    function onCancel() {
      cleanup();
    }

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onCancel);
  }

  function onHandleKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: SectionId) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const list = getPortfolioSettings().order;
    const index = list.indexOf(id);
    if (index < 0) return;
    if (event.key === "ArrowUp" && index > 0) {
      moveSectionBefore(id, list[index - 1]);
      return;
    }
    if (event.key === "ArrowDown" && index < list.length - 1) {
      const after = list[index + 2];
      if (after) moveSectionBefore(id, after);
      else moveSectionToEnd(id);
    }
  }

  return { dragId, overId, onHandlePointerDown, onHandleKeyDown };
}
