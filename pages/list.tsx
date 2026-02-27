/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext, PreviewData, NextApiRequest, NextApiResponse } from 'next';
import { ParsedUrlQuery } from 'querystring';
import axios from 'axios';
import Nav from '../components/Nav';
import router from 'next/router';
import { getAvatarName } from '../functions/getAvatarName';

export const getServerSideProps = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | { req: NextApiRequest; res: NextApiResponse<any>; }) => {
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
            redirect: {
                permanent: false,
                destination: "/login",
            }
        }
    }
    const { data } = await supabase
    .from('listcontent')
    .select('listid, list_img, name, summary, created')
    .eq('userid', session?.user.id)

    return {
        props: {
            userlists: data,
            loggedin: true,
            username,
            avatar
        },
    }
}

async function CreateList(userid: string, router: any) { 
    const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/CreateList", {params: {userid: userid}});
    router.push({
        pathname: '/list/[listid]',
        query: { listid: getResult.data.listid },
    })
}

export default function Lists({userlists, loggedin, username, avatar}: any) {
    const supabase = useSupabaseClient();
    const session = useSession();
    // get lists that user created.
    const display_lists = userlists.map((list: any) =>
        <>
            <li key={list.listid} className="card card-side bg-gray-900 shadow-xl">
                <figure><img src={list.list_img} alt="List Cover" className='w-full h-full'/></figure>
                <div className="card-body">
                    <h2 className="text-2xl font-bold">{list.name}</h2>
                    <p>{list.summary}</p>
                    <p>Updated: {list.created}</p>
                    <div className="card-actions justify-center">
                        <button onClick={() => router.push("/list/" + list.listid)}>
                            <button type="button"
                                className="inline-block rounded-lg bg-blue-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">
                                View List
                            </button>
                        </button>
                    </div>
                </div>
            </li>
        </>
    );
    if (session != undefined && loggedin == false) {
        router.push({
            pathname: '/list',
            query: {},
        })
    }
    return (
        <>
            <Nav isloggedin={loggedin} username={username} avatar={avatar} />
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-6 m-auto text-center'>
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
                        <div className='justify-center max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-3xl m-auto mb-20'>
                            <p className='p-6 text-md font-medium'>Please note that all lists are publicly accessible via the URL, but only editible by the author.</p>
                            <button onClick={()=> CreateList(session.user.id, router)} 
                                className="inline-block rounded-lg bg-blue-400 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-blue-500 hover:text-white hover:scale-110 ease-in-out transition">
                                    Create a new list
                            </button>
                        </div>
                        <div className='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 max-w-6xl m-auto gap-6'>
                            {display_lists}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}