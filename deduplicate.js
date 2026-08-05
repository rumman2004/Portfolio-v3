const fs = require('fs');

// 1. Check skillsData.js duplicates
let rawSkills = fs.readFileSync('client/src/utils/skillsData.js', 'utf8');
let jsonStr = rawSkills.replace('export const FALLBACK_CATEGORIES = ', '').replace(/;\s*$/, '');
let categories = JSON.parse(jsonStr);

let duplicatesFound = false;
categories.forEach(cat => {
  let seen = new Set();
  let uniqueTools = [];
  cat.tools.forEach(tool => {
    if (seen.has(tool.name)) {
      console.log('Duplicate in skillsData:', cat.id, tool.name);
      duplicatesFound = true;
    } else {
      seen.add(tool.name);
      uniqueTools.push(tool);
    }
  });
  cat.tools = uniqueTools;
});

fs.writeFileSync('client/src/utils/skillsData.js', 'export const FALLBACK_CATEGORIES = ' + JSON.stringify(categories, null, 2) + ';\n');


// 2. Check iconMap.js duplicates
let rawMap = fs.readFileSync('client/src/utils/iconMap.js', 'utf8');
let lines = rawMap.split('\n');

// Deduplicate imports
let importSet = new Set();
let uniqueLines = [];
lines.forEach(line => {
  if (line.startsWith('import ')) {
    if (importSet.has(line)) {
      console.log('Duplicate import in iconMap.js:', line);
    } else {
      importSet.add(line);
      uniqueLines.push(line);
    }
  } else {
    uniqueLines.push(line);
  }
});
rawMap = uniqueLines.join('\n');

// Deduplicate keys in iconMap object
// Let's use regex or parsing to deduplicate keys within iconMap
let inObject = false;
let keySet = new Set();
let finalLines = [];
rawMap.split('\n').forEach(line => {
  if (line.trim().startsWith('export const iconMap = {')) {
    inObject = true;
    finalLines.push(line);
  } else if (inObject && line.trim() === '};') {
    inObject = false;
    finalLines.push(line);
  } else if (inObject) {
    let match = line.match(/^\s*'([^']+)'\s*:/);
    if (match) {
      if (keySet.has(match[1])) {
        console.log('Duplicate key in iconMap.js:', match[1]);
      } else {
        keySet.add(match[1]);
        finalLines.push(line);
      }
    } else {
      finalLines.push(line);
    }
  } else {
    finalLines.push(line);
  }
});

fs.writeFileSync('client/src/utils/iconMap.js', finalLines.join('\n'));

console.log('Deduplication done.');
