import fs from 'fs';
import pdf_default from 'pdf-parse';
const pdf = pdf_default.default || pdf_default;

const dataBuffer = fs.readFileSync('C:\\Users\\Fablo\\.gemini\\antigravity\\brain\\23986dcf-b10d-49d4-8f03-b1e2bb52acbc\\.tempmediaStorage\\a66de24b889ece8b.pdf');

pdf(dataBuffer).then(function(data) {
    // Write output to a text file for easy reading
    fs.writeFileSync('pdf_output.txt', data.text);
    console.log('PDF text extracted successfully to pdf_output.txt');
}).catch(function(error){
    console.error('Error:', error);
});
