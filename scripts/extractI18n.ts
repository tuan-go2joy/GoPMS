import chalk from 'chalk';

console.log('------------------ Extract i18n ------------------\n');

type TMessages = { [key: string]: string | TMessages };

import VueI18NExtract from 'vue-i18n-extract';
import objectPath from 'object-path';
import path from 'path';
import fs from 'fs-extra';

/**
 * Thus function sorts the keys of the object in alphnumeric order.
 * It will handle nested object recursively.
 */
const sortMessages = (messages: TMessages) => {
  const newMessages: TMessages = {};
  const keys = [];
  for (const key in messages) {
    const value = messages[key];
    switch (typeof value) {
      case 'object':
        newMessages[key] = sortMessages(value);
        break;
      case 'string':
        keys.push(key);
        break;
    }
  }
  const sortedKeys = keys.slice().sort((a, b) => a.localeCompare(b));

  sortedKeys.forEach((key) => {
    newMessages[key] = messages[key];
  });
  return newMessages;
};

/**
 * This function removes unused i18n key/value and stores it.
 */
const handleUnusedKey = (messages: TMessages, path: string, store: TMessages) => {
  const unusedValue = objectPath.get(messages, path);
  if (unusedValue !== '__missing__') objectPath.set(store, path, unusedValue);
  objectPath.del(messages, path);

  return messages;
};

/**
 * This function look for a missing i18n key in the store and adds it in i18n json file.
 * If it's not in the store, this function will add just '__missing__' as a value.
 */
const handleMissingKey = (messages: TMessages, path: string, store: TMessages) => {
  const storedValue = objectPath.get(store, path);
  if (storedValue) {
    objectPath.del(store, path);
  }
  objectPath.set(messages, path, storedValue ?? '__missing__');
};

/**
 * MAIN FUNCTION
 * This function generates i18n report with VueI18NExtract, manage them, and move/write i18n json files.
 */
const main = async () => {
  const enUSStoreFilePath = path.resolve(__dirname, '../locales/store/en-US.json');
  const viVNStoreFilePath = path.resolve(__dirname, '../locales/store/vi-VN.json');
  const enUSFilePath = path.resolve(__dirname, `../locales/en-US.json`);
  const viVNFilePath = path.resolve(__dirname, `../locales/vi-VN.json`);

  const enUSMessagesStore = await fs.readJson(enUSStoreFilePath);
  const viVNMessagesStore = await fs.readJson(viVNStoreFilePath);
  const enUSMessages = await fs.readJson(enUSFilePath);
  const viVNMessages = await fs.readJson(viVNFilePath);

  const { missingKeys, unusedKeys } = await VueI18NExtract.createI18NReport({
    vueFiles: path.resolve(__dirname, `../src/**/*.?(ts|vue)`),
    languageFiles: path.resolve(__dirname, `../locales/*.json`),
  });

  missingKeys.forEach((key) => {
    switch (key.language) {
      case 'en-US':
        handleMissingKey(enUSMessages, key.path, enUSMessagesStore);
        break;
      case 'vi-VN':
        handleMissingKey(viVNMessages, key.path, viVNMessagesStore);
        break;
    }
  });

  unusedKeys.forEach((key) => {
    switch (key.language) {
      case 'en-US':
        handleUnusedKey(enUSMessages, key.path, enUSMessagesStore);
        break;
      case 'vi-VN':
        handleUnusedKey(viVNMessages, key.path, viVNMessagesStore);
        break;
    }
  });
  const sortedEnUS = sortMessages(enUSMessages);
  const sortedViVN = sortMessages(viVNMessages);
  const sortedEnUSStore = sortMessages(enUSMessagesStore);
  const sortedViVNStore = sortMessages(viVNMessagesStore);

  try {
    await fs.writeJson(enUSFilePath, sortedEnUS);

    await fs.writeJson(viVNFilePath, sortedViVN);

    await fs.writeJson(enUSStoreFilePath, sortedEnUSStore);
    await fs.writeJson(viVNStoreFilePath, sortedViVNStore);

    console.log(chalk.green('GoPMS i18n extraction completed!'));
  } catch (err) {
    console.log(chalk.bgRed(` Failed with following error `));
    console.error(err);
  } finally {
    console.log('\n--------------------------------------------------');
  }
};

main();
