import React from 'react';
import home from '../assets/home.svg';

export class HeaderComponent extends React.Component {
    
    render(){
        return (
        <div className="header-container">
            <img className="app-logo" src={home} alt="Powered by Home" />
            <span className="app-title">Google Maps Visualization</span>
        </div>);
    }
}

export default HeaderComponent;