/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext, PreviewData, NextApiRequest, NextApiResponse } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Nav from '../components/Nav';
import router from 'next/router';
import { getAvatarName } from '../functions/getAvatarName';
import { RatingWatchCard } from '../components/RateWatchCard';
import { useState } from 'react';
import { WatchlistAZ, WatchlistZA } from '../functions/SortWatchlist';

export const getServerSideProps = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | { req: NextApiRequest; res: NextApiResponse<any>; }) => {
    // Create authenticated Supabase Client
    const supabase = createPagesServerClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession();

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
    const { data } = await supabase
    .from('rating')
    .select('itemid, itemname, type, image, added, rating, comment')
    .eq('userid', session?.user.id)

    return {
        props: {
            userwatchlist: data,
            loggedin: true,
            username,
            avatar
        },
    }
}

export default function Rating({userwatchlist, loggedin, username, avatar}: any) {
    const supabase = useSupabaseClient();
    const session = useSession();
    // get items that user added.
    let userwatchlist_movie: any[] | (() => any[]) = [];
    let userwatchlist_tv: any[] | (() => any[]) = [];
    let userwatchlist_people: any[] | (() => any[]) = [];
    let userwatchlist_collection: any[] | (() => any[]) = [];
    for (var item in userwatchlist) {
        if (userwatchlist[item].type == "movie") {
            userwatchlist_movie.push(userwatchlist[item]);
        } else if (userwatchlist[item].type == "tv") {
            userwatchlist_tv.push(userwatchlist[item]);
        } else if (userwatchlist[item].type == "collection") {
            userwatchlist_collection.push(userwatchlist[item]);
        } else {
            userwatchlist_people.push(userwatchlist[item]);
        }
    }

    const item_display = (arg: any) => {
        return arg.map((item: any) =>
            <>
                <div key={item.id}>
                    <RatingWatchCard itemdata={item} type={"rating"} height={"h-40"} />
                </div>
            </>
        );
    }

    if (session != undefined && loggedin == false) {
        router.push({
            pathname: '/rating',
            query: {},
        })
    }

    let [checkMovie, setCheckMovie] = useState(true);
    let [checkTv, setCheckTv] = useState(true);
    let [checkPeople, setCheckPeople] = useState(true);
    let [checkCollection, setCheckCollection] = useState(true);

    let [movieWatch, setMovieWatch] = useState(userwatchlist_movie.sort(WatchlistAZ));
    let [tvWatch, setTvWatch] = useState(userwatchlist_tv.sort(WatchlistAZ));
    let [peopleWatch, setPeopleWatch] = useState(userwatchlist_people.sort(WatchlistAZ));
    let [collectionWatch, setCollectionWatch] = useState(userwatchlist_collection.sort(WatchlistAZ));

    let [sortValue, setsortValue] = useState("A-Z");
    function run_sort_check (value:any, userwatchlist_movie:any, userwatchlist_tv:any, userwatchlist_people:any, userwatchlist_collection:any) {
        setsortValue(value);
        if (value == "A-Z") {
            setMovieWatch(userwatchlist_movie.sort(WatchlistAZ));
            setTvWatch(userwatchlist_tv.sort(WatchlistAZ));
            setPeopleWatch(userwatchlist_people.sort(WatchlistAZ));
            setCollectionWatch(userwatchlist_collection.sort(WatchlistAZ));
        } else if (value == "Z-A") {
            setMovieWatch(userwatchlist_movie.sort(WatchlistZA));
            setTvWatch(userwatchlist_tv.sort(WatchlistZA));
            setPeopleWatch(userwatchlist_people.sort(WatchlistZA));
            setCollectionWatch(userwatchlist_collection.sort(WatchlistZA));
        } else if (value == "Newest") {
            setMovieWatch(userwatchlist_movie.sort());
            setTvWatch(userwatchlist_tv.sort());
            setPeopleWatch(userwatchlist_people.sort());
            setCollectionWatch(userwatchlist_collection.sort());
        } else {
            setMovieWatch([...userwatchlist_movie].reverse());
            setTvWatch([...userwatchlist_tv].reverse());
            setPeopleWatch([...userwatchlist_people].reverse());
            setCollectionWatch([...userwatchlist_collection].reverse());
        } 
    }
    
    let display_watchlist_movie;
    try{ display_watchlist_movie = item_display(movieWatch);} catch {display_watchlist_movie = <p>You have not added any movies to your watchlist.</p>};
    
    let display_watchlist_tv;
    try{ display_watchlist_tv = item_display(tvWatch);} catch {display_watchlist_tv = <p>You have not added any tv to your watchlist.</p>};
    
    let display_watchlist_people;
    try{ display_watchlist_people = item_display(peopleWatch);} catch {display_watchlist_people = <p>You have not added any people to your watchlist.</p>};

    let display_watchlist_collection;
    try{ display_watchlist_collection = item_display(collectionWatch);} catch {display_watchlist_collection = <p>You have not added any collections to your watchlist.</p>}
        
    return (
        <>
            <Nav isloggedin={loggedin} username={username} avatar={avatar} />
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-6 m-auto text-center'>
                {!session ? (
                    <>
                        <div className='max-w-xl m-auto text-center text-lg'>
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
                        <div className='max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-6xl m-auto justify-center mb-20'>
                            <div className=' bg-slate-900 rounded-lg p-4'>
                                <div className="form-control grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="label-text text-white text-lg text-left">Include:</p>
                                        <div className='grid grid-cols-2 gap-2 mt-4'>
                                            <label className="cursor-pointer label">
                                                <span className="label-text text-white text-lg">Movie</span>
                                                <input type="checkbox" className="checkbox checkbox-info" checked={checkMovie} name="MovieCheckbox" onChange={(e) => setCheckMovie(!checkMovie)} />
                                            </label>
                                            <label className="cursor-pointer label">
                                                <span className="label-text text-white text-lg">Tv</span>
                                                <input type="checkbox" className="checkbox checkbox-info" checked={checkTv} name="TvCheckbox" onChange={(e) => setCheckTv(!checkTv)} />
                                            </label>
                                            <label className="cursor-pointer label">
                                                <span className="label-text text-white text-lg">People</span>
                                                <input type="checkbox" className="checkbox checkbox-info" checked={checkPeople} name="PeopleCheckbox" onChange={(e) => setCheckPeople(!checkPeople)} />
                                            </label>
                                            <label className="cursor-pointer label">
                                                <span className="label-text text-white text-lg">Collection</span>
                                                <input type="checkbox" className="checkbox checkbox-info" checked={checkCollection} name="CollectionCheckbox" onChange={(e) => setCheckCollection(!checkCollection)} />
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="label-text text-white text-lg text-left">Sort By:</p>
                                        <select className="select select-ghost w-full text-left mt-4 text-md font-normal" value={sortValue} onChange={(e) => run_sort_check(e.target.value, userwatchlist_movie, userwatchlist_tv, userwatchlist_people, userwatchlist_collection)}>
                                            <option value="New">Newest</option>
                                            <option value="A-Z">A-Z</option>
                                            <option value="Z-A">Z-A</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {checkMovie &&
                                <>
                                    <p className="text-3xl leading-8 font-bold pr-4 pb-10 pt-6 text-left">Movies: </p>
                                    <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 min-w-full m-auto gap-2'>
                                        {display_watchlist_movie}
                                    </div>
                                </>
                            }
                            {checkTv &&
                                <>
                                    <p className="text-3xl leading-8 font-bold pr-4 py-10 text-left">Tv: </p>
                                    <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 min-w-full m-auto gap-2'>
                                        {display_watchlist_tv}
                                    </div>
                                </>
                            }
                            {checkPeople &&
                                <>
                                    <p className="text-3xl leading-8 font-bold pr-4 py-10 text-left">People: </p>
                                    <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 min-w-full m-auto gap-2'>
                                        {display_watchlist_people}
                                    </div>
                                </>
                            }
                            {checkCollection &&
                                <>
                                    <p className="text-3xl leading-8 font-bold pr-4 py-10 text-left">Collections: </p>
                                    <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 min-w-full m-auto gap-2'>
                                        {display_watchlist_collection}
                                    </div>
                                </>
                            }
                        </div>
                    </>
                )}
            </div>
        </>
    )
}