import "mocha"
import { assert, expect} from "chai"
import * as fs from "fs-extra";
import * as path from "path";
import { detectIntent } from "../src";
import { getAccessToken } from '../src/index';

describe("Sample Test", () => {
    const source = fs.readJsonSync(path.join(__dirname, "./data/utterances.json")) 
    const token = getAccessToken();
    const project = "sample-c23fa"
    const expectedIntent = "HelloIntent"
    before(()=> {
        console.log(source)

    })
    source.forEach(text => {
        it(`"${text}" to be resolved to Intent:  ${expectedIntent}`, async () => {
            const detect =  await detectIntent(text, project, token);
            expect(detect.queryResult.intent.displayName).to.be.eq(expectedIntent)
        })    
    });
    
})