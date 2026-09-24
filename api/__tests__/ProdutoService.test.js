const ProdutoService = require("../services/ProdutoService")

describe("ProdutoService - testes unitários", () => {
    let service;
    let mockRepository;

    beforeEach(() => {
        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn()
        };
    service = new ProdutoService(mockRepository)
    });
    
    describe("listar", () => {
        test("chama repository.findAll uma vez e retorna o resultado", () => {
            const produtos = [{ id: 1, nome: "Coxinha", preco: 5 }]
            mockRepository.findAll.mockReturnValue(produtos)

            const resultado = service.listar()

            expect(mockRepository.findAll).toHaveBeenCalledTimes(1) //Verifica se o mock foi chamado uma unica vez
            expect(resultado).toEqual(produtos)
        })

        //Exercicio: criar teste repository.findById
        test("chama repository.findById uma vez e retorna o resultado", () => {
            const produtos = [{ id: 1, nome: "Coxinha", preco: 5 }]
            mockRepository.findById.mockReturnValue(produtos)

            const resultado = service.buscarPorId()

            expect(mockRepository.findById).toHaveBeenCalledTimes(1) //Verifica se o mock foi chamado uma unica vez
            expect(resultado).toEqual(produtos)
        })
        
    })
});