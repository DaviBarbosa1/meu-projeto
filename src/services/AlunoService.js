const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");


class AlunoService {

    async findMany(page, pageSize, orderBy = 'id', order = 'asc') {
        const direcao = String(order).toLowerCase() === 'desc' ? 'desc' : 'asc';
        const camposValidos = ['id', 'nome', 'email', 'createdAt'];
        const campoOrdenacao = camposValidos.includes(orderBy) ? orderBy : 'id';

        const alunos = await prisma.aluno.findMany({
            skip: (page - 1) * pageSize,
            take: Number(pageSize),
            orderBy: {
                [campoOrdenacao]: direcao
            }
        });

        const total = await prisma.aluno.count();

        return { alunos, total };
    }

    async findUnique(id) {
        const alunoId = Number(id);

        if (isNaN(alunoId)) {
            throw new AlunoNaoEncontradoError('ID inválido');
        }

        const aluno = await prisma.aluno.findUnique({
            where: { id: alunoId }
        });

        if (!aluno) {
            throw new AlunoNaoEncontradoError();
        }

        return aluno;
    }

    async update(id, data) {
        const alunoId = Number(id);
        const { nome, email } = data;

        if (!nome && !email) {
            throw new ApiError('Informe ao menos um campo (nome ou email) para atualizar', 400);
        }

        const alunoExistente = await prisma.aluno.findUnique({ where: { id: alunoId } });
        if (!alunoExistente) {
            throw new AlunoNaoEncontradoError();
        }

        if (email && email !== alunoExistente.email) {
            const emailEmUso = await prisma.aluno.findUnique({ where: { email } });
            if (emailEmUso) {
                throw new ApiError('O e-mail informado já está em uso por outro aluno', 400);
            }
        }

    }

    async remove(id) {
        const alunoId = Number(id);

        const alunoExistente = await prisma.aluno.findUnique({ where: { id: alunoId } });
        if (!alunoExistente) {
            throw new AlunoNaoEncontradoError();
        }

        await prisma.aluno.delete({
            where: { id: alunoId }
        });
    }

    async create(aluno) {
        const { nome, email } = aluno;
        if (!nome || !email) {
            throw new AlunoInvalidoError();
        }

        const novoAluno = await prisma.aluno.create({ data: aluno });

        return novoAluno;
    }
}

module.exports = {
    findMany,
    findUnique,
    update,
    remove
};

module.exports = new AlunoService();