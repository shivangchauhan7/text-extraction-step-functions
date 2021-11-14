const AWS = require("aws-sdk");
const stepfunctions = new AWS.StepFunctions()

exports.triggerStateMachine = async (event) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    const { AWS_REGION, ACCOUNT_ID, stateMachineName } = process.env;

    try {
        const params = {
            stateMachineArn: `arn:aws:states:${AWS_REGION}:${ACCOUNT_ID}:stateMachine:${stateMachineName}`,
            input: JSON.stringify({ bucket, key })
        };

        await stepfunctions.startExecution(params).promise();
    }
    catch (e) {
        console.log(e);
    }
}