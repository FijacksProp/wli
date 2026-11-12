export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Enter your email address.";
  if (v.length > 254 || !EMAIL_RE.test(v)) return "Enter a valid email address, like name@example.com.";
  return undefined;
}

export type ContactValues = { name: string; email: string; phone: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  if (!name) errors.name = "Enter your name.";
  else if (name.length > 100) errors.name = "Name must be 100 characters or fewer.";

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const phone = values.phone.trim();
  if (phone && !/^[+()\-\s\d]{7,20}$/.test(phone))
    errors.phone = "Enter a valid phone number, or leave this blank.";

  const message = values.message.trim();
  if (!message) errors.message = "Enter a message.";
  else if (message.length < 10) errors.message = "Message must be at least 10 characters.";
  else if (message.length > 2000) errors.message = "Message must be 2,000 characters or fewer.";

  return errors;
}
