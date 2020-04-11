import React from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import filterBy from '../assets/filterBy.svg';
import './dropdown.css';


export class FilterDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentFilter: null
        };
    }

    handleSelect(filter) {
        this.setState({ currentFilter: filter });
        this.props.onSelect(filter);
        this.refs.dropdown.hide();
    }

    render() {

        const { currentFilter } = this.state;

        return (<Dropdown ref="dropdown">
            <DropdownTrigger>
                <div className={currentFilter ? "tag selected" : "tag"}>
                    <img className="small-icon" src={filterBy} alt="Filter By" />
                    <span>
                        {currentFilter ?
                            (currentFilter === 'active' ? 'Sorted By Last Active' : 'Sorted By Distance') :
                            'Sorted By Last Active'
                        }
                    </span>
                </div>
            </DropdownTrigger>
            <DropdownContent>
                <div
                    onClick={() => {
                        this.handleSelect('distance');
                    }}
                    className={currentFilter === "distance" ? "dropdown-menuitem selected" : "dropdown-menuitem"}>
                    <span>Sort By Distance</span>
                </div>

                <div onClick={() => {
                    this.handleSelect('active');
                }}
                    className={currentFilter === "active" ? "dropdown-menuitem selected" : "dropdown-menuitem"}>
                    <span>Sort By Last Active</span>
                </div>
            </DropdownContent>
        </Dropdown >);
    }

}

export default FilterDropdown;