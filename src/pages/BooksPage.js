import {Helmet} from 'react-helmet-async';
import {useEffect, useState} from 'react';
// @mui
import {Container, InputAdornment, OutlinedInput, Stack, Typography} from '@mui/material';
// components
import {alpha, styled} from "@mui/material/styles";
import {filter} from "lodash";
import { BookList} from '../sections/@dashboard/books';
// mock
import Iconify from "../components/iconify";
import {getBooksList} from "../api/modules/book";
import message from "../utils/messageUtil";

// ----------------------------------------------------------------------

const StyledSearch = styled(OutlinedInput)(({theme}) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
        width: 320,
        boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
}));

export default function BooksPage() {

    const [filterName, setFilterName] = useState('');

    // 保存一遍数据

    const [bookListConst, setBookListConst] = useState();
    const [bookList, setBookList] = useState([]);

    const allBook = async () => {
        try {
            const {data} = await getBooksList();
            setBookList(data)
            setBookListConst(data)
        } catch (e) {
            message.error(e)
        }
    }

    useEffect(() => {
        allBook()
    }, [])



    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };


    useEffect(() => {
        const filterBooks = filter(bookListConst, (_book) => _book.bookName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1||
            _book.bookAuthor.toLowerCase().indexOf(filterName.toLowerCase()) !== -1||
            _book.categoryName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
        setBookList(filterBooks)
    }, [filterName])


    return (
        <>
            <Helmet>
                <title> 图书借阅列表 </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{mb: 5}}>
                    图书借阅列表
                </Typography>

                <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-start"
                       sx={{mb: 5}}>
                    <Stack direction="row" spacing={1} flexShrink={0} sx={{my: 1}}>
                        <StyledSearch
                            placeholder="图书搜索"
                            value={filterName}
                            onChange={handleFilterByName}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill"
                                             sx={{color: 'text.disabled', width: 20, height: 20}}/>
                                </InputAdornment>
                            }
                        />
                    </Stack>
                </Stack>

                <BookList refreshBooks={allBook} books={bookList}/>
            </Container>
        </>
    );
}
