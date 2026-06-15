import { describe, expect, it } from "vitest";
import { login, register, reset } from "@/features/auth/schema";

describe("auth schema", () => {

    it("accepts login credentials", () => {

        expect(login.safeParse({ email: "user@example.com", password: "secret" }).success).toBe(true);

    });

    it("rejects invalid register input", () => {

        const result = register.safeParse({
            name: "User",
            phone: "+966500000000",
            email: "user",
            password: "secret",
            confirmPassword: "different",
            terms: false,
        });

        expect(result.success).toBe(false);

    });

    it("requires matching reset passwords", () => {

        const result = reset.safeParse({
            code: "123456",
            password: "Secret123",
            confirmPassword: "Secret124",
        });

        expect(result.success).toBe(false);

    });

});
