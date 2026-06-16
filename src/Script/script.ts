import sequelize from "../Config/sequelize.js";

async function run() {

  const t = await sequelize.transaction();

  try {

    await sequelize.query(`
      ALTER TABLE mentores
      ALTER COLUMN reacao_padrao TYPE character varying(255);
    `, {
      transaction: t,
    });

    await sequelize.query(`
      INSERT INTO mentores (
        nome,
        descricao,
        imagem,
        ativo,
        imagem_certo,
        imagem_errado,
        imagem_duvida,
        reacao_padrao
      )
      VALUES
      (
        'Aurelia',
        'A Guardiã da Luz — Uma paladina nobre que jurou proteger o reino e o conhecimento dos seus habitantes. A sua coragem inspira todos os heróis.',
        '/uploads/Aurelia/Aurelia.png',
        true,
        '/uploads/Aurelia/AureliaCerto.png',
        '/uploads/Aurelia/AureliaErrado.png',
        '/uploads/Aurelia/AureliaDuvida.png',
        '/uploads/Aurelia/AureliaPadrao.png'
      ),
      (
        'Bromm',
        'O Guerreiro Inabalável — Um anão resistente e determinado que nunca recua perante um desafio. A sua força tornou-se lendária em todo o vale.',
        '/uploads/Bromm/Bromm.png',
        true,
        '/uploads/Bromm/BrommCerto.png',
        '/uploads/Bromm/BrommErrada.png',
        '/uploads/Bromm/BrommDuvida.png',
        '/uploads/Bromm/BrommPadrao.png'
      ),
      (
        'Eldrin',
        'O Sábio Ancião — Um arquimago experiente que dedicou a sua vida ao estudo da magia e dos segredos do código. O seu conhecimento é incomparável.',
        '/uploads/Eldrin/Eldrin.png',
        true,
        '/uploads/Eldrin/EldrinCerto.png',
        '/uploads/Eldrin/EldrinErrado.png',
        '/uploads/Eldrin/EldrinDuvida.png',
        '/uploads/Eldrin/EldrinPadrao.png'
      ),
      (
        'Lyra',
        'A Arqueira Veloz — Uma exploradora élfica rápida e precisa. Conhece cada caminho da floresta e consegue atingir qualquer alvo à distância.',
        '/uploads/Lyra/Lyra.png',
        true,
        '/uploads/Lyra/LyraCerto.png',
        '/uploads/Lyra/LyraErrado.png',
        '/uploads/Lyra/LyraDuvida.png',
        '/uploads/Lyra/LyraPadrao.png'
      ),
      (
        'Tharok',
        'O Bárbaro Selvagem — Um guerreiro tribal das montanhas que luta com honra e determinação. A sua força é tão impressionante quanto a sua lealdade.',
        '/uploads/Tharok/Tharok.png',
        true,
        '/uploads/Tharok/TharokCerto.png',
        '/uploads/Tharok/TharokErrado.png',
        '/uploads/Tharok/TharokDuvida.png',
        '/uploads/Tharok/TharokPadrao.png'
      ),
      (
        'Vaelgrim',
        'O Cavaleiro Amaldiçoado — Antigo herói do reino, agora marcado por uma poderosa maldição. Apesar da escuridão que carrega, continua a combater pelo bem.',
        '/uploads/Vaelgrim/Vaelgrim.png',
        true,
        '/uploads/Vaelgrim/VaelgrimCerto.png',
        '/uploads/Vaelgrim/VaelgrimErrado.png',
        '/uploads/Vaelgrim/VaelgrimDuvida.png',
        '/uploads/Vaelgrim/VaelgrimPadrao.png'
      )
      ON CONFLICT (nome) DO UPDATE SET
        descricao = EXCLUDED.descricao,
        imagem = EXCLUDED.imagem,
        ativo = EXCLUDED.ativo,
        imagem_certo = EXCLUDED.imagem_certo,
        imagem_errado = EXCLUDED.imagem_errado,
        imagem_duvida = EXCLUDED.imagem_duvida,
        reacao_padrao = EXCLUDED.reacao_padrao;
    `, {
      transaction: t,
    });

    await t.commit();

    console.log("✅ Mentores inseridos/atualizados com sucesso");

  } catch (err) {

    await t.rollback();

    console.error("❌ Erro ao inserir mentores:", err);

  } finally {

    await sequelize.close();

  }
}

run();