import {Helmet} from 'react-helmet-async';
import {useEffect, useState} from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
} from '@mui/material';
// components
import {useNavigate} from "react-router-dom";
import Label from '../components/label';
import Scrollbar from '../components/scrollbar';
// sections
import message from "../utils/messageUtil";
import {backBorrowBook, getBorrowList} from "../api/modules/borrow";
import BorrowListHead from "../sections/@dashboard/borrow/BorrowListHead";
import {getBookInfo} from "../api/modules/book";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'bookName', label: '书名', alignRight: false},
    {id: 'createTime', label: '借阅时间', alignRight: false},
    {id: 'backTime', label: '归还时间', alignRight: false},
    {id: 'status', label: '状态', alignRight: false},
    {id: 'reset', label: '操作', alignRight: false},
];

// ----------------------------------------------------------------------

export default function BorrowPage() {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');


    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [borrows, setBorrows] = useState([]);
    const navigate = useNavigate();
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = borrows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };


    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - borrows.length) : 0;


    const borrowList = async () => {
        try {
            const {data} = await getBorrowList();
            setBorrows(data)
            setSelected([]);
        } catch (e) {
            message.error(e)
        }
    }


    const backBook = (bookNo) => async () => {
        try {
            await backBorrowBook(bookNo);
            message.success('归还成功')
            borrowList()
        } catch (e) {
            message.error(e)
        }
    }
    const getBookContent = (bookNo) => () => {
        window.open(`/book/${bookNo}`)
    }


    // 获取借阅列表
    useEffect(() => {
        borrowList()
    }, [])

    return (
        <>
            <Helmet>
                <title> 借阅记录 </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        借阅记录
                    </Typography>
                </Stack>
                <Card>
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <BorrowListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={borrows.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {borrows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {id, bookNo, bookName, createdTime, backTime} = row;
                                        const selectedUser = selected.indexOf(id) !== -1;
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedUser}>

                                                <TableCell align="left">{bookName}</TableCell>
                                                <TableCell align="left">{createdTime}</TableCell>
                                                <TableCell align="left">{backTime || '暂未归还'}</TableCell>

                                                <TableCell align="left">
                                                    <Label
                                                        color={backTime ? 'success' : 'error'}>{
                                                        backTime ? '已归还' : '未归还'
                                                    }</Label>
                                                </TableCell>

                                                <TableCell align="left">
                                                    {
                                                        backTime ? '' : <Button sx={{m: 1}}
                                                                                color={"success"}
                                                                                onClick={getBookContent(bookNo)}
                                                                                variant="contained">{'查看图书'}</Button>
                                                    }
                                                    <Button disabled={!!backTime} sx={{m: 1}}
                                                            onClick={backBook(bookNo)}
                                                            variant="contained">{backTime ? '无需归还' : '归还图书'}</Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={borrows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

        </>
    );
}
