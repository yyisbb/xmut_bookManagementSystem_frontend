import React from 'react';
import { createRoot } from 'react-dom/client';
import { Snackbar , Alert} from '@mui/material';

const DURATION_TIME = 1500

function MessageUtil(props) {
    const { content, duration, type } = { ...props };
    // 开关控制：默认true,调用时会直接打开
    const [open, setOpen] = React.useState(true);
    // 关闭消息提示
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Snackbar open={open} autoHideDuration={duration} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleClose}>
            <Alert severity={type}>{content}</Alert>
        </Snackbar>
    );
}

const message = {
    dom: null,
    success(content) {
        // 创建一个dom
        this.dom = document.createElement('div');
        // 定义组件，
        const JSXdom = <MessageUtil content={content} duration={DURATION_TIME} type="success" />;
        createRoot(this.dom).render(JSXdom)
        document.body.appendChild(this.dom);
    },
    error(content) {
        // 创建一个dom
        this.dom = document.createElement('div');
        // 定义组件，
        const JSXdom = <MessageUtil content={content} duration={DURATION_TIME} type="error" />;
        createRoot(this.dom).render(JSXdom)
        document.body.appendChild(this.dom);
    },
    warning(content) {
        this.dom = document.createElement('div');
        const JSXdom = <MessageUtil content={content} duration={DURATION_TIME} type="warning" />;
        createRoot(this.dom).render(JSXdom)
        document.body.appendChild(this.dom);
    },
    info(content) {
        this.dom = document.createElement('div');
        const JSXdom = <MessageUtil content={content} duration={DURATION_TIME} type="warning" />;
        createRoot(this.dom).render(JSXdom)
        document.body.appendChild(this.dom);
    },
    customMsg({content,duration}) {
        this.dom = document.createElement('div');
        const JSXdom = <MessageUtil content={content} duration={duration} type="success" />;
        createRoot(this.dom).render(JSXdom)
        document.body.appendChild(this.dom);
    }
};

export default message;
