/**
 * Helper to identify Python boilerplate headers (imports, `class Solution:`,
 * and `def methodName(self, ...):` plus the leading indentation of the first body line).
 *
 * This allows the typing drill to keep the entire code visible in the editor,
 * but mark the boilerplate as already completed so the cursor begins immediately
 * on the actual algorithmic logic.
 */

export function getBoilerplateLength(fullCode) {
  if (!fullCode) return 0;
  const normalized = fullCode.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");

  let foundClass = false;
  let inDef = false;
  let defLineIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("class ")) {
      foundClass = true;
      continue;
    }
    if (foundClass && trimmed.startsWith("def ")) {
      inDef = true;
      if (trimmed.endsWith(":")) {
        defLineIndex = i;
        break;
      }
      continue;
    }
    if (inDef && trimmed.endsWith(":")) {
      defLineIndex = i;
      break;
    }
  }

  // Fallback: look for any top-level def statement
  if (defLineIndex === -1) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith("def ") && trimmed.endsWith(":")) {
        defLineIndex = i;
        break;
      }
    }
  }

  if (defLineIndex === -1 || defLineIndex + 1 >= lines.length) {
    return 0;
  }

  // Count chars up to the end of defLineIndex (including newlines)
  let charCount = 0;
  for (let i = 0; i <= defLineIndex; i++) {
    charCount += lines[i].length + 1; // +1 for '\n'
  }

  // Include the leading indentation of the first body line so cursor is at the first letter
  const nextLine = lines[defLineIndex + 1];
  const indentMatch = nextLine.match(/^( +)/);
  if (indentMatch) {
    charCount += indentMatch[1].length;
  }

  return Math.min(charCount, normalized.length);
}

export function hasBoilerplate(fullCode) {
  return getBoilerplateLength(fullCode) > 0;
}
