/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext, PreviewData, NextApiRequest, NextApiResponse } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import Nav from '../components/Nav';
import { getAvatarName } from '../functions/getAvatarName';
import axios from 'axios';

export const getServerSideProps = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | { req: NextApiRequest; res: NextApiResponse<any>; }) => {
    // Create authenticated Supabase Client
    const supabase = createPagesServerClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const updateTop500 = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/Top500");
    const currentTop500 = await supabase.from("top500").select().eq("id", 1);
    // @ts-ignore
    let movie = currentTop500.data[0].movie; let tv = currentTop500.data[0].tv;

    let movie_count = 0; let tv_count = 0;
    for (var x in movie) {movie_count++;};for (var y in tv) {tv_count++;};
    movie_count = movie_count-1; tv_count = tv_count-1;

    let UserData = await getAvatarName(session);
    // @ts-ignore
    let username = UserData.username;
    // @ts-ignore
    let avatar = UserData.avatar;

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            }
        }
    }

    return {
        props: {
            loggedin: true,
            username,
            avatar,
            movie,
            tv,
            movie_count,
            tv_count
        },
    }
}

export default function Trivia(this: any, {loggedin, username, avatar, movie, tv, movie_count, tv_count}: any) {
    const supabase = useSupabaseClient();
    const session = useSession();

    const [order, setOrder] = useState("rel");
    const [type_ofshow, setTypeOfShow] = useState("mov");
    const [border, setBorder] = useState(0);
    const [clicked, setClicked] = useState(false);

    const [m1, setM1] = useState(randomIntFromInterval(0, movie_count/2));
    const [m2, setM2] = useState(randomIntFromInterval(((movie_count/2) + 1), movie_count));
    const [t1, setT1] = useState(randomIntFromInterval(0, tv_count/2));
    const [t2, setT2] = useState(randomIntFromInterval(((tv_count/2) + 1), tv_count));
    const triviaArr_range_mov = [movie[m1], movie[m2]];
    const triviaArr_range_tv = [tv[t1], tv[t2]];

    function randomIntFromInterval(min: number, max: number) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    function newOptions () {
        let a; let b;
        if (type_ofshow == "mov") {
            a = randomIntFromInterval(0, movie_count);
            b = randomIntFromInterval(0, movie_count);
            while (a == b) {a = randomIntFromInterval(0, movie_count);b = randomIntFromInterval(0, movie_count);}
            setM1(a);
            setM2(b);
        } else {
            a = randomIntFromInterval(0, tv_count);
            b = randomIntFromInterval(0, tv_count);
            while (a == b) {a = randomIntFromInterval(0, tv_count);b = randomIntFromInterval(0, tv_count);}
            setT1(a);
            setT2(b);
        }
        setClicked(false);
    }

    async function GetAnswer (arr: any[], movieid: number) {
        let other_index = 0;
        let index = 1;
        let other_movieid = arr[0][3];
        if (arr[0][3] == movieid){other_index=1;index=0;other_movieid = arr[1][3];};
        // order = rel, rev, sco, len
        let bool;
        if (order == "rel") {
            bool = new Date(arr[index][5]) < new Date(arr[other_index][5]);
        } if (order == "sco") {
            bool = arr[index][6] > arr[other_index][6];
        }

        if (bool) {
            setBorder(movieid);
        } else {
            setBorder(other_movieid);
        }
        setClicked(true);
        const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/UpdateTrivia", {params: {userid: session?.user.id, answer: JSON.stringify({"arr": arr, "movieid": movieid, "correct": bool})}});
    }
    
    // @ts-ignore
    const display_movies = triviaArr_range_mov.map((m) =>
        <>
            {clicked && border == m[3] ?
                <>
                    <div key={m[3]} className="group cursor-pointer relative inline-block text-center ring-4 ring-green-400 rounded-xl">
                        <button onClick={() => GetAnswer(triviaArr_range_mov, m[3])}>
                            <img id={m[3].toString()} src={m[2].toString()} alt={m[0].toString()} className="rounded-3xl w-80 p-2 h-full" />
                            <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                                    {m[0]}
                                </span>
                            </div>
                        </button>
                        {order == "rel" &&
                            <p className='text-lg'>{new Date(m[5]).toLocaleDateString("en-GB") }</p>
                        }
                        {order == "sco" &&
                            <p className='text-lg'>{m[6]}</p>
                        }
                    </div>
                </>
                :
                <>
                    {clicked ?
                        <>
                            <div key={m[3]} className="group cursor-pointer relative inline-block text-center ring-4 ring-red-600 rounded-xl">
                                <button onClick={() => GetAnswer(triviaArr_range_mov, m[3])}>
                                    <img id={m[3].toString()} src={m[2].toString()} alt={m[0].toString()} className="rounded-3xl w-80 p-2 h-full" />
                                    <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                        <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                                            {m[0]}
                                        </span>
                                    </div>
                                </button>
                                {order == "rel" &&
                                    <p className='text-lg'>{new Date(m[5]).toLocaleDateString("en-GB") }</p>
                                }
                                {order == "sco" &&
                                    <p className='text-lg'>{m[6]}</p>
                                }
                            </div>
                        </>
                        :
                        <div key={m[3]} className="group cursor-pointer relative inline-block text-center">
                            <button onClick={() => GetAnswer(triviaArr_range_mov, m[3])}>
                                <img id={m[3].toString()} src={m[2].toString()} alt={m[0].toString()} className="rounded-3xl w-80 p-2 h-full" />
                                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                                        {m[0]}
                                    </span>
                                </div>
                            </button>
                        </div>
                    }
                </>
            }
        </>
    );
    // @ts-ignore
    const display_tv = triviaArr_range_tv.map((t) =>
        <>
            {clicked && border == t[3] ?
                <>
                    <div key={t[3]} className="group cursor-pointer relative inline-block text-center ring-4 ring-green-400 rounded-xl">
                        <button onClick={() => GetAnswer(triviaArr_range_tv, t[3])}>
                            <img id={t[3].toString()} src={t[2].toString()} alt={t[0].toString()} className="rounded-3xl w-80 p-2 h-full" />
                            <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                                    {t[0]}
                                </span>
                            </div>
                        </button>
                        {order == "rel" &&
                            <p className='text-lg'>{new Date(t[5]).toLocaleDateString("en-GB") }</p>
                        }
                        {order == "sco" &&
                            <p className='text-lg'>{t[6]}</p>
                        }
                    </div>
                </>
                :
                <>
                    {clicked ?
                        <>
                            <div key={t[3]} className="group cursor-pointer relative inline-block text-center ring-4 ring-red-600 rounded-xl">
                                <button onClick={() => GetAnswer(triviaArr_range_tv, t[3])}>
                                    <img id={t[3].toString()} src={t[2].toString()} alt={t[0].toString()} className="rounded-3xl w-80 p-2 h-full" />
                                    <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                        <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                                            {t[0]}
                                        </span>
                                    </div>
                                </button>
                            </div>
                            {order == "rel" &&
                                <p className='text-lg'>{new Date(t[5]).toLocaleDateString("en-GB") }</p>
                            }
                            {order == "sco" &&
                                <p className='text-lg'>{t[6]}</p>
                            }
                        </>
                        :
                        <div key={t[3]} className="group cursor-pointer relative inline-block text-center">
                            <button onClick={() => GetAnswer(triviaArr_range_tv, t[3])}>
                                <img id={t[3].toString()} src={t[2].toString()} alt={t[0].toString()} className="rounded-3xl w-80 p-2 h-full" />
                                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                                        {t[0]}
                                    </span>
                                </div>
                            </button>
                        </div>
                    }
                </>
            }
        </>
    );

    let text = "Please select the ";
    if (type_ofshow == "mov"){text = text + "movie that "}else{text = text + "tv show that "};
    if (order == "rel"){text = text + "released first."}; if (order == "rev"){text = text + "generated the most revenue."}; 
    if (order == "sco"){text = text + "has the higher imdb rating."};if (order == "len"){text = text + "has the longest runtime."};

    return (
        <>
            <Nav isloggedin={loggedin} username={username} avatar={avatar} />
            <div className='mt-6 max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-6xl m-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 max-w-6xl m-auto'>
                    <div className='p-4'>
                        <label htmlFor="type" className="block mb-2 text-m font-medium text-blue-500 dark:text-white m-auto">Type</label>
                        <select id="type" value={type_ofshow} onChange={(e) => {setTypeOfShow(e.target.value); setClicked(false)}} className="m-auto bg-gray-50 border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="mov">Movie</option>
                            <option value="tv">Tv Shows</option>
                        </select>
                    </div>
                    <div className='p-4'>
                        <label htmlFor="order" className="block mb-2 text-m font-medium text-blue-500 dark:text-white m-auto">Compare By</label>
                        <select id="order" value={order} onChange={(e) => {setOrder(e.target.value); setClicked(false)}} className="m-auto bg-gray-50 border border-gray-300 text-gray-900 text-m rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="rel">Release Date</option>
                            <option value="sco">Imdb Score</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 m-auto'>
                {!session ? (
                    <>
                        <div className='max-w-xl m-auto text-center text-lg'>
                            <h1 className='font-semibold text-2xl p-2'>To view, please login below:</h1>
                            <p>Demo credentials:
                                <br />
                                email - matthewtlharvey@gmail.com
                                <br />
                                pass - demouser
                            </p>
                            <Auth
                                supabaseClient={supabase}
                                appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                    colors: {
                                        brand: 'red',
                                        brandAccent: 'darkred',
                                    },
                                    },
                                },
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <button onClick={() => newOptions()} className="max-w-xs m-auto inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">Get new options</button>
                        <p className='max-w-6xl p-4 m-auto text-lg'>{text}</p>
                        <div className='max-w-6xl p-4 justify-center m-auto grid grid-cols-2 gap-6'>
                            {type_ofshow == "mov" && 
                                <>
                                    {display_movies}
                                </>
                            }
                            {type_ofshow == "tv" && 
                                <>
                                    {display_tv}
                                </>
                            }
                        </div>
                    </>
                )}
            </div>
        </>
    )
}