const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(data = {}) {
  const payload = data && typeof data === "object" ? data : {};
  const contact = {
    name: String(payload.name || "").trim(),
    email: String(payload.email || "").trim().toLowerCase(),
    company: String(payload.company || "").trim(),
    subject: String(payload.subject || "").trim(),
    message: String(payload.message || "").trim(),
  };
  const errors = [];

  if (!contact.name || contact.name.length > 120) {
    errors.push("Name is required and must not exceed 120 characters.");
  }
  if (!EMAIL_PATTERN.test(contact.email) || contact.email.length > 320) {
    errors.push("A valid email address is required.");
  }
  if (contact.company.length > 160) {
    errors.push("Company must not exceed 160 characters.");
  }
  if (!contact.subject || contact.subject.length > 180) {
    errors.push("Subject is required and must not exceed 180 characters.");
  }
  if (!contact.message || contact.message.length > 5000) {
    errors.push("Message is required and must not exceed 5000 characters.");
  }

  return { valid: errors.length === 0, errors, data: contact };
}

module.exports = { validateContact };
