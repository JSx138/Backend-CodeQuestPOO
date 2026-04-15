const NIVEIS = [
  { nivel: 1, xpMin: 0, titulo: "Aprendiz" },
  { nivel: 2, xpMin: 80, titulo: "Explorador" },
  { nivel: 3, xpMin: 180, titulo: "Programador" },
  { nivel: 4, xpMin: 320, titulo: "Mestre do Código" },
  { nivel: 5, xpMin: 500, titulo: "Guardião do Código" },
  { nivel: 6, xpMin: 750, titulo: "Arquiteto de Sistemas" },
  { nivel: 7, xpMin: 1100, titulo: "Lenda do Código" },
]

// 🔥 FUNÇÃO PRINCIPAL: nível completo
export function calcularNivel(xpTotal) {
  let nivelAtual = NIVEIS[0]

  for (const nivel of NIVEIS) {
    if (xpTotal >= nivel.xpMin) {
      nivelAtual = nivel
    }
  }

  const proximoNivel = NIVEIS.find(
    n => n.nivel === nivelAtual.nivel + 1
  )

  const xpProximoNivel = proximoNivel ? proximoNivel.xpMin : null

  const nivelMaximo = xpProximoNivel === null

  const xpAtualNivel = nivelAtual.xpMin

  const progresso =
    xpProximoNivel !== null
      ? Math.min(
          100,
          ((xpTotal - xpAtualNivel) /
            (xpProximoNivel - xpAtualNivel)) *
            100
        )
      : 100

  return {
    nivel: nivelAtual.nivel,
    titulo: nivelAtual.titulo,

    xpTotal,
    xpAtualNivel,
    xpProximoNivel,

    nivelMaximo,

    progresso, // % da barra XP
  }
}

// 🔥 XP ganho com regra de repetição
export function calcularXpGanho(xpBase, primeiraVez) {
  if (primeiraVez) return xpBase
  return Math.floor(xpBase * 0.2)
}

// 🔥 helper direto (UX)
export function formatarNivelInfo(xpTotal) {
  const nivel = calcularNivel(xpTotal)

  return {
    textoNivel: `Nível ${nivel.nivel} - ${nivel.titulo}`,
    isMaxLevel: nivel.nivelMaximo,
    xpProximoTexto: nivel.nivelMaximo
      ? "NÍVEL MÁXIMO 👑"
      : `${nivel.xpProximoNivel - xpTotal} XP para o próximo nível`,
  }
}

export default {
  calcularNivel,
  calcularXpGanho,
  formatarNivelInfo,
}