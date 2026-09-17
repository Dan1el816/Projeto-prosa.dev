import express from "express";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views")
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const ano = new Date().getFullYear();
let posts=[];

app.get("/", (req, res) => {
  res.render("index.ejs",{
    ano_atual:ano,
    posts:posts
  });
});

app.get("/escrever", (req,res)=>{
  res.render("escrever.ejs",{
    ano_atual:ano
  })
});

app.get("/post/:id", (req, res) => {
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return res.status(404).send("Post não encontrado");
  }

  res.render("post.ejs", {
    ano_atual: ano,
    post
  });
});

app.post("/enviar", (req, res) => {
  const { titulo, conteudo } = req.body;

  console.log("Título:", titulo);
  console.log("Conteúdo:", conteudo);


  const newPost = {
    id: posts.length + 1,
    titulo,
    conteudo
  };

    posts.push(newPost);

  res.redirect("/");
});

app.get("/editar/:id",(req,res)=>{
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return res.status(404).send("Post não encontrado");
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
    return res.status(404).send("Post não encontrado");
  }

  posts = posts.filter((post) => post.id !== id);

  res.redirect("/");
});
app.post("/editar/:id", (req, res) => {
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return res.status(404).send("Post não encontrado");
  }

  post.titulo = req.body.titulo;
  post.conteudo = req.body.conteudo;

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});