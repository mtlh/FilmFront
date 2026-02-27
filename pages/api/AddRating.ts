/* eslint-disable react-hooks/rules-of-hooks */
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function AddRating(req: NextApiRequest, res: NextApiResponse<any>) {
    const userid = req.query.userid;
    let itemid = req.query.itemid;
    let itemname = req.query.itemname;
    let image = req.query.image;
    let type = req.query.type;
    let rating = req.query.rating;
    let comment = req.query.comment;
    const added = new Date().toLocaleDateString("en-GB").toString();
    const supabase = createPagesBrowserClient();
    const {error, data} = await supabase.from('rating').upsert({ userid: userid, itemid: itemid, type: type, itemname: itemname, image: image, added: added, rating: rating?.toString(), comment: comment});
    res.status(200).json({message: "Added to ratings!", data: data, error: error});
}