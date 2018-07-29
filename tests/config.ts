import {getAccessToken} from "../src";
import * as moment from "moment";
let lastTokenIssuedTime = moment().unix();
export const config = {
  projectId: "aglvoicedev-5b72b",
  serviceAccount: 'automation1@aglvoicedev-5b72b.iam.gserviceaccount.com',
  token: getAccessToken(),
  reportFileName: "BillAmount_reports.csv",
  concurrentTask: 5,
  tests: {
    BillAmountIntent: true,
    AccountBalanceIntent: false,
    UsageCostIntent: false,
    BillDueDateIntent: false,
    PaymentExtensionIntent: false,
    EBillingIntent: false
  },
  getToken: function () {
    const now =  moment().unix();
    if(now - lastTokenIssuedTime > 15*60000) {
      this.token = getAccessToken();
    }
    return this.token;
  }
}
