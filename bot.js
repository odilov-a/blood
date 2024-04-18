require("dotenv").config();
console.log("bot is working...");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const token = process.env.BOOLD_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const firstName = msg.from.first_name;
  const welcomeMessage = `*Assalomu alaykum, ${firstName}!*`;
  const opts = {
    reply_markup: {
      keyboard: [["🔬 Analizlar"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
  bot.sendMessage(msg.chat.id, welcomeMessage, { parse_mode: "Markdown", ...opts });
});

bot.onText(/\/help/, (msg) => {
  const helpMessage = "*dasturchi bilan bog'lanish uchun @HyperNova_Inc*";
  bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: "Markdown" });
});

// analysis
bot.onText(/Analizlar/, (msg) => {
  const opts = {
    reply_markup: {
      keyboard: [[{ text: "Raqamni yuborish", request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
  const numberMessage = "*Iltimos, raqamingizni yuboring!*";
  bot.sendMessage(msg.chat.id, numberMessage, { parse_mode: "Markdown", ...opts });
});

bot.on("contact", async (msg) => {
  try {
    const userNumber = Number(msg.contact.phone_number);
    const response = await axios.get(`${process.env.API_URL}/analysis`);
    const data = response.data.data;
    const userAnalysis = data.find((item) => item.number === userNumber);
    if (userAnalysis) {
      userAnalysis.fileUrl.forEach((file, index) => {
        const caption = `*🔬 Analiz turi:* ${userAnalysis.analysisType}`;
        bot.sendDocument(msg.chat.id, file, {
          caption: caption,
          parse_mode: "Markdown"
        }).then(() => {
          console.log(`Document ${index + 1} sent successfully.`);
        }).catch((error) => {
          console.error(`Error sending document ${index + 1}: ${error}`);
        });
      });
    } else {
      bot.sendMessage(msg.chat.id, "No analysis found for this number");
    }
    const mainMenuOpts = {
      reply_markup: {
        keyboard: [["🔬 Analizlar"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };
    const manuMessage = "*Menyuga qaytish*";
    bot.sendMessage(msg.chat.id, manuMessage, { parse_mode: "Markdown", ...mainMenuOpts });
  } catch (error) {
    console.error("Error:", error);
    bot.sendMessage(
      msg.chat.id,
      "Sorry, something went wrong while fetching data"
    );
  }
});
