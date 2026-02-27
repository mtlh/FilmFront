/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import router from "next/router";

export default function Nav({isloggedin, username, avatar} : any) {
    const supabase = useSupabaseClient();
    async function SignOut(){
        await supabase.auth.signOut();
        router.replace(router.asPath);
    }
    async function SignIn(){
        router.push({pathname: '/login', query: { callback: router.asPath}});
    }
    return (
        <>
            <div className="w-full bg-zinc-900 z-50 sticky top-0">
            <div className="navbar max-w-6xl m-auto">
                <div className="navbar-start">
                    <div className="dropdown dropdown-hover">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" color="white" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content px-1 py-4 shadow rounded-box w-52 bg-zinc-900">
                            <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                                <button onClick={() => router.push("/trending")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">Trending</button>
                            </li>
                            <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                                <button onClick={() => router.push("/movies")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">Movies</button>
                            </li>
                            <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                                <button onClick={() => router.push("/tvshows")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">TV Shows</button>
                            </li>
                            <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                                <button onClick={() => router.push("/people")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">People</button>
                            </li>
                        </ul>
                    </div>
                    <button onClick={() => router.push("/")}>
                        <div className="flex items-center" aria-label="Home" role="img">
                            <img className="cursor-pointer w-9 h-9 sm:w-auto" src="/movie.png" alt="logo" />
                            <p className="ml-2 lg:ml-4 text-3xl font-bold invisible text-white md:visible"><span className="text-blue-500">Film</span>Front</p>
                        </div>
                    </button>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                            <button onClick={() => router.push("/trending")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">Trending</button>
                        </li>
                        <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                            <button onClick={() => router.push("/movies")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">Movies</button>
                        </li>
                        <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                            <button onClick={() => router.push("/tvshows")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">TV Shows</button>
                        </li>
                        <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                            <button onClick={() => router.push("/people")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">People</button>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end">
                    {!isloggedin ? (
                        <button onClick={()=> SignIn()} 
                            className="inline-block rounded-lg bg-green-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-green-500 hover:text-white hover:scale-110 ease-in-out transition">
                            Sign In
                        </button>
                        ) :
                        <>
                            <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
                                <button tabIndex={0} className="btn btn-ghost mt-2" onClick={() => router.push("/profile")}>
                                    {username}
                                    <div className="pl-3">
                                        <svg color="white" fill="#FFFFFF" height="12px" width="12px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"></path> </g></svg>
                                    </div>
                                </button>
                                <ul tabIndex={0} className="menu menu-compact dropdown-content px-1 py-4 shadow rounded-box w-52 bg-zinc-900">
                                    <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                                        <button onClick={() => router.push("/watchlist")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">Watchlist</button>
                                    </li>
                                    <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                                        <button onClick={() => router.push("/rating")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">Rating</button>
                                    </li> 
                                    <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                                        <button onClick={() => router.push("/trivia")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">Trivia</button>
                                    </li>
                                    
                                    <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-white">
                                        <button onClick={() => router.push("/list")} className="m-auto text-left btn hover:text-blue-500 btn-link text-lg font-normal no-underline normal-case">Lists</button>
                                    </li>
                                    <li className="cursor-pointer sm:ml-1 lg:ml-4 m-auto text-left text-rose-500">
                                        <button onClick={() => SignOut()} className="m-auto text-left btn btn-link text-lg font-normal normal-case underline">Sign Out</button>
                                    </li>
                                </ul>
                            </div>
                            <button tabIndex={0} className="pr-1 -mb-1 hover:scale-125" onClick={() => router.push("/profile")}>
                                <img src={"/avatar" + avatar + ".svg"} alt={"avatar" + avatar} width="50px" height="30px" />
                            </button>
                        </>
                    }
                </div>
            </div>
            </div>
        </>
    );
}
