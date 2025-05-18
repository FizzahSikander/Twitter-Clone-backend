import request from "supertest";
import app from "../server.js";



describe("POST /register", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/register")
            .send({
                name: "Hamoudi",
                email: "hamoudi_lazkani@hotmail.se",
                password: "testpass",
                nickname: "hamo1"
            })
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "User created");
    });

    it("should register a new user but email is taken", async () => {
        const res = await request(app)
            .post("/register")
            .send({
                name: "Hamoudi",
                email: "hamoudi_lazkani@hotmail.se",
                password: "testpass",
                nickname: "hamo2"
            })

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "Email already exists");
    });


    it("should register a new user but nickname is taken", async () => {
        const res = await request(app)
            .post("/register")
            .send({
                name: "Hamoudi",
                email: "hamoudi@test.com",
                password: "testpass",
                nickname: "hamo1"
            })

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "Nickname is taken");
    });
});