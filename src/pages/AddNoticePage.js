import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet-async";
import {
    Avatar, Box, Button,
    Card,
    Container, FormControl, FormControlLabel, FormLabel,
    Grid, InputLabel, MenuItem, Radio, RadioGroup, Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import 'react-mde/lib/styles/css/react-mde-all.css';
import 'github-markdown-css/github-markdown-light.css';
import {useNavigate} from "react-router-dom";
import {ADD_BOOK} from "../constant/menuType";
import message from "../utils/messageUtil";
import {addBook} from "../api/modules/book";
import {sendNotice} from "../api/modules/notice";

function AddNoticePage(props) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('all');
    const [recipientId, setRecipientId] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setType(event.target.value);
    };

    const handleNotice = async () => {
        if (!title || !content || !type) {
            message.error('参数不允许为空')
            return
        }
        if (type === 'single') {
            if (recipientId.indexOf(",") !== -1) {
                message.error('单用户不允许输入多个ID参数')
                return
            }
        }

        const obj = {
            title,
            content,
            type,
            recipientId
        }
        try {
            const {data} = await sendNotice(obj);
            message.success('发送成功')
            navigate('/dashboard/noticeList',{replace:true})
        } catch (e) {
            message.error(e)
        }

    }
    return (
        <>
            <Helmet>
                <title> 发送通知 </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        发送通知
                    </Typography>
                </Stack>

                <Card sx={{p: 3}}>
                    <Grid container spacing={3}>
                        <Grid container item spacing={3} sm={12}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="title"
                                    name="title"
                                    label="通知标题"
                                    onChange={(event) => {
                                        setTitle(event.target.value)
                                    }}
                                    value={title}
                                    fullWidth
                                    autoComplete="given-name"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="content"
                                    name="content"
                                    label="通知内容"
                                    onChange={(event) => {
                                        setContent(event.target.value)
                                    }}
                                    value={content}
                                    fullWidth
                                    autoComplete="given-name"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    disabled={type === 'all'}
                                    id="recipientId"
                                    name="recipientId"
                                    label="用户ID(以逗号分隔)"
                                    onChange={(event) => {
                                        setRecipientId(event.target.value)
                                    }}
                                    value={recipientId}
                                    fullWidth
                                    autoComplete="given-name"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <RadioGroup
                                    row
                                    value={type}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="all" control={<Radio/>} label="全体用户"/>
                                    <FormControlLabel value="single" control={<Radio/>} label="单用户"/>
                                    <FormControlLabel value="multi" control={<Radio/>} label="多用户"/>
                                </RadioGroup>
                            </Grid>
                        </Grid>

                        <Grid container item>
                            <Button onClick={handleNotice} sx={{width: '100%'}}
                                    variant="contained">发送</Button>
                        </Grid>
                        <Grid container item>
                            <Button onClick={() => {
                                navigate('/dashboard/noticeList', {
                                    replace: false,
                                })
                            }} sx={{width: '100%'}} color={"warning"}
                                    variant="contained">返回</Button>
                        </Grid>
                    </Grid>
                </Card>
            </Container>

        </>
    );
}

export default AddNoticePage;
