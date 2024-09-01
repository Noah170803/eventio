import { parseEnv } from "znv";
import { z } from "zod";

export const { MY_SQL_CONNECTION_STRING } = parseEnv(process.env, {
	MY_SQL_CONNECTION_STRING: z.string(),
});
