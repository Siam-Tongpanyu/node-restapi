const validator = require("../../../utils/validator");

describe("validator.errorHandle", () => {
  test("Should throw error", () => {
    expect(validator.errorHandle).toThrow();
  });
});
