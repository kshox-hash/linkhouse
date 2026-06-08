
import { insertSlugRepository } from "./slug.repository";
import { insertSlugSchema, InsertSlugDto } from "./slug.schema";

export async function insertSlugService(
    params : {
        userId : string,
        slug : string,
        
    }) :Promise<void> {

        const validatedData = insertSlugSchema.parse({
            slug : params.slug
        })
       return await insertSlugRepository({
        userId : params.userId,
        slug : validatedData.slug
       });
    }
