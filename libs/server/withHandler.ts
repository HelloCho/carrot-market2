import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
    ok: boolean;
    [key: string]: any;
}
type method = "GET"|"POST"|"PUT"|"DELETE";
export interface ConfigType {
    methods: method[],
    handler:(req: NextApiRequest, res: NextApiResponse) => void,
    isPrivate?: boolean
}
export default function withHandler({methods, handler, isPrivate = true}: ConfigType) {

    return async function (req: NextApiRequest, res: NextApiResponse): Promise<any> {
        // console.log("Session : ", isPrivate, req.session);
        if(isPrivate && !req.session.user) {
            return res.status(401).json({ok:false});
        }
        if(req.method && !methods.includes(req.method as any)) {
            console.log(req.method, methods, "Not match.");
            return res.status(405).end();
        }
        try {
            await handler(req, res);
        } catch(error) {
            console.log(error);
            return res.status(500).json({error});
        }
    };
}