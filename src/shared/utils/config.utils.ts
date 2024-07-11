import { readYaml, writeYaml } from "./yaml.utils.ts";
import { ConfigTypes } from "shared/types/config.types.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";

export const getConfig = async (): Promise<ConfigTypes> => {
  let config: ConfigTypes;
  try {
    config = await readYaml<ConfigTypes>("./config.yml");
  } catch (e) {}

  const defaults: ConfigTypes = {
    port: config?.port || CONFIG_DEFAULT.port,
    database: {
      filename: config?.database.filename || CONFIG_DEFAULT.database.filename,
    },
  };
  try {
    await writeYaml<ConfigTypes>("./config.yml", defaults, { async: true });
  } catch (e) {}

  return defaults;
};
