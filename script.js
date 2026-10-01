// Arquivo de configuração e processamento do Partido PDisney

// Identificação fixa deste partido (definida pelo sorteio da disciplina)
const PARTIDO = "PDisney";
const NUMERO_PARTIDO = "91";

// Tamanho total de dígitos exigido para o número do candidato, por cargo.
// Ex: Senador(a) = 3 dígitos -> 2 do partido (91) + 1 dígito do candidato.
const TAMANHO_NUMERO_POR_CARGO = {
  "Presidente": 2,
  "Governador(a)": 2,
  "Senador(a)": 3,
  "Deputado(a) Federal": 4,
  "Deputado(a) Estadual": 5
};

// Estrutura em memória com os filiados do partido (carregada do JSON)
const candidatos = [];

async function carregarCandidatos() {
  const resposta = await fetch("candidatos.json");

  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar candidatos.json (status ${resposta.status})`);
  }

  const dados = await resposta.json();
  const filiados = dados[PARTIDO] || [];

  // Reinicia o array (evita duplicar em caso de nova chamada)
  candidatos.length = 0;

  filiados.forEach((filiado) => {
    candidatos.push({
      nome: filiado.nome,
      foto: filiado.foto,
      cargo: null,   // só é preenchido quando o candidato é registrado
      numero: null   // só é preenchido quando o candidato é registrado
    });
  });

  return candidatos;
}

function validarNumeroCandidato(numero, cargo) {
  // 1. Deve conter apenas dígitos
  if (!numero || !/^\d+$/.test(numero)) {
    return { valido: false, mensagem: "O número deve conter apenas dígitos." };
  }

  // 2. Cargo precisa ser um dos cargos conhecidos
  const tamanhoEsperado = TAMANHO_NUMERO_POR_CARGO[cargo];
  if (!tamanhoEsperado) {
    return { valido: false, mensagem: "Selecione um cargo válido antes de validar o número." };
  }

  // 3. O número deve iniciar com o número do partido
  if (!numero.startsWith(NUMERO_PARTIDO)) {
    return {
      valido: false,
      mensagem: `O número deve iniciar com ${NUMERO_PARTIDO} (número do ${PARTIDO}).`
    };
  }

  // 4. O número deve ter exatamente o tamanho exigido pelo cargo
  if (numero.length !== tamanhoEsperado) {
    return {
      valido: false,
      mensagem: `Para ${cargo}, o número deve ter ${tamanhoEsperado} dígitos (ex: ${NUMERO_PARTIDO}${"X".repeat(tamanhoEsperado - NUMERO_PARTIDO.length)}).`
    };
  }

  return { valido: true, mensagem: "" };
}
