import { useEffect, useState } from "react";
import { Modal, Form, Button, Input, message} from "antd";
import axios from "axios";


const Branch = ({ isOpen, onClose, onRefresh, editingBranch, isEdit = !!editingBranch }) => {
   
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
    // useEffect
    useEffect(() => {
        if(isEdit) {
            form.setFieldsValue(editingBranch);
        } else {
            form.resetFields();
        }
    }, [isOpen, editingBranch, form, isEdit]);

    // Execute Ok click from user
    const handleAdd = async () => {
        try {
            // Form Validation
            const values = await form.validateFields();
            setLoading(true);

            // Post values by API
            const response = await axios.post('http://localhost:8000/api/companies', values);
            message.success(response.data.message || "Successfully add new branch" );

            form.resetFields(); // Reset Form
            onRefresh();        // Reload Table
            onClose();          // Close modal
        } catch (error) {
            console.log('Validate Failed:', error);            
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        try {
            // Form Validation
            const values = await form.validateFields();
            setLoading(true);
            
            // Put value by API
            const response = await axios.put(`http://localhost:8000/api/companies/${editingBranch.id}`, values);
            message.success(response.data.message || "Successful update");

            form.resetFields(); // Reset Form
            onRefresh();        // Reload Table
            onClose();          // Close modal
        } catch (error) {
            console.log('Validate Failed:', error);
        } finally {
            setLoading(false);
        }
    }
    
    // Execute Cancel click from user
    const handleCancel = async () => {
        try {
            form.resetFields(); // Reset Form
            onClose();          // Close modal  
        } catch (error) {
            console.log('Validate Failed:', error);
        }
    };
    return (
        <Modal
            title = {isEdit ? 'Edit Branch' : 'Add New Branch'}
            closable = {{'aria-label': 'Cancel'}}
            open = {isOpen}
            onOk = {isEdit ? handleEdit : handleAdd}
            onCancel = {handleCancel}
            confirmLoading = {loading}
            okText="Save"
            cancelText="Cancel"
            forceRender
        >  
        <Form
            form={form}
            layout="vertical"
            name="add_branch_form"
            initialValues={{ remember: true }}
        >
            <Form.Item
                name="name"
                label="Branch Name"
                rules={[{ required: true, message: 'Enter branch name!' }]}
            >
                <Input placeholder="Ex: CMH Viet Nam"/>
            </Form.Item>
            <Form.Item
                name="company_code"
                label="Branch Code"
                rules={[{ required: true, message: 'Enter branch code!' }]}
            >
                <Input placeholder="Ex: CMHVietNam"/>
            </Form.Item>
            <Form.Item
                name="manager_name"
                label="Manager Name"
                rules={[{ required: true, message: 'Enter Manager Name!' }]}
            >
                <Input placeholder="Ex: Le Van A"/>
            </Form.Item>
            <Form.Item
                name="phone"
                label="Branch Phone"
                rules={[{ required: true, message: 'Enter Branch Phone Number!' }]}
            >
                <Input placeholder="Ex: 028 800 80.."/>
            </Form.Item>
            <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Enter branch address!' }]}
            >
                <Input placeholder="Enter branch address..."/>
            </Form.Item>
        </Form>
        </Modal>
    );
}
export default Branch;