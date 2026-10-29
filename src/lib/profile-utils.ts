export interface UserProfileContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  city?: string;
}

/**
 * Accurately injects/replaces the candidate's real profile credentials (Full Name, Phone, Email)
 * into any resume text (presets, AI generated, or rewritten), completely preventing
 * hallucinated placeholder names like "Алексей Морозов", "Анна Смирнова", "Иван Иванов".
 */
export function injectUserProfileIntoResume(
  resumeText: string,
  profile?: UserProfileContactInfo | null
): string {
  if (!resumeText) return "";
  if (!profile) return resumeText;

  const realName = (profile.name || "").trim();
  const realEmail = (profile.email || "").trim();
  const realPhone = (profile.phone || "").trim();

  if (!realName) return resumeText;

  const lines = resumeText.split("\n");
  let nameLineIndex = -1;

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const l = lines[i].trim();
    if (
      l &&
      !l.toUpperCase().includes("РЕЗЮМЕ") &&
      !l.toUpperCase().includes("RESUME") &&
      !l.includes("|") &&
      !l.startsWith("•") &&
      !l.startsWith("-") &&
      !l.startsWith("*")
    ) {
      nameLineIndex = i;
      break;
    }
  }

  if (nameLineIndex !== -1) {
    // Replace placeholder name with real candidate name
    lines[nameLineIndex] = realName;

    // Contact line is typically the next non-empty line
    let contactLineIndex = -1;
    for (let j = nameLineIndex + 1; j < Math.min(lines.length, nameLineIndex + 4); j++) {
      if (lines[j].trim()) {
        contactLineIndex = j;
        break;
      }
    }

    if (contactLineIndex !== -1) {
      let contactLine = lines[contactLineIndex];

      // 1. Mask all email addresses first so phone regex cannot match digits inside emails
      const maskedEmails: string[] = [];
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      contactLine = contactLine.replace(emailRegex, (match) => {
        maskedEmails.push(match);
        return `__EMAIL_TOKEN_${maskedEmails.length - 1}__`;
      });

      // 2. Replace phone numbers with real phone using strict lookaround guards
      if (realPhone) {
        const guardedPhoneRegex = /(?<![a-zA-Z0-9_.%+-])(?:\+?7|8)[\s\-(]*\d{3}[\s\-)]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}(?![a-zA-Z0-9_.%+-]|@)|(?<![a-zA-Z0-9_.%+-])\+?[1-9]\d{0,2}[\s\-(]*\d{2,4}[\s\-)]*\d{2,4}[\s\-]*\d{2,4}(?![a-zA-Z0-9_.%+-]|@)/g;
        contactLine = contactLine.replace(guardedPhoneRegex, realPhone);
      }

      // 3. Restore email address (or substitute real profile email)
      contactLine = contactLine.replace(/__EMAIL_TOKEN_(\d+)__/g, (m, idx) => {
        return realEmail || maskedEmails[Number(idx)];
      });

      lines[contactLineIndex] = contactLine;
    }
  } else {
    // If no header found, prepend real name
    lines.unshift(realName);
  }

  return lines.join("\n");
}

/**
 * Extracts candidate full name from resume text if possible.
 */
export function extractCandidateName(resumeText: string): string {
  if (!resumeText) return "";
  const lines = resumeText.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const l = lines[i];
    if (
      l &&
      !l.toUpperCase().includes("РЕЗЮМЕ") &&
      !l.toUpperCase().includes("RESUME") &&
      !l.includes("|") &&
      !l.startsWith("•") &&
      !l.startsWith("-") &&
      !l.startsWith("*") &&
      l.length < 50
    ) {
      return l;
    }
  }
  return "";
}

export { anonymizePII, restorePII } from "./privacy-utils";

