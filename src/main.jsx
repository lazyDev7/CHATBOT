import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter,RouterProvider} from 'react-router-dom'
import Homepage from './routes/homepage/Homepage'
import Dashboardpage from "./routes/dashboardpage/Dashboardpage"
import RootLayout from "./layout/rootLayout/RootLayout"
import DashboardLayout from './layout/dashboardLayout/DashboardLayout'
import Chatpage from './routes/chatpage/Chatpage'
import SignInPage from "e:/CHATBOT/chatgpt-clone/src/routes/signInpage/signInpage"
import SignUpPage from "e:/CHATBOT/chatgpt-clone/src/routes/signUpPage/signUppage"




const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        path:"/", 
        element: <Homepage/>,
      },
      {
        path:"/sign-in/*",
        element:<SignInPage/>,
      },
       {
        path:"/sign-up/*",
        element:<SignUpPage/>,
      },
      {
        element: <DashboardLayout/>,
        children:[
          {
            path:"/dashboard",
            element:<Dashboardpage/>,
          },
          {
            path:"/dashboard/chats/:id",
            element:<Chatpage/>,
          },
        ],
      },
    ],
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
