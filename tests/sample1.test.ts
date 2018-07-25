import "mocha"
import { assert, expect} from "chai"
import * as fs from "fs-extra";
import * as path from "path";
import { detectIntent, getIntents } from "../src";
import { getAccessToken  } from '../src/index';
let allIntents : {intents?: any[]} = {};
const token = getAccessToken();
const project = "aglvoicedev-5b72b"
const expectedIntent = "HelloIntent"
const source = fs.readJsonSync(path.join(__dirname, "./data/utterances.json")) 

describe("Sample Test", async () => {
    
    before(async() => {
        console.log("before call")
        allIntents = await getIntents(project, token)
        fs.writeJsonSync(path.join(__dirname, "./data/all.json"), allIntents, {spaces: 4}) 
        console.log("all", allIntents)
        allIntents.intents.forEach((intent) =>  {
            console.log("intent test", intent.displayName)
            describe(intent.displayName, () => {
                var phrases = intent.trainingPhrases || [];
                phrases.forEach(t => {
                const combinedText = t.parts.reduce((a, b) =>a + b.text, "");
                it(`${combinedText} should resolve to ${intent.displayName}`, async () => {
                    var detected = await detectIntent(combinedText, project, token);
                    expect(detected.queryResult.intent.displayName).to.be.eq(intent.displayName)
                })
            })

            })
        //})
        })
    
    });

    it("Happy testing hacking", () => {
        expect(1).to.be.eq(1)
    })
    
})