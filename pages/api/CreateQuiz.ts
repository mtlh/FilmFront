/* eslint-disable react-hooks/rules-of-hooks */
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function CreateList(req: NextApiRequest, res: NextApiResponse<any>) {
    const userid = req.query.userid;
    const quizid = makeid(12);
    const datecreated = new Date().toLocaleTimeString("en-GB") + " " + new Date().toLocaleDateString();
    const supabase = createPagesBrowserClient();
    await supabase
        .from('quizcontent')
        .insert({ userid: userid, quizid: quizid, quizcontent: 
            {quizname: "myQuiz", created: datecreated, quizid: quizid, summary: "This is a template summary, please click view list below to edit this..."}
        })
    res.status(200).json({quizid: quizid});
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