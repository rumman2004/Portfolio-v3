const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client/src/components/sections');

const filesToUpdate = [
  'EducationSection.jsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(directoryPath, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const regex = /<div className="(absolute -top-\[[^\]]+\] left-1\/2 -translate-x-1\/2 -translate-y-1\/2[^"]*?)( opacity-10)([^"]*)">/g;
  
  const newContent = content.replace(regex, '<div className="$1$3">');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${file}`);
  } else {
    console.log(`No changes made to: ${file}`);
  }
});
