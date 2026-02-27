import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js"

export async function getAvatarName (session: Session | null) {
    const supabase = createPagesBrowserClient();
    const { data } = await supabase.from('user_nicknames').select().eq('userid', session?.user.id.toString())
    try {
        // @ts-ignore
        return {username: data[0].nickname, avatar: data[0].avatar}
    } catch {
        return {username: '', avatar: ''}
    }
}