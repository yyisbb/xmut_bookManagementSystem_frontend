import PropTypes from 'prop-types';
import {set, sub} from 'date-fns';
import {noCase} from 'change-case';
import {faker} from '@faker-js/faker';
import {useEffect, useState} from 'react';
// @mui
import {
    Box,
    List,
    Badge,
    Button,
    Avatar,
    Tooltip,
    Divider,
    Popover,
    Typography,
    IconButton,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
    ListItemButton,
} from '@mui/material';
// utils
import {useSelector} from "react-redux";
import {fToNow} from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import {getNotice, readAllNotice, readNotice} from "../../../api/modules/notice";
import {getInfo} from "../../../api/modules/user";
import {setToken, setUserInfo} from "../../../redux/global/globalSlice";
import message from "../../../utils/messageUtil";

// ----------------------------------------------------------------------


export default function NotificationsPopover() {
    const [notifications, setNotifications] = useState([]);
    const [delay, setDelay] = useState(5000)
    const user = useSelector(state => state.globalSlice.userInfo);
    const totalUnRead = notifications.filter((item) => !item.state).length;

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleMarkAllAsRead = async () => {
        try {
            const {data} = await readAllNotice()
            getNoticeList()
        } catch (e) {
            console.log(e)
        }
    };
    const getNoticeList = async () => {
        try {
            const {data} = await getNotice()
            setNotifications(data)
        } catch (e) {
            message.error(e)
        }
    }
    useEffect(() => {
        if (!user.isAdmin) {
            const timer = setInterval(() => {
                getNoticeList()
            }, delay)
            return () => clearInterval(timer)
        }

        return ()=>{}
    }, [delay])


    return (
        <>
            <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{width: 40, height: 40}}>
                <Badge badgeContent={totalUnRead} color="error">
                    <Iconify icon="eva:bell-fill"/>
                </Badge>
            </IconButton>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        ml: 0.75,
                        width: 360,
                    },
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', py: 2, px: 2.5}}>
                    <Box sx={{flexGrow: 1}}>
                        <Typography variant="subtitle1">站内通知</Typography>
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            您有 {totalUnRead} 条未读消息
                        </Typography>
                    </Box>

                    {totalUnRead > 0 && (
                        <Tooltip title=" Mark all as read">
                            <IconButton color="primary" onClick={handleMarkAllAsRead}>
                                <Iconify icon="eva:done-all-fill"/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <Scrollbar sx={{height: {xs: 340, sm: 'auto'}}}>
                    <List
                        disablePadding
                        subheader={
                            <ListSubheader disableSticky sx={{py: 1, px: 2.5, typography: 'overline'}}>
                                未读消息
                            </ListSubheader>
                        }
                    >
                        {notifications.map((notification) => (
                            !notification.state ?
                                <NotificationItem refreshNoticeList={getNoticeList} key={notification.id}
                                                  notification={notification}/> : ''
                        ))}
                    </List>

                    <List
                        disablePadding
                        subheader={
                            <ListSubheader disableSticky sx={{py: 1, px: 2.5, typography: 'overline'}}>
                                已读消息
                            </ListSubheader>
                        }
                    >
                        {notifications.map((notification) => (
                            notification.state ?
                                <NotificationItem refreshNoticeList={getNoticeList} key={notification.id}
                                                  notification={notification}/> : ''
                        ))}
                    </List>
                </Scrollbar>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <Box sx={{p: 1}}>
                    <Button fullWidth disableRipple>
                        View All
                    </Button>
                </Box>
            </Popover>
        </>
    );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
    notification: PropTypes.shape({
        createdTime: PropTypes.string,
        id: PropTypes.number,
        state: PropTypes.number,
        title: PropTypes.string,
        content: PropTypes.string,
    }),
};

function NotificationItem({notification, refreshNoticeList}) {
    const {avatar, title} = renderContent(notification);


    const readHandle = async () => {
        try {
            const {data} = await readNotice(notification.id)
            refreshNoticeList()
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <ListItemButton
            onClick={readHandle}
            sx={{
                py: 1.5,
                px: 2.5,
                mt: '1px',
                ...(!notification.state && {
                    bgcolor: 'action.selected',
                }),
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{bgcolor: 'background.neutral'}}>{avatar}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={title}
                secondary={
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.disabled',
                        }}
                    >
                        <Iconify icon="eva:clock-outline" sx={{mr: 0.5, width: 16, height: 16}}/>
                        {fToNow(notification.createdTime)}
                    </Typography>
                }
            />
        </ListItemButton>
    );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
    const title = (
        <Typography variant="subtitle2">
            {notification.title}
            <Typography component="span" variant="body2" sx={{color: 'text.secondary'}}>
                &nbsp; {noCase(notification.content)}
            </Typography>
        </Typography>
    );

    return {
        avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg"/>,
        title,
    };
}
