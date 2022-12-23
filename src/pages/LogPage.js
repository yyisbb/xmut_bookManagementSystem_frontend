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
import {getUserLogList} from "../api/modules/userLog";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'id', label: 'ID', alignRight: false},
    {id: 'createTime', label: '操作时间', alignRight: false},
    {id: 'type', label: '操作', alignRight: false},
    {id: 'nickname', label: '姓名', alignRight: false},
];

// ----------------------------------------------------------------------

export default function LogPage() {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');


    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [userLog, setUserLog] = useState([]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = userLog.map((n) => n.id);
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


    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userLog.length) : 0;


    const userLogList = async () => {
        try {
            const {data} = await getUserLogList();
            setUserLog(data)
            setSelected([]);
        } catch (e) {
            message.error(e)
        }
    }



    // 获取借阅列表
    useEffect(() => {
        userLogList()
    }, [])

    return (
        <>
            <Helmet>
                <title> 操作日志 </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        操作日志
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
                                    rowCount={userLog.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {userLog.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {id, type, createdTime, nickname} = row;
                                        const selectedUser = selected.indexOf(id) !== -1;
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedUser}>

                                                <TableCell align="left">{id}</TableCell>
                                                <TableCell align="left">{createdTime}</TableCell>
                                                <TableCell align="left">{type}</TableCell>
                                                <TableCell align="left">{nickname}</TableCell>

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
                        count={userLog.length}
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
