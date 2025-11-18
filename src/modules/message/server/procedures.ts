import { z } from "zod";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const messageRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const message = await prisma.message.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return message;
  }),
  create: baseProcedure
    .input(
      z.object({ value: z.string().min(1, { message: "Message is required" }) })
    )
    .mutation(async ({ input }) => {
      const newMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
        },
      });

      return newMessage;
    }),
});
