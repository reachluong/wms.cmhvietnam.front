import React, { useState, useEffect } from 'react';
import { Tabs, Table, Tag, Button, Card, Image, Avatar, Popconfirm, Tooltip } from 'antd';
import { AppstoreOutlined, BankOutlined, BuildOutlined, CalculatorOutlined, CheckCircleOutlined, EditOutlined, StopOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';
import Branch from './modals/Branch';

const SystemConfigDashboard = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

    
    // 1 - Fetch Company Branches for Laravel API on component mount
    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://wms.cmhvietnam.test/api/companies');
            if (response.data.success) {
                setCompanies(response.data.data);
            }
        } catch (error) {
            console.error("Laravel connection failed!", error);
        } finally {
            setLoading(false);
        }
    };
    // 1.2 - Change Status
    const handleToggleStatus = async (id, is_active) => {
        try {
            const response = await axios.put(`https://wms.cmhvietnam.test/api/companies/${id}`,
                {is_active: !is_active}
                // Update status to UI
            );
            //const curCompanies = curCompanies.map(companies);
            setCompanies(curCompanies => curCompanies.map(
                company => company.id === id 
                            ? { ...company, is_active: !is_active }
                            : company 
            ));
            console.log(response.data.message);
        } catch (error) {
            console.error("Unsuccess change status");
        }
    }
    // 2 - Define table columns for Company Branches. Tab 1
    const companyColumns = [
        {
            title: 'Company Logo',
            dataIndex: 'logo_path',
            key: 'logo_Path',
            render: (text) => {
                return (
                    text ? <Image width={50} src={text} fallback="https://placehold.co/50x50?text=CMH" />
                     : <Avatar shape="square" size={50} icon={<BankOutlined />} style={{ backgroundColor: '#1890ff' }}/>
                )
            },
        },
        {
            title: 'Company Code',
            dataIndex: 'company_code',
            key: 'company_code',
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Company Name',
            dataIndex: 'name',
            key: 'name',
            className: 'font-weight-bold',
        },
        {
            title: 'Manager Name',
            dataIndex: 'manager_name',
            key: 'manager_name',
        },
        {
            title: 'Company Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (active) => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? 'Operating' : 'Closed'}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: 'action',
            width: 130,
            render: (_, record ) => { 
                const {is_active, id} = record ; 
                return (
                    <>
                    {/* Change Company Status */}
                    <Popconfirm
                        title={is_active ? "Disable" : "Enable"}
                        onConfirm={() => handleToggleStatus(id, is_active)}
                        okText="Agree"
                        cancelText="Abort"
                        >
                        <Tooltip title={is_active ? "Click to enable" : "Click to disable"}>
                            <Button 
                                type='text'
                                shape='circle'
                                danger={is_active}
                                icon={is_active ? <StopOutlined /> : <CheckCircleOutlined />}
                                style={{ color: is_active ? undefined : "#52c41a" }}
                                ></Button>
                        </Tooltip>
                    </Popconfirm>
                    {/* Edit Company Button */}
                    <Tooltip title="Edit Company">
                        <Button
                            type='text'
                            shape='circle'
                            icon={<EditOutlined />}
                            style={{ color: "#1677ff" }}
                            onClick={() => {
                                setEditingRecord(record);
                                setIsBranchModalOpen(true);
                            }}
                        ></Button>
                    </Tooltip>
                    
                    </>
                    
                );
                

            },
        }
    ]; 

    // 3 - Mock data for independent external warehouses Tab 2
    const mockWarehouses = [
        { id: 1, name: 'Kho Gỗ Bình Dương', code: 'W-BINHDUONG-01', location: 'Khu Vực Miền Nam', compaManaged: 'CMH Việt Nam' },
        { id: 2, name: 'Kho Thành Phẩm Đông Anh', code: 'W-DONGANH-02', location: 'TT. Đông Anh, Hà Nội', companyManaged: 'CMH Hanoi Branch' },
    ];

    const warehouseColumns = [
        { title: 'Warehouse Code', dataIndex: 'code', key: 'code', render: (text) => <Tag color="purple">{text}</Tag> },
        { title: 'Warehouse Name', dataIndex: 'name', key: 'name' },
        { title: 'Physical Address', dataIndex: 'location', key: 'location' },
        { title: 'Managed By Branch', dataIndex: 'companyManaged', key: 'companyManaged', render: (text) => <b>{text}</b> },
    ];

    // 4- Configure the 5-tabs main layout structure
    const tabItems = [
        {
            key: '1',
            label: <span><BankOutlined /></span>,
            children: (
                <Card 
                    title="Corporate Company Branches & Base Operations" 
                    extra={
                    <Button type="primary" onClick={() => setIsBranchModalOpen(true)}>+ Add New Branch
                    </Button>}
                >
                    <Table dataSource={companies} columns={companyColumns} rowKey="id" loading={loading} />
                </Card>
                
            ),
        },
        {
            key: '2',
            label: <span><AppstoreOutlined /> Warehouses</span>,
            children: (
                <Card title="Independent External Wood Warehouses & Logistics Hubs" extra={<Button type="primary">+ Add New Warehouse</Button>}>
                    <Table dataSource={mockWarehouses} columns={warehouseColumns} rowKey="id" />
                </Card> 
            ),
        },
        {
            key: '3',
            label: <span><BuildOutlined /> Timber Config</span>,
            children: <Card title="Wood Properties & Specifications Directory"><i>Timber specifications configuration interface...</i></Card>,
        },
        {
            key: '4',
            label: <span><CalculatorOutlined /> Calculation Rules</span>,
            children: <Card title="Volume (m³) Conversion Formula Settings"><i>Automatic volume calculation formula configuration...</i></Card>,
        },
        {
            key: '5',
            label: <span><TeamOutlined /> Users</span>,
            children: <Card title="Personnel Role & Permission Management"><i>User accounts and storekeeper permission matrix...</i></Card>,
        },
    ];
    
    // 5 - Render the main configuration dashboard view.
    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: '#1f1f1f' }}>CMH VIETNAM - WMS SYSTEM CONFIGURATION</h2>
                <small style={{ color: '#8c8c8c' }}>Central administration and base resource setup module</small>
            </div>
            <Tabs defaultActiveKey="1" items={tabItems} type="card" size="large" />
            <Branch 
                isOpen={isBranchModalOpen}
                onClose={() => setIsBranchModalOpen(false)}
                onRefresh={() => fetchCompanies()}
            />
        </div>
    );
};

export default SystemConfigDashboard;
