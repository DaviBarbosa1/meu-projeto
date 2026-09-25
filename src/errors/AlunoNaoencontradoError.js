const ApiError = require('./ApiError');

class AlunoNaoEncontradoError extends ApiError {
  constructor(message = 'Aluno não encontrado') {
    super(message, 404);
  }
}

module.exports = AlunoNaoEncontradoError;