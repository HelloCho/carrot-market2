import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ConfigType, ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { create } from "domain";
import Upload from "pages/products/upload";

import twilio from "twilio";
import mail from "@sendgrid/mail";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const sendgridClient = mail.setApiKey(process.env.SENDGRID_KEY!);

const config: ConfigType = {
    methods: ["POST"],
    handler,
    isPrivate: false
};

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    // console.log("Server :", req.body);
    // if(req.method?.toLowerCase() !== "post") {
    //     res.status(401).end();
    // }

    const { email, phone } = req.body;
    const user = phone ? {phone} : {email} ? {email} : null;
    if(!user) return res.status(400).json({ok:false});
    const payload = Math.floor(100000+ Math.random() * 900000).toString();
/*     const user = await client.user.upsert({
        where: {
            // ...(phone && {phone: +phone}),
            // ...(email && {email})
            ...payload,
        },
        create: {
            name: "Anonymous",
            // ...(phone && {phone: +phone}),
            // ...(email && {email})
            ...payload,
        },
        update: {},
    });
    console.log(user); */
    const token = await client.token.create({
        data: {
            payload,
            user: {
                connectOrCreate: {
                    // id: user.id
                    where: {
                        // ...(phone && {phone: +phone}),
                        // ...(email && {email})
                        ...user,
                    },
                    create: {
                        name: "Anonymous",
                        // ...(phone && {phone: +phone}),
                        // ...(email && {email})
                        ...user,
                    },
                },
            },
        },
    });

    if(phone) {
        // const message = await twilioClient.messages.create({
        //     messagingServiceSid: process.env.TWILIO_MSID,
        //     to: process.env.MY_PHONE!,
        //     body: `This token is ${payload}.`
        // });
        // console.log(message);
    } else if(mail) {
        
        // const msg = {
        //     to: "skidrow0802@gmail.com", // Change to your recipient
        //     from: "tom@kla.so", // Change to your verified sender
        //     subject: "Sending with SendGrid is Fun With Carrot-market",
        //     text: `and easy to do anywhere, even with Node.js ㅇㅅㅇ!\nYour token is ${payload}.`,
        //     html: `<strong>and easy to do anywhere, even with Node.js : )</strong><bn/><h1>Your token is ${payload}.</h1>`,
        // };
        
        // const email = await mail.send(msg);
        // .then(() => {
        //   console.log('Email sent')
        // })
        // .catch((error) => {
        //   console.error(error)
        // });
        // console.log(email);
    }
    /* let user;
    if(email) {
        user = await client.user.findUnique({
            where: {
                email
            }
        });
        
        if(!user) {
            console.log("Didn't find the user's email. So, will create.");
            user = await client.user.create({
                data : {
                    name: "Anomymous",
                    email
                }
            });
            console.log(user);
        } else {
            console.log("found it.", user);
        }
    }
    if(phone) {
        user = await client.user.findUnique({
            where: {
                email
            }
        });
        
        if(!user) {
            console.log("Didn't find the user's email. So, will create.");
            user = await client.user.create({
                data : {
                    name: "Anomymous",
                    email
                }
            });
            console.log(user);
        } else {
            console.log("found it.", user);
        }
    }
 */
    // return res.status(200).end();
    return res.json({ok:true});
}

export default withHandler(config);
