import * as fs from 'fs-extra';
import * as nodePath from 'path';

// tslint:disable:no-console
console.log('updating package');

const packageDir = process.cwd();
const packageName = process.env.LERNA_PACKAGE_NAME;

const TS_CONFIG = {
  extends: '../../tsconfig.json',
};

async function writeJson(path, obj) {
  await fs.writeFile(path, JSON.stringify(obj, null, 2));
}

async function updateTsConfig() {
  await writeJson(nodePath.resolve(packageDir, 'tsconfig.json'), TS_CONFIG);
}

async function main() {}

main();
