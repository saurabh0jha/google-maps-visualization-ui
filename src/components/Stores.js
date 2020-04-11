import React from 'react';
import * as moment from 'moment';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import bookmark from '../assets/bookmark.svg';
import bookmarkBW from '../assets/bookmarkBW.svg';
import activity from '../assets/activity.svg';
import home from '../assets/home.svg';
import FilterDropdown from './FilterDropdown';
import { timeStringComparator, distanceComparator, getIsoString } from '../services/utilService';

const filters = ['distance', 'active'];

export class StoresComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: 'active'
        };
    }

    updateList(filter) {
        if (filters.includes(filter)) {
            this.setState({ filter });
        }
    }

    render() {
        const sortBy = this.state.filter;
        const stores = this.props.stores;
        if (sortBy === 'active') {
            stores.sort(timeStringComparator('last_transaction','desc'));
        } else if (this.props.center && this.props.center.lat &&
            this.props.center.lng && sortBy === 'distance') {
            stores.sort(distanceComparator('asc', this.props.center));
        }

        let homeLocation = stores.filter(store => store.isHome)[0];
        return (

            <div className="stores-container">

                <div className="stores-header">
                    <FilterDropdown onSelect={(filter) => { this.updateList(filter) }} />
                    <div className="tag colored">
                        <img className="small-icon" src={bookmark} alt="Bookmarked" />
                        <span>Bookmarked</span>
                    </div>
                    {
                        homeLocation &&
                        <div className="tag" onClick={() => {
                            this.props.onStoreSelect({
                                lat: homeLocation.lat,
                                lng: homeLocation.lon,
                                id: homeLocation.id
                            });
                        }}>
                            <img className="small-icon" src={home} alt="Home Location" />
                            <span className="store-name" >{homeLocation.name && homeLocation.name.toLowerCase()}</span>

                        </div>
                    }
                </div>
                <SimpleBar className="stores-scroller">
                    <div className="stores-body">
                        {(!stores || stores.length === 1) &&
                            <div className="store" style={{ color: '#f5821f', textTransform: 'unset' }}>
                                No Stores found here. Please explore nearby.
                         </div>}
                        {stores && stores.map((store) => {
                            const ts = store.last_transaction ?
                                moment(getIsoString(store.last_transaction)).fromNow() :
                                '';
                            return <div key={store.id}>
                                {!store.isHome && <div className={this.props.selectedStore === store.id ? 'store selected' : 'store'} onClick={(event) => {
                                    this.props.onStoreSelect({ lat: store.lat, lng: store.lon, id: store.id });
                                }}>
                                    <div style={{ 'display': 'flex', 'justifyContent': 'space-between' }}>
                                        <img className="small-icon" src={bookmarkBW} alt="Bookmarked" />
                                        <span className="store-name">{store.name && store.name.toLowerCase()}</span>
                                    </div>
                                    <div style={{ 'display': 'flex', 'justifyContent': 'space-between' }}>
                                        <img className="smaller-icon" src={activity} alt="Last Active" />
                                        <small>Active {ts}</small>
                                    </div>
                                </div>}
                            </div>;
                        })}
                    </div>
                </SimpleBar>
            </div>
        );
    }
}

export default StoresComponent;