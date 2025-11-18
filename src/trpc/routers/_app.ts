import { createTRPCRouter } from "../init";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { messagesRouter } from "@/modules/messages/server/procedures";

export const appRouter = createTRPCRouter({
  message: messagesRouter,
  project: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
