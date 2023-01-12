import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client"
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    await client.user.create({
        data: {
            name:"Baek",
            email:"baek@google.com"
        }
    });

    res.json({
        ok: true,
        data: "xx"
    })
}