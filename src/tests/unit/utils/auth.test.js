const auth = require("../../../utils/auth");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../../config/vars");
const bcrypt = require("bcrypt");

describe("auth.generateToken", () => {
  test("Should return valid JWT", async () => {
    const token = await auth.generateToken({
      userId: "12345",
      email: "xxx@test.com"
    });
    const decode = jwt.verify(token, jwtSecret);
    expect(decode).toMatchObject({ userId: "12345", email: "xxx@test.com" });
  });
});

describe("auth.encrypt", () => {
  test("Should return encrypt hash", async () => {
    const hash = await auth.encrypt("This is secret text");
    const hashCheck = await bcrypt.compare("This is secret text", hash);
    expect(hashCheck).toBeTruthy();
  });
});

describe("auth.verifyToken", () => {
  test("Should verify headerAuth (Authorization: Bearer <token>)", async () => {
    const token = await auth.generateToken({
      userId: "12345",
      email: "xxx@test.com"
    });
    const headerAuth = { Authorization: "Bearer " + token };
    const decode = await auth.verifyToken(headerAuth.Authorization);
    expect(decode).toMatchObject({ userId: "12345", email: "xxx@test.com" });
  });

  test("Should be reject if not input correct headerAuth", async () => {
    const token = await auth.generateToken({
      userId: "12345",
      email: "xxx@test.com"
    });
    await expect(auth.verifyToken(token)).rejects.toMatch(
      "Your header authorization is incorrect!!"
    );
  });

  test("Should be reject if not correct token in headerAuth", async () => {
    const fakeToken = await jwt.sign(
      { userId: "12345", email: "xxx@test.com" },
      "fakeJWTSecreat"
    );
    const fakeHeaderAuth = { Authorization: "Bearer " + fakeToken };
    await expect(
      auth.verifyToken(fakeHeaderAuth.Authorization)
    ).rejects.toMatch("Your authorization is incorrect!!");
  });
});
