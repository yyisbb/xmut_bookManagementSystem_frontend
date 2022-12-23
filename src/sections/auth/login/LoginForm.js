import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
// @mui
import {Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Grid, Typography, Avatar} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import {useDispatch, useSelector} from "react-redux";
import {Image} from "@mui/icons-material";
import Iconify from '../../../components/iconify';
import {loginApi} from "../../../api/modules/login";
import message from "../../../utils/messageUtil";
import {PARAM_NULL_ERROR} from "../../../constant/errorMsg";
import {setToken, setUserInfo} from "../../../redux/global/globalSlice";
import {getInfo} from "../../../api/modules/user";
// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [codeUrl, setCodeUrl] = useState('api/getCode');
    const dispatch = useDispatch();
    const usernameChange = (event) => {
        setUserName(event.target.value)
    }
    const passwordChange = (event) => {
        setPassword(event.target.value)
    }


    const handleClick = async (event) => {
        if (!username || !password) {
            message.info(PARAM_NULL_ERROR)
            return
        }
        const loginParam = {
            username,
            password
        };
        // 清空token和用户信息
        dispatch(setToken(''));
        dispatch(setUserInfo({}))
        try {
            const {data} = await loginApi(loginParam);
            dispatch(setToken(data));
            try {
                const {data} = await getInfo()
                dispatch(setUserInfo(data));
                navigate('/', {replace: true})
            } catch (e) {
                dispatch(setToken(''));
                message.error(e)
            }

        } catch (e) {
            message.error(e)
        }


    };

    const toRegisterHandleClick = () => {
        navigate('/register', {replace: true})
    }


    useEffect(() => {
    }, [])

    return (
        <>
            <Stack spacing={3}>
                <TextField name="usernameOrStuId" onChange={usernameChange} label="用户名或学号"/>

                <TextField
                    name="password"
                    label="密码"
                    type={showPassword ? 'text' : 'password'}
                    onChange={passwordChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}/>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
                登录
            </LoadingButton>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}/>
            <LoadingButton color={'success'} onClick={toRegisterHandleClick} fullWidth size="large" type="submit"
                           variant="contained">
                去注册
            </LoadingButton>
        </>
    );
}
