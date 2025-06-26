import { Link } from 'react-router-dom'
import './chatList.css'
import { useQuery } from '@tanstack/react-query';

const ChatList = () => {

    const { isPending, error, data } = useQuery({
        queryKey: ["userChats"],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
                credentials: "include",
            }).then((res) =>
                res.json(),
            ),
    });

    return (
        <div className='chatList'>
            <span className='title'>
                DASHBOARD
            </span>
            <Link to="/dashboard">Create an new chat</Link>
            <Link to="/">Explore Calvi AI</Link>
            <Link to="/">Contact</Link>
            <hr />
            <span className='title'>
                RECENT CHATS
            </span>
            <div className="list">{
                isPending ? "Loading..." : error ? "Something wrong!" : data?.map((chats) => (
                    <Link to={`/dashboard/chats/${chats._id}`} key={chats._id}>
                        {chats.title}
                    </Link>
                ))
            }

            </div>
            <hr />
            <div className="upgrade">
                <img src="/logo.png" alt="" />
                <div className="text">
                    <span>Upgarde to Calvi AI Extra</span>

                    <span>Get unlimited access to all features</span>
                </div>

            </div>
        </div>

    )
}

export default ChatList