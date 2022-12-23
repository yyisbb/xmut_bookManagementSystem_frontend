import { useState} from 'react';
// @mui
import {alpha} from '@mui/material/styles';
import {
    Box,
    Divider,
    Typography,
    Stack,
    MenuItem,
    Avatar,
    IconButton,
    Popover,
    Dialog,
    DialogTitle, DialogContent, TextField, DialogActions, Button
} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setToken, setUserInfo} from "../../../redux/global/globalSlice";
import {resetPassword, updatePassword} from "../../../api/modules/user";
import message from "../../../utils/messageUtil";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
    {
        id: 1,
        label: '首页',
        icon: 'eva:home-fill',
    },
    {
        id: 2,
        label: '修改密码',
        icon: 'eva:settings-2-fill',
    },
    {
        id: 3,
        label: '退出登录',
        icon: 'eva:settings-2-fill',
    },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [updatePwdOpen, setUpdatePwdOpen] = useState(false)
    const [newPwd, setNewPwd] = useState('');
    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleUpdateClose = async () => {
        if (!newPwd) {
            message.error('参数不允许为空')
            return
        }
        try {
            const {data} = await updatePassword(newPwd)
            message.customMsg({content: '密码修改成功,当前密码是: '.concat(data), data, duration: 10000});
            logout()
        } catch (e) {
            message.error(e)
        }
        setUpdatePwdOpen(false)
    }


    const logout = () => {
        // 退出登录
        dispatch(setToken(''));
        dispatch(setUserInfo({}))
        navigate('/login', {replace: true})
    }

    const handleClick = (id) => {
        return () => {
            setOpen(null);
            switch (id) {
                case 1:
                    navigate('/dashboard/bookList',{replace:true})
                    break
                case 2:
                    // 修改密码
                    setNewPwd('')
                    setUpdatePwdOpen(true)
                    break
                case 3:
                    logout();
                    break
                default:
            }
        }
    };


    const user = useSelector(state => state.globalSlice.userInfo);

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar src={user.avatar} alt="photoURL"/>
            </IconButton>

            <Dialog open={updatePwdOpen} onClose={handleUpdateClose}>
                <DialogTitle>修改密码</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="请输入新密码"
                        onChange={(event) => {
                            setNewPwd(event.target.value)
                        }}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setUpdatePwdOpen(false)
                    }}>取消</Button>
                    <Button onClick={handleUpdateClose}>修改</Button>
                </DialogActions>
            </Dialog>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{
                    sx: {
                        p: 0,
                        mt: 1.5,
                        ml: 0.75,
                        width: 180,
                        '& .MuiMenuItem-root': {
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <Box sx={{my: 1.5, px: 2.5}}>
                    <Typography variant="subtitle2" noWrap>
                        {user.nickname}
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                        {user.username}
                    </Typography>
                </Box>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <Stack sx={{p: 1}}>
                    {MENU_OPTIONS.map((option) => (
                        <MenuItem key={option.label} onClick={handleClick(option.id)}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Stack>

                <Divider sx={{borderStyle: 'dashed'}}/>
            </Popover>
        </>
    );
}
