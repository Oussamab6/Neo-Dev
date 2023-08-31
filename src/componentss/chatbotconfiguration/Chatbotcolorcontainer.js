import React from 'react';
import { Layout, Space } from 'antd';

const { Header, Content } = Layout;
import ChatbotColor from '../chatbotconfiguration/ChatbotThemeColor.js';

const headerStyle = {
  textAlign: 'center',
  color: '#000',
  fontWeight: 'bold',
  height: 50,
  paddingInline: 50,
  lineHeight: '50px',
  backgroundColor: '#FFA559',
  border: '1px solid #FF6000',
  borderTopLeftRadius: '10px', // Rounded top-left corner
  borderTopRightRadius: '10px',
};

const contentStyle = {
  textAlign: 'center',
  color: '#000',
  fontWeight: 'bold',
  minHeight: 60,
  lineHeight: '60px',
  backgroundColor: '#EEE0C9',
  border: '1px solid #D4A362',
  borderTopLeftRadius: '10px', // Rounded top-left corner
  borderTopRightRadius: '10px',
};

const siderStyle = {
  textAlign: 'center',
  lineHeight: '50px',
  fontWeight: 'bold',
  color: '#000',
  backgroundColor: '#EEE0C9',
};

const Appa = ({
  onColorChangee,
  onHeaderColorChangee,
  onChatMessageColorChangee,
  onChatIconColorChangee,
}) => (
  <Space
    direction="vertical"
    style={{
      width: '34rem',
    }}
  >
    <Layout
      style={{
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
      }}
    >
      <Header style={headerStyle}>
        Paint Your Chatbot with Vibrant Hues and Unleash the Joy Within!
      </Header>
    </Layout>
    <Layout
      style={{
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
      }}
    >
      <ChatbotColor onColorChangee={onColorChangee} text={'Backgroun Color'} />
    </Layout>
    <Layout
      style={{
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
      }}
    >
      <ChatbotColor
        onColorChangee={onHeaderColorChangee}
        text={'Header Color'}
      />
    </Layout>
    <Layout
      style={{
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
      }}
    >
      <ChatbotColor
        onColorChangee={onChatMessageColorChangee}
        text={'Chat Message Color'}
      />
    </Layout>
    <Layout
      style={{
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
      }}
    >
      <ChatbotColor
        onColorChangee={onChatIconColorChangee}
        text={'Chat Icon Color'}
      />
    </Layout>
  </Space>
);

export default Appa;
