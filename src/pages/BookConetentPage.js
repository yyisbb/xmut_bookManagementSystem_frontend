import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeRaw from 'rehype-raw'
import 'github-markdown-css/github-markdown-light.css'
import './index.css'
// material
import {
    Container,
    Box,
    Card, CardHeader, Typography, CardContent
} from '@mui/material';
// components
import * as React from 'react';
import Page from '../components/Page';
import { getBookInfoByBookNo} from "../api/modules/book";
import message from "../utils/messageUtil";

// ----------------------------------------------------------------------

export default function BookConetentPage() {
    const {id} = useParams();
    const [book, setBook] = useState({})
    const getBook = async (bookNo) => {
        try {
            const {data} = await getBookInfoByBookNo(bookNo)
            setBook(data)
        } catch (e) {
            message.error(e)
        }
    }
    useEffect(() => {

        getBook(id)

    }, [id])


    return <Page  title={book.bookName || ''}>
        <Container>
            <Box>
                <Card
                    sx={{
                        ':hover': {
                            boxShadow: '0 2px 14px 0 rgb(32 40 45 / 10%)'
                        },
                        m:5
                    }}
                >
                    <CardHeader sx={{textAlign: 'center'}} title={
                        <Typography sx={{mt: 3}} variant="h2">
                            {book.bookName || ''}
                        </Typography>
                    }
                    />
                    <CardContent className={'markdown-body'} sx={{p: 3}}>
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}
                                       remarkPlugins={[remarkGfm, remarkToc]}
                                       children={book.bookContent || ''}
                        />
                    </CardContent>
                </Card>
            </Box>

        </Container>
    </Page>
}
