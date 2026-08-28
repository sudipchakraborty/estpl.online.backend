const assert = require("node:assert/strict");
const test = require("node:test");
const { validateContact } = require("./contactValidation");

test("validateContact normalizes a valid contact request", () => {
  const result = validateContact({
    name: "  Jane Doe  ",
    email: " JANE@EXAMPLE.COM ",
    company: " Example Ltd ",
    subject: " Visual AI enquiry ",
    message: " Please contact me. ",
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.data, {
    name: "Jane Doe",
    email: "jane@example.com",
    company: "Example Ltd",
    subject: "Visual AI enquiry",
    message: "Please contact me.",
  });
});

test("validateContact rejects missing and invalid required values", () => {
  const result = validateContact({ email: "invalid" });

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 4);
});
