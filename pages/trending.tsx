/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import Nav from "../components/Nav";
import router from "next/router";
import { getAvatarName } from "../functions/getAvatarName";

const baseimg = "https://image.tmdb.org/t/p/w500";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    // Fetch data from external API
    const movie = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    const tv = await fetch("https://api.themoviedb.org/3/trending/tv/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    const people = await fetch("https://api.themoviedb.org/3/trending/person/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    // Pass data to the page via props
    const supabase = createPagesServerClient(ctx);

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

    return { props: { movie, tv, people, isloggedin, username, avatar} }
}

export default function Trending( { movie, tv, people, isloggedin, username, avatar } : any) {
    const [movie_animate] = useAutoAnimate<HTMLDivElement>();
    const [tv_animate] = useAutoAnimate<HTMLDivElement>();
    const [people_animate] = useAutoAnimate<HTMLDivElement>();

    const movie_arr: (string | number)[][] = [];
    var counter = 0;
    movie.results.forEach((movie: { title: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        movie_arr.push([movie.title, movie.popularity, imgurl, movie.job, movie.id, counter])
        counter++;
    });

    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(6);
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

    const [movie_loading, setMovieLoading] = useState("test");
    const display_movies = currentcast.map((movie) =>
        <div key={movie[5]} className="group cursor-pointer relative text-center">
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

    const crewarr: (string | number)[][] = [];
    var counter = 0;
    tv.results.forEach((movie: { name: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.name;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        crewarr.push([movie.name, movie.popularity, imgurl, movie.job, movie.id, counter])
        counter++;
    });
    crewarr.sort(compareSecondColumn);

    const [crewpage, setCrewPage] = useState(1);
    const [crewperpage] = useState(6);
    const indexoflastcrew = crewpage * crewperpage;
    const indexoffirstcrew = indexoflastcrew - crewperpage;
    const currentcrew = crewarr.slice(indexoffirstcrew, indexoflastcrew)
    const crewPageNumbers = [];
    for (let i = 1; i <= Math.ceil(crewarr.length / crewperpage); i++) {
        crewPageNumbers.push(i);
    }
    const crewpaginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(crewarr.length / crewperpage)) {
            setCrewPage(number);
        }
    };
    const display_crew = currentcrew.map((person) =>
        <div key={person[5]} className="group cursor-pointer relative inline-block text-center">
            {movie_loading.toString() == person[4].toString() ?
                <>
                    <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-60 p-2 h-70 grayscale" />
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
                    <button onClick={() => {setMovieLoading(person[4].toString()); router.push("/tv/" + person[4])}}>
                        <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-60 p-2 h-70" />
                        <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                            <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                                {person[0]}
                            </span>
                        </div>
                    </button>
                </>
            }
        </div>
    );

    const personarr: (string | number)[][] = [];
    var counter = 0;
    people.results.forEach((person: { original_name: string; popularity: number; profile_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (person.profile_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + person.original_name;
        } else {
            imgurl = baseimg + person.profile_path;
        }
        personarr.push([person.original_name, person.popularity, imgurl, person.job, person.id, counter])
        counter++;
    });
    personarr.sort(compareSecondColumn);

    const [personpage, setPeoplePage] = useState(1);
    const [peopleperpage] = useState(6);
    const indexoflastperson = personpage * peopleperpage;
    const indexoffirstperson = indexoflastperson - peopleperpage;
    const currentpeople = personarr.slice(indexoffirstperson, indexoflastperson)
    const peoplePageNumbers = [];
    for (let i = 1; i <= Math.ceil(personarr.length / peopleperpage); i++) {
        peoplePageNumbers.push(i);
    }
    const peoplePaginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(personarr.length / peopleperpage)) {
            setPeoplePage(number);
        }
    };
    const display_people = currentpeople.map((person) =>
        <div key={person[5]} className="group cursor-pointer relative inline-block text-center pb-10">
            {movie_loading.toString() == person[4].toString() ?
                <>
                    <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-60 p-2 h-70 grayscale" />
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
                    <button onClick={() => {setMovieLoading(person[4].toString()); router.push("/person/" + person[4])}}>
                        <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-60 p-2 h-70" />
                        <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                            <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                                {person[0]}
                            </span>
                        </div>
                    </button>
                </>
            }
        </div>
    );

    const allarr = crewarr.concat(movie_arr).concat(personarr);
    useEffect(() => {
        //preloading image
        allarr.forEach((movie) => {
          const img = new Image();
          img.src = movie[2].toString();
        });
    }, [allarr]);

    return (
        <>
            <Nav isloggedin={isloggedin} username={username} avatar={avatar} />
            <div className="grid p-6 sm:grid-cols-1 md:grid-cols-1 mt-2 max-w-6xl m-auto">
                <div className="col-span-2">
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                            <div className="grid grid-flow-col">
                                <span className="text-3xl leading-8 font-bold pr-4">Movies: </span>
                                <button onClick={() => paginate(castpage-1)} className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                                <span className="font-normal text-sm m-auto"> {castpage + " / " + Math.ceil(movie_arr.length / castperpage)} </span>
                                <button onClick={() => paginate(castpage+1)} className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6" ref={movie_animate}>
                        {display_movies}
                    </div>
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                            <div className="grid grid-flow-col">
                                <span className="text-3xl leading-8 font-bold pr-4">TV Shows: </span>
                                <button onClick={() => crewpaginate(crewpage-1)} className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                                <span className="font-normal text-sm m-auto"> {crewpage + " / " + Math.ceil(crewarr.length / crewperpage)} </span>
                                <button onClick={() => crewpaginate(crewpage+1)} className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6" ref={tv_animate}>
                        {display_crew}
                    </div>
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                            <div className="grid grid-flow-col">
                                <span className="text-3xl leading-8 font-bold pr-4">People: </span>
                                <button onClick={() => peoplePaginate(personpage-1)} className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                                <span className="font-normal text-sm m-auto"> {personpage + " / " + Math.ceil(personarr.length / peopleperpage)} </span>
                                <button onClick={() => peoplePaginate(personpage+1)} className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6" ref={people_animate}>
                        {display_people}
                    </div>
                </div>
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