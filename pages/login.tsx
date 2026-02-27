/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createPagesServerClient, Session, SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next';
import Nav from '../components/Nav';
import router, { useRouter } from 'next/router';
import { getAvatarName } from '../functions/getAvatarName';
import axios from 'axios';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

    let callback = ctx.query.callback;
    if (callback == undefined) {
        callback = "/trending";
    }
    
    const movie = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString() + "&language=en-US&include_adult=false").then((response) => response.json());
    const baseimg = "url(https://image.tmdb.org/t/p/original"
    const movie_arr: (string | number)[][] = [];
    var counter = 0;
    movie.results.forEach((movie: { title: string; backdrop_path: string}) => {
        var imgurl = "";
        if (movie.backdrop_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
        } else {
            imgurl = baseimg + movie.backdrop_path + ")";
        }
        movie_arr.push([movie.title, imgurl])
        counter++;
    });
    var movie_item = movie_arr[Math.floor(Math.random()*movie_arr.length)];
    // Create authenticated Supabase Client
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

    if (!session) {
        return {
            props: {
                loggedin: false,
                movie_item,
                callback
            }
        }
    } else {
        return {
            props: {
                loggedin: true,
                movie_item,
                username,
                avatar,
                callback
            },
        }
    }
}

async function LogUserNickNames(session: Session) { 
    const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/UpsertNickname", {params: {userid: session.user.id}});
}

export default function Login({loggedin, movie_item, username, avatar, callback}:any) {
    const supabase = useSupabaseClient();
    const session = useSession();
    const router = useRouter();
    if (session) {
        LogUserNickNames(session);
        router.push(callback);
    }
    return (
        <>
            <Nav isloggedin={loggedin} username={username} avatar={avatar} />
            <div className='grid sm:grid-cols-1 md:grid-cols-1 m-auto text-center relative backdrop-brightness-50 bg-scroll lg:bg-fixed bg-center bg-cover bg-no-repeat min-h-screen' style={{backgroundImage: movie_item[1].toString()}}>
                <div className='max-w-xl m-auto text-center text-lg bg-white rounded-xl px-20 py-10'>
                    {!session ? (
                        <>
                            <h1 className='font-semibold text-2xl p-2 text-black'>Login to FilmFront</h1>
                            <Auth
                                supabaseClient={supabase}
                                appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                        colors: {
                                            brand: 'blue',
                                            brandAccent: 'lightblue',
                                            messageText: "black"
                                        },
                                    },
                                },
                                }}
                            />
                            <button onClick={async ()=> await supabase.auth.signInWithPassword({email: 'matthewtlharvey@gmail.com',password: 'demouser'})}
                                className="inline-block rounded-lg bg-zinc-700 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-zinc-900 hover:text-white hover:scale-110 ease-in-out transition">
                                Demo User
                            </button>
                        </>
                    ) : (
                        
                        <>
                            <div role="status" className="flex z-10 bg-white">
                                <svg aria-hidden="true" className="inline w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}