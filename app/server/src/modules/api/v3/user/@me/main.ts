import { RequestType, getPathRequestList } from "@oh/utils";
import { mainGetRequest } from "./main.request.ts";
import { connectionRequestList } from "./connection/main.ts";
import { scopesGetRequest } from "./scopes.request.ts";
import { emailGetRequest } from "./email.request.ts";
import { licenseRequestList } from "./license/main.ts";

export const meRequestList: RequestType[] = getPathRequestList({
  requestList: [
    mainGetRequest,
    scopesGetRequest,
    emailGetRequest,
    ...connectionRequestList,
    ...licenseRequestList,
  ],
  pathname: "/@me",
});
