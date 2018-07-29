import Axios from "axios";
import {
    execSync
} from "child_process";
import * as fs from "fs-extra";
import * as colors from 'colors';
async function sleepSync(time) {
    return new Promise(r => setTimeout(r, time))
}
export async function detectIntent(input: string, project: string, token: string): Promise < any > {
    
    const url = `https://dialogflow.googleapis.com/v2/projects/${project}/agent/sessions/36e20c4a-7578-5abe-762a-2d7d827c75fb:detectIntent`;
    const data = {
        'query_input': {
            'text': {
                'text': input,
                'language_code': 'en-US'
            }
        },
        "queryParams": {
            timeZone: "Australia/Sydney"
        }
    }
    const options = {
        //baseURL: "https://dialogflow.googleapis.com/v2/projects",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json; charset=utf-8"
        }
    }
    let response = null;
    for (let index = 0; index < 30; index++) {
    
        try{
            response = await Axios.post(url, data, options);
            return response.data;
        } catch(err) {
            console.log(colors.dim(`    Dialog flow API throttled, retrying #${index+1} in ${index +5} second`));
            await sleepSync(index+5*1000);
        }
    }
    return null;
}

export async function getIntents(project: string, token: string): Promise < any > {
    const url = `https://dialogflow.googleapis.com/v2/projects/${project}/agent/intents?intentView=INTENT_VIEW_FULL`;
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json; charset=utf-8"
        }
    }
    const response = await Axios.get(url, options);
    return response.data;
}
export async function getEntities(project: string, token: string): Promise < any > {
    const url = `https://dialogflow.googleapis.com/v2/projects/${project}/agent/entityTypes`;
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json; charset=utf-8"
        }
    }
    const response = await Axios.get(url, options);
    return response.data;
}

export function getAccessToken(): string {
    execSync("gcloud auth print-access-token> token.txt")

    const token = fs.readFileSync("token.txt", "utf8")
    fs.removeSync("token.txt")
    return token.trim()


}
