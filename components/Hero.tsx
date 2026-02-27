/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { useSession } from "@supabase/auth-helpers-react";
import axios from "axios";
import router from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { baseimg } from "../functions/baseimg";

export function Hero ({ main, response, watchlist_bool, rating_bool, type } : any) {
    const backdrop_img = "url(https://image.tmdb.org/t/p/original" + main.backdrop_path + ")";
    const poster_img = baseimg + main.poster_path;
    const imdblink = "https://www.imdb.com/title/" + main.imdb_id;
    const revtotal = "£" + new Intl.NumberFormat('en-GB').format(main.revenue);

    let tag = main.status + " " + new Date(main.release_date).toLocaleDateString("en-GB") + " / " + main.runtime + " minutes / " +  revtotal;

    let name: string = main.title;
    if (type != "movie") {
        name = main.name;
        tag = main.status + " / " + main.number_of_episodes + " episodes / " + main.number_of_seasons + " season(s)";
    }

    let lang = "";
    for (let x in response.content) {
        if (response.content[x].iso_639_1 == main.original_language) {
            lang = response.content[x].english_name;
        }
    }

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
            <main>
                <div style={{backgroundImage: backdrop_img}} className="relative px-6 lg:px-8 backdrop-brightness-50 bg-scroll lg:bg-fixed bg-center bg-cover bg-no-repeat min-h-screen">
                <div className="grid grid-cols-6 mx-auto max-w-6xl pt-2 pb-32 md:pt-10 sm:pb-40 items-stretch">
                        <img src={poster_img} alt={name?.toString()} className="w-100 invisible md:visible md:rounded-l-3xl md:col-span-2" />
                        <div className="bg-white bg-opacity-75 shadow-md rounded-3xl md:rounded-r-3xl md:rounded-none col-span-6 md:col-span-4 pl-6 p-4">
                            <div className="flex py-4">
                                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-lg leading-6 ring-1 ring-gray-900/50 hover:ring-gray-900/5">
                                    <span className="text-gray-600">
                                        {tag}
                                    </span>
                                </div>
                            </div>
                            <div className="">
                                <h1 className="text-4xl text-black font-bold tracking-tight sm:text-6xl drop-shadow-sm">
                                    {name}
                                </h1>
                                <div className='flex gap-1 mt-6'>
                                    {main.genres.map((genre: { id: string; name: string; }) =>
                                        <div key={genre.id} className="p-1">
                                            <span className="z-10 text-lg rounded-lg text-black italic">
                                                {genre.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className='mb-6 mt-2 flex gap-4'>
                                    <span className="z-10 text-lg rounded-lg text-black p-1 italic">
                                        {parseFloat(main.vote_average).toFixed(1)}/10
                                    </span>
                                    <span className="z-10 text-lg rounded-lg text-black p-1 italic">
                                        {lang}
                                    </span>
                                </div>
                                <div className="text-xl leading-8 font-normal mt-6 text-black">
                                    {main.tagline}
                                </div>
                                <p className="mt-6 text-lg leading-8 text-black hidden md:flex">
                                    {main.overview}
                                </p>
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 m-auto">
                                    <a
                                        href={imdblink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-center my-auto inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition"
                                    >
                                        IMDb
                                    </a>
                                    <a
                                        href={main.homepage}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-center my-auto inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-black text-white shadow-md hover:scale-110 hover:text-black hover:bg-white ease-in-out transition"
                                    >
                                        Watch
                                    </a>
                                    {session && 
                                        <>
                                            <input type="checkbox" id="my-modal" className="modal-toggle" />
                                            <div className="modal">
                                                <div className="modal-box m-auto max-w-2xl text-left">
                                                    <p className='pb-4 font-bold text-xl text-black'>Rate '{name}'</p>
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
                                                                onClick={() => session.user && AddRating(session.user.id, main.id, name, poster_img, type, currentinput, ratingRange)}
                                                                className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-green-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-green-300 ease-in-out transition"
                                                            >
                                                                Update Rating
                                                            </button>
                                                            :
                                                            <button
                                                                onClick={() => session.user && AddRating(session.user.id, main.id, name, poster_img, type, currentinput, ratingRange)}
                                                                className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-green-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-green-300 ease-in-out transition"
                                                            >
                                                                Create Rating
                                                            </button>
                                                        }
                                                        {session && rating_bool != false &&
                                                            <button
                                                                onClick={() => session.user && DeleteRating(session.user.id, main.id, name, poster_img, type, currentinput, ratingRange)}
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
                                            onClick={() => session.user && AddWatchlist(session.user.id, main.id, name, poster_img, type)}
                                            className="text-center my-auto inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-green-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-green-300 ease-in-out transition"
                                        >
                                            Watchlist+
                                        </button>
                                    }
                                    {session && watchlist_bool == true &&
                                        <button
                                            onClick={() => session.user && RemoveWatchlist(session.user.id, main.id, type)}
                                            className="text-center my-auto inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-red-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-red-300 ease-in-out transition"
                                        >
                                            Watchlist-
                                        </button>
                                    }
                                    {session && rating_bool != false &&
                                        <label htmlFor="my-modal" className="text-center my-auto inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-red-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-red-300 ease-in-out transition">
                                            Rating-
                                        </label>
                                    }
                                    {session && rating_bool == false &&
                                        <label htmlFor="my-modal" className="text-center my-auto inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-green-500 text-white shadow-md hover:scale-110 hover:text-black hover:bg-green-300 ease-in-out transition">
                                            Rating+
                                        </label>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}