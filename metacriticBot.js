const axios = require('axios');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');

const botToken = '';
const bot = new TelegramBot(botToken, { polling: true });


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Bem-vindo ao Bot do Metacritic! Digite o nome do jogo e a plataforma separados por espaço:');
});

bot.onText(/\/gamescore (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const [nomeJogo, plataforma] = match[1].split(' '); // corrigir caso tenha mais de 1 palavra

  const result = await getScoreMetacritic(nomeJogo, plataforma);

  if (result) {
    bot.sendMessage(chatId, `${result.name} -> ${result.score}`);

  } else {
    bot.sendMessage(chatId, 'Jogo não encontrado.');
  }
});

async function getScoreMetacritic(nomeJogo, plataforma) {
   if(plataforma) {
    console.log('escolheu', plataforma)
  }

  try {
    const url = `https://www.metacritic.com/search/game/${nomeJogo}/results`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const name = $('#main_content > div > div.module.search_results.fxdcol.gu6 > div > ul > li.result.first_result > div > div.basic_stats.has_thumbnail > div > h3 > a').first().text().trim();
    const score = $('#main_content > div > div.module.search_results.fxdcol.gu6 > div > ul > li.result.first_result > div > div.basic_stats.has_thumbnail > div > span.metascore_w.medium.game.positive').first().text().trim();
    return { name: name, score: score };
  } catch (error) {
    return null;
  }
}

// Filters
// ?search_type=advanced&plats[3]=1 PC
// ?search_type=advanced&plats[72496]=1 PS4
// ?search_type=advanced&plats[80000]=1 One
// ?plats[268409]=1&search_type=advanced Switch