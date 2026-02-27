/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useSession } from '@supabase/auth-helpers-react';
import axios from 'axios';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse, PreviewData } from 'next';
import router from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Nav from "../../components/Nav";
import { getAvatarName } from '../../functions/getAvatarName';

const baseimg = "https://image.tmdb.org/t/p/w500";

export async function getServerSideProps(ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
    // Fetch data from external API
    const collectionid = ctx.query.collectionid;
    const main = await fetch("https://api.themoviedb.org/3/collection/" + collectionid + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    // Pass data to the page via props
    const supabase = createPagesServerClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    let UserData = await getAvatarName(session);
    let username = UserData.username;
    let avatar = UserData.avatar;

    let isloggedin = false;
    if (session) {
        isloggedin = true;
    }

     let is_watchlist = await supabase.from('watchlist').select().eq("itemid", main.id).eq("userid", session?.user.id.toString()).eq("type", "collection");
     let watchlist_bool = false;
     // @ts-ignore
     if (is_watchlist.data?.length > 0) {
         watchlist_bool = true;
     }
 
     let is_rating = await supabase.from('rating').select().eq("itemid", main.id).eq("userid", session?.user.id.toString()).eq("type", "collection");
     let rating_bool = false;
     // @ts-ignore
     if (is_rating.data?.length > 0) {rating_bool = is_rating.data[0];};
     
    return { props: { main, isloggedin, username, avatar, watchlist_bool, rating_bool } }
}

export default function DisplayCollection( { main, isloggedin, username, avatar, watchlist_bool, rating_bool } : any) {
    const backdrop_img = "url(https://image.tmdb.org/t/p/original" + main.backdrop_path + ")";
    const poster_img = baseimg + main.poster_path;
    const [parent] = useAutoAnimate<HTMLDivElement>();

    const partsarr: (string | number)[][] = [];
    var counter = 0;
    main.parts.forEach((movie: { title: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        partsarr.push([movie.title, movie.popularity, imgurl, movie.job, movie.id, counter])
        counter++;
    });
    partsarr.sort(compareSecondColumn);

    const [movie_loading, setMovieLoading] = useState("test");
    const display_parts = partsarr.map((movie : any) =>
        <div key={movie[4]} className="group cursor-pointer relative inline-block text-center">
            {movie_loading.toString() == movie[4].toString() ?
                <>
                    <img id={movie[4].toString()} src={movie[2].toString()} alt={movie[0].toString()} className="rounded-3xl w-60 p-2 h-70 grayscale" />
                    <div role="status" className="absolute z-10 left-1/3 right-1/3 top-1/3 bottom-1/3 m-auto">
                        <svg aria-hidden="true" className="inline w-14 h-14 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </>
                :
                <>
                    <button onClick={() => {setMovieLoading(movie[4].toString()); router.push("/movie/" + movie[4])}}>
                        <img id={movie[4].toString()} src={movie[2].toString()} alt={movie[0].toString()} className="rounded-3xl w-60 p-2 h-70" />
                        <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                            <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                                {movie[0]}
                            </span>
                        </div>
                    </button>
                </>
            }
        </div>
    );

    const display_names = partsarr.map((movie : any) =>
        <li key={movie[4]} className="group cursor-pointer">
            <button onClick={() => router.push("/movie/" + movie[4])}>
                {movie[0]}
            </button>
        </li>
    );

    const session = useSession();

    const AddWatchlistToast = () => toast.success('Added to watchlist', {position: "bottom-right",autoClose: 2000,hideProgressBar: false,closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "dark",});
    async function AddWatchlist(userid: string, itemid: any, itemname: any, image: any, type: any) { 
        AddWatchlistToast();
        const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/AddWatchlist", {params: {userid: userid, itemid: itemid, itemname: itemname, type: type, image: image}});
        router.push({
            pathname: router.pathname,
            query: { ...router.query },
        }, undefined, { scroll: false });
    }
    const RemoveWatchlistToast = () => toast.success('Removed from watchlist', {position: "bottom-right",autoClose: 2000,hideProgressBar: false,closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "dark",});
    async function RemoveWatchlist(userid: string, itemid: any, type: any) { 
        RemoveWatchlistToast();
        const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/RemoveWatchlist", {params: {userid: userid, itemid: itemid, type: type}});
        router.push({
            pathname: router.pathname,
            query: { ...router.query },
        }, undefined, { scroll: false });
    }

    const AddRatingToast = () => toast.success('Added rating', {position: "bottom-right",autoClose: 2000,hideProgressBar: false,closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "dark",});
    async function AddRating(userid: string, itemid: any, itemname: any, image: any, type: any, comment: any, rating: any) { 
        AddRatingToast();
        const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/AddRating", {params: {userid: userid, itemid: itemid, itemname: itemname, type: type, image: image, comment: comment, rating: rating}});
        router.push({
            pathname: router.pathname,
            query: { ...router.query },
        }, undefined, { scroll: false });
    }
    const DeleteRatingToast = () => toast.success('Deleted rating', {position: "bottom-right",autoClose: 2000,hideProgressBar: false,closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "dark",});
    async function DeleteRating(userid: string, itemid: any, itemname: any, image: any, type: any, comment: any, rating: any) { 
        DeleteRatingToast();
        setInput("");
        setRatingRange(5);
        const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/DeleteRating", {params: {userid: userid, itemid: itemid, itemname: itemname, type: type, image: image, comment: comment, rating: rating}});
        router.push({
            pathname: router.pathname,
            query: { ...router.query },
        }, undefined, { scroll: false });
    }
    
    const [currentinput, setInput] = useState(rating_bool.comment);
    const InputChange = (value: any) => {
        setInput(value);
    }
    let start_rating = rating_bool.rating;
    if (rating_bool.rating){
        start_rating = 5;
    }
    const [ratingRange, setRatingRange] = useState(start_rating);
    const RatingChange = (value: any) => {
        setRatingRange(value);
    }
    
    return (
        <>
            <Nav isloggedin={isloggedin} username={username} avatar={avatar} />
            <main>
                <div style={{backgroundImage: backdrop_img}} className="relative px-6 lg:px-8 backdrop-brightness-50 bg-fixed bg-center bg-cover h-screen">
                    <div className="grid grid-cols-6 mx-auto max-w-6xl pt-6 pb-32 sm:pt-16 sm:pb-40 items-stretch">
                        <img src={poster_img} alt={main.name.toString()} className="w-100 invisible md:visible md:rounded-l-3xl md:col-span-2" />
                        <div className="bg-white bg-opacity-75 shadow-md rounded-3xl md:rounded-r-3xl md:rounded-none col-span-6 md:col-span-4 pl-6 p-4">
                            <div className="p-2">
                                <h1 className="text-4xl text-black font-bold tracking-tight sm:text-6xl drop-shadow-sm">
                                    {main.name}
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-black">
                                    {main.overview}
                                </p>
                                <ul className="mt-6 text-lg leading-8 text-black list-disc pl-6">
                                    {display_names}
                                </ul>
                            </div>
                            <div className="mt-6 flex gap-x-4">
                                    {session && 
                                        <>
                                            <input type="checkbox" id="my-modal" className="modal-toggle" />
                                            <div className="modal">
                                                <div className="modal-box m-auto max-w-2xl text-left">
                                                    <p className='pb-4 font-bold text-xl text-black'>Rate '{main.name}'</p>
                                                    <p className='pb-4 font-normal text-md text-black'>Score: {ratingRange}</p>
                                                    <input type="range" min="0" max="10" className="range range-primary p-4 ring-1 ring-slate-700 mb-4 " step="0.1" value={ratingRange} onChange={(e) => RatingChange(e.target.value)} />
                                                    <p className='pb-4 font-normal text-md text-black'>Your comment:</p>
                                                    <div className="mb-3 text-left m-auto w-full">
                                                        <div className="input-group items-stretch w-full mb-6">
                                                            <textarea value={currentinput} onChange={(e) => InputChange(e.target.value)}
                                                                className="textarea textarea-bordered textarea-md w-full text-black" 
                                                                placeholder="Rating Comment" aria-label="Text" aria-describedby="button-addon2"
                                                             />
                                                        </div>
                                                    </div>
                                                    <div className="modal-action gap-2">
                                                        {session && rating_bool != false ?
                                                            <button
                                                                onClick={() => AddRating(session.user.id, main.id, main.name, poster_img, "collection", currentinput, ratingRange)}
                                                                className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-green-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-green-300 ease-in-out transition"
                                                            >
                                                                Update Rating
                                                            </button>
                                                            :
                                                            <button
                                                                onClick={() => AddRating(session.user.id, main.id, main.name, poster_img, "collection", currentinput, ratingRange)}
                                                                className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-green-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-green-300 ease-in-out transition"
                                                            >
                                                                Create Rating
                                                            </button>
                                                        }
                                                        {session && rating_bool != false &&
                                                            <button
                                                                onClick={() => DeleteRating(session.user.id, main.id, main.name, poster_img, "collection", currentinput, ratingRange)}
                                                                className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-red-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-red-300 ease-in-out transition"
                                                            >
                                                                Delete Existing Rating
                                                            </button>
                                                        }
                                                        <label htmlFor="my-modal" className="inline-block rounded-lg bg-slate-600 px-4 py-1.5 text-lg font-semibold leading-7 text-white shadow-md hover:bg-slate-500 hover:text-white hover:scale-110 ease-in-out transition">Close</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {session && watchlist_bool == false &&
                                        <button
                                            onClick={() => AddWatchlist(session.user.id, main.id, main.name, poster_img, "collection")}
                                            className="text-center inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-green-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-green-300 ease-in-out transition"
                                        >
                                            Watchlist+
                                        </button>
                                    }
                                    {session && watchlist_bool == true &&
                                        <button
                                            onClick={() => RemoveWatchlist(session.user.id, main.id, "collection")}
                                            className="text-center inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-red-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-red-300 ease-in-out transition"
                                        >
                                            Watchlist-
                                        </button>
                                    }
                                    {session && rating_bool != false &&
                                        <label htmlFor="my-modal" className="text-center inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-red-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-red-300 ease-in-out transition">
                                            Rating-
                                        </label>
                                    }
                                    {session && rating_bool == false &&
                                        <label htmlFor="my-modal" className="text-center inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-green-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-green-300 ease-in-out transition">
                                            Rating+
                                        </label>
                                    }
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="text-3xl leading-8 font-bold pr-4 mt-6 max-w-6xl m-auto pl-2">Parts of collection: </div>
            <div className="max-w-6xl m-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
                {display_parts}
            </div>
        </>
    )
}

function compareSecondColumn(a: any, b: any) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (b[1] < a[1]) ? -1 : 1;
    }
}
