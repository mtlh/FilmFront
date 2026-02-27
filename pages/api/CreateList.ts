/* eslint-disable react-hooks/rules-of-hooks */
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function CreateList(req: NextApiRequest, res: NextApiResponse<any>) {
    const userid = req.query.userid;
    const listid = makeid(12);
    const datecreated = new Date().toLocaleDateString("en-GB").toString();
    const supabase = createPagesBrowserClient();
    await supabase
        .from('listcontent')
        .insert({ userid: userid, listid: listid, name: "myList", summary: "This is a template summary, please click view list below to edit this...", 
            item_names: "", item_imgs: "", created: datecreated, list_img: "https://eu.ui-avatars.com/api/?name=myList"
        })
    res.status(200).json({listid: listid});
}

function makeid(length: number) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}