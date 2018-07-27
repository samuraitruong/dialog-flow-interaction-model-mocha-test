import { expect } from "chai";
import "mocha";
import { getEntities, getIntents } from "../src";
import {config} from "./config";
let allIntents : {intents?: any[]} = {};

describe("Common function test", async () => {

    it("getEntities() should return data", async() => {
        var entity = await getEntities(config.projectId, config.token)
        expect(entity).not.to.be.null;
    })
    it("getIntents() should return data", async() => {
        var entity = await getIntents(config.projectId, config.token)
        expect(entity).not.to.be.null;
    })
})
