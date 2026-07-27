const fs = require('fs');
const PDFParser = require("pdf2json");

let pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync('pdf_output.txt', pdfParser.getRawTextContent());
    console.log('PDF parsed successfully.');
});

pdfParser.loadPDF('C:\\Users\\Fablo\\.gemini\\antigravity\\brain\\23986dcf-b10d-49d4-8f03-b1e2bb52acbc\\.tempmediaStorage\\a66de24b889ece8b.pdf');
