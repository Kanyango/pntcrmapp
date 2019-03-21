const express = require('express');
const router = express.Router();
var PDFDocument, doc;
var fs = require('fs');
PDFDocument = require('pdfkit');
doc = new PDFDocument;
doc.pipe(fs.createWriteStream('invoice.pdf'));
// PDF Creation logic goes here
doc.fontSize(15).text('Wally Gator !', 50, 50);
// Set the paragraph width and align direction
doc.text('Wally Gator is a swinging alligator in the swamp. He\'s the greatest percolator when he really starts to romp. There has never been a greater operator in the swamp. See ya later, Wally Gator.', {
    width: 410,
    align: 'left'
});
doc.end();

module.exports = router;