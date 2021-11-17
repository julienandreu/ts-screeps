'use strict';

import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import screeps from 'rollup-plugin-screeps';
import json from '@rollup/plugin-json';
import semver from 'semver';
import fs from 'fs';
import path from 'path';

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log('No destination specified - code will be compiled but not uploaded');
} else if ((cfg = require('./screeps.json')[dest]) == null) {
  throw new Error('Invalid upload destination');
}

// Increase version
const screepsConfigPath = path.resolve(__dirname, 'screeps.json');
const screepsConfig = require(screepsConfigPath);
const { version } = screepsConfig[dest];
const nextVersion = semver.inc(version, 'patch');
const nextScreepsConfig = {
  ...screepsConfig,
  [dest]: {
    ...screepsConfig[dest],
    version: nextVersion,
  },
};
fs.writeFileSync(screepsConfigPath, JSON.stringify(nextScreepsConfig, null, 2));

const configPath = path.resolve(__dirname, 'src', 'config.json');
const config = require(configPath);
fs.writeFileSync(configPath, JSON.stringify({ ...config, version: nextVersion }, null, 2));

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    sourcemap: true,
  },

  plugins: [
    clear({ targets: ['dist'] }),
    resolve({ rootDir: 'src' }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    screeps({ config: cfg, dryRun: cfg == null }),
    json(),
  ],
};
