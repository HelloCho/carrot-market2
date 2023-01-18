import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ConfigType, ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const config: ConfigType = {
    methods: ["GET"],
    handler
};

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    
    console.log(req.session.user);
    const profile = await client.user.findUnique({
        where: {
            id: req.session.user?.id
        }
    });
    await req.session.save();
    return res.json({ok:true,profile});
}

export default withApiSession(withHandler(config));
