require("dotenv").config();
console.log("bot is working...");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const token = process.env.BOOLD_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// start
bot.onText(/\/start/, (msg) => {
  const opts = {
    reply_markup: {
      keyboard: [["🔬 Analysis"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
  bot.sendMessage(msg.chat.id, "Welcome", opts);
});

// help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, "dasturchi bilan bog'lanish uchun @akbr_odlv");
});

// analysis
bot.onText(/Analysis/, (msg) => {
  const opts = {
    reply_markup: {
      keyboard: [[{ text: "Share Contact", request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
  bot.sendMessage(msg.chat.id, "Please share your contact", opts);
  bot.on("contact", async (msg) => {
    try {
      const userNumber = Number(msg.contact.phone_number);
      const response = await axios.get(`${process.env.API_URL}/analysis`);
      const data = response.data.data;
      const userAnalysis = data.find((item) => item.number === userNumber);
      if (userAnalysis) {
        bot.sendMessage(
          msg.chat.id,
          `*🔬 Analysis:*\n*👤 Name:* ${userAnalysis.name}\n*🔗 File URL:* ${userAnalysis.fileUrl}`,
          { parse_mode: 'Markdown' }
        );   
      } else {
        bot.sendMessage(msg.chat.id, "No analysis found for this number");
      }
      const mainMenuOpts = {
        reply_markup: {
          keyboard: [["🔬 Analysis"]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      };
      bot.sendMessage(msg.chat.id, "Main menu", mainMenuOpts);
    } catch (error) {
      console.log("Error:", error);
      console.error("Error:", error);
      bot.sendMessage(
        msg.chat.id,
        "Sorry, something went wrong while fetching data"
      );
    }
  });
});
