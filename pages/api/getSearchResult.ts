import { NextApiRequest, NextApiResponse } from "next";

export default async function getSearchResult(req: NextApiRequest, res: NextApiResponse) {
    const term = req.query.searchterm;
    const type = req.query.type;
    const movie = await fetch("https://api.themoviedb.org/3/search/" + type + "?query=" + term + "&api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    res.status(200).json({result: movie});
}