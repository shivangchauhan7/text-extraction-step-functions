const AWS = require("aws-sdk");
const PDFDocument = require("pdfkit")
const s3 = new AWS.S3();

exports.generatePdf = async (event) => {
    try {
        const { key, pdfData } = event;
        const fileName = 'output.pdf';
        const pdfPromise = await new Promise(resolve => {
            const doc = new PDFDocument();

            doc.text(pdfData);
            doc.end();

            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
        });
        const params = {
            Bucket: 'pdf-store-34',
            Key: `${key.split(".")[0]}-${fileName}`,
            Body: pdfPromise,
            ContentType: 'application/pdf',
        };

        const response = await s3.putObject(params).promise();
        return response;
    }
    catch (e) {
        console.log(e);
    }
}