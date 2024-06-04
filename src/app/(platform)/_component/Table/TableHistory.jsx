'use client';

import React, { useState } from 'react';
import { Table } from 'antd';
import {DetailPopupdata} from '@/app/(platform)/_component/Detail/DetailPopupInfo';

const columns = (onViewDetails) => [
  {
    title: 'Thời gian đối chiếu',
    dataIndex: 'timePeriod',
    key: 'timePeriod',
  },
  {
    title: 'Process',
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
    render: (text) => <span className={`status-${text.toLowerCase()}`}>{text == "pass"? "không chênh lệch": <span className="text-red-500">chênh lệch</span>}</span>,
  },
  {
    title: 'Thông tin',
    dataIndex: 'information',
    key: 'information',
    render: (text, record) => (
      record.status =="pass" ? <span>Số liệu trùng khớp</span> :
      <button onClick={() => onViewDetails(record.information)}><span className="text-blue-500">  Xem chi tiết </span></button>
    ),
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
  const [detailData, setDetailData] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleViewDetails = (information) => {
    setDetailData(information);
    setShowDetail(true);
  };

  const handleCloseDetails = () => {
    setShowDetail(false);
    setDetailData(null);
  };

  const datatable = datas.map((dataonbj, key) => ({
    key,
    timePeriod: dataonbj['created_at'],
    status: dataonbj['status'],
    process: dataonbj['process'],
    documentType: key_map[dataonbj['process']],
    information: JSON.stringify(dataonbj['description']),
  }));

  return (
    <>
      <Table columns={columns(handleViewDetails)} dataSource={datatable} />
      
      <DetailPopupdata data={detailData} isShow={showDetail} onClose={handleCloseDetails} />
    </>
  );
};

export default TableHistory;
