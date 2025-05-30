import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { user } = useAuth();

    return (
        <Route
            {...rest}
            render={props => {
                if (!user) {
                    return <Redirect to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }} />;
                }

                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
