// import { prisma } from "./prisma";
// import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";

// export async function createUser(id: string) {
//   const clerkUser = await clerkClient.;

//   const email = clerkUser.emailAddresses[0]?.emailAddress;
//   if (!email) throw new Error("No email found");

//   return await prisma.user.create({
//     data: {
//       clerkId: id,
//       email: email,
//       credits: 10, // 初期クレジット
//     },
//   });
// }

// export async function handleWebhook(event: WebhookEvent) {
//   switch (event.type) {
//     case "user.created":
//       await createUser(event.data.id);
//       break;

//     case "user.deleted":
//       // Clerkでユーザーが削除された場合、DBからも削除
//       await prisma.user.delete({
//         where: { clerkId: event.data.id },
//       });
//       break;
//   }
// }
