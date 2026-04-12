import type { Section } from "../types/courseTypes";
import type { CalendarBlock, Combination } from "../types/schedule";

// ── Time helpers ─────────────────────────────────────────────────────────────

export function parseMinutes(t: string): number {
  // t is like "0930" or "1420"
  if (!t || t.length < 4) return 0;
  return parseInt(t.slice(0, 2), 10) * 60 + parseInt(t.slice(2, 4), 10);
}

interface TimeBlock {
  day: number;
  start: number;
  end: number;
}

const DAY_MAP: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

function getTimeBlocks(section: Section): TimeBlock[] {
  const blocks: TimeBlock[] = [];
  for (const mf of section.meetingsFaculty ?? []) {
    const mt = mf.meetingTime;
    if (!mt) continue;
    const start = parseMinutes(mt.beginTime ?? "");
    const end = parseMinutes(mt.endTime ?? "");
    if (!start && !end) continue;
    for (const [dayKey, dayIdx] of Object.entries(DAY_MAP)) {
      if ((mt as Record<string, unknown>)[dayKey]) {
        blocks.push({ day: dayIdx, start, end });
      }
    }
  }
  return blocks;
}

function blocksOverlap(a: TimeBlock[], b: TimeBlock[]): boolean {
  for (const x of a) {
    for (const y of b) {
      if (x.day === y.day && x.start < y.end && y.start < x.end) return true;
    }
  }
  return false;
}

function sectionsConflict(a: Section, b: Section): boolean {
  return blocksOverlap(getTimeBlocks(a), getTimeBlocks(b));
}

// ── Combination generation ────────────────────────────────────────────────────
// Groups sections by their linkIdentifier (A1, B1 etc.) within a course,
// then picks one group per course and checks conflicts.

// function groupByLink(sections: Section[]): Section[][] {
//   // Lectures are linked with labs/tutorials via linkIdentifier.
//   // Group by linkIdentifier so we pick a coherent set.
//   const map = new Map<string, Section[]>();
//   for (const s of sections) {
//     const key = s.linkIdentifier ?? s.sequenceNumber ?? s.crn;
//     if (!map.has(key)) map.set(key, []);
//     map.get(key)!.push(s);
//   }
//   return Array.from(map.values());
// }

let comboCounter = 0;

export function generateCombinations(
  courseSectionGroups: Section[][],
): Combination[] {
  // Each element of courseSectionGroups is the full section list for one course.
  // We pick one section from each course and check for conflicts.
  const results: Combination[] = [];

  function recurse(courseIdx: number, chosen: Section[]) {
    if (courseIdx === courseSectionGroups.length) {
      // Check all pairs for conflicts
      let conflict = false;
      for (let i = 0; i < chosen.length && !conflict; i++) {
        for (let j = i + 1; j < chosen.length && !conflict; j++) {
          if (sectionsConflict(chosen[i], chosen[j])) conflict = true;
        }
      }
      results.push({
        id: `combo-${comboCounter++}`,
        sections: [...chosen],
        hasConflict: conflict,
      });
      return;
    }

    for (const section of courseSectionGroups[courseIdx]) {
      chosen.push(section);
      recurse(courseIdx + 1, chosen);
      chosen.pop();
    }
  }

  recurse(0, []);
  return results.filter((c) => !c.hasConflict);
}

// ── Calendar block builder ────────────────────────────────────────────────────

const COURSE_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ef4444", // red
  "#06b6d4", // cyan
  "#f97316", // orange
  "#ec4899", // pink
];

export function buildCalendarBlocks(sections: Section[]): CalendarBlock[] {
  const blocks: CalendarBlock[] = [];
  sections.forEach((section, sectionIdx) => {
    const color = COURSE_COLORS[sectionIdx % COURSE_COLORS.length];
    for (const mf of section.meetingsFaculty ?? []) {
      const mt = mf.meetingTime;
      if (!mt) continue;
      const start = parseMinutes(mt.beginTime ?? "");
      const end = parseMinutes(mt.endTime ?? "");
      if (!start && !end) continue;
      for (const [dayKey, dayIdx] of Object.entries(DAY_MAP)) {
        if ((mt as Record<string, unknown>)[dayKey]) {
          blocks.push({
            section,
            day: dayIdx,
            startMinutes: start,
            endMinutes: end,
            color,
          });
        }
      }
    }
  });
  return blocks;
}
