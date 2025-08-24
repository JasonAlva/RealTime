import {createContext,useContext,useEffect,useState} from "react";
import {supabase} from "../lib/supabaseClient";


type User={
    id:string;
    email?:string;
    
}|null;

interface AuthContextType {
    user:User;
    signUp:(email:string,password:string)=>Promise<void>;
    signIn:(email:string,password:string)=>Promise<void>;
    signOut:()=>Promise<void>;
}

const AuthContext=createContext<AuthContextType|undefined>(undefined);


export const authProvider=({children}: {children: React.ReactNode})=>{

    const [user,setUser]=useState<User>(null);

    useEffect(()=>{
        const session=supabase.auth.getSession().then(({data})=>{
            if(data.session){
                setUser(data.session.user)
            }
        });

        const {data:listener}=supabase.auth.onAuthStateChange((_event,session)=>{
            setUser(session?.user ?? null)
        })

            return ()=>{
                listener.subscription.unsubscribe();
            };
    },[])

    const signUp = async (email: string, password: string) => {
        await supabase.auth.signUp({ email, password });
      };
    
      const signIn = async (email: string, password: string) => {
        await supabase.auth.signInWithPassword({ email, password });
      };
    
      const signOut = async () => {
        await supabase.auth.signOut();
      };

      return (
        <AuthContext.Provider value={{user,signUp,signIn,signOut}}>
            {children}
        </AuthContext.Provider>
      )

}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
  };