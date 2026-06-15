import { afterEach, describe, expect, it } from "vitest";
import { clear, get, set } from "@/lib/auth/token";

afterEach(() => {

    clear();

});

describe("auth token", () => {

    it("stores the token in memory", () => {

        set("secret");

        expect(get()).toBe("secret");

    });

    it("clears the token", () => {

        set("secret");
        clear();

        expect(get()).toBeNull();

    });

});
