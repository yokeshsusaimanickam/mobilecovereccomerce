import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
/* library we use for get image height and width */
import sharp from "sharp"; 
import { db } from "@/db";
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
      /* image size getting */
      const res=await fetch(file.url)
      const buffer=await res.arrayBuffer()
      const imgMetadata=await sharp(buffer).metadata()
      const {width,height}=imgMetadata

      if(!configId){
        const configuration=await db.configuration.create({
          data:{
            imageUrl:file.url,
            height:height||500,
            width:width||500,
          },
        })
        return {configId:configuration.id}
      }else{
        const updatedConfiguration=await db.configuration.update({
          // when we update the value we need to show where it needs to be unique
          where:{
              id:configId
          },
          data:{
            croppedImageUrl:file.url
          },
        })
        return {configId:updatedConfiguration.id}
      }
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;