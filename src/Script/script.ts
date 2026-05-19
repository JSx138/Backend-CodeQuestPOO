import sequelize from '../Config/sequelize.js';

async function run() {

  const t = await sequelize.transaction();

  try {

    await sequelize.query(`
    
    ALTER TABLE jogador_tempo ADD COLUMN ultima_semana_reset TIMESTAMP DEFAULT NOW();

    `, {
      transaction: t,
    });

    await t.commit();

    console.log("✅ Tabela jogador_sessoes criada com sucesso");

  } catch (err) {

    await t.rollback();

    console.error('❌ Erro ao criar tabela:', err);

  } finally {

    await sequelize.close();

  }
}

run();