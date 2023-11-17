import { doc, updateDoc } from "@firebase/firestore";
import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { firestore } from "../../components/google-sign-in/config";

function Perfil() {
  const location = useLocation();
  const originalName = location.state.userName;
  const originalPhoto = location.state.userPhoto;
  const userId = location.state.userId;
  const [name, setName] = useState(location.state.userName);
  const [photo, setPhoto] = useState(location.state.userPhoto);
  const [email, setEmail] = useState(location.state.userEmail);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPhoto(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Verifica se houve alteração no nome ou na foto
    if (name !== originalName || photo !== originalPhoto) {
      // Cria uma referência para o documento do usuário no Firestore
      debugger
      const userDocRef = doc(firestore, "usuarios", userId);

      console.log("Firestore object:", firestore);
      console.log("User ID:", userId);
      console.log("User Doc Ref:", userDocRef);
      // Atualiza os campos no Firestore
      await updateDoc(userDocRef, {
        nome: name
      });

      console.log("Alterações salvas no Firestore.");
    } else {
      console.log("Nenhuma alteração para salvar.");
    }
  };

  return (
    <>
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
        <label htmlFor="file-upload">
          <img
            src={photo}
            alt="Descrição da imagem"
            style={{ cursor: "pointer", width: "100%", marginBottom: "20px" }}
          />
        </label>

        <input
          type="file"
          id="file-upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <TextField
          id="nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Nome"
          type="text"
          style={{ width: "100%", margin: "20px" }}
          variant="filled"
        />
        <TextField
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          style={{ width: "100%" }}
          type="text"
          variant="filled"
          disabled
        />
        <Button
          variant="contained"
          style={{ margin: "20px" }}
          onClick={handleSave}
        >
          Salvar
        </Button>
      </Box>
    </>
  );
}

export default Perfil;
