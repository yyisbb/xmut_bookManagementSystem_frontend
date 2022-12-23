import {Helmet} from 'react-helmet-async';
import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import {useEffect, useState} from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Dialog
} from '@mui/material';
// components
import {useNavigate} from "react-router-dom";
import Scrollbar from '../components/scrollbar';
// sections
import {BookManagementListHead, BookManagementToolbar} from '../sections/@dashboard/bookManagement';
import message from "../utils/messageUtil";
import Iconify from "../components/iconify";
import {getBooksList} from "../api/modules/book";
import {ADD_BOOK, UPDATE_BOOK} from "../constant/menuType";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'id', label: 'ID', alignRight: false},
    {id: 'created_time', label: '添加时间', alignRight: false},
    {id: 'bookNo', label: '书号', alignRight: false},
    {id: 'bookName', label: '书名', alignRight: false},
    {id: 'bookAuthor', label: '作者', alignRight: false},
    {id: 'bookQuantity', label: '库存数', alignRight: false},
    {id: 'bookBorrowNum', label: '借阅数', alignRight: false},
    {id: 'categoryName', label: '分类', alignRight: false},
    {id: 'operation', label: '操作', alignRight: false},
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_book) => {
                return _book.bookName.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || _book.bookAuthor.toLowerCase().indexOf(query.toLowerCase()) !== -1
                    || _book.categoryName.toLowerCase().indexOf(query.toLowerCase()) !== -1
            }
        )
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function BookManagementPage() {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const allBook = async () => {
        try {
            const {data} = await getBooksList();
            setBooks(data)
        } catch (e) {
            message.error(e)
        }
    }

    useEffect(() => {
        allBook()
    }, [])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = books.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const addBook = () => {
        navigate('/dashboard/addBook', {
            replace: false, state: {
                type: ADD_BOOK
            },
        })
    }

    const updateBook = (bookId) => {
        return () => {
            navigate('/dashboard/addBook', {
                replace: false, state: {
                    type: UPDATE_BOOK,
                    bookStateId: bookId,
                },
            })
        }
    }

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };


    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - books.length) : 0;

    const filteredBooks = applySortFilter(books, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredBooks.length && !!filterName;


    return (
        <>
            <Helmet>
                <title> 图书管理 </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        图书管理
                    </Typography>
                    <Button onClick={addBook} variant="contained" startIcon={<Iconify icon="eva:plus-fill"/>}>
                        添加图书
                    </Button>
                </Stack>
                <Card>
                    <BookManagementToolbar allBook={allBook} selectBook={selected}
                                           numSelected={selected.length}
                                           filterName={filterName}
                                           onFilterName={handleFilterByName}/>
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <BookManagementListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={books.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {
                                            id,
                                            createdTime,
                                            bookNo,
                                            bookName,
                                            bookAuthor,
                                            bookQuantity,
                                            bookBorrowNum,
                                            categoryName
                                        } = row;
                                        const selectedCategory = selected.indexOf(id) !== -1;
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedCategory}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedCategory}
                                                              onChange={(event) => handleClick(event, id)}/>
                                                </TableCell>

                                                <TableCell align="left">{id}</TableCell>
                                                <TableCell align="left">{createdTime}</TableCell>
                                                <TableCell align="left">{bookNo}</TableCell>
                                                <TableCell align="left">{bookName}</TableCell>
                                                <TableCell align="left">{bookAuthor}</TableCell>
                                                <TableCell align="left">{bookQuantity}</TableCell>
                                                <TableCell align="left">{bookBorrowNum}</TableCell>
                                                <TableCell align="left">{categoryName}</TableCell>
                                                <TableCell align="left">
                                                    <Button onClick={updateBook(id)} sx={{m: 1}}
                                                            variant="contained">编辑</Button>
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


                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        无结果
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        暂无当前图书 &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>
                                                        <br/> 请尝试其他输入
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={books.length}
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
