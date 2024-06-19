import React, { useState, useEffect } from 'react';
import './Bai2.scss';
import all_bai2_img from '../Assets/all_bai2_img';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Form, Input } from 'antd';

export const Bai2 = () => {
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(3);
    const [data, setData] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        initializeData(rows, cols);
    }, []);

    const handleFormSubmit = (values) => {
        const newRows = parseInt(values.row);
        const newCols = parseInt(values.col);
        setRows(newRows);
        setCols(newCols);
        initializeData(newRows, newCols);
        toast.success(`Đã chỉnh sửa lại thành bảng ${newRows}x${newCols}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const initializeData = (rows, cols) => {
        const newData = Array.from({ length: rows }, () => Array(cols).fill(''));
        setData(newData);
    };

    const renderBoard = () => {
        const imagesArray = Object.values(all_bai2_img);
        return (
            <div className="board">
                {data.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`} className="boxes">
                                <img
                                    src={imagesArray[(rowIndex * cols + colIndex) % imagesArray.length]}
                                    alt={`Image ${rowIndex * cols + colIndex + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="Bai2">
            <h1>Bài 2: Hiển thị ảnh (image) theo lưới (Grid)​</h1>
            <Form form={form} onFinish={handleFormSubmit} className="form">
                <Form.Item
                    label="Hàng"
                    name="row"
                    rules={[{ required: true, message: 'Vui lòng nhập số hàng' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    label="Cột"
                    name="col"
                    rules={[{ required: true, message: 'Vui lòng nhập số cột' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Thay đổi kích thước
                    </Button>
                </Form.Item>
            </Form>
            {renderBoard()}
            <ToastContainer />
        </div>
    );
};
