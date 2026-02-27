/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useRouter } from 'next/router';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react';
import axios from 'axios';
import Nav from '../../components/Nav';
import { getAvatarName } from '../../functions/getAvatarName';

const baseimg = "https://image.tmdb.org/t/p/w500";

export const getServerSideProps = async (ctx: any) => {
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
    
    if (!session)
        return {
            props: {
                quizcontent: [],
                loggedin: false,
                serveruser: "",
                quizid: ctx.query.quizid
            }
        }

    const { data } = await supabase
        .from('quizcontent')
        .select('quizcontent, userid')
        .eq('quizid', ctx.query.quizid)

    if (data == null) {
        return {
            redirect: {
              permanent: false,
              destination: "/quiz"
            }
          }
    } else {
        return {
            props: {
                quizcontent: data,
                loggedin: true,
                // @ts-ignore
                serveruser: data[0].userid,
                quizid: ctx.query.quizid,
                username,
                avatar
            },
        } 
    }
}

export default function Quiz({quizcontent, loggedin, serveruser, quizid, username, avatar}: any) {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const session = useSession();

    try{
        quizcontent = quizcontent[0].quizcontent;
    } catch{
        quizcontent = "";
    }

    const [editbool, setEdit] = useState<Boolean>(false);
    if (serveruser == session?.user.id && editbool == false) {
        setEdit(true);
    }

    const [title, setTitle] = useState(quizcontent.quizname);
    const titleChange = (value: any) => {
        setTitle(value);
    }
    const [summary, setSummary] = useState(quizcontent.summary);
    const SummaryChange = (value: any) => {
        setSummary(value);
    }

    if (session != undefined && loggedin == false) {
        router.push({
            pathname: '/trivia',
            query: {},
        })
    }

    return (
        <>
            <Nav isloggedin={loggedin} username={username} avatar={avatar} />
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-6 m-auto justify-center text-center'>
                {!session ? (
                    <>
                        <h1 className='font-semibold text-2xl p-2'>To create/view lists you must login:</h1>
                        <p>Demo credentials:
                            <br />
                            email - matthewtlharvey@gmail.com
                            <br />
                            pass - demouser
                        </p>
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
                        <div>
                            {editbool == false &&
                                <>
                                    <p className='p-2 text-center font-semibold text-5xl'>{quizcontent.quizname}</p>
                                    <br />
                                    <p className='p-2 text-center font-medium text-sm'>{quizcontent.summary}</p>
                                </>
                            }
                            {editbool == true &&
                                <>
                                    <div className='justify-center m-auto text-center grid p-2 sm:grid-cols-1 md:grid-cols-1'>
                                        <input className='p-2 text-center font-semibold text-5xl' placeholder={quizcontent.quizname} value={title} onChange={(e) => titleChange(e.target.value)} />
                                        <br />
                                        <input className='p-2 text-center font-medium text-sm' placeholder={quizcontent.summary} value={summary} onChange={(e) => SummaryChange(e.target.value)} />
                                    </div>
                                    <div className='text-center grid grid-cols-6 gap-2 p-2 justify-center m-auto'>
                                        <div></div>
                                        <div></div>
                                        <label htmlFor="my-modal" className="btn p-1 rounded-lg bg-blue-600 text-white font-medium text-lg leading-tight shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center">Add</label>
                                        <button onClick={()=> SaveContent(quizid, title, summary)} className="btn p-1 rounded-lg bg-blue-600 text-white font-medium text-lg leading-tight shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center">Save</button>
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

async function SaveContent(quizid: any, summary: any, title: any){
    let itemstr = "";
    let items = ["lol"];
    for (let item in items){
        itemstr+= items[item] + "$%$"
    }
    const response = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/SaveQuiz", {params: {quizid: quizid, summary: summary, title: title}});
}