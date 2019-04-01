import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Col, Grid, Row} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPlus, faUsers} from '@fortawesome/free-solid-svg-icons';
import {isEmpty} from 'lodash';
import {IconLinkButton} from '@indec/react-commons';

import {TableContainer} from '../../common';
import {requestUsers, requestRemoveUser} from '../../../actions/users';
import {confirmDialog} from '../../../util';
import {User} from '../../../model';

import UsersTable from './UsersTable';

class Users extends PureComponent {
    static propTypes = {
        requestRemoveUser: PropTypes.func.isRequired,
        requestUsers: PropTypes.func.isRequired,
        users: PropTypes.arrayOf(
            PropTypes.instanceOf(User)
        ),
        location: PropTypes.shape({
            search: PropTypes.string
        }).isRequired,
        loading: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.shape({}))
    };

    static defaultProps = {
        users: [],
        loading: false,
        roles: []
    };

    componentDidMount() {
        this.props.requestUsers();
    }

    handleRemoveUser(user) {
        if (confirmDialog(`¿Seguro desea deshabilitar al usuario: ${user.username}?`)) {
            this.props.requestRemoveUser(user._id);
        }
    }

    render() {
        const {users, loading, roles} = this.props;
        return (
            <Grid fluid>
                <Row className="form-group">
                    <Col sm={8}>
                        <h2>
                            <FontAwesomeIcon icon={faUsers}/>
                            &nbsp;Usuarios
                        </h2>
                    </Col>
                    <Col sm={2}>
                        <IconLinkButton
                            to="/users/new"
                            icon={faUserPlus}
                            bsStyle="primary"
                            className="btn-group-justified margin-top-h2"
                        >
                            Nuevo
                        </IconLinkButton>
                    </Col>
                </Row>
                <TableContainer loading={loading} entities={users}>
                    {!isEmpty(users) && (
                        <UsersTable onRemove={user => this.handleRemoveUser(user)} {...{users, roles}}/>
                    )}
                </TableContainer>
            </Grid>
        );
    }
}

export default connect(
    state => ({
        loading: state.user.loading,
        users: state.user.users,
        roles: state.staticData.roles
    }),
    dispatch => ({
        requestUsers: (term, state, page) => dispatch(requestUsers(term, state, page)),
        requestRemoveUser: id => dispatch(requestRemoveUser(id))
    })
)(Users);