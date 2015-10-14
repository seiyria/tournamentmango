
const fs = require('fs');
const execSync = require('child_process').execSync;

export const getPaths = () => JSON.parse(fs.readFileSync('./package.json')).gulp;
export const currentTag = () => execSync('git describe --abbrev=0').toString().trim();