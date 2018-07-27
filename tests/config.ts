import {getAccessToken} from "../src"

export const config = {
  projectId: "aglvoice-9894b",
  token: getAccessToken(),
  tests: {
    BillAmountIntent: true
  }
}
