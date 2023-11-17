import React from "react";

function SignIn() {
    const imagemURL = "https://cdn.discordapp.com/attachments/933565701162168371/1175071148057309274/tenshiyou_Vantablack_emptiness_embodying_a_greek_god_erebos_wea_3ee7bcfd-e49b-49b9-94f0-c74772331ec0.png?ex=6569e549&is=65577049&hm=230b9aa24946a3477e6cde5e896c85834e00de2ff45e4a81bf5e94db14b1a0f1";

    const estiloTelaCheia = {
      margin: 0,
      overflow: 'hidden', // Impede barras de rolagem
      position: 'relative', // Permite que a posição absoluta seja relativa a este elemento
    };
  
    const estiloCamada = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor preta com 50% de opacidade
    };
  
    const estiloImagem = {
      width: '100%',
      height: '100%',
      objectFit: 'cover', // Garante que a imagem cubra todo o espaço
    };

  return (
    <>
      <div style={estiloTelaCheia}>
      <div style={estiloCamada}></div>
      <img src={imagemURL} alt="Imagem de fundo" style={estiloImagem} />
    </div>
    </>
  );
}

export default SignIn;
