import request from "supertest";
import app from "../server.js";



describe("POST /login", () => {

    beforeEach(async () => {
        await request(app)
            .post("/register")
            .send({
                name: "Hamoudi1",
                email: "hamoudi_lazkani@hotmail.se",
                password: "correctpass",
                nickname: "hamo1"
            });
    });

    it("should login user with wrong email", async () => {
        const res = await request(app)
            .post("/login")
            .send({
                email: "hamoudi@test.com",
                password: "testing"
            })

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "Email not found");
    });

    it("should login user with wrong pass", async () => {
        const res = await request(app)
            .post("/login")
            .send({
                email: "hamoudi_lazkani@hotmail.se",
                password: "wrongpass"
            })

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "Wrong password");
    });

    it("should login user with correct credentials", async () => {
        const res = await request(app)
            .post("/login")
            .send({
                email: "hamoudi_lazkani@hotmail.se",
                password: "correctpass"
            })
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Authenticated");
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.headers['set-cookie'][0]).toContain("token=");

    });
});