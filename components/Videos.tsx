import { useAutoAnimate } from "@formkit/auto-animate/react";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

export function Videos ({ videos } : any) {
    const video_arr: (string | number)[][] = [];
    var counter = 0;
    videos.results.forEach((video: { name: string; id: string; key: string, site: string, official: boolean}) => {
        var imgurl = "";
        if (video.site == "YouTube" && video.official == true) {
            imgurl = "https://www.youtube.com/watch?v=" + video.key;
            video_arr.push([video.name, imgurl, counter])
            counter++;
        }
    });
    const [videopage, setVideoPage] = useState(1);
    const [videoperpage] = useState(1);
    const indexoflastvideo = videopage * videoperpage;
    const indexoffirstvideo = indexoflastvideo - videoperpage;
    const currentvideo = video_arr.slice(indexoffirstvideo, indexoflastvideo)
    const crewPageNumbers = [];
    for (let i = 1; i <= Math.ceil(video_arr.length / videoperpage); i++) {
        crewPageNumbers.push(i);
    }
    const video_paginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(video_arr.length / videoperpage)) {
            setVideoPage(number);
        }
    };
    const videoresult = currentvideo.map((video) =>
        <div key={video[2]} className="p-2 sm:w-full col-span-2 object-cover">
            <ReactPlayer url={video[1].toString()} width="100%" controls={true} />
        </div>
    );
    const [parent] = useAutoAnimate<HTMLDivElement>();
    return (
        <>
            <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch mt-6">
                {video_arr.length != 0 &&
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                            <div className="grid grid-flow-col">
                                <span className="text-3xl leading-8 font-bold pr-4">Videos: </span>
                                <button onClick={() => video_paginate(videopage-1)} className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                                <span className="font-normal text-sm m-auto"> {videopage + " / " + Math.ceil(video_arr.length / videoperpage)} </span>
                                <button onClick={() => video_paginate(videopage+1)} className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                            </div>
                        </div>
                    </>
                }
            </div>
            <div ref={parent}>
                {videoresult}
            </div>
        </>
    )
}