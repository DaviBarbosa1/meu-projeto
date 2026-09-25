const alunoService = require("../services/AlunoService");

class AlunoController {

    async findMany(request, response) {
        try {
            let { page, pageSize, orderBy, order, tipoordenacao } = request.query;

            page = Number(page) || 1;
            pageSize = Number(pageSize) || 10;
            const direcaoOrdenacao = order || tipoordenacao || 'asc';

            const resultado = await alunoService.findMany(page, pageSize, orderBy, direcaoOrdenacao);

            return response.status(200).json(resultado);
        } catch (error) {
            return response.status(error.statusCode || 500).json({ error: error.message });
        }


    }

    async create(request, response) {
        try {
            const aluno = await alunoService.create(request.body);
            return response.status(201).json({ aluno });
        } catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }

}

module.exports = new AlunoController();