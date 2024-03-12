const fs = require('fs');

const main = async () => {
  const configMod = require('./configs/index.json');

  const configRules = configMod.rules;

  const recommendedMod = require('./node_modules/stylelint-config-recommended/index.js');

  const recommendedRules = recommendedMod.rules;

  const standardMod = require('./node_modules/stylelint-config-standard/index.js');

  const standardRules = standardMod.rules;

  const stylelintMod = require('./node_modules/stylelint/lib/rules/index.cjs');

  const stylelintRules = stylelintMod;

  const rules = {};

  for (const key in configRules) {
    if (!stylelintRules[key]) {
      throw new Error(`unknown rule: ${key}`);
    }
  }

  for (const key in stylelintRules) {
    if (typeof configRules[key] !== 'undefined') {
      // if (configRules[key] === null) {
      //   console.log(`[warn] disabled rule: ${key}`);
      // }

      if (recommendedRules[key] || standardRules[key]) {
        throw new Error(`core rule: ${key}`);
      }

      if (
        configRules[key] !== null &&
        Array.isArray(configRules[key]) !==
          !!(await stylelintRules[key]).primaryOptionArray
      ) {
        throw new Error(`invalid options: ${key}`);
      }

      rules[key] = configRules[key];
    } else if (!recommendedRules[key] && !standardRules[key]) {
      if (key.endsWith('-list') || key.startsWith('selector-max-')) {
        rules[key] = null;
      } else if (!(await stylelintRules[key]).primaryOptionArray) {
        throw new Error(`undefined options: ${key}`);
      } else {
        throw new Error(`undefined options: ${key}`);
      }
    }
  }

  const output = { ...configMod, rules };

  fs.writeFileSync(`${__dirname}/dist/index.json`, JSON.stringify(output));
};
main();
