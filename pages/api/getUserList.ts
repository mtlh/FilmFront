/* eslint-disable react-hooks/rules-of-hooks */
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function CreateList(req: NextApiRequest, res: NextApiResponse<any>) {
    const userid = req.query.userid;
    const supabase = createPagesBrowserClient();
    const { data } = await supabase
        .from('listcontent')
        .select('listid, listcontent')
        .eq('userid', userid)

    console.log(data);
    res.status(200).json({listid: data});
}
