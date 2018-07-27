import {getAccessToken} from "../src";
import * as moment from "moment";
let lastTokenIssuedTime = moment().unix();
export const config = {
  projectId: "aglvoicedev-5b72b",
  serviceAccount: 'automation1@aglvoicedev-5b72b.iam.gserviceaccount.com',
  token: getAccessToken(),
  reportFileName: "EBillingIntent_reports.csv",
  tests: {
    BillAmountIntent: false,
    AccountBalanceIntent: false,
    UsageCostIntent: false,
    BillDueDateIntent: false,
    PaymentExtensionIntent: false,
    EBillingIntent: true
  },
  getToken: function () {
    const now =  moment().unix();
    if(now - lastTokenIssuedTime > 15*60000) {
      this.token = getAccessToken();
    }
    return this.token;
  }
}
