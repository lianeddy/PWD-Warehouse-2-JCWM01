import React from 'react';
import { Navbar, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle,DropdownMenu, DropdownItem, NavbarBrand, NavbarText} from 'reactstrap'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class navbar extends React.Component {

    render() {
        console.log(this.props.userGlobal)
        return (
            <div>
                <Navbar color="dark" dark>
                    <NavbarBrand>Annett</NavbarBrand>
                    <Nav>
                        <NavItem>
                            <NavbarText>Hello, {this.props.userGlobal.username}</NavbarText>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Pages
                            </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        <Link to="/home">Home</Link>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <Link to="/register">Register</Link>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <Link to="/login">Login</Link>
                                    </DropdownItem>
                                </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Navbar>
            </div>    
        )
    }
}



const mapStateToProps = (state) => {
    return {
        userGlobal: state.user
    }
}

export default connect(mapStateToProps)(navbar);