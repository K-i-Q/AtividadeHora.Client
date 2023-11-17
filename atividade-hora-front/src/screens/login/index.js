import React, { useEffect, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { TextField, Box, Alert, AlertTitle, Button } from "@mui/material";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "@firebase/firestore";
import checkCollection from "../../repository";
import { signInWithPopup } from "@firebase/auth";
import { useNavigate } from "react-router";
import { auth, provider } from "../../components/google-sign-in/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAuth } from "../../components/auth";
import LoginIcon from "@mui/icons-material/Login";

function Login() {
  const navigate = useNavigate();
  const { setIsLogado } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [inputSenha, setInputSenha] = useState(false);
  const usuariosRef = collection(getFirestore(), "usuarios");
  const [usuarioSnapShot, setUsuarioSnapShot] = useState();
  const [nome, setNome] = useState("");
  const [exibirAlerta, setExibirAlerta] = useState(false);

  useEffect(() => {
    checkCollection(usuariosRef);
  });

  const imagemURL =
    "https://cdn.discordapp.com/attachments/933565701162168371/1175071148057309274/tenshiyou_Vantablack_emptiness_embodying_a_greek_god_erebos_wea_3ee7bcfd-e49b-49b9-94f0-c74772331ec0.png?ex=6569e549&is=65577049&hm=230b9aa24946a3477e6cde5e896c85834e00de2ff45e4a81bf5e94db14b1a0f1";

  const estiloTelaCheia = {
    margin: 0,
    overflow: "hidden", // Impede barras de rolagem
    position: "relative", // Permite que a posição absoluta seja relativa a este elemento
  };

  const estiloCamada = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Cor preta com 50% de opacidade
  };

  const estiloImagem = {
    height: "100vh",
    objectFit: "cover", // Garante que a imagem cubra todo o espaço
  };

  const getUsuario = async (email) => {
    const consulta = query(usuariosRef, where("email", "==", email));
    const snapShot = await getDocs(consulta);
    if (!snapShot.empty) {
      //exibe inpput de senha
      setUsuarioSnapShot(snapShot);
      setInputSenha(true);
    } else {
      //redireciona para cadastro
    }
  };

  const loginGoogle = async () => {
    try {
      const data = await signInWithPopup(auth, provider);
      localStorage.setItem("email", data.user.email);
      setIsLogado(true);
      navigate("/home", {
        state: {
          userName: data.user.displayName,
          userPhoto: data.user.photoURL,
          userEmail: data.user.email,
        },
      });
    } catch (error) {
      //exibe uma mensagem de falha no login
    }
  };

  const usuarioComCadastro = async () => {
    return !usuarioSnapShot.empty;
  };

  const guardarEmailNavegarHome = () => {
    localStorage.setItem("email", email);
    setIsLogado(true);
    navigate("/home", {
      state: {
        userName: nome,
        userPhoto: "",
        userEmail: email,
      },
    });
  };

  const loginEmailSenha = async () => {
    try {
      if (usuarioComCadastro()) {
        // eslint-disable-next-line array-callback-return
        usuarioSnapShot.docs.map((doc) => {
          const user = doc.data();
          if (user.senha !== senha) {
            console.error("Erro senha incorreta");
          } else {
            guardarEmailNavegarHome();
          }
        });
      } else {
        //exibe alerta de erro
        setExibirAlerta(true);
      }
    } catch (error) {
      //exibe uma mensagem de falha no login
      setIsLogado(false);
    }
  };

  const handleCloseAlert = () => {
    setExibirAlerta(false);
  };

  return (
    <>
      <div style={estiloTelaCheia}>
        <div style={estiloCamada}>
          {exibirAlerta && (
            <Alert severity="error" onClose={handleCloseAlert}>
              <AlertTitle>Usuário não encontrado</AlertTitle>
              Usuário não está cadastrado —{" "}
              <strong>confira as informações!</strong>
            </Alert>
          )}

          <Box
            sx={{
              width: "300px", // Defina a largura conforme necessário
              backgroundColor: "white",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ccc", // Borda para visualização
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {!inputSenha && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => loginGoogle()}
                  endIcon={<GoogleIcon />}
                  style={{ marginBottom: "30px" }}
                >
                  Entrar com Google
                </Button>
                <TextField
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  type="text"
                  variant="filled"
                />
                <Button
                  color="primary"
                  variant="contained"
                  style={{ margin: "20px" }}
                  onClick={() => getUsuario(email)}
                  endIcon={<ArrowForwardIosIcon />}
                >
                  Próximo
                </Button>
              </>
            )}
            {inputSenha && (
              <>
                <TextField
                  id="pass"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  label="Senha"
                  type="password"
                  variant="filled"
                />
                <Button
                  onClick={() => loginEmailSenha()}
                  endIcon={<LoginIcon />}
                  variant="contained"
                  style={{ margin: "20px" }}
                  color="primary"
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => setInputSenha(false)}
                  endIcon={<ArrowBackIcon />}
                  variant="outlined"
                  color="primary"
                >
                  Voltar
                </Button>
              </>
            )}
          </Box>
        </div>
        <img src={imagemURL} alt="Imagem de fundo" style={estiloImagem} />
      </div>
    </>
  );
}

export default Login;
