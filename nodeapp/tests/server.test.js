const request = require("supertest");
const app = require("../index");
const ideaController = require("../controllers/ideaController");

beforeEach(() => {
  ideaController._resetData();
});

describe("Idea API Tests", () => {
  // 1. Get empty ideas
  test("GET /api/ideas should return empty array", async () => {
    const res = await request(app).get("/api/ideas");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  // 2. Add valid idea
  test("POST /api/ideas should add idea", async () => {
    const res = await request(app).post("/api/ideas").send({
      ideaTitle: "Idea One",
      description: "Desc One",
      targetMarket: "Market A",
      estimatedBudget: 10000
    });
    expect(res.status).toBe(200);
    expect(res.body.ideaTitle).toBe("Idea One");
    expect(res.body.id).toBeDefined();
  });

  // 3. Add invalid idea
  test("POST /api/ideas with missing fields should return 400", async () => {
    const res = await request(app).post("/api/ideas").send({ ideaTitle: "Bad" });
    expect(res.status).toBe(400);
  });

  // 4. Get ideas after adding
  test("GET /api/ideas should list added ideas", async () => {
    await request(app).post("/api/ideas").send({
      ideaTitle: "Idea Two",
      description: "Desc Two",
      targetMarket: "Market B",
      estimatedBudget: 5000
    });
    const res = await request(app).get("/api/ideas");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].ideaTitle).toBe("Idea Two");
  });

  // 5. Delete existing idea
  test("DELETE /api/ideas/:id should delete idea", async () => {
    const addRes = await request(app).post("/api/ideas").send({
      ideaTitle: "Idea Delete",
      description: "Desc",
      targetMarket: "Market C",
      estimatedBudget: 2000
    });
    const id = addRes.body.id;
    const delRes = await request(app).delete(`/api/ideas/${id}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.message).toBe("Idea deleted");
  });

  // 6. Delete non-existing idea
  test("DELETE /api/ideas/:id should return 404 if not found", async () => {
    const res = await request(app).delete("/api/ideas/999");
    expect(res.status).toBe(404);
  });

  // 7. Get validated ideas
  test("GET /api/ideas/validated should return validation results", async () => {
    await request(app).post("/api/ideas").send({
      ideaTitle: "Idea Valid",
      description: "Desc",
      targetMarket: "Market D",
      estimatedBudget: 15000
    });
    const res = await request(app).get("/api/ideas/validated");
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty("averageScore");
  });

  // 8. Validation score high vs low
  test("GET /api/ideas/validated should give different scores", async () => {
    await request(app).post("/api/ideas").send({
      ideaTitle: "Small Budget",
      description: "Desc",
      targetMarket: "Market E",
      estimatedBudget: 5000
    });
    await request(app).post("/api/ideas").send({
      ideaTitle: "Big Budget",
      description: "Desc",
      targetMarket: "Market F",
      estimatedBudget: 30000
    });
    const res = await request(app).get("/api/ideas/validated");
    expect(res.body[0].averageScore).not.toBe(res.body[1].averageScore);
  });

  // 9. Invalid route
  test("GET /wrong should return 404", async () => {
    const res = await request(app).get("/wrong");
    expect(res.status).toBe(404);
  });

  // 10. Multiple ideas list size
  test("GET /api/ideas should return multiple ideas", async () => {
    await request(app).post("/api/ideas").send({
      ideaTitle: "Idea A",
      description: "Desc",
      targetMarket: "Market G",
      estimatedBudget: 4000
    });
    await request(app).post("/api/ideas").send({
      ideaTitle: "Idea B",
      description: "Desc",
      targetMarket: "Market H",
      estimatedBudget: 6000
    });
    const res = await request(app).get("/api/ideas");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
