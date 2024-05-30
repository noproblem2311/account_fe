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
    title: 'Loại giấy tờ',
    dataIndex: 'documentType',
    key: 'documentType',
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
  },
];
const key_map = {
  "process_1": ["BẢNG CÂN ĐỐI TÀI KHOẢN"],
  "process_2": ["THÔNG TƯ","BẢNG CÂN ĐỐI TÀI KHOẢN"],
  "process_3": ["BẢNG CÂN ĐỐI TÀI KHOẢN","NHẬT KÝ CHUNG"],
  "process_4": ["BÁO CÁO TÀI CHÍNH","NHẬT KÝ CHUNG"],
  "process_5": ["TỜ KHAI QUYẾT TOÁN THUẾ THU NHẬP DOANH NGHIỆP","NHẬT KÝ CHUNG"],
  "process_6": ["TỜ KHAI THUẾ GIÁ TRỊ GIA TĂNG","NHẬT KÝ CHUNG"],
}
const TableHistory = ({ datas = [] }) => {
  const datatable = [];
  for (const key in datas) {
    const dataonbj = datas[key];

    const preobj = {
      key: key,
      timePeriod: dataonbj['created_at'],
      status: dataonbj['status'],
      documentType: key_map[dataonbj['process']],
      information: dataonbj['description'],
    };

    datatable.push(preobj);
  }

  return <Table columns={columns} dataSource={datatable} />;
};


export default TableHistory;