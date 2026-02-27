/* eslint-disable @next/next/no-img-element */

import { useAutoAnimate } from "@formkit/auto-animate/react";
import router from "next/router";
import { useState } from "react";

export default function Topcrew( { crewcredit } : any) {
    const [crewpage, setCrewPage] = useState(1);
    const [crewperpage] = useState(6);
    const indexoflastcrew = crewpage * crewperpage;
    const indexoffirstcrew = indexoflastcrew - crewperpage;
    const currentcrew = crewcredit.slice(indexoffirstcrew, indexoflastcrew)
    const crewPageNumbers = [];
    for (let i = 1; i <= Math.ceil(crewcredit.length / crewperpage); i++) {
        crewPageNumbers.push(i);
    }
    const crewpaginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(crewcredit.length / crewperpage)) {
            setCrewPage(number);
        }
    };

    const [movie_loading, setMovieLoading] = useState("test");
    const display_crew = currentcrew.map((person:any) =>
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
                    <button onClick={() => {setMovieLoading(person[4].toString()); router.push("/person/" + person[4])}}>
                        <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-60 p-2 h-70" />
                        <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                            <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                                {person[0]} as {person[3]}
                            </span>
                        </div>
                    </button>
                </>
            }
        </div>
    );

    const [parent] = useAutoAnimate<HTMLDivElement>();
    return (
        <> 
        <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                <div className="grid grid-flow-col">
                    {Math.ceil(crewcredit.length / crewperpage) > 0 && 
                        <span className="text-3xl leading-8 font-bold pr-4">Top Crew: </span>
                    }
                    {Math.ceil(crewcredit.length / crewperpage) > 1 && 
                        <>
                            <button onClick={() => crewpaginate(crewpage-1)} className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm m-auto"> {crewpage + " / " + Math.ceil(crewcredit.length / crewperpage)} </span>
                            <button onClick={() => crewpaginate(crewpage+1)} className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </>
                    }
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6" ref={parent}>
            {display_crew}
        </div>
        </>
    )
}