import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ConfigType, ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

const config: ConfigType = {
    methods: ["POST"],
    handler,
    isPrivate: false
};

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    // console.log("Session : ",req.session);
    const { token } = req.body;
    // console.log(token);
    const fountToken = await client.token.findUnique({
        where: {
            payload: token
        }
        /* ,include: {
            user: true -> 유저 정보까지 호출.
        } */
    });
    if(!fountToken) {
        return res.status(404).json({ok:false});
    }
    // console.log(fountToken);
    req.session.user = {
        id: fountToken?.userId
    };
    await req.session.save();
    console.log("Fount token", fountToken);
    await client.token.deleteMany({
        where:{
            userId: fountToken.userId
        }
    });
    return res.json({ok:true});
}

export default withApiSession(withHandler(config));
