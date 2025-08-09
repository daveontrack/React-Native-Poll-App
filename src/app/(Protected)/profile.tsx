// import { useEffect, useState } from "react"
// import { supabase } from "../lib/supabase"
// import { Session } from "@supabase/supabase-js"
// import { Text, View } from "react-native"

// export default function ProfileScreen() {
//     const [session, setSession] = useState<Session| null>(null)
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })
//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })
//   }, []);
//   console.log(session)
//   return (
//   <View>
//     <Text>
//         User id: {session?.user?.id}
//     </Text>
//   </View>
//   )
//}
import { View, Text, Button } from 'react-native';
import { useAuth } from '../../Providers/AuthProvider';
import { supabase } from '../../lib/supabase';
import { Redirect } from 'expo-router';


export default function ProfileScreen() {
  const { user } = useAuth();
    if(!user){
        return (
        <Redirect href="/login"/>
        )
    }
  return (
    <View style={{ padding: 10 }}>
      <Text>User id: {user?.id}</Text>

      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}


