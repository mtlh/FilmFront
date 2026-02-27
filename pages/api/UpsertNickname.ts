/* eslint-disable react-hooks/rules-of-hooks */
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function UpsertNickname(req: NextApiRequest, res: NextApiResponse<any>) {
    const userid = req.query.userid;
    const supabase = createPagesBrowserClient();
    const {data} = await supabase.from('user_nicknames').select("nickname").eq("userid", userid);
    try {
        // @ts-ignore
        let test = data[0].nickname;
    } catch{
        await supabase.from('user_nicknames').upsert({'userid': userid, 'nickname': 'Username', 'avatar': 1}).select();
    }
    res.status(200).json({message: "Complete"});
}