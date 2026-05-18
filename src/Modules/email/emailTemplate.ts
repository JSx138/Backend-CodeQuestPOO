export default class EmailServiceTemplates {

  static boasVindas(userName: string) {
    return `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px; border-radius: 12px; line-height: 1.8;">

        <h1 style="color: #facc15; text-align: center; font-size: 36px;">
          ⚔️ Bem-vindo ao Reino de CodeQuestPOO ⚔️
        </h1>

        <p style="font-size: 18px;">
          Olá <strong>${userName}</strong>,
        </p>

        <p>
          É com grande honra que te damos as boas-vindas ao universo de
          <strong>CodeQuestPOO</strong>, onde o conhecimento é a arma mais poderosa e cada linha de código
          pode mudar o destino do reino.
        </p>

        <p>
          Durante muito tempo, os antigos <strong>Guardians do Código</strong> protegeram os segredos da Programação Orientada a Objetos.
          Mas o caos espalhou-se… erros começaram a surgir, sistemas perderam equilíbrio e o terrível
          <span style="color:#ef4444; font-weight:bold;">Dragão do Caos</span> despertou novamente.
        </p>

        <div style="background:#1e293b; padding:20px; border-left:5px solid #facc15; border-radius:8px; margin:25px 0;">
          <p style="margin:0; font-size:17px;">
            ⚡ Agora uma nova geração de heróis foi chamada… e tu és um deles. ⚡
          </p>
        </div>

        <p>
          Prepara-te para explorar mapas misteriosos, enfrentar desafios, desbloquear poderes e dominar os princípios da POO
          enquanto evoluis como verdadeiro Guardian do Código.
        </p>

        <p>
          Cada missão concluída aproxima-te da batalha final para restaurar o conhecimento perdido e salvar o reino.
        </p>

      </div>
    `;
  }

}