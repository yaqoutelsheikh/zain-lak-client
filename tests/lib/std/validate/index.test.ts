import { describe, expect, it } from "vitest";
import { isEmail, isStrongPassword } from "@/lib/std/validate";

describe("validate", () => {

    it("checks email format", () => {

        expect(isEmail("user@example.com")).toBe(true);
        expect(isEmail("user")).toBe(false);

    });

    it("checks password strength", () => {

        expect(isStrongPassword("Secret123")).toBe(true);
        expect(isStrongPassword("secret123")).toBe(false);
        expect(isStrongPassword("Secret")).toBe(false);

    });

});
