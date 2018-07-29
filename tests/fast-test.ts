import "mocha"
import { assert, expect} from "chai"
import * as CSVWriter from "csv-write-stream";
import * as colors from "colors";
import * as fs from "fs-extra";
import * as path from "path";
import { detectIntent, getIntents } from "../src";
import { config } from './config';
import * as eachLimit from "async/eachLimit";
import { resolve } from "url";
import { runInThisContext } from "vm";


let failedCount  = 0;
let actualIntent : string = "";
const model = fs.readJsonSync(path.join(__dirname, "./data/model.json"))
let testFailed : {
  [name:string] : string[]
} ={};
let writer : any;
const intents = model.interactionModel.languageModel.intents;
const testIntents = intents.filter(x => config.tests[x.name]);
writer = new CSVWriter({
headers: ["status", "input","expected", "actual", "error"]
});
function sleepSync() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
}
async function runSingleTest(inputSample: string, intent: any) {
    try{
        
        let combinedText = inputSample.replace("{FuelType}", "gas")
        if(combinedText.indexOf("{Period}") > 0 && combinedText.indexOf("{PeriodSecondary}")) {
            combinedText = combinedText.replace("{Period}", "twenty seventeen")
            combinedText = combinedText.replace("{PeriodSecondary}", "June")
        }
        combinedText = combinedText.replace("{SkipPeriod}", "current")
        combinedText = combinedText.replace("{Period}", "May twenty seventeen")

        const detected = await detectIntent(combinedText, config.projectId, config.getToken());
        actualIntent = detected.queryResult.intent.displayName;
        
        const expectedIntent =intent.name;
        const input = combinedText
        const passed = actualIntent == expectedIntent;
        writer.write({status: passed ? "PASSED" : "FAILED",
        input: input,
        expected: expectedIntent,
        actual: actualIntent,
        error: ""
        })
        //console.log(this.currentTest.ctx)
        if( !passed) {
            failedCount++;
            testFailed[expectedIntent] = testFailed[expectedIntent] || [];
            testFailed[expectedIntent].push(input)
            if(failedCount % 10 == 0) {
                //persit data
                fs.writeJsonSync(path.join(__dirname,'./data/elaxa_failed.json'), testFailed, {spaces: 4});
            }
            console.error(colors.red("    ✘ ") + colors.yellow.underline(input) );
            console.log(colors.red("      expected: " + expectedIntent) + "\t" + colors.green("actual: " + actualIntent) )

        }
        else {
            console.error(colors.green("    ✔ ") + colors.grey(input) + "");
        }
    } catch(err) {
        console.log(colors.red(err))
    }
}
async function runTest() {
    let done = false;
    writer.pipe(fs.createWriteStream(path.join(__dirname,'./data/' + config.reportFileName)))
    testIntents.forEach((intent) =>  {
        var phrases = intent.samples
        eachLimit(phrases, config.concurrentTask || 50, async function(t, cb) {
            await runSingleTest(t, intent);
            cb()
            return true;    
        }, () => {done = true})
    }
    )
    while(!done) {
        await sleepSync();
    }
};

runTest().then(x => console.log("Finished!!!"))