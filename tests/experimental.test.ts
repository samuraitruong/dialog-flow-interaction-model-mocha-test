import "mocha"
import { expect , assert} from 'chai';
describe('sample test ', () => {
    it('sample test with update title', () => {
            console.log(this.title);
            this.expectedOutput = "abcded"
            //this._runnable.title = this._runnable.title + "hahahaha";
            expect(1).to.be.eq(11)
    });
    afterEach(function(){
        //console.log(this)
        if(this.currentTest && this.currentTest.state == "failed") {
            console.log(this.currentTest.err.message);
        }
        // /console.log(this.currentTest); //displays test title for each test method      
    });
});