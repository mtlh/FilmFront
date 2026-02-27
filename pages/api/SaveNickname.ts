/* eslint-disable react-hooks/rules-of-hooks */
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function SaveNickname(req: NextApiRequest, res: NextApiResponse<any>) {
    const userid = req.query.userid;
    const nickname = req.query.nickname;
    const supabase = createPagesBrowserClient();
    const {data} = await supabase.from('user_nicknames').update({nickname: nickname}).eq("userid", userid);
    res.status(200).json({message: "Complete"});
}