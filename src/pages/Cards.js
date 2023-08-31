import React, { useState, useEffect } from 'react';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Card,
  Menu,
  Layout,
  Button,
  theme,
  Popover,
  Modal,
} from 'antd';
import Headerr from '../profile/Header.js';
import useToken from '../profile/useToken.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Header, Sider, Content } = Layout;

const CardPage = () => {
  const [data, setData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedChatbotId, setSelectedChatbotId] = useState(null);
  const isAuthenticated = localStorage.getItem('token'); // Assuming your token key is 'token'
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  useEffect(() => {
    // Fetch data from the server here
    fetchData();
  }, []);

  const fetchData = async () => {
    axios({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${isAuthenticated}`, // Include the access token in the Authorization header
      },
      url: `/get_data`,
    })
      .then((response) => {
        const chats = response.data; // Assuming the response structure is { "prompt": "your_prompt_value" }
        setData(chats);
        console.log(chats);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };
  const handleDelete = async () => {
    if (selectedChatbotId) {
      try {
        // Send the selectedChatbotId to the server for deletion
        const response = await axios.delete(
          `/delete_chatbot/${selectedChatbotId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${isAuthenticated}`,
            },
          }
        );
        // Handle the response as needed
        console.log(response.data);
        // Fetch updated data
        fetchData();
      } catch (error) {
        console.error(error);
      } finally {
        setSelectedChatbotId(null); // Reset the selected ID
      }
    }
  };
  const goConfig = async (chatbotId) => {
    try {
      const insertedId = chatbotId;
      console.log('response', insertedId);
      navigate(`/chatConfig/${insertedId}`);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    }
  };
  const { removeToken } = useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '3rem' }}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Chatbots',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: 'white', // Add this line to set the text color
            }}
          />
          <Headerr token={removeToken} />
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
          }}
        >
          <div className="flex justify-center items-center">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.map((item) => (
                <Card
                  key={item._id}
                  className="rounded-lg overflow-hidden shadow-md hover:shadow-lg bg-white"
                  actions={[
                    <SettingOutlined
                      key="setting"
                      onClick={() => goConfig(item._id)}
                    />,
                    <EditOutlined key="edit" />,
                    <Popover
                      content={
                        <div>
                          <Button
                            onClick={() => setSelectedChatbotId(item._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      }
                      trigger="click"
                    >
                      <EllipsisOutlined key="ellipsis" />
                    </Popover>,
                  ]}
                >
                  <Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: item.chatIconColor }}
                        size={64}
                      >
                        {item.firstbotletter}
                      </Avatar>
                    }
                    title={
                      <span className="text-lg font-semibold">
                        {item.botName}
                      </span>
                    }
                    description={<p className="text-gray-600">{item._id}</p>}
                  />
                </Card>
              ))}
              <Card
                className="rounded-lg overflow-hidden shadow-md hover:shadow-lg bg-white"
                onClick={() => navigate('/chatPage')}
                style={{ cursor: 'pointer', textAlign: 'center' }}
              >
                <Meta
                  avatar={
                    <Avatar
                      icon={<PlusOutlined />}
                      size={64}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  }
                  title={
                    <span className="text-lg font-semibold">Add Chatbot</span>
                  }
                  description={
                    <p className="text-gray-600">Click to add a new chatbot</p>
                  }
                />
              </Card>
            </div>
          </div>
          <Modal
            title="Confirm Delete"
            visible={!!selectedChatbotId}
            onOk={handleDelete}
            onCancel={() => setSelectedChatbotId(null)}
            okText="Delete"
            cancelText="Cancel"
          >
            Are you sure you want to delete this chatbot?
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CardPage;
