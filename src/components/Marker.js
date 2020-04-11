import React from 'react';
import PropTypes from 'prop-types';
import mapMarker from '../assets/mapMarker.png';
import pinBlue from '../assets/pinBlue.svg';
import home from '../assets/home.svg';

export class Marker extends React.Component {

    render() {
        let marker = mapMarker;
        let markerType = null;
        if (this.props.isHome) {
            marker = home;
            markerType = 'home';
        } else if (this.props.isSelected) {
            marker = pinBlue;
            markerType = 'selected';
        }
        return (
            <div>
                <img className={`marker ${markerType}`} src={marker} alt="Logo" />
                <div className={`marker-text ${markerType}`}>{this.props.text && this.props.text.toLowerCase()}</div>
            </div>
        );
    }

    static propTypes = {
        onClick: PropTypes.func,
        text: PropTypes.string.isRequired,
    };
}

export default Marker;