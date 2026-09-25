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



    async create(aluno) {
        const { nome, email } = aluno;
        if (!nome || !email) {
            throw new AlunoInvalidoError();
        }

        const novoAluno = await prisma.aluno.create({ data: aluno });

        return novoAluno;
    }
}

module.exports = new AlunoService();