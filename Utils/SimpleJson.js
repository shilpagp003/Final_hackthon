import fs from "fs"

function saveOutputToJson( resutlsJson) {
        const filePath = 'Utils/output.json';
        let existingData = [];
        const fileContent = fs.readFileSync(filePath);
        existingData = JSON.parse(fileContent);

        existingData.push(resutlsJson);
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
      }
      
module.exports = { saveOutputToJson };