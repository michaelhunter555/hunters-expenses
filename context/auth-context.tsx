import { useContext, createContext, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useApi } from '@/hooks/useHttp';

interface IAuth {
    name: string;
    id: string;
    isLoggedIn?: boolean;
    handleLogin: (email: string, password: string) => void;
    handleLogout: () => void;
    jwtToken: string | null;
}

const authContext: IAuth = {
    name: "",
    id: "",
    isLoggedIn: false,
    handleLogin: (email: string, password: string) => {},
    handleLogout: () => {},
    jwtToken: null
}

const AuthContext = createContext<IAuth>(authContext);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const router = useRouter();
    const { request } = useApi();
    const [user, setUser] = useState<any>({
        name: "",
        id: "",
        isLoggedIn: false,
        jwtTokent: null
    })

    useEffect(() => {
        const token = localStorage.getItem("@token");
        if(!token) handleLogout();
        const userData = JSON.parse(String(token));
        if(userData?.expiration && userData?.user && new Date(userData?.expiration) > new Date()) {
            setUser({
                name: userData.user.name,
                id: userData.user._id,
                isLoggedIn: true,
                jwtToken: userData.user.jwtToken,
            })
        } else {
            handleLogout()
        }
    }, [])

    const login = useMutation({
        mutationKey: ['login-admin'],
        mutationFn: async (p:{email: string, password: string}) => {
            const { email, password } = p;
            return await request(
                `admin/login`, 
                'POST', 
                JSON.stringify({ email, password }),
                {"Content-Type":"application/json"}
            )
        }
    })

    const handleLogin = async (email: string, password: string) => {
        if(password && email) {
            login.mutate({ email, password}, {
                onSuccess: (data) => {
                    console.log(data)
                    const newUser = {
                        name: data.name,
                        id: data.id,
                        isLoggedIn: true,
                        jwtToken: data.token,
                    }
                    setUser(newUser)

                    const expiration = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                    localStorage.setItem("@token", JSON.stringify({ user: newUser, expiration }))
                    router.push('/');
                },
                onError: (err) => {
                    console.log(err);
                }
            })
        }
    }

    const handleLogout = async () => {
        await request(
            `user/logout`, 
            'POST', 
            null, 
            {
                Authorization: `Bearer ${user.jwtToken}`
            })
            localStorage.removeItem("@token")
        setUser({
            name: "",
            id: "",
            isLoggedIn: false,
            jwtToken: null,
        })
    }


    return (
        <AuthContext.Provider value={{
            name: user.name,
            id: user.id,
            isLoggedIn: !!user.isLoggedIn,
            handleLogin: handleLogin,
            handleLogout: handleLogout,
            jwtToken: user.jwtToken,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);
export default useAuth;