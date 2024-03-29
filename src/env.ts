import { z } from "zod";

const myEnv = z.object({
  DATABASE_URL: z.string(),
  SHADOW_DATABASE_URL: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  NEXT_PUBLIC_VAPID_ID_KEY: z.string(),
  PRIVATE_VAPID_ID_KEY: z.string(),
});

myEnv.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof myEnv> {}
  }
}
