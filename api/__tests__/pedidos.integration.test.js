const request = require('supertest');
const createApp = require('../app');

describe('API /pedidos (integracao com supertest)', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /pedidos', () => {
    test('retorna 200 e um array com os pedidos iniciais', async () => {
      const res = await request(app).get('/pedidos');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /pedidos/:id', () => {
    test('retorna 200 e o pedido quando o id existe', async () => {
      const res = await request(app).get('/pedidos/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('cliente', 'Ana Souza');
    });

    test('retorna 404 com mensagem de erro quando o pedido nao existe', async () => {
      const res = await request(app).get('/pedidos/90');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });
  });

  describe('POST /pedidos', () => {
    test('retorna 201 e o pedido criado com o total calculado corretamente', async () => {
      const res = await request(app)
        .post('/pedidos')
        .send({
          cliente: 'Maria Oliveira',
          itens: [
            { nome: 'Coxinha', precoUnitario: 5, quantidade: 2 },
            { nome: 'Refrigerante', precoUnitario: 4, quantidade: 3 },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('total', 22);
      expect(res.body).toHaveProperty('status', 'pendente');
    });

    test('retorna 400 quando o cliente esta faltando', async () => {
      const res = await request(app)
        .post('/pedidos')
        .send({
          cliente: '',
          itens: [{ nome: 'Coxinha', precoUnitario: 5, quantidade: 2 }],
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 400 quando a lista de itens esta vazia', async () => {
      const res = await request(app)
        .post('/pedidos')
        .send({
          cliente: 'Maria Oliveira',
          itens: [],
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 400 quando algum item tem preco ou quantidade invalidos', async () => {
      const res = await request(app)
        .post('/pedidos')
        .send({
          cliente: 'Maria Oliveira',
          itens: [{ nome: 'Coxinha', precoUnitario: 0, quantidade: 2 }],
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });
  });

  describe('PATCH /pedidos/:id/status', () => {
    test('retorna 200 e o pedido com o novo status quando o id existe', async () => {
      const res = await request(app)
        .patch('/pedidos/1/status')
        .send({ status: 'pago' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'pago');
    });

    test('retorna 404 quando o pedido nao existe', async () => {
      const res = await request(app)
        .patch('/pedidos/90/status')
        .send({ status: 'pago' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 400 quando o status enviado e invalido', async () => {
      const res = await request(app)
        .patch('/pedidos/1/status')
        .send({ status: 'entregue' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro', 'Status invalido');
    });

    test('retorna 400 ao tentar alterar o status de um pedido ja cancelado', async () => {
      const cancelamento = await request(app)
        .patch('/pedidos/1/status')
        .send({ status: 'cancelado' });
      expect(cancelamento.status).toBe(200);

      const res = await request(app)
        .patch('/pedidos/1/status')
        .send({ status: 'pago' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro', 'Pedido cancelado nao pode ser alterado');
    });
  });

  describe('DELETE /pedidos/:id', () => {
    test('retorna 204 quando o pedido e removido com sucesso', async () => {
      const res = await request(app).delete('/pedidos/1');

      expect(res.status).toBe(204);
    });

    test('pedido removido nao aparece mais na listagem', async () => {
      const resDelete = await request(app).delete('/pedidos/1');
      expect(resDelete.status).toBe(204);

      const resGet = await request(app).get('/pedidos/1');
      expect(resGet.status).toBe(404);
    });

    test('retorna 404 quando o pedido nao existe', async () => {
      const res = await request(app).delete('/pedidos/90');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });
  });
});
