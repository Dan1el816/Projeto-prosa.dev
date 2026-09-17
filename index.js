import express from "express";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views")
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const ano = new Date().getFullYear();
let posts = [];
let nextPostId = 1;

const mensagens = {
  publicado: "Post publicado com sucesso!",
  editado: "Post atualizado com sucesso!",
  excluido: "Post excluído com sucesso!"
};

const renderNotFound = (res) => res.status(404).render("error.ejs", {
  ano_atual: ano,
  titulo: "Post não encontrado",
  mensagem: "O post que você procura não existe ou já foi removido."
});

const validarPost = (titulo, conteudo) => {
  const tituloNormalizado = titulo?.trim();
  const conteudoNormalizado = conteudo?.trim();

  if (!tituloNormalizado || !conteudoNormalizado) {
    return "Título e conteúdo são obrigatórios.";
  }

  if (tituloNormalizado.length > 120) {
    return "O título deve ter no máximo 120 caracteres.";
  }

  if (conteudoNormalizado.length > 10000) {
    return "O conteúdo deve ter no máximo 10.000 caracteres.";
  }

  return null;
};

app.get("/", (req, res) => {
  res.render("index.ejs",{
    ano_atual:ano,
    posts,
    mensagem: mensagens[req.query.mensagem]
  });
});

app.get("/escrever", (req,res)=>{
  res.render("escrever.ejs",{
    ano_atual:ano
  })
});

app.get("/about", (req, res) => {
  res.render("about.ejs", {
    ano_atual: ano
  });
});

app.get("/post/:id", (req, res) => {
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return renderNotFound(res);
  }

  res.render("post.ejs", {
    ano_atual: ano,
    post
  });
});

app.post("/enviar", (req, res) => {
  const { titulo, conteudo } = req.body;
  const erro = validarPost(titulo, conteudo);

  if (erro) {
    return res.status(400).render("error.ejs", {
      ano_atual: ano,
      titulo: "Não foi possível publicar o post",
      mensagem: erro
    });
  }

  const newPost = {
    id: nextPostId++,
    titulo: titulo.trim(),
    conteudo: conteudo.trim(),
    createdAt: new Date(),
    updatedAt: null
  };

  posts.push(newPost);

  res.redirect("/?mensagem=publicado");
});

app.get("/editar/:id",(req,res)=>{
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return renderNotFound(res);
  }

  res.render("editar.ejs",{
    ano_atual:ano,
    post
  })
});
app.post("/excluir/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return renderNotFound(res);
  }

  posts = posts.filter((post) => post.id !== id);

  res.redirect("/?mensagem=excluido");
});
app.post("/editar/:id", (req, res) => {
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return renderNotFound(res);
  }

  const { titulo, conteudo } = req.body;
  const erro = validarPost(titulo, conteudo);

  if (erro) {
    return res.status(400).render("error.ejs", {
      ano_atual: ano,
      titulo: "Não foi possível atualizar o post",
      mensagem: erro
    });
  }

  post.titulo = titulo.trim();
  post.conteudo = conteudo.trim();
  post.updatedAt = new Date();

  res.redirect("/?mensagem=editado");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});