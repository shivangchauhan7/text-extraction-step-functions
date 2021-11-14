const AWS = require("aws-sdk");
const textract = new AWS.Textract();

exports.extractText = async (event) => {
    const { bucket, key } = event;
    try {
        const params = {
            Document: {
                S3Object: {
                    Bucket: bucket,
                    Name: key,
                }
            }
        };
        const response = await textract.detectDocumentText(params).promise();
        let text = '';
        response.Blocks.forEach((data) => {
            if (data.BlockType === 'LINE') {
                text += `${data.Text} `;
            }
        })
        return { key, pdfData: text };
    }
    catch (e) {
        console.log(e);
    }
}