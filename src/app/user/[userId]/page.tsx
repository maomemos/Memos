'use client'
import { useParams } from "next/navigation";
import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from "react";
import { getUserById, getUserByUsername } from "@/api/user";
import { parseToken } from "@/lib/token";
import HeaderMenu from "@/components/header";
import AccountInfo from "@/components/accountInfo";
import AccountSetting from "@/components/accountSetting";
async function getUsername() {
  const pToken = await parseToken();
  return pToken.sub;
}
export default function UserPage() {
  const { userId } = useParams();
  const [username, setUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const currentUsernameTemp = await getUsername() || '';
      const currentUserTemp = await (await getUserByUsername(currentUsernameTemp)).data?.account || null;
      const userTemp = await (await getUserById(parseInt(userId.toString(), 10))).data?.account || null;
      setCurrentUsername(currentUserTemp?.username || '');
      setUser(userTemp);
      setUsername(userTemp?.username || '');
      setCurrentUser(currentUserTemp);
    }
    fetchData();
  }, [userId]);

  if(currentUser == null || user == null) {
    return (
      <></>
    )
  }
  else {
    if(currentUser.userId == userId) {
      return (
        <main className="m-0 min-h-screen min-w-screen flex flex-col items-center">
        <div className="md:w-full max-w-xl flex flex-col items-center w-full">
          <HeaderMenu />
          <AccountInfo userId={parseInt(userId.toString(), 10)} currentUsername={currentUsername} username={username}/>
          <AccountSetting />
        </div>
      </main>
      )
    }
    else {
      return (
        <main className="m-0 min-h-screen min-w-screen flex flex-col items-center">
        <div className="md:w-full max-w-xl flex flex-col items-center w-full">
          <HeaderMenu />
          <AccountInfo userId={parseInt(userId.toString(), 10)} currentUsername={currentUsername} username={username}/>
        </div>
      </main>
      )
    }
  }
}