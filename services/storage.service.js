import { homedir } from "os";
import { join } from "path";
import { promises } from "fs";
const filePath = join(homedir(), "weather-data.json");
const TOKEN_DICTIONARY = {
  token: "token",
  cities: "cities",
  language: "launguage",
};
const saveKeyValue = async (key, value) => {
  let data = {};
  if (await isExist(filePath)) {
    const file = await promises.readFile(filePath);
    data = JSON.parse(file);
  }
  if(key === TOKEN_DICTIONARY.language){
    data[key] = value;
  }
  if(key === TOKEN_DICTIONARY.cities){
    if(!data[key]){
      data[key] = []
    }
    if(!data[key].includes(value)){
      data[key].push(value);
    }
  }else {
    data[key] = value;
  }
  await promises.writeFile(filePath, JSON.stringify(data));
};
const getKeyValue = async (key) => {
  if (await isExist(filePath)) {
    const file = await promises.readFile(filePath);
    const data = JSON.parse(file);
    return data[key];
  }
  return undefined;
};
const isExist = async (path) => {
  try {
    await promises.stat(path);
    return true;
  } catch (e) {
    return false;
  }
};
export { saveKeyValue, getKeyValue, TOKEN_DICTIONARY };
