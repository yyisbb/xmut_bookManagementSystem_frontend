import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
// @mui
import {styled, alpha} from '@mui/material/styles';
import {Box, Link, Button, Drawer, Typography, Avatar, Stack} from '@mui/material';
// hooks
import {useDispatch, useSelector} from "react-redux";
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import {navConfig, authNavConfig} from './config';
import SvgColor from "../../../components/svg-color";

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{width: 1, height: 1}}/>;

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
    openNav: PropTypes.bool,
    onCloseNav: PropTypes.func,
};

export default function Nav({openNav, onCloseNav}) {
    const {pathname} = useLocation();

    const isDesktop = useResponsive('up', 'lg');
    const user = useSelector(state => state.globalSlice.userInfo);
    const [config,setConfig] = useState([]);

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps


    }, [pathname]);

    useEffect(() => {
        if (user.isAdmin === 1) {
            setConfig(authNavConfig)
        }else {
            setConfig(navConfig)
        }
    }, [])


    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': {height: 1, display: 'flex', flexDirection: 'column'},
            }}
        >
            <Box sx={{px: 2.5, py: 3, display: 'inline-flex'}}>
                <Logo/>
            </Box>

            <Box sx={{mb: 5, mx: 2.5}}>
                <Link underline="none">
                    <StyledAccount>
                        <Avatar src={user.avatar || ''} alt="photoURL"/>

                        <Box sx={{ml: 2}}>
                            <Typography variant="subtitle2" sx={{color: 'text.primary'}}>
                                {user.nickname || ''}
                            </Typography>

                            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                {user.username || ''}
                            </Typography>
                        </Box>
                    </StyledAccount>
                </Link>
            </Box>

            <NavSection data={config}/>

            <Box sx={{flexGrow: 1}}/>

        </Scrollbar>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: {lg: 0},
                width: {lg: NAV_WIDTH},
            }}
        >
            {isDesktop ? (
                <Drawer
                    open
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            width: NAV_WIDTH,
                            bgcolor: 'background.default',
                            borderRightStyle: 'dashed',
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        sx: {width: NAV_WIDTH},
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}
