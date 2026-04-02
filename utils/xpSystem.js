const NIVEIS = [
  { nivel: 1, xpMin: 0,   titulo: "Aprendiz" },
  { nivel: 2, xpMin: 80,  titulo: "Explorador" },
  { nivel: 3, xpMin: 180, titulo: "Programador" },
  { nivel: 4, xpMin: 320, titulo: "Mestre do Código" },
  { nivel: 5, xpMin: 500, titulo: "Guardião do Código" },
];

// Calcula o nível e título com base no XP total
export function calcularNivel(xpTotal) {
  let resultado = NIVEIS[0]; // começa no nível 1

  for (const n of NIVEIS) {
    if (xpTotal >= n.xpMin) {
      resultado = n;
    }
  }

  // Próximo nível (para a barra de progresso)
  const proximoNivel = NIVEIS.find(n => n.nivel === resultado.nivel + 1);

  return {
    nivel: resultado.nivel,
    titulo: resultado.titulo,
    xp: xpTotal,
    nivel_atual: resultado.xpMin,
    xpProximoNivel: proximoNivel ? proximoNivel.xpMin : null, // null = nível máximo
    nivelMaximo: !proximoNivel,
  };
}

// Calcula o XP ganho (reduzido se for repetição)
export function calcularXpGanho(xpBase, primeiraVez) {
  if (primeiraVez) return xpBase;
  return Math.floor(xpBase * 0.2); // 20% se repetir
}

export default { calcularNivel, calcularXpGanho };
