const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../../models/user");
const auth = require("../../utils/auth");
const timeOut = 30000;
let server;

describe("/api/auth", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await User.deleteMany({});
    server.close();
  });

  describe("POST /signup", () => {
    let signupObject = {
      email: "fortest01@fortest.com",
      name: "Monalisa",
      password: "monalisaForTest01"
    };

    const callApi = async () => {
      return await request(server)
        .post("/api/auth/signup")
        .send(signupObject)
        .set("Accept", "application/json");
    };
    afterEach(async () => {
      await User.deleteMany({});
    });

    test("Should return object userId and message with status 201", async () => {
      const res = await callApi();
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Create new user successful");
    }, timeOut);

    test("Should return status 422 error because invalid email", async () => {
      signupObject = {
        email: "fortest01@fortest.com",
        name: "Monalisa",
        password: "monalisaForTest01"
      };
      signupObject.email = "fortest01fortest.com";
      const res = await callApi();
      expect(res.status).toBe(422);
    }, timeOut);

    test("Should return status 422 error because invalid password", async () => {
      signupObject = {
        email: "fortest01@fortest.com",
        name: "Monalisa",
        password: "monalisaForTest01"
      };
      signupObject.password = "123";
      const res = await callApi();
      expect(res.status).toBe(422);
    }, timeOut);

    test("Should return status 422 error because empty name", async () => {
      signupObject = {
        email: "fortest01@fortest.com",
        name: "Monalisa",
        password: "monalisaForTest01"
      };
      signupObject.name = " ";
      const res = await callApi();
      expect(res.status).toBe(422);
    }, timeOut);

    test("Should return status 422 error because email already exit", async () => {
      const dupEmail = new User({
        email: "fortest01@fortest.com",
        name: "Monalisa123",
        password: "ForTest01monalisa"
      });
      await dupEmail.save();
      signupObject = {
        email: "fortest01@fortest.com",
        name: "Monalisa",
        password: "monalisaForTest01"
      };
      const res = await callApi();
      expect(res.status).toBe(422);
    }, timeOut);
  });

  describe('PUT /login', () => {
    let loginObject = {
      email: 'fortest01@fortest.com',
      password: 'monalisaForTest01'
    };
    let recUser = {
      email: "fortest01@fortest.com",
      name: "Monalisa",
      password: "monalisaForTest01"
    };
    const callApi = async () => {
      return await request(server)
        .put("/api/auth/login")
        .send(loginObject)
        .set("Accept", "application/json");
    };
    beforeEach(async () => {
      const hassPw = await auth.encrypt(recUser.password);
      recUser.password = hassPw;
      const oldUser = new User(recUser);
      await oldUser.save();
    });

    test('Should return object userId and token with status 200', async () => {
      const res = await callApi();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("userId");
      expect(res.body).toHaveProperty("token");
    }, timeOut);

    test('Should return status 401 error because email not exit', async () => {
      loginObject = {
        email: 'fortest01@fortest.com',
        password: 'monalisaForTest01'
      };
      loginObject.email = 'fortest02@fortest.com';
      const res = await callApi();
      expect(res.status).toBe(401);
    }, timeOut);

    test('Should return status 422 error because invalid email', async () => {
      loginObject = {
        email: 'fortest01@fortest.com',
        password: 'monalisaForTest01'
      };
      loginObject.email = 'fortest01@fortest';
      const res = await callApi();
      expect(res.status).toBe(422);
    }, timeOut);

    test('Should return status 422 error because invalid passsword', async () => {
      loginObject = {
        email: 'fortest01@fortest.com',
        password: 'monalisaForTest01'
      };
      loginObject.password = '1234';
      const res = await callApi();
      expect(res.status).toBe(422);
    }, timeOut);

    test('Should return status 401 error because wrong passsword', async () => {
      loginObject = {
        email: 'fortest01@fortest.com',
        password: 'monalisaForTest01'
      };
      loginObject.password = 'monalisaForTest11';
      const res = await callApi();
      expect(res.status).toBe(401);
    }, timeOut);
  });

  describe('GET /status', () => {
    let token;
    let header = {
      Accept: 'application/json',
      Authorization: "Bearer " + token
    }
    let recUser = {
      email: "fortest01@fortest.com",
      name: "Monalisa",
      password: "monalisaForTest01"
    };
    const callApi = async () => {
      return await request(server)
        .get("/api/auth/status")
        .set(header);
    };

    test('Should return status 200 with object status', async () => {
      const hassPw = await auth.encrypt(recUser.password);
      recUser.password = hassPw;
      const oldUser = new User(recUser);
      const oUserData = await oldUser.save();
      token = await auth.generateToken({
        email: oUserData.email,
        userId: oUserData._id.toString()
      });
      header = {
        Accept: 'application/json',
        Authorization: "Bearer " + token
      }
      const res = await callApi();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status");
    }, timeOut);

    test('Should return status 404 error because User not found', async () => {
      const hassPw = await auth.encrypt(recUser.password);
      recUser.password = hassPw;
      const oldUser = new User(recUser);
      const oUserData = await oldUser.save();
      token = await auth.generateToken({
        email: oUserData.email,
        userId: oUserData._id.toString()
      });
      const truncate = await User.deleteMany({});
      header = {
        Accept: 'application/json',
        Authorization: "Bearer " + token
      }
      const res = await callApi();
      expect(res.status).toBe(404);
    }, timeOut);

    test('Should return status 404 error because have wrong token', async () => {
      token = await auth.generateToken({
        email: 'fortest01@fortest.com',
        userId: '12345'
      });
      header = {
        Accept: 'application/json',
        Authorization: "Bearer " + token
      }
      const res = await callApi();
      expect(res.status).toBe(404);
    }, timeOut);

    test('Should return status 404 error because no token', async () => {
      token = '';
      header = {
        Accept: 'application/json',
        Authorization: "Bearer " + token
      }
      const res = await callApi();
      expect(res.status).toBe(404);
    }, timeOut);

    test('Should return status 401 error because not authenticated', async () => {
      header = {
        Accept: 'application/json'
      }
      const res = await callApi();
      expect(res.status).toBe(401);
    }, timeOut);
  });
});