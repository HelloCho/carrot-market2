import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ConfigType, ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const config: ConfigType = {
    methods: ["POST"],
    handler
};

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    switch (req.method) {
        case "POST":
            const { query: {id}, session: {user} } = req;
            const exist = await client.fav.findFirst({
                where: {
                    productId: Number(id),
                    userId: Number(user?.id)
                }
            })
            console.log(`${req.method}, method and ${exist}`);
            if(exist) {
                // delete
                console.log("delete");
                await client.fav.delete({
                    where: {
                        id: exist.id
                    }
                });
            } else {
                // create
                console.log("create");
                await client.fav.create({
                    data: {
                        user: {
                            connect: {id: user?.id}
                        },
                        product: {
                            connect: {id: Number(id)}
                        }
                    }
                });
            }

            return res.json({ok:true, id});
        default:
            return res.json({ok:false});
    }
    
}

export default withApiSession(withHandler(config));
