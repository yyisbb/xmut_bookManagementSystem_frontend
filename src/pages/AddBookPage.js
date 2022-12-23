import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet-async";
import {
    Avatar, Box, Button,
    Card,
    Container, FormControl,
    Grid, InputLabel, MenuItem, Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import message from "../utils/messageUtil";
import {getAllCategory} from "../api/modules/category";
import {uploadFile} from "../utils/fileUtil";
import {upload} from "../api/modules/file";
import {addBook, getBookInfo, updateBookInfo} from "../api/modules/book";
import {ADD_BOOK, UPDATE_BOOK} from "../constant/menuType";
import 'react-mde/lib/styles/css/react-mde-all.css';
import 'github-markdown-css/github-markdown-light.css';

function loadSuggestions(text) {
    return new Promise((accept) => {
        setTimeout(() => {
            const suggestions = [
                {
                    preview: 'Andre',
                    value: '@andre'
                },
                {
                    preview: 'Angela',
                    value: '@angela'
                },
                {
                    preview: 'David',
                    value: '@david'
                },
                {
                    preview: 'Louise',
                    value: '@louise'
                }
            ].filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
            accept(suggestions);
        }, 250);
    });
}
function AddBookPage(props) {
    const [bookNo, setBookNo] = useState(0);
    const [bookName, setBookName] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [bookDescription, setDescription] = useState('');
    const [bookQuantity, setBookQuantity] = useState(0);
    const [bookCover, setBookCover] = useState('');
    const [bookCategoryId, setBookCategoryId] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [content, setContent] = useState('');
    const [selectedTab, setSelectedTab] = useState('write');
    const {
        state: { type ,bookStateId},
    } = useLocation()

    const navigate = useNavigate();
    const getCategoryList = async () => {
        try {
            const {data} = await getAllCategory()
            setCategoryList(data)
        } catch (e) {
            message.error(e)
        }
    }

    const getBookInfoHandle =async () => {
        try {
            const {data} =await getBookInfo(bookStateId)
            setBookNo(data.bookNo)
            setBookName(data.bookName)
            setBookAuthor(data.bookAuthor)
            setBookQuantity(data.bookQuantity)
            setBookCover(data.bookCover)
            setBookCategoryId(data.bookCategoryId)
            setContent(data.bookContent)
            setDescription(data.bookDescription)
        } catch (e) {
            message.error(e)
        }
    }
    useEffect( () => {
        getCategoryList()
        if (type===UPDATE_BOOK){
            getBookInfoHandle()
        }
    }, [])

    const updateBookHandle = async () => {
        if (!bookNo || !bookName || !bookAuthor || !bookQuantity || !bookCover || !bookCategoryId) {
            message.error('参数不允许为空')
            return
        }
        const obj = {
            id:bookStateId,
            bookName,
            bookAuthor,
            bookQuantity,
            bookCover,
            bookCategoryId,
            bookContent:content,
            bookDescription,
        }

        try {
            const {data} = await updateBookInfo(obj)
            message.success('修改成功')
            navigate('/dashboard/bookManagement',{replace:true})
        } catch (e) {
            message.error(e)
        }
    }

    const submitHandle = async () => {
        if (!bookNo || !bookName || !bookAuthor || !bookQuantity || !bookCover || !bookCategoryId) {
            message.error('参数不允许为空')
            return
        }
        const obj = {
            bookNo,
            bookName,
            bookAuthor,
            bookQuantity,
            bookCover,
            bookCategoryId,
            bookContent:content,
            bookDescription,
        }


        try {
            const {data} = await addBook(obj)
            message.success('添加成功')
            navigate('/dashboard/bookManagement',{replace:true})
        } catch (e) {
            message.error(e)
        }
    }

    const handleChange = (event) => {
        setBookCategoryId(event.target.value);
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
                setBookCover(data)
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
            <Helmet>
                <title> 新增图书 </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        新增图书
                    </Typography>
                </Stack>

                <Card sx={{p: 3}}>
                    <Grid container spacing={3}>
                        <Grid container item spacing={3} sm={8}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="bookNo"
                                    name="bookNo"
                                    label="书号"
                                    onChange={(event) => {
                                        setBookNo(event.target.value)
                                    }}
                                    disabled={type !== ADD_BOOK}
                                    value={bookNo}
                                    type={"number"}
                                    fullWidth
                                    autoComplete="given-name"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="bookName"
                                    name="bookName"
                                    label="书名"
                                    onChange={(event) => {
                                        setBookName(event.target.value)
                                    }}
                                    value={bookName}
                                    fullWidth
                                    autoComplete="given-name"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="bookAuthor"
                                    name="bookAuthor"
                                    label="作者"
                                    onChange={(event) => {
                                        setBookAuthor(event.target.value)
                                    }}
                                    value={bookAuthor}
                                    fullWidth
                                    autoComplete="given-name"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="bookDescription"
                                    name="bookDescription"
                                    label="图书描述"
                                    onChange={(event) => {
                                        setDescription(event.target.value)
                                    }}
                                    value={bookDescription}
                                    fullWidth
                                    autoComplete="given-name"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="bookQuantity"
                                    name="bookQuantity"
                                    label="库存"
                                    type={"number"}
                                    value={bookQuantity}
                                    onChange={(event) => {
                                        setBookQuantity(event.target.value)
                                    }}
                                    fullWidth
                                    autoComplete="family-name"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ReactMde
                                    value={content}
                                    onChange={setContent}
                                    style={{width:'100%'}}
                                    selectedTab={selectedTab}
                                    onTabChange={setSelectedTab}
                                    generateMarkdownPreview={(markdown) =>
                                        Promise.resolve(
                                            <div className={'markdown-body'}>
                                                <ReactMarkdown children={markdown} />
                                            </div>
                                        )
                                    }
                                    loadSuggestions={loadSuggestions}
                                    childProps={{
                                        writeButton: {
                                            tabIndex: -1
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="select-label">选择分类</InputLabel>
                                    <Select
                                        labelId="select-label"
                                        label="SelectCategory"
                                        value={bookCategoryId|| 0}
                                        onChange={handleChange}
                                    >
                                        <MenuItem key={0} value={0}>
                                            请选择分类
                                        </MenuItem>
                                        {
                                            categoryList.map((item) => <MenuItem key={item.id}
                                                                                 value={item.id || 0}>{item.name}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container item sm={4}>
                            <Card sx={{width: "100%", height: "100%"}}>
                                {bookCover ? '' : <Typography sx={{m: 2, textAlign: 'center'}} variant="h6">
                                    上传图书封面
                                </Typography>}
                                <Avatar
                                    variant="rounded"
                                    alt="Remy Sharp"
                                    src={bookCover || '/assets/upload.png'}
                                    sx={bookCover ? {width: "100%", height: "100%"} : {
                                        p: 1,
                                        width: "100%",
                                        height: "auto"
                                    }}
                                    onClick={uploadOnClick}
                                />
                            </Card>
                        </Grid>
                        <Grid container item>
                            <Button onClick={type===ADD_BOOK?submitHandle:updateBookHandle} sx={{width: '100%'}} color={"primary"}
                                    variant="contained">{type===ADD_BOOK?'确认':'修改'}</Button>
                        </Grid>

                        <Grid container item>
                        <Button onClick={()=>{
                            navigate('/dashboard/bookManagement',{replace:true})
                        }} sx={{width: '100%'}} color={"warning"}
                                variant="contained">返回</Button></Grid>
                    </Grid>
                </Card>
            </Container>

        </>
    );
}

export default AddBookPage;
