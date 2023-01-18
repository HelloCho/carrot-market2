import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ConfigType, ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const config: ConfigType = {
    methods: ["GET"],
    handler
};

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    const { query: {id}, session: {user}} = req
    
    switch (req.method) {
        case "GET":
            
            const product = await client.product.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    _count: {
                        select: {
                            favs: true
                        }
                    }
                }
            });
            
            const terms = product?.name.split(" ").map((word) => ({
                name: {
                    contains: word
                }
            }));

            const relatedProducts = await client.product.findMany({
                where: {
                    OR: terms,
                    NOT: {
                        id: product?.id
                    }
                }
            });
            const isLiked = Boolean(await client.fav.findFirst({
                select: {
                    id: true
                },
                where: {
                    productId: product?.id,
                    userId: user?.id
                }
            }));
            // console.log(relatedProducts);
            return res.json({ok:true, product, isLiked,relatedProducts});
        
        default:
            return res.json({ok:false});
    }
    
}

export default withApiSession(withHandler(config));
