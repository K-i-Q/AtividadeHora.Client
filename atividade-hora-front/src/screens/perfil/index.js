import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router";

function Perfil() {
  const location = useLocation();
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
        />
      </Box>
    </>
  );
}

export default Perfil;
