import "mocha"
import { assert, expect} from "chai"
import * as fs from "fs-extra";
import * as path from "path";
import { detectIntent, getIntents } from "../src";
import { getAccessToken  } from '../src/index';
let allIntents : {intents?: any[]} = {};
const token = getAccessToken();
const project = "aglvoice-9894b"
const expectedIntent = "HelloIntent"
const source = fs.readJsonSync(path.join(__dirname, "./data/utterances.json")) 

describe("Sample Test", async () => {
    
    before(async() => {
        allIntents = await getIntents(project, token)
        fs.writeJsonSync(path.join(__dirname, "./data/all.json"), allIntents, {spaces: 4}) 
        allIntents.intents.forEach((intent) =>  {
            describe(intent.displayName, () => {
                var phrases = intent.trainingPhrases || [];
                phrases.forEach(t => {
                    const combinedText = t.parts.reduce((a, b) =>a + b.text, "");
                    it(`${combinedText}  ===> ${intent.displayName}`, async () => {
                        var detected = await detectIntent(combinedText, project, token);
                        expect(detected.queryResult.intent.displayName).to.be.eq(intent.displayName)
                    })
                })
            })
        })
    
    });

    it("Happy testing hacking", () => {
        expect(1).to.be.eq(1)
    })
    
})