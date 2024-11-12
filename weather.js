#!/usr/bin/env node
import { getArgs } from "./helpers/arg.js";
import { getWeather, getIcon } from "./services/api.service.js";
import {
  printHelp,
  printSuccess,
  printError,
  printWeather,
} from "./services/log.service.js";
import {
  getKeyValue,
  saveKeyValue,
  TOKEN_DICTIONARY,
} from "./services/storage.service.js";

const saveToken = async (token) => {
  if (!token.length) {
    printError("Не передан token");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token);
    printSuccess("Токен сохранён");
  } catch (e) {
    printError(e.message);
  }
};
const saveCity = async (cities) => {
  if (!cities.length) {
    printError("Не переданы города!");
    return;
  }
  const citiesArr = cities.split(",").map(city => city.trim()).filter(city => city);
  try {
    const existingCities = (await getKeyValue(TOKEN_DICTIONARY.cities)) || [];
    const updatedCities = Array.from(new Set([...existingCities, ...citiesArr]));

    await saveKeyValue(TOKEN_DICTIONARY.cities, updatedCities);
    printSuccess("Города сохранены!");
  } catch (e) {
    printError(e.message);
  }
};
export let currentLanguage = "en";
const setLanguage = async (lang) => {
  if (["en", "ru"].includes(lang)) {
    await saveKeyValue(TOKEN_DICTIONARY.language, lang);
    currentLanguage = lang;
  }
};

const getForcast = async () => {
  try {
    const cities = await getKeyValue(TOKEN_DICTIONARY.cities);
    if(cities.length === 0){
      printError("Не сохранены города для отображения!");
      return;
    };
    const weatherPromises = cities.map(city => getWeather(city));
    const weatherResults = await Promise.all(weatherPromises); 
    weatherResults.forEach((weather, index) => {
      printWeather(weather, getIcon(weather.weather[0].icon), cities[index])
    });
  } catch (e) {
    if (e?.response?.status == 404) {
      printError("Неверно указан город");
    } else if (e?.response?.status == 401) {
      printError("Неверно указан токен");
    } else {
      printError(e.message);
    }
  }
};
const initCLI = () => {
  const args = getArgs(process.argv);
  if (args.h) {
    return printHelp();
  }
  if (args.s) {
    return saveCity(args.s);
  }
  if (args.t) {
    return saveToken(args.t);
  }
  if (args.l) {
    return setLanguage(args.l);
  }
  return getForcast();
};

initCLI();
