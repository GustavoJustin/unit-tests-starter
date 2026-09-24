const request = require('supertest');
const createApp = require('../app');
const expectCookies = require('supertest/lib/cookies');

// Teste de integracao: testa a API de ponta a ponta via HTTP real.
// Cada teste recebe uma app nova (factory), garantindo estado isolado.
//
// Abaixo ha 1 teste pronto (GET /clientes) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-02-CLIENTES.md.

describe('API /clientes (integracao com supertest)', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /clientes', () => {
    test('retorna 200 e um array com os clientes iniciais', async () => {
      const res = await request(app).get('/clientes');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });



  describe('GET /clientes/:id', () => {
    test('retorna 200 e o cliente quando o id existe', async () => {
      const res = await request(app).get('/clientes/1')

      expect(res.status).toBe(200)
    });

    test('retorna 404 com mensagem de erro quando o cliente nao existe', async () => {
      const res = await request(app).get('/clientes/90')

      expect(res.status).toBe(404)
      expect(res.body).toHaveProperty('erro')
    });
  });



  describe('POST /clientes', () => {
    test('retorna 201 e o cliente criado com id gerado', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({
          nome: 'Fulano de Tal',
          email: 'novo_cliente@email.com'
        })
      expect(res.status).toBe(201)
    });

    test('retorna 400 quando o nome esta faltando', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({
          nome: '',
          email: 'novo_cliente@email.com'
        })
      expect(res.status).toBe(400)
    });

    test('retorna 400 quando o email esta faltando', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({
          nome: 'Fulano de Tal',
          email: ''
        })
      expect(res.status).toBe(400)
    });

    test('retorna 400 quando o email ja esta cadastrado', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({
          nome: 'Fulano de Tal',
          email: 'novo_cliente@email.com'
        })
      expect(res.status).toBe(201)

      const res2 = await request(app)
        .post('/clientes')
        .send({
          nome: 'Fulano de ser',
          email: 'novo_cliente@email.com'
        })
      expect(res2.status).toBe(400)
    });


    test('cliente criado aparece em GET /clientes', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({
          nome: 'Fulano de ser',
          email: 'novo_cliente@email.com'
        })
      expect(res.status).toBe(201)

      const res2 = await request(app).get('/clientes/90')
      expect(res2.status).toBe(404)
    });
  });



  describe('PUT /clientes/:id', () => {
    test('retorna 200 e o cliente atualizado quando o id existe', async () => {
      const res = await request(app)
        .put('/clientes/1')
        .send({
          nome: 'Fulano atualizado',
          email: 'novo_cliente-atualizado@email.com'
        })
      expect(res.status).toBe(200)
    });

    test('retorna 404 quando o cliente nao existe', async () => {
      const res = await request(app).get('/clientes/90')

      expect(res.status).toBe(404)
    });

    test('retorna 400 quando o novo email ja pertence a outro cliente', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({
          nome: 'Fulano de Tal',
          email: 'novo_cliente@email.com'
        })
      expect(res.status).toBe(201)

      const resPut = await request(app)
        .post('/clientes')
        .send({
          nome: 'Fulano de ser',
          email: 'novo_cliente@email.com'
        })
      expect(resPut.status).toBe(400)

    });
  });



  describe('DELETE /clientes/:id', () => {
    test('retorna 204 quando o cliente e removido com sucesso', async () => {
      const res = await request(app).delete('/clientes/1')

      expect(res.status).toBe(204)
    });

    test('cliente removido nao aparece mais na listagem', async () => {
      const res = await request(app).delete('/clientes/1')
      expect(res.status).toBe(204)

      const resGet = await request(app).get('/clientes/1')
      expect(resGet.status).toBe(404)
    });

    test('retorna 404 quando o cliente nao existe', async () => {
      const res = await request(app).delete('/clientes/90')

      expect(res.status).toBe(404)
    });
  });
});
