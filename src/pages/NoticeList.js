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
import {getAllPullNoticeList} from "../api/modules/notice";
import Iconify from "../components/iconify";
import {ADD_BOOK} from "../constant/menuType";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'id', label: 'ID', alignRight: false},
    {id: 'createTime', label: '发布时间', alignRight: false},
    {id: 'title', label: '通知标题', alignRight: false},
    {id: 'type', label: '通知类型', alignRight: false},
    {id: 'state', label: '通知状态', alignRight: false},
    {id: 'recipientId', label: '接收者ID', alignRight: false},
    {id: 'managerName', label: '发布者', alignRight: false},
];

// ----------------------------------------------------------------------

export default function NoticeList() {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');


    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [noticeList, setNoticeList] = useState([]);
    const navigate = useNavigate();
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = noticeList.map((n) => n.id);
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


    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - noticeList.length) : 0;


    const pullNoticeList = async () => {
        try {
            const {data} = await getAllPullNoticeList();
            setNoticeList(data)
            setSelected([]);
        } catch (e) {
            message.error(e)
        }
    }

    const addNotice = () => {
        navigate('/dashboard/addNotice', {
            replace: false,
        })
    }


    // 获取通知列表
    useEffect(() => {
        pullNoticeList()
    }, [])

    return (
        <>
            <Helmet>
                <title> 站内通知 </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        站内通知
                    </Typography>
                    <Button onClick={addNotice} variant="contained" startIcon={<Iconify icon="eva:plus-fill"/>}>
                        发送通知
                    </Button>
                </Stack>
                <Card>
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <BorrowListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={noticeList.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {noticeList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {
                                            id,
                                            title,
                                            createdTime,
                                            managerName,
                                            type,
                                            state,
                                            recipientId,
                                            managerId,
                                        } = row;
                                        const selectedUser = selected.indexOf(id) !== -1;
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedUser}>

                                                <TableCell align="left">{id}</TableCell>
                                                <TableCell align="left">{createdTime}</TableCell>
                                                <TableCell align="left">{title}</TableCell>
                                                <TableCell align="left">{type === "all" ? '全站' : '私信'}</TableCell>
                                                <TableCell align="left">{state}</TableCell>
                                                <TableCell
                                                    align="left">{recipientId === "0" || recipientId === "" ? '全体' : recipientId}</TableCell>
                                                <TableCell align="left">{managerName}</TableCell>

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
                        count={noticeList.length}
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
