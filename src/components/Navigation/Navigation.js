import React from 'react';

const Navigation = ({onRouteChange, isSignedIn}) => {
        if (isSignedIn) {
            return (
        <nav className="flex justify-end">
            <p onClick={() => onRouteChange('signout')} className="f3 link dim white pa3 pointer ml2 mr4">Sing Out</p>
        </nav>
            );
        } else {
             return (
        <nav className="flex justify-end">
            <p onClick={() => onRouteChange('signin')} className="f3 link dim white pa3 pointer ml2 mr4">Sing In</p>
            <p onClick={() => onRouteChange('register')} className="f3 link dim white pa3 pointer ml2 mr4">Register</p>
        </nav>);
        }
}

export default Navigation;