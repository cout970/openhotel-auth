import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { PASSWORD_REGEX } from "shared/consts/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { Account } from "shared/types/account.types.ts";

export const changePassPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/change-pass",
  kind: RequestKind.PUBLIC,
  func: async (request, url) => {
    const { password, rePassword, token } = await request.json();

    if (!password || !rePassword || !token) {
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Some input is missing",
      });
    }

    if (!new RegExp(PASSWORD_REGEX).test(password) || password !== rePassword) {
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Invalid password",
      });
    }

    const recoverRequest = await System.db.get(["passRecoverRequests", token]);

    if (!recoverRequest) {
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Recover password request has expired, please send a new one",
      });
    }

    const account: Account | undefined = await System.db.get([
      "accounts",
      recoverRequest.accountId,
    ]);

    if (!account) {
      return getResponse(HttpStatusCode.NOT_FOUND, {
        message: "Account is gone",
      });
    }

    account.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));

    await System.db.set(["accounts", recoverRequest.accountId], account);

    await System.db.delete(["passRecoverRequests", token]);

    return getResponse(HttpStatusCode.OK);
  },
};
