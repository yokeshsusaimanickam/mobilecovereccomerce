import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
 
const f = createUploadthing();
 
 /* we can press shift+alt+o to get rid of unused import */
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
  .input(z.object({configId:z.string().optional()}))
    .middleware(async ({ input }) => {
     return {input}
    })
    /* The metadata we return here contain cofig id. Whatever we return from the middleware that's how
     we pass data around middleware to handler function*/
    .onUploadComplete(async ({ metadata, file }) => {
      const {configId}=metadata.input
      return { configId }
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;