
import DB from "../../db/db_configuration";


 export async function insertSlugRepository(
    params : {
        userId : string,
        slug: string
}) : Promise<void>{
    await DB.getPool().query(
            `
    INSERT INTO user_slug_settings (
        user_id,
        public_slug,
        is_public_enabled
    )
    VALUES(
    $1,
    $2,
    true
    )
    `,    
     [params.userId, params.slug]
    )

}


