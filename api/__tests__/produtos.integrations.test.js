const request = require("supertest")
const createApp = require("../app");


describe('API /produtos - testes de integração', () => {
    let app

    beforeEach(() => {
        app = createApp()
    })
    
    describe('GET /produtos', () => {
        test('Retorna 200 e um array com os produtos iniciais', async () => {
            const res = await request(app).get("/produtos")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(3)
        })
    })

    describe('GET /produtos', () => {
        //Exercicio: criar teste GET por id
        test('Retorna 200 e o produto com id igual 1', async () => {
            const res = await request(app).get("/produtos/1")

            expect(res.status).toBe(200)
            expect(res.body.id).toBe(1)
            expect(res.body.nome).toBe('Coxinha')
        })
    })
});