'use client';
import React from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Thời gian đối chiếu',
    dataIndex: 'timePeriod',
    key: 'timePeriod',
  },
  {
    title: 'process',
    dataIndex: 'process',
    key: 'process',
  },
  {
    title: 'Loại giấy tờ',
    dataIndex: 'documentType',
    key: 'documentType',
    render: (text) => <span dangerouslySetInnerHTML={{__html: text.join('<br>')}} />,

  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <span className={`status-${text.toLowerCase()}`}>{text}</span>,
  },
  {
    title: 'Thông tin',
    dataIndex: 'information',
    key: 'information',
    render: (text) => {
      let info;
      try {
        text = text.replace(/'/g, '"');
        text = text.replace(/^"/, "").replace(/"$/, "");
        console.log("text",text);

        info = JSON.parse(text);
        console.log("info",info);
      } catch (e) {
        console.error("Invalid JSON string:", e);
        return <p>{text}</p>;
      }
  
      if (Array.isArray(info) && typeof info[0] != "string") {

        return (
          <div>
            {info.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
                {Object.keys(item).map((key, idx) => (
                  <p key={idx}><strong>{key}:</strong> {item[key]}</p>
                ))}
              </div>
            ))}
          </div>
        );
      }
      else if (typeof info[0] == "string"  ) {
        const len = info.length;
        if (len>1) {
          return (
            <div>
              {info.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
                  <p><strong>{item}</strong></p>
                </div>
              ))}
            </div>
          );
        }
        return <p>{info}</p>;
      }
       else {
        return <p>Invalid JSON format</p>;
      }
    }
    
    
    
  },
];

const key_map = {
  "process_1": ["BẢNG CÂN ĐỐI TÀI KHOẢN"],
  "process_2": ["THÔNG TƯ", "BẢNG CÂN ĐỐI TÀI KHOẢN"],
  "process_3": ["BẢNG CÂN ĐỐI TÀI KHOẢN", "NHẬT KÝ CHUNG"],
  "process_4": ["BÁO CÁO TÀI CHÍNH", "NHẬT KÝ CHUNG"],
  "process_5": ["TỜ KHAI QUYẾT TOÁN THUẾ THU NHẬP DOANH NGHIỆP", "NHẬT KÝ CHUNG"],
  "process_6": ["TỜ KHAI THUẾ GIÁ TRỊ GIA TĂNG", "NHẬT KÝ CHUNG"],
}

const TableHistory = ({ datas = [] }) => {
  const datatable = [];
  for (const key in datas) {
    const dataonbj = datas[key];

    const preobj = {
      key: key,
      timePeriod: dataonbj['created_at'],
      status: dataonbj['status'],
      process: dataonbj['process'],
      documentType: key_map[dataonbj['process']],
      information: JSON.stringify(dataonbj['description']),
    };

    datatable.push(preobj);
  }

  return <Table columns={columns} dataSource={datatable} />;
};

export default TableHistory;
