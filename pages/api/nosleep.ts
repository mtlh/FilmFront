/* eslint-disable react-hooks/rules-of-hooks */
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function CreateList(req: NextApiRequest, res: NextApiResponse<any>) {
    const supabase = createPagesBrowserClient();

    const select = await supabase.from('top500').select().eq("id", 1);
    const insert = await supabase.from('top500').insert({"id": 2 , "movie": [], "tv": [], "month": ""});
    const del = await supabase.from('top500').delete().eq("id", 2);
    
    res.status(200).json({nosleep: true});
}
