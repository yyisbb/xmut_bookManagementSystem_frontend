import PropTypes from 'prop-types';
// @mui
import {alpha, styled} from '@mui/material/styles';
import {
    Link,
    Card,
    Grid,
    Typography,
    CardContent,
    Button,
    DialogTitle,
    DialogContent,
    DialogContentText, Dialog, Slide
} from '@mui/material';
// utils
//
import {forwardRef, useState} from "react";
import * as React from "react";
import message from "../../../utils/messageUtil";
import {borrowBook} from "../../../api/modules/borrow";
import Label from "../../../components/label";
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
    position: 'relative',
    paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
    height: 44,
    overflow: 'hidden',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
});


const StyledCover = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
    book: PropTypes.object.isRequired,
    refreshBooks: PropTypes.func,
};

const Transition = forwardRef((props, ref) => <Slide direction="right" ref={ref} {...props} />);


export default function BlogPostCard({book,refreshBooks,}) {
    const {bookAuthor,bookBorrowNum, bookDescription,bookCover, bookName, bookNo, categoryName, bookQuantity} = book;

    const [open, setOpen] = useState(false);

    const handleClickOpen = (event) => {
        event.stopPropagation()
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const borrow = (bookNo) => async (event) => {
        event.stopPropagation()
            try {
                await borrowBook(bookNo)
                message.success('借阅成功')
                refreshBooks()
            } catch (e) {
                message.error(e)
            }
        }

    return (
        <Grid item xs={12} sm={6} md={3}>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{bookName}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {
                            bookDescription
                        }
                    </DialogContentText>
                </DialogContent>
            </Dialog>

            <Card onClick={handleClickOpen} sx={{position: 'relative'}}>
                <StyledCardMedia
                    sx={{
                        ...({
                            pt: 'calc(100% * 4 / 3)',
                            '&:after': {
                                top: 0,
                                content: "''",
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.5),
                            },
                        })
                    }}
                >

                    <SvgColor
                        color="paper"
                        src="/assets/icons/shape-avatar.svg"
                        sx={{
                            width: 80,
                            height: 36,
                            zIndex: 9,
                            bottom: -15,
                            position: 'absolute',
                            color: 'background.paper',
                            ...({display: 'none'}),
                        }}
                    />
                    <Button
                        variant="outlined"
                        color={'success'}
                        onClick={borrow(bookNo)}
                        sx={{
                            zIndex: 9,
                            top: 16,
                            right: 16,
                            color: 'common.green',
                            position: 'absolute',
                            textTransform: 'uppercase',
                        }}
                    >
                        借阅
                    </Button>
                    <StyledCover alt={bookName} src={bookCover || ''}/>


                </StyledCardMedia>

                <CardContent
                    sx={{
                        pt: 4,
                        ...( {
                            bottom: 0,
                            width: '100%',
                            position: 'absolute',
                        }),
                    }}
                >


                    <Typography gutterBottom variant="caption" sx={{color: 'common.white', display: 'block'}}>
                        作者 : {bookAuthor}
                    </Typography>

                    <Typography gutterBottom variant="caption" sx={{color: 'common.white', display: 'block'}}>
                        分类 : {categoryName}
                    </Typography>

                    <StyledTitle
                        color="inherit"
                        variant="subtitle2"
                        underline="hover"
                        sx={{
                            ...( {
                                color: 'common.white',
                            }),
                        }}
                    >
                        {bookName}
                    </StyledTitle>


                        <Label
                            sx={{
                                zIndex: 9,
                                bottom: 16,
                                right: 16,
                                color: 'common.black',
                                position: 'absolute',
                                textTransform: 'uppercase',
                                bgcolor: (theme) => alpha(theme.palette.grey[100], 0.8),
                            }}
                        >
                            剩余库存: {bookQuantity || 0}
                        </Label>

                        <Label
                            sx={{
                                zIndex: 9,
                                bottom: 16,
                                left: 16,
                                color: 'common.black',
                                position: 'absolute',
                                textTransform: 'uppercase',
                                bgcolor: (theme) => alpha(theme.palette.grey[100], 0.8),
                            }}
                        >
                            借阅次数: {bookBorrowNum || 0}
                        </Label>
                </CardContent>
            </Card>
        </Grid>
    );
}
