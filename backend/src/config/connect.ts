import { createClient, type SupabaseClient } from "@supabase/supabase-js/dist/index.cjs";

export const connectDb = (
    supabaseUrl: string,
    supabaseKey: string
): SupabaseClient => {
    if (!supabaseKey || !supabaseUrl) {
        throw new Error('Supabase key or url is nor defined')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("✅ Supabase client created successfully");

    return supabase;
}