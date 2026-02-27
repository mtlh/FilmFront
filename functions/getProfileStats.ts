import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js"

export async function getProfileStats(session: Session | null) {
    const supabase = createPagesBrowserClient();
    const list = await supabase.from('listcontent').select().eq('userid', session?.user.id.toString());
    const watchlist = await supabase.from('watchlist').select().eq('userid', session?.user.id.toString());
    const rating = await supabase.from('rating').select().eq('userid', session?.user.id.toString());
    const trivia = await supabase.from('trivia_scores').select().eq('userid', session?.user.id.toString());
    let triva_result;
    // @ts-ignore
    if (trivia?.data?.length > 0) {
        // @ts-ignore
        triva_result = parseFloat(trivia?.data[0]?.overall_percent).toFixed(0);
    } else {
        triva_result = 0;
    }
    return {lists: list?.data?.length, watchlist: watchlist?.data?.length, rating: rating?.data?.length, trivia: triva_result};
}