import { expect } from "chai";
import "mocha";
import { getEntities, getIntents } from "../src";
import { getAccessToken } from '../src/index';
let allIntents : {intents?: any[]} = {};
const token = getAccessToken();
const project = "aglvoice-9894b"

describe("Common function test", async () => {

    it("getEntities() should return data", async() => {
        var entity = await getEntities(project, token)
        expect(entity).not.to.be.null;
    })
    it("getIntents() should return data", async() => {
        var entity = await getIntents(project, token)
        expect(entity).not.to.be.null;
    })
})
