import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { Outlet, useNavigate } from 'react-router-dom';
export default function ProtectedRoutes() {
    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        const auth = cookies.get('auth');
        if (!auth) {
            navigate('/');
        } else {
            <Outlet />
        }
    })

}