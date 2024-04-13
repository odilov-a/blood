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
      keyboard: [["🔬 Analysis"], ["🏥 Clinics", "📰 News"]],
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

// clinics
let doctors = [];
bot.onText(/Clinics/, (msg) => {
  axios
    .get(`${process.env.API_URL}/clinics`)
    .then((response) => {
      const data = response.data.data;
      const clinics = data.map((clinic) => [clinic.name]);
      clinics.push(["Back to Main Menu"]);
      const opts = {
        reply_markup: {
          keyboard: clinics,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      };
      bot.sendMessage(msg.chat.id, "Please choose a clinic", opts);
    })
    .catch((error) => {
      console.log(error);
      bot.sendMessage(msg.chat.id, "Error fetching data");
    });
});

bot.on("message", (msg) => {
  const chosenClinicName = msg.text;
  if (chosenClinicName === "Back to Main Menu") {
    bot.sendMessage(msg.chat.id, "Main Menu", {
      reply_markup: {
        keyboard: [["🔬 Analysis"], ["🏥 Clinics", "📰 News"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  } else {
    const chosenDoctor = doctors.find(
      (doctor) => doctor.name === chosenClinicName
    );
    if (chosenDoctor) {
      bot.sendMessage(
        msg.chat.id,
        `Doctor information: ${JSON.stringify(chosenDoctor)}`
      );
    } else {
      axios
        .get(`${process.env.API_URL}/clinics`)
        .then((response) => {
          const chosenClinic = response.data.data.find(
            (clinic) => clinic.name === chosenClinicName
          );
          if (chosenClinic) {
            const chosenClinicId = chosenClinic._id;
            axios
              .get(`${process.env.API_URL}/doctors`)
              .then((response) => {
                doctors = response.data.data;
                const clinicDoctors = doctors.filter(
                  (doctor) => doctor.address === chosenClinicId
                );
                if (clinicDoctors.length > 0) {
                  const doctorNames = clinicDoctors.map((doctor) => [
                    doctor.name,
                  ]);
                  doctorNames.push(["Back to Main Menu"]);
                  const opts = {
                    reply_markup: {
                      keyboard: doctorNames,
                      resize_keyboard: true,
                      one_time_keyboard: true,
                    },
                  };
                  bot.sendMessage(msg.chat.id, "Please choose a doctor", opts);
                } else {
                  bot.sendMessage(
                    msg.chat.id,
                    "No doctors found for this clinic"
                  );
                }
              })
              .catch((error) => {
                console.log(error);
                bot.sendMessage(msg.chat.id, "Error fetching data");
              });
          }
        })
        .catch((error) => {
          console.log(error);
          bot.sendMessage(msg.chat.id, "Error fetching data");
        });
    }
  }
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

  bot.on("contact", (msg) => {
    const userNumber = Number(msg.contact.phone_number);
    axios
      .get(`${process.env.API_URL}/analysis`)
      .then((response) => {
        const data = response.data.data;
        const userAnalysis = data.find((item) => item.number === userNumber);
        if (userAnalysis) {
          bot.sendMessage(
            msg.chat.id,
            `Analysis: ${JSON.stringify(userAnalysis)}`
          );
        } else {
          bot.sendMessage(msg.chat.id, "No analysis found for this number");
        }
        const mainMenuOpts = {
          reply_markup: {
            keyboard: [["🔬 Analysis"], ["🏥 Clinics", "📰 News"]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        };
        bot.sendMessage(msg.chat.id, "Main menu", mainMenuOpts);
      })
      .catch((error) => {
        bot.sendMessage(msg.chat.id, "Error fetching data");
      });
  });
});

// news
bot.onText(/News/, (msg) => {
  axios
    .get(`${process.env.API_URL}/news`)
    .then((response) => {
      const data = response.data.data; 
      currentNewsIndex = 0;
      bot.sendMessage(
        msg.chat.id,
        `News: ${JSON.stringify(data[currentNewsIndex])}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Next", callback_data: "next" },
                { text: "Prev", callback_data: "prev" },
              ],
            ],
          },
        }
      );
    })
    .catch((error) => {
      bot.sendMessage(msg.chat.id, "Error fetching data");
    });
});

bot.on("callback_query", (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  axios
    .get(`${process.env.API_URL}/news`)
    .then((response) => {
      const news = response.data.data;
      if (data === "next") {
        currentNewsIndex = (currentNewsIndex + 1) % news.length;
      } else if (data === "prev") {
        currentNewsIndex = (currentNewsIndex - 1 + news.length) % news.length;
      }
      bot.editMessageText(`News: ${JSON.stringify(news[currentNewsIndex])}`, {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Next", callback_data: "next" },
              { text: "Prev", callback_data: "prev" },
            ],
          ],
        },
      });
    })
    .catch((error) => {
      bot.sendMessage(msg.chat.id, "Error fetching data");
    });
});