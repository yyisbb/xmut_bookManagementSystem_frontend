import PropTypes from 'prop-types';
// @mui
import {Box, Card, Link, Typography, Stack, Button} from '@mui/material';
import {alpha, styled} from '@mui/material/styles';
// components
import Label from '../../../components/label';
import {borrowBook} from "../../../api/modules/borrow";
import message from "../../../utils/messageUtil";

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

// ----------------------------------------------------------------------

BookCard.propTypes = {
    book: PropTypes.object,
    refreshBooks: PropTypes.func.isRequired,
};

export default function BookCard({book,refreshBooks}) {
    const {bookAuthor, bookBorrowNum, bookCover, bookName,bookNo, categoryName, bookQuantity} = book;

    const borrow = (bookNo) => {
        return async () => {
            try {
                await borrowBook(bookNo)
                message.success('借阅成功')
                refreshBooks()
            } catch (e) {
                message.error(e)
            }
        }
    }

    return (
        <Card >
            <Box sx={{pt: '100%', position: 'relative'}}>
                <Label
                    variant="filled"
                    color={'info'}
                    sx={{
                        zIndex: 9,
                        top: 16,
                        right: 16,
                        position: 'absolute',
                        textTransform: 'uppercase',
                    }}
                >
                    剩余库存: {bookQuantity || 0}
                </Label>

                <Label
                    variant="filled"
                    color={'error'}
                    sx={{
                        zIndex: 9,
                        top: 16,
                        left: 16,
                        position: 'absolute',
                        textTransform: 'uppercase',
                    }}
                >
                    借阅次数: {bookBorrowNum || 0}
                </Label>
                <StyledProductImg alt={bookNo} src={bookCover}/>
            </Box>

            <Stack spacing={2} sx={{p: 3}}>
                <Link color="inherit" underline="hover">
                    <Typography variant="h5" noWrap>
                        {bookName}
                    </Typography>
                </Link>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle3">
                        分类: {categoryName}
                    </Typography>
                    <Typography variant="subtitle3">
                        作者: {bookAuthor}
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Button onClick={borrow(bookNo)} variant="contained">借阅</Button>
                </Stack>
            </Stack>
        </Card>
    );
}
