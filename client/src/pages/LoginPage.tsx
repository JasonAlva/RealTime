import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, signInWithGoogle, signOut } = useAuth();
  return user?.isGuest ? (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  ) : (
    <button onClick={signOut}>Sign out ({user?.name})</button>
  );
}
