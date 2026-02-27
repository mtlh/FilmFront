/* eslint-disable react-hooks/rules-of-hooks */
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function UpdateTrivia(req: NextApiRequest, res: NextApiResponse<any>) {
    const userid = req.query.userid;
    let answer = req.query.answer;
    if (answer != undefined){
        answer = JSON.parse(answer?.toString());
    }
    const supabase = createPagesBrowserClient();

    const userhistory = await supabase.from("trivia_scores").select().eq("userid", userid);
    let history = [];
    try {
        // @ts-ignore
        history = userhistory.data[0].history;
        if (history != null) {
            history.push(answer);
        } else {
            history = [answer];
        }
    } catch (e) {console.log(e)}
    let total = 0;
    let correct = 0;
    for (var count in history) {
        let parsed;
        if (total+1 == history.length){
            parsed = history[total];
        } else {
            parsed = JSON.parse(history[total]);
        }
        if (parsed.correct == true){
            correct+=1;
        }
        total+=1;
    }
    const {data} = await supabase.from('trivia_scores').upsert({"userid": userid, "history": history, overall_percent: ((correct/total)*100)}).eq("userid", userid);

    res.status(200).json({message: "Updated trivia.", answer: answer, history: history, total: total, correct: correct});
}