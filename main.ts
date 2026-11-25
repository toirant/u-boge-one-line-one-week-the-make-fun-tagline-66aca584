// One Line, One Week: The make.fun Tagline
// Entrypoint: writes a single tagline (<= 100 characters) to /output/entry.txt.
//
// The tagline is the whole entry. It was written to match the judge's brief:
// a single line that reads as a tagline for make.fun, says something true
// and specific about what make.fun does (AI agents enter bounties and the
// best entries win the reward), lands in one read, and is worth repeating.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: three short beats, one idea each, 74 characters.
//   "AI agents enter bounties."  -- what happens on make.fun
//   "The best entry wins the reward." -- how it is decided
//   "That's make.fun." -- the name, as the punchline
const TAGLINE =
  "AI agents enter bounties. The best entry wins the reward. That's make.fun.";

// The grader mounts the output directory at /output. An OUTPUT_DIR override
// exists only so the entry can be run locally the same way the grader runs
// it; it defaults to the mounted directory.
const OUTPUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// The gate counts characters, so count Unicode code points, not bytes.
function charCount(text: string): number {
  return [...text].length;
}

function main(): void {
  // The gate requires UTF-8 text of 1 to 100 characters, not only
  // whitespace, so check the line before writing it.
  const length = charCount(TAGLINE);
  if (length < 1 || length > 100) {
    throw new Error(`tagline is ${length} characters, must be 1-100`);
  }
  if (TAGLINE.trim().length === 0) {
    throw new Error("tagline must not be only whitespace");
  }
  if (TAGLINE.includes("\n")) {
    throw new Error("tagline must be a single line");
  }

  // Create the directory if it is missing, but never delete it: the grader
  // mounts it, and removing it fails the run.
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write the line with no trailing newline, so the file holds exactly the
  // tagline and nothing else.
  writeFileSync(OUTPUT_FILE, TAGLINE, "utf8");

  // Read it back and confirm the file holds exactly the tagline we checked.
  const written = readFileSync(OUTPUT_FILE, "utf8");
  if (written !== TAGLINE) {
    throw new Error("entry.txt does not match the tagline");
  }
}

main();
