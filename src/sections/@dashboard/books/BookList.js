import PropTypes from 'prop-types';
// @mui
import { Grid} from '@mui/material';
import {BlogPostCard} from "../blog";

// ----------------------------------------------------------------------

BookList.propTypes = {
    books: PropTypes.array.isRequired,
    refreshBooks: PropTypes.func.isRequired,
};


export default function BookList({books, refreshBooks, ...other}) {
    return (

        <>

            <Grid container spacing={3} {...other}>
                {books.map((book, index) => <BlogPostCard  refreshBooks={refreshBooks} key={book.id} book={book} index={index}/>)}
            </Grid>
        </>
    );
}
