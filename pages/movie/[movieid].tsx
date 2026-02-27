/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import { useAutoAnimate } from '@formkit/auto-animate/react';
import Topcast from "../../components/Topcast";
import Topcrew from "../../components/Topcrew";
import Recommended from "../../components/Recommend";
import { Videos } from "../../components/Videos";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import Nav from '../../components/Nav';
import { getAvatarName } from '../../functions/getAvatarName';
import { ToastContainer } from 'react-toastify';
import { Collection } from '../../components/Collection';
import { Hero } from '../../components/Hero';
import { useEffect } from 'react';
import { compareSecondColumn } from '../../functions/SortSecond';
import { baseimg } from '../../functions/baseimg';
import { isDateWithin5Days } from '../../functions/checkDate';

export const getServerSideProps = async (ctx: any) => {
    const supabase = createPagesServerClient(ctx);
    const {
        data: { session },
    } = await supabase.auth.getSession()
    
    let UserData = await getAvatarName(session);
    // @ts-ignore
    let username = UserData.username;
    // @ts-ignore
    let avatar = UserData.avatar;

    let isloggedin = false;
    if (session) {
        isloggedin = true;
    }

    let langquery = await supabase.from('store_api').select().eq("created_at", new Date().toDateString());
    let already_exists = false;
    let response = "";
    // @ts-ignore
    try {already_exists = langquery.data[0].created_at == new Date().toDateString(); response = langquery.data[0];} catch {already_exists = false;}
    if (already_exists == false) {
        response = await fetch('https://api.themoviedb.org/3/configuration/languages' + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
        await supabase.from('store_api').upsert({ id: 1, created_at: new Date().toDateString(), content: response}).eq("id", 1)
    }
    // Fetch data from external API
    const movieid = ctx.query.movieid;
    let itemresponse = await supabase.from('itemresponse').select().eq("id", movieid).eq("type", "movie");
    let main= null;
    let videos= null;
    let recommend= null;
    let credits= null;
    if (itemresponse.data?.toString() != "[]" && itemresponse.data?.[0]?.lastupdate && isDateWithin5Days(new Date(itemresponse.data![0].lastupdate))) 
    {
        main = itemresponse.data![0].main;
        credits = itemresponse.data![0].credits; 
        recommend = itemresponse.data![0].recommend;
        videos = itemresponse.data![0].videos;
    } 
    else 
    {
        main = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
        credits = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/credits?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
        recommend = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/recommendations?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
        videos = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/videos?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());   
        await supabase.from('itemresponse').upsert({ id: movieid, type: "movie", main: main, credits: credits, recommend: recommend, videos: videos, lastupdate: new Date()})
    }

    // @ts-ignore
    let is_watchlist = await supabase.from('watchlist').select().eq("itemid", main.id).eq("userid", session?.user.id.toString()).eq("type", "movie");
    let watchlist_bool = false;
    // @ts-ignore
    if (is_watchlist.data?.length > 0) {
        watchlist_bool = true;
    }

    // @ts-ignore
    let is_rating = await supabase.from('rating').select().eq("itemid", main.id).eq("userid", session?.user.id.toString()).eq("type", "movie");
    let rating_bool = false;
    // @ts-ignore
    if (is_rating.data?.length > 0) {rating_bool = is_rating.data[0];};

    // Pass data to the page via props
    return { props: { main, credits, recommend, videos, response, isloggedin, username, avatar, watchlist_bool, rating_bool} }
}

export default function DisplayMovie( { main, credits, recommend, videos, response, isloggedin, username, avatar, watchlist_bool, rating_bool} : any) {
    const [parent] = useAutoAnimate<HTMLDivElement>();

    const castarr: (string | number)[][] = [];
    credits.cast.forEach((person: { original_name: string; popularity: number; profile_path: string; character: string; id: number}) => {
        var imgurl = "";
        if (person.profile_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + person.original_name;
        } else {
            imgurl = baseimg + person.profile_path;
        }
        castarr.push([person.original_name, person.popularity, imgurl, person.character, person.id])
    });
    castarr.sort(compareSecondColumn);

    useEffect(() => {
        //preloading image
        castarr.forEach((movie) => {
          const img = new Image();
          img.src = movie[2].toString();
        });
    }, [castarr]);

    const crewarr: (string | number)[][] = [];
    const namesarr: (string)[] = [];
    var counter = 0;
    credits.crew.forEach((person: { original_name: string; popularity: number; profile_path: string; job: string; id: number}) => {
        if (namesarr.indexOf(person.original_name) > -1){
            crewarr[namesarr.indexOf(person.original_name)][3] = crewarr[namesarr.indexOf(person.original_name)][3] + " / " + person.job;
        } else {
            var imgurl = "";
            if (person.profile_path == null){
                imgurl = "https://eu.ui-avatars.com/api/?name=" + person.original_name;
            } else {
                imgurl = baseimg + person.profile_path;
            }
            namesarr.push(person.original_name);
            crewarr.push([person.original_name, person.popularity, imgurl, person.job, person.id, counter])
        }
        counter++;
    });
    crewarr.sort(compareSecondColumn);

    useEffect(() => {
        //preloading image
        crewarr.forEach((movie) => {
          const img = new Image();
          img.src = movie[2].toString();
        });
    }, [crewarr]);

    return (
        <>
            <Nav isloggedin={isloggedin} username={username} avatar={avatar} />
            <Hero main={main} response={response} watchlist_bool={watchlist_bool} rating_bool={rating_bool} type={"movie"} />
            <p className="mt-6 text-lg leading-8 text-white flex md:hidden max-w-xl m-auto p-6">
                {main.overview}
            </p>
            <div className="grid p-2 grid-cols-1 max-w-6xl m-auto pb-40">
                <div className="" ref={parent}>
                    <Topcast castcredit={castarr} />
                    <Topcrew crewcredit={crewarr} />
                    <Videos videos={videos} />
                    <Recommended recommend={recommend} type="movie" />
                    <Collection collection={main.belongs_to_collection}  />
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}