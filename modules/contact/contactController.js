const { sendContactMessage } = require("./contactService");
const { validateContact } = require("./contactValidation");

async function submitContact(request, response) {
  const validation = validateContact(request.body);
  if (!validation.valid) {
    return response.status(400).json({
      success: false,
      message: validation.errors[0],
      errors: validation.errors,
    });
  }

  try {
    await sendContactMessage(validation.data);
    return response.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact email failed:", error.message);
    return response.status(502).json({
      success: false,
      message: "We could not send your message right now. Please try again later.",
    });
  }
}

module.exports = { submitContact };
