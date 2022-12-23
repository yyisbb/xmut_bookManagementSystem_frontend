import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
// @mui
import {
    Link,
    Stack,
    IconButton,
    InputAdornment,
    TextField,
    Checkbox,
    Grid,
    FormControl,
    InputLabel, Select, MenuItem, Card, Typography, Avatar, Button
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import {useDispatch, useSelector} from "react-redux";
import Iconify from '../../../components/iconify';
import {loginApi, registerApi} from "../../../api/modules/login";
import message from "../../../utils/messageUtil";
import {PARAM_NULL_ERROR} from "../../../constant/errorMsg";
import {setToken, setUserInfo} from "../../../redux/global/globalSlice";
import {getInfo} from "../../../api/modules/user";
import {ADD_BOOK} from "../../../constant/menuType";
import {uploadFile} from "../../../utils/fileUtil";
import {upload} from "../../../api/modules/file";
// ----------------------------------------------------------------------

export default function RegisterForm() {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState('');

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [studentId, setStudentId] = useState('');
    const dispatch = useDispatch();
    const usernameChange = (event) => {
        setUserName(event.target.value)
    }
    const passwordChange = (event) => {
        setPassword(event.target.value)
    }

    const nicknameChange = (event) => {
        setNickname(event.target.value)
    }
    const studentIdChange = (event) => {
        setStudentId(event.target.value)
    }


    const toLoginHandleClick = () => {
        navigate('/login', {replace: true})
    }

    const handleClick = async (event) => {
        if (!username || !password||!avatar||!studentId||!nickname) {
            message.info(PARAM_NULL_ERROR)
            return
        }
        const registerParam = {
            username:`${username}@qq.com`,
            password,
            avatar,
            studentId,
            nickname
        };
        try {
            const {data} = await registerApi(registerParam);
            message.success('注册成功')
            navigate('/login', {replace: true})
        } catch (e) {
            message.error(e)
        }


    };

    const uploadOnClick = () => {
        uploadFile({accept: 'image/*', fileTypes: [], fileSize: 50}).then(async (file) => {
            if (!file) {
                message.error('参数不允许为空')
                return
            }
            // 获取到的file对象
            const formData = new FormData();
            formData.append('file', file);
            try {
                const {data} = await upload(formData);
                message.success('上传成功')
                setAvatar(data)
            } catch (e) {
                message.error(e)
            }
        }).catch((errorMsg) => {
            // 检验不通过的错误信息
            message.error(errorMsg)
        });
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item container xs={12}>
                    <Grid item xs={4}/>
                    <Grid item xs={4}>
                        <Avatar
                            variant="circular"
                            alt="Remy Sharp"
                            src={avatar || '/assets/images/avatars/avatar_4.jpg'}
                            sx={avatar ? {width: "100%", height: "100%"} : {
                                p: 1,
                                width: "100%",
                                height: "auto"
                            }}
                            onClick={uploadOnClick}
                        />
                    </Grid>
                    <Grid item xs={4}/>

                </Grid>
                <Grid item xs={8}>
                    <TextField
                        required
                        id="username"
                        name="username"
                        label="用户名"
                        value={username}
                        onChange={usernameChange}
                        fullWidth
                        autoComplete="given-name"
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h3">
                       @qq.com
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="password"
                        name="password"
                        label="密码"
                        onChange={passwordChange}
                        value={password}
                        fullWidth
                        type={"password"}
                        autoComplete="given-name"
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="nickname"
                        name="nickname"
                        label="真实姓名"
                        onChange={nicknameChange}
                        fullWidth
                        value={nickname}
                        type={"text"}
                        autoComplete="given-name"
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="studentId"
                        name="studentId"
                        label="学号"
                        value={studentId}
                        onChange={studentIdChange}
                        fullWidth
                        type={"number"}
                        autoComplete="family-name"
                        variant="outlined"
                    />
                </Grid>
            </Grid>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}/>
            <LoadingButton onClick={handleClick} fullWidth size="large" type="submit" variant="contained">
                注册
            </LoadingButton>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}/>
            <LoadingButton color={'success'} onClick={toLoginHandleClick} fullWidth size="large" type="submit"
                           variant="contained">
                去登录
            </LoadingButton>
        </>
    );
}
