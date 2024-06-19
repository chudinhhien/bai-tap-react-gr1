import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, DatePicker } from 'antd';
import './Bai1_7.scss';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Bai1_7 = () => {
    const [form] = Form.useForm();
    const storageStudents = JSON.parse(localStorage.getItem("students")) || [];
    const [students, setStudents] = useState(storageStudents);

    const handleFormSubmit = (values) => {
        const { name, id, dob, email } = values;

        const checkStudent = students.find(student => student.id === id);

        if (!checkStudent) {
            const newStudent = { name, id, dob: dob.format('YYYY-MM-DD'), email };
            const updatedStudents = [...students, newStudent];
            setStudents(updatedStudents);
            localStorage.setItem("students", JSON.stringify(updatedStudents));
            form.resetFields("");
            toast.success(`Đã thêm thành công sinh viên ${name}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.error(`MSSV: ${id} đã tồn tại. Vui lòng kiểm tra lại`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleDelete = (index) => {
        const updatedStudents = [...students];
        updatedStudents.splice(index, 1);
        setStudents(updatedStudents);
        localStorage.setItem("students", JSON.stringify(updatedStudents));
    };

    const exportToExcel = () => {
        const filteredStudents = students.map(({ name, id, dob, email }) => ({
            "Họ Tên": name,
            "MSSV": id,
            "Ngày sinh": dob,
            "Email": email,
            "Địa chỉ": ""
        }));
        const ws = XLSX.utils.json_to_sheet(filteredStudents);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        XLSX.writeFile(wb, 'students.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Danh sách sinh viên", 10, 10);
        const headers = ['STT', 'MSSV', 'Họ tên', 'Ngày sinh', 'Email'];
        const rows = students.map((student, index) => [
            index + 1,
            student.id,
            student.name,
            student.dob,
            student.email
        ]);
        doc.autoTable({
            head: [headers],
            body: rows
        });
        doc.save("students.pdf");
    };

    return (
        <div className="Bai1" style={{ padding: 32 }}>
            <h1>Bài 1 + 7: Thao tác với Data Table và export data dạng excel và pdf</h1>
            <Form onFinish={handleFormSubmit} className="form" form={form}>
                <Row gutter={50}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="MSSV"
                            name="id"
                            rules={[{ required: true, message: 'Vui lòng nhập MSSV' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={50}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Ngày sinh"
                            name="dob"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button className="btn" type="primary" htmlType="submit">
                        Thêm
                    </Button>
                </Form.Item>
            </Form>

            <table id="my-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>MSSV</th>
                        <th>Họ tên</th>
                        <th>Ngày sinh</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.dob}</td>
                            <td>{student.email}</td>
                            <td><Button className="btn" type="danger" onClick={() => handleDelete(index)}>Xóa</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="export">
                <p className="export--title">Export:</p>
                <Button className="btn" onClick={exportToExcel}>Excel</Button>
                <Button className="btn" onClick={exportToPDF}>PDF</Button>
            </div>
            <ToastContainer />
        </div>
    );
};
