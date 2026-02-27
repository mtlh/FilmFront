/* eslint-disable react-hooks/rules-of-hooks */
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function SaveList(req: NextApiRequest, res: NextApiResponse<any>) {
    const listid = req.query.listid;
    const summary = req.query.summary;
    const title = req.query.title;
    const items = req.query.items;
    const item_imgs = req.query.item_imgs;
    const datecreated = new Date().toLocaleTimeString("en-GB") + " " + new Date().toLocaleDateString();
    const supabase = createPagesBrowserClient();
    let ifitem = "";
    if (item_imgs) {
        ifitem = item_imgs.toString().split("$%$")[0];
        await supabase
        .from('listcontent')
        .update({ name: title, created: datecreated, summary: summary, list_img: ifitem, item_names: items, item_imgs: item_imgs})
        .eq('listid', listid)
    } else {
        await supabase
        .from('listcontent')
        .update({ name: title, created: datecreated, summary: summary, list_img: "https://eu.ui-avatars.com/api/?name=" + title, item_names: items, item_imgs: item_imgs})
        .eq('listid', listid)
    }
    res.status(200).json({message: "Saved list!"});
}