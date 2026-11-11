import { describe, expect, it } from "vitest";

import { validateContact, validateEmail } from "@/lib/validation";

const valid = { name: "Ada", email: "ada@example.com", phone: "", message: "Hello there, WLI." };

describe("contact form rules", () => {
  it("requires name, email and message", () => {
    const errors = validateContact({ name: " ", email: "", phone: "", message: "" });
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
  });

  it("treats phone as optional", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("rejects a malformed phone when one is given", () => {
    expect(validateContact({ ...valid, phone: "call me" }).phone).toBeDefined();
  });

  it("rejects messages shorter than 10 characters", () => {
    expect(validateContact({ ...valid, message: "Hi" }).message).toBeDefined();
  });
});

describe("email rule", () => {
  it("rejects an address without a domain", () => {
    expect(validateEmail("ada@")).toBeDefined();
  });

  it("accepts a normal address", () => {
    expect(validateEmail("ada@example.com")).toBeUndefined();
  });
});
