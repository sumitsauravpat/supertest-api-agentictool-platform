// Agent A — checks a raw Jira requirement for the 4 sections Agent B needs
// before any code generation is allowed to start.

const REQUIRED_SECTIONS = [
  "Scenario",
  "Request",
  "Expected Response",
  "Prerequisites",
] as const;

export interface RequirementSections {
  scenario: string;
  request: string;
  expectedResponse: string;
  prerequisites: string;
}

export interface CompletenessResult {
  complete: boolean;
  missingSections: string[];
  sections?: RequirementSections;
}

// Pulls the text under one "SectionName:" header, stopping at the next
// Capitalized-Header: line (or the end of the string).
function extractSection(rawText: string, sectionName: string): string | undefined {
  const pattern = new RegExp(
    `${sectionName}:\\s*([\\s\\S]*?)(?=\\n[A-Z][a-zA-Z ]*:|$)`,
    "i",
  );
  const match = rawText.match(pattern);
  const value = match?.[1]?.trim();
  return value ? value : undefined;
}

export function checkRequirementCompleteness(rawDescription: string): CompletenessResult {
  const missingSections: string[] = [];
  const found: Record<string, string> = {};

  for (const section of REQUIRED_SECTIONS) {
    const value = extractSection(rawDescription, section);
    if (!value) {
      missingSections.push(section);
    } else {
      found[section] = value;
    }
  }

  if (missingSections.length > 0) {
    return { complete: false, missingSections };
  }

  return {
    complete: true,
    missingSections: [],
    sections: {
      scenario: found["Scenario"],
      request: found["Request"],
      expectedResponse: found["Expected Response"],
      prerequisites: found["Prerequisites"],
    },
  };
}
