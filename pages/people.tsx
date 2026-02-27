/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

const baseimg = "https://image.tmdb.org/t/p/w500";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import router from "next/router";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { getAvatarName } from "../functions/getAvatarName";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    // Fetch data from external API
    const movie = await fetch("https://api.themoviedb.org/3/trending/person/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    const type = "person";
    const supabase = createPagesServerClient(ctx)
    // Check if we have a session
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
    // Pass data to the page via props
    return { props: { mediatype: type, movie: movie, isloggedin, username, avatar} }
}

export default function MoviesHome( { mediatype, movie, isloggedin, username, avatar } : any) {
    
    const [currentdata, setData] = useState(movie);
    const [query, setQuery] = useState("");

    const [currentinput, setInput] = useState("");
    const InputChange = (value: any) => {
        setInput(value);
    }

    useEffect(() => {
        const fetchData = async () => {
            const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/getSearchResult", {params: {searchterm: query, type: mediatype}});
            setData(getResult.data.result);
            console.log(getResult.data.result)
        }
        if (query != "") {
            fetchData();
        }
    }, [query]);

    const [parent] = useAutoAnimate<HTMLDivElement>();
    
    const movie_arr: (string | number)[][] = [];
    var counter = 0;
    currentdata.results.forEach((person: { name: string; popularity: number; profile_path: string; id: number}) => {
        var imgurl = "";
        if (person.profile_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + person.name;
        } else {
            imgurl = baseimg + person.profile_path;
        }
        movie_arr.push([person.name, person.popularity, imgurl, person.id, counter])
        counter++;
    });
    
    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(18);
    const indexoflast = castpage * castperpage;
    const indexoffirst = indexoflast - castperpage;
    const currentcast = movie_arr.slice(indexoffirst, indexoflast)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(movie_arr.length / castperpage); i++) {
        pageNumbers.push(i);
    }
    const paginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(movie_arr.length / castperpage)) {
            setCastPage(number);
        }
    };
    const handleKeyDown = (e: any) => {
        if (e.code === "Enter") {
            setQuery(currentinput)
        }
    };
    
    const [movie_loading, setMovieLoading] = useState("test");
    const display_movies = currentcast.map((movie) =>
        <div key={movie[5]} className="group cursor-pointer relative inline-block text-center">
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
                    <button onClick={() => {setMovieLoading(movie[4].toString()); router.push("/person/" + movie[3])}}>
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

    return (
        <>
            <Nav isloggedin={isloggedin} username={username} avatar={avatar} />
            <div className="grid p-6 sm:grid-cols-1 md:grid-cols-1 mt-6 max-w-6xl m-auto">
                <div className="mb-3 justify-center flex text-center m-auto">
                    <div className="input-group grid items-stretch w-full mb-4 grid-cols-6">
                        <input value={currentinput} onChange={(e) => InputChange(e.target.value)} type="search" onKeyDown={handleKeyDown} className="col-span-5 form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search People" aria-label="Search" aria-describedby="button-addon2" />
                        <button onClick={()=> setQuery(currentinput)} className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-xl font-semibold leading-7 text-white shadow-md hover:bg-blue-500 ease-in-out transition" type="button" id="button-addon2">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="col-span-2" ref={parent}>
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch">
                        <span>
                            {query != "" && (
                                <>
                                    <span className="text-3xl leading-8 font-bold pr-4">People Results - &quot;{query}&quot;: </span>
                                </>
                            )}
                            {query == "" && (
                                <span className="text-3xl leading-8 font-bold pr-4">Trending People: </span>
                            )}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
                        {display_movies}
                    </div>
                </div>
            </div>
        </>
    )
}