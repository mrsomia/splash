import { z } from "zod";

const myEnv = z.object({
  DATABASE_URL: z.string(),
  SHADOW_DATABASE_URL: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_CLIENT_ID: z.string(),
});

myEnv.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof myEnv> {}
  }
}
