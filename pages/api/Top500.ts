import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

const baseimg = "https://image.tmdb.org/t/p/w500";

export const config = {
    runtime: "experimental-edge",
};

export default async function Top500(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createPagesBrowserClient();
    const checkmonth = await supabase.from("top500").select().eq("month", new Date().getMonth().toString() + new Date().getFullYear().toString());
    // @ts-ignore
    let new_month = false;
    try {
        let count = 0;
        for (var x in checkmonth.data){
            count++;
        }
        if (count == 0) {
            new_month = true;
        }
    } catch {}
    if (new_month == true) {
        let counter = 1;
        let movie_arr: any[] = [];
        let tv_arr: any[] = [];
        while ( counter < 20) {
            const moviepage = await fetch("https://api.themoviedb.org/3/movie/top_rated?page=" + counter + "&api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
            moviepage.results.forEach((movie: { title: string; popularity: number; poster_path: string; id: number, original_language: string, genre_ids: any[], revenue: string, release_date: string, vote_average: number}) => {
                var imgurl = "";
                if (movie.poster_path == null){
                    imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
                } else {
                    imgurl = baseimg + movie.poster_path;
                }
                if (movie.original_language == 'en') {
                    movie_arr.push([movie.title, movie.popularity, imgurl, movie.id, movie.genre_ids, movie.release_date, movie.vote_average])
                }
            });
            const tvpage = await fetch("https://api.themoviedb.org/3/tv/top_rated?page=" + counter + "&api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
            tvpage.results.forEach((tv: { name: string; popularity: number; poster_path: string; id: number, original_language: string, genre_ids: any[], first_air_date: string, vote_average: number}) => {
                var imgurl = "";
                if (tv.poster_path == null){
                    imgurl = "https://eu.ui-avatars.com/api/?name=" + tv.name;
                } else {
                    imgurl = baseimg + tv.poster_path;
                }
                if (tv.original_language == 'en') {
                    tv_arr.push([tv.name, tv.popularity, imgurl, tv.id, tv.genre_ids, tv.first_air_date, tv.vote_average])
                }
            });
            counter++;
        }
        await supabase.from("top500").upsert({"id": 1 , "movie": movie_arr, "tv": tv_arr, "month": new Date().getMonth().toString() + new Date().getFullYear().toString()}).eq("id", 1)
    }
    const body = "Completed function. Was it a new month -> " + new_month;
    return new Response(body);
}