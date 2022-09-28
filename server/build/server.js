import express from "express";
const app = express();
app.get("/ads", (req, res) => {
    return res.json([
        { id: 1, ads: "Anuncio 01" },
        { id: 2, ads: "Anuncio 02" },
        { id: 3, ads: "Anuncio 03" },
    ]);
});
/** //*.get()
 * O primeiro parâmetro deve ser a 'rota' (www.api.com/rota) da aplicação
 * O segundo parâmetro deve ser uma função a ser executada coso o usuário acesse essa roa
 * 	Esse segundo parâmetro aceita outros dois parâmetros: //* request response
 * 		//* request
 * 		faz a requisição e captura as informações que a rota traz
 *
 * 		//* response
 * 		envia para a rota alguma informação
 */
app.listen(2424);
