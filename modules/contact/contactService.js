const emailService = require("../email");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendContactMessage(contact) {
  const recipient = process.env.CONTACT_EMAIL_TO?.trim() || "info@elternsegen.ai";

  const subject = `[Website Contact] ${contact.subject}`;
  const text = [
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Company: ${contact.company || "Not provided"}`,
    "",
    contact.message,
  ].join("\n");
  const html = `
    <h2>New website contact request</h2>
    <p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(contact.company || "Not provided")}</p>
    <p><strong>Subject:</strong> ${escapeHtml(contact.subject)}</p>
    <hr>
    <p>${escapeHtml(contact.message).replaceAll("\n", "<br>")}</p>
  `;

  return emailService.sendEmail({
    to: recipient,
    replyTo: contact.email,
    subject,
    text,
    html,
  });
}

module.exports = { escapeHtml, sendContactMessage };
