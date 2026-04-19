import { useSelector } from "react-redux";
import Login from "../../pages/Login";

const Auth = ({ children }) => {
    const { user } = useSelector(state => state.userStore)
    return (
        user?._id ? (children) : (<Login />)
    )
}

export default Auth