// tslint:disable:no-console
const packageName = process.env.LERNA_PACKAGE_NAME;

const RE_PLUGIN = /plugin-/;

async function main() {
  if (!RE_PLUGIN.test(packageName)) {
    console.log('Skipping core package');
    return;
  }

  console.log('updating plugin');
}

main();
