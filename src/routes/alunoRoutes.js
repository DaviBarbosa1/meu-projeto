const express = require("express");
const alunoController = require("../controllers/AlunoController");
const validarAluno = require("../middlewares/validarAluno");
const router = express.Router();



router.get("/", (request, response, next)=>{
    console.log("Esse middleware está executando antes do controller!");
    next();
}, alunoController.findMany);
router.post("/", validarAluno, alunoController.create);
router.get('/alunos', alunoController.findMany);
router.get('/alunos/:id', alunoController.findUnique);
router.put('/alunos/:id', alunoController.update);
router.delete('/alunos/:id', alunoController.remove)

module.exports = router;