/* eslint-disable react-hooks/rules-of-hooks */
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function DeleteRating(req: NextApiRequest, res: NextApiResponse<any>) {
    const userid = req.query.userid;
    let itemid = req.query.itemid;
    let type = req.query.type;
    const supabase = createPagesBrowserClient();
    const {error, data} = await supabase.from('rating').delete().eq("userid", userid).eq("itemid", itemid).eq("type", type);
    res.status(200).json({message: "Added to ratings!", data: data, error: error});
}