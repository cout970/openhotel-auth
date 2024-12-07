import { useApi } from "./useApi";
import { useCallback } from "react";
import { RequestMethod } from "shared/enums";
import { useAccount } from "./useAccount";

export const useConnection = () => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const remove = useCallback(
    async (hotelId: string, integrationId: string) => {
      return fetch({
        method: RequestMethod.DELETE,
        pathname: `/user/@me/connection?hotelId=${hotelId}&integrationId=${integrationId}`,
        headers: getAccountHeaders(),
      });
    },
    [fetch, getAccountHeaders],
  );

  const getList = useCallback(async () => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: "/user/@me/connection",
      headers: getAccountHeaders(),
    });

    return data.connections;
  }, [fetch]);

  const get = useCallback(
    async (hotelId: string, integrationId: string) => {
      const { data } = await fetch({
        method: RequestMethod.GET,
        pathname: `/user/@me/connection?hotelId=${hotelId}&integrationId=${integrationId}`,
        headers: getAccountHeaders(),
      });

      return data.connection;
    },
    [fetch],
  );

  const add = useCallback(
    async (
      hotelId: string,
      integrationId: string,
      state: string,
      scopes: string[],
    ) => {
      return fetch({
        method: RequestMethod.POST,
        pathname: `/user/@me/connection`,
        headers: getAccountHeaders(),
        body: { hotelId, integrationId, state, scopes },
      });
    },
    [fetch, getAccountHeaders],
  );

  const ping = useCallback(async (connectionId: string) => {
    const { data } = await fetch({
      method: RequestMethod.PATCH,
      pathname: `/user/@me/connection/ping?connectionId=${connectionId}`,
      headers: getAccountHeaders(),
    });

    return data;
  }, []);

  return {
    add,
    remove,
    get,
    getList,
    ping,
  };
};