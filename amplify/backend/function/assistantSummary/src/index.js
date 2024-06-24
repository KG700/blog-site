import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const client = new BedrockRuntimeClient({ region: 'eu-west-2'});

    const input = {
        modelId: "amazon.titan-text-express-v1",
        contentType: "application/json",
        accept: "*/*",
        body: JSON.stringify({
          inputText: `Write a summary of: ${event.arguments.summary}. Make it interest someone into reading the full text. It should be shorter than 500 characters`,
          textGenerationConfig: {
              maxTokenCount: 8192,
              stopSequences: [],
              temperature: 0.7,
              topP: 1,
          }
        })
      }

      let text = '';
      try {
        const data = await client.send(new InvokeModelCommand(input));
        const jsonString = Buffer.from(data.body).toString('utf-8');
        const parsedData = JSON.parse(jsonString);
        text = parsedData.results[0].outputText;

      } catch(error) {
        console.log({ error });
      }



    return {
        statusCode: 200,
        body: text,
    };
};
