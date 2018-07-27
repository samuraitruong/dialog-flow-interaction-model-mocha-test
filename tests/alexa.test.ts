import "mocha"
import { assert, expect} from "chai"
import * as CSVWriter from "csv-write-stream";
import * as colors from "colors";
import * as fs from "fs-extra";
import * as path from "path";
import { detectIntent, getIntents } from "../src";
import { getAccessToken  } from '../src/index';
import { config } from './config';

let allIntents : {intents?: any[]} = {};
let failedCount  = 0;
// let combinedText :string ="";
// let expectedIntent: string = "";
let actualIntent : string = "";
const model = fs.readJsonSync(path.join(__dirname, "./data/model.json"))
let testFailed : {
  [name:string] : string[]
} ={};
let writer : any;
describe("Alexa Model Testing", async () => {
    const intents = model.interactionModel.languageModel.intents;
    const testIntents = intents.filter(x => config.tests[x.name]);
    before(() => {
      writer = new CSVWriter({
        headers: ["status", "input","expected", "actual", "error"]
      });
      writer.pipe(fs.createWriteStream(path.join(__dirname,'./data/elaxa_reports.csv')))
    })
    testIntents.forEach((intent) =>  {
        describe(intent.name, () => {
            // expectedIntent = intent.name;
            var phrases = intent.samples
            phrases.forEach(t => {

                let combinedText = t.replace("{FuelType}", "gas")
                if(combinedText.indexOf("{Period}") > 0 && combinedText.indexOf("{PeriodSecondary}")) {
                  combinedText = combinedText.replace("{Period}", "twenty seventeen")
                  combinedText = combinedText.replace("{PeriodSecondary}", "June")
                }
                combinedText = combinedText.replace("{SkipPeriod}", "current")
                combinedText = combinedText.replace("{Period}", "May twenty seventeen")

                it(`${combinedText}  ===> ${intent.name}`, async function ()  {
                    const detected = await detectIntent(combinedText, config.projectId, config.token);
                    actualIntent = detected.queryResult.intent.displayName;
                    expect(actualIntent).to.be.eq(intent.name)
                })
            })
            afterEach(function () {
              const expectedIntent =this.currentTest.parent.title.trim();
              const input = this.currentTest.title.split("=")[0].trim();
              writer.write({status: this.currentTest.state,
                input: input,
                expected: this.currentTest.parent.title,
                actual: actualIntent,
                error: this.currentTest.err ? this.currentTest.err.message: ""
              })
              //console.log(this.currentTest.ctx)
              if(this.currentTest.state == "failed") {
                failedCount++;
                testFailed[expectedIntent] = testFailed[expectedIntent] || [];
                testFailed[expectedIntent].push(input)
                if(failedCount % 10 == 0) {
                  //persit data
                  fs.writeJsonSync(path.join(__dirname,'./data/elaxa_failed.json'), testFailed, {spaces: 4});
                }
                console.error(colors.red("\t ✘ ") + colors.yellow.underline(this.currentTest.err.message));
              }
            })
        })
    })


    it("Happy testing hacking", () => {
        expect(1).to.be.eq(1)
    })

})
after(()=> {
  writer.end()
})
