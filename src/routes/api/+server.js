import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

export async function GET(){
    return new Response("image to story api", { headers: { 'Content-Type': 'text/plain; charset=UTF-8' } })
}

export async function POST({request}){
    const { image, type } = await request.json()
    const data = {
        image : image,
        type : type
    };
    const res = await ai()
    return new Response(JSON.stringify({res}), { headers: { 'Content-Type': 'text/plain; charset=UTF-8' } })
}

const MODEL_NAME = "models/text-bison-001";
const API_KEY = "AIzaSyCdbwkBoPVPDHNYujWYc2kYbF7Vb1Kch-M";  // 여기에 API 키를 입력하세요.

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

async function ai() {
    const promptString = `Write a story without title`;
    const stopSequences = [];
  
    const result = await client.generateText({
      model: MODEL_NAME,
      temperature: 0.7,
      candidateCount: 1,
      top_k: 40,
      top_p: 0.95,
      max_output_tokens: 1024,
      stop_sequences: stopSequences,
      safety_settings: [{"category":"HARM_CATEGORY_DEROGATORY","threshold":1},{"category":"HARM_CATEGORY_TOXICITY","threshold":1},{"category":"HARM_CATEGORY_VIOLENCE","threshold":2},{"category":"HARM_CATEGORY_SEXUAL","threshold":2},{"category":"HARM_CATEGORY_MEDICAL","threshold":2},{"category":"HARM_CATEGORY_DANGEROUS","threshold":2}],
      prompt: {
        text: promptString,
      },
    });
  
    // output 값만 추출
    const output = result[0].candidates[0].output;
  
    return output;
  }


async function etri(params) {
    const openApiURL = "http://aiopen.etri.re.kr:8000/ObjectDetect";
    const accessKey = "efe37e9e-013c-4970-a48c-45ae21d4faf3";

    try {
        var imageContents = params.image;
        var type = params.type;
    } catch (e) {
        return "invalid syntax: post base64 encoded image in 'image' and image's file extension at 'type'";
    }

    const requestJson = {
        argument: {
            type: String(type),
            file: String(imageContents)
        }
    };

    console.log(type)

    const response = await fetch(openApiURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": accessKey
        },
        body: JSON.stringify(requestJson)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData)
    const jsondata = responseData.return_object.data;
    jsondata.sort((a, b) => (b.width * b.height) - (a.width * a.height));

    const data = jsondata.slice(0, Math.min(5, jsondata.length)).map(item => item.class);
    return String(data)
}