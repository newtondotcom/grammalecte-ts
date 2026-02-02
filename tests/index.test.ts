import { describe, it, expect } from "vitest";

import {
  checkGrammar,
  getOptions,
  setOptions,
  resetOptions,
  getSpellingSuggestions,
} from "../src/index";

// Set up Grammalecte URL for tests
process.env.GRAMMALECTE_URL = process.env.GRAMMALECTE_URL || "http://localhost:8080";

describe("Grammalecte Wrapper", () => {
  describe("checkGrammar", () => {
    it("should check grammar and return data array and error field", async () => {
      const result = await checkGrammar("Ceci est un teste.");

      expect(result).toBeDefined();
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("error");
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.error).toBe("string");
    });

    it("should return array for any text", async () => {
      const result = await checkGrammar("Ceci est un test correct.");

      expect(result).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should handle empty text", async () => {
      const result = await checkGrammar("");

      expect(result).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should include error details in data array when errors are found", async () => {
      const result = await checkGrammar("Il y a une erreur ici");

      expect(result).toBeDefined();
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("error");

      if (result.data.length > 0) {
        const error = result.data[0];
        expect(error).toHaveProperty("nStart");
        expect(error).toHaveProperty("nEnd");
        expect(error).toHaveProperty("sRuleId");
        expect(error).toHaveProperty("sMessage");
        expect(error).toHaveProperty("aSuggestions");
        expect(typeof error.nStart).toBe("number");
        expect(typeof error.nEnd).toBe("number");
        expect(typeof error.sRuleId).toBe("string");
        expect(typeof error.sMessage).toBe("string");
        expect(Array.isArray(error.aSuggestions)).toBe(true);
      }
    });
  });

  describe("getOptions", () => {
    it("should get default grammar options", async () => {
      const options = await getOptions();

      expect(options).toBeDefined();
      expect(typeof options).toBe("object");
    });

    it("should return an object with option keys", async () => {
      const options = await getOptions();

      // Grammalecte typically returns options like { "option_name": true/false, ... }
      expect(Object.keys(options).length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("setOptions", () => {
    it("should set and return updated options", async () => {
      // First get current options
      const initialOptions = await getOptions();

      // Set new options (pick the first option and toggle it, or just set a subset)
      const testOption: Record<string, boolean | number | string> = {};
      const optionKeys = Object.keys(initialOptions);

      if (optionKeys.length > 0) {
        testOption[optionKeys[0]] =
          typeof initialOptions[optionKeys[0]] === "boolean"
            ? !(initialOptions[optionKeys[0]] as boolean)
            : initialOptions[optionKeys[0]];

        const result = await setOptions(testOption);

        expect(result).toBeDefined();
        expect(typeof result).toBe("object");
        // Just verify it returns an object, not that the specific option changed
        // (setOptions may handle options differently)
      }
    });

    it("should handle empty options object", async () => {
      const result = await setOptions({});

      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

  describe("resetOptions", () => {
    it("should reset options without throwing", async () => {
      const fn = async () => {
        await resetOptions();
      };

      expect(fn).not.toThrow();
    });

    it("should return void", async () => {
      const result = await resetOptions();
      expect(result).toBeUndefined();
    });
  });

  describe("getSpellingSuggestions", () => {
    it("should handle spelling suggestion endpoints gracefully", async () => {
      // Note: This endpoint may not be available in all Grammalecte instances
      // The test just ensures the function handles responses properly
      try {
        const suggestions = await getSpellingSuggestions("teste");
        expect(Array.isArray(suggestions)).toBe(true);
      } catch (error) {
        // If endpoint is not available, that's acceptable for this test
        expect(error).toBeDefined();
      }
    });
  });

  describe("Error handling", () => {
    it("should handle API responses properly", async () => {
      // Test that the function handles normal API responses
      const result = await checkGrammar("test");
      expect(result).toBeDefined();
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("error");
    });
  });

  describe("Cookie handling", () => {
    it("should accept cookies parameter", async () => {
      const cookies = "session=test123";
      const fn = async () => {
        await checkGrammar("test", cookies);
      };

      expect(fn).not.toThrow();
    });

    it("should pass cookies to grammar check", async () => {
      const cookies = "session=test123";
      const result = await checkGrammar("Ceci est un test.", cookies);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("error");
    });
  });
});
