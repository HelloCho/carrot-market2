import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ConfigType, ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const config: ConfigType = {
    methods: ["GET", "POST"],
    handler
};

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    switch (req.method) {
        case "POST":
            /* const { name, price, description } = req.body;
            const { user } =  req.session; */
            const {
                body: { name, price, description },
                session: { user }
            } = req;
            const product = await client.product.create({
                data: {
                    name,
                    price: +price,
                    image: "product-sample-image",
                    description,
                    user:{
                        connect: {
                            id: user?.id
                        }
                    }
                }
            });
            console.log("server", product);
            return res.json({ok:true,product});
    
        case "GET":
            const products = await client.product.findMany({
                include: {
                    _count: {
                      select: {
                        favs: true,
                      }
                    }
                  }
            });
            return res.json({ok:true, products});
        
        default:
            return res.json({ok:false});
    }
    
}

export default withApiSession(withHandler(config));
