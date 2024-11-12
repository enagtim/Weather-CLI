import chalk from "chalk";
import dedent from "dedent-js";
import { currentLanguage } from "../weather.js";
import { getKeyValue, TOKEN_DICTIONARY } from "./storage.service.js";
const MESSAGES = {
  en: {
    error: "ERROR",
    success: "SUCCESS",
    help: "HELP",
    noCity: "No cities saved for display!",
    saveCitySuccess: "Cities saved!",
    invalidToken: "Invalid token",
    invalidCity: "Invalid city",
    tokenSaved: "Token saved",
  },
  ru: {
    error: "ОШИБКА",
    success: "УСПЕХ",
    help: "ПОМОЩЬ",
    noCity: "Не сохранены города для отображения!",
    saveCitySuccess: "Города сохранены!",
    invalidToken: "Неверно указан токен",
    invalidCity: "Неверно указан город",
    tokenSaved: "Токен сохранён",
  },
};
const getMessage = (key) => MESSAGES[currentLanguage][key];

const printError = (error) => {
  console.log(chalk.bgRed(` ${getMessage("error")} `) + " " + error);
};
const printSuccess = (message) => {
  console.log(chalk.bgGreen(` ${getMessage("success")} `) + " " + message);
};
const printHelp = async () => {
  const language = await getKeyValue(TOKEN_DICTIONARY.language) || 'en';
  if (language === 'ru') {
    console.log(
      dedent`
      ${chalk.bgCyan("ПОМОЩЬ")} 
      Без параметров - вывод погоды
      -s [ГОРОД] для установки города
      -h для вывода помощи
      -t [API_KEY] для сохранения токена
      -l [ЯЗЫК] для установки языка (en или ru)
      `
    );
  } else {
    console.log(
      dedent`
      ${chalk.bgCyan("HELP")} 
      No parameters - display weather
      -s [CITY] to set the city
      -h for help
      -t [API_KEY] to save the token
      -l [LANGUAGE] to set the language (en or ru)
      `
    );
  }
};
const printWeather = async (res, icon) => {
  const language = await getKeyValue(TOKEN_DICTIONARY.language) || 'en';
  if(language === 'ru'){
    console.log(
      dedent`
      ${chalk.bgYellow("Погода")} 
      Погода в городе ${res.name} ${icon}  ${res.weather[0].description}
      Температура: ${res.main.temp} (ощущается как ${res.main.feels_like})
      Влажность: ${res.main.humidity}%
      Скорость ветра: ${res.wind.speed}
      `
    );
  }else{
    console.log(
      dedent`
      ${chalk.bgYellow("Weather")} 
      Weather in ${res.name} ${icon}  ${res.weather[0].description}
      Temperature: ${res.main.temp} (feels like ${res.main.feels_like})
      Humidity: ${res.main.humidity}%
      Wind speed: ${res.wind.speed}
      `
    );
  }
};
export { printError, printSuccess, printHelp, printWeather };
