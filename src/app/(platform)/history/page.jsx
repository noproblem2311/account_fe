'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import closeicon from '@/assets/icon/close.svg';
import axios from 'axios';
import noticicon from '@/assets/icon/notice.svg';
import CustomUpload from "@/app/(platform)/_component/Upload/Upload";
import TableHistory from '@/app/(platform)/_component/Table/TableHistory';

const History = () => {
  const [datasource, setDatasource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDatasource = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://13.214.156.123/history-by-user/3537f1c1-8aa9-4a66-90de-6a59ea16bc75/');
      const data = response.data;
      setDatasource(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors appropriately (e.g., display an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasource();
  }, []);

  return (
    <div className="p-[15px] bg-[#f7f7f7] w-full flex flex-col gap-y-[15px] bg-slate-100">
      <div className="flex items-center bg-white p-4">
        <Image src={noticicon} alt="" width={24} height={24} className="cursor-pointer"></Image>
        <p className="flex-1">Doanh thu và thuế GTGT trên Tổng cục Thuế được lấy từ các hoá đơn trên dữ liệu Tổng cục Thuế</p>
        <Image src={closeicon} alt="" width={24} height={24} className="cursor-pointer"></Image>
      </div>

      <div className="flex flex-col gap-y-[15px] ">
        <h3 className="font-bold leading-8 text-[23px]">Lịch sử gần đây</h3>
        <div className=" flex flex-col min-h-[875px] bg-white px-4 py-5">
          <TableHistory datas={datasource}></TableHistory>
        </div>
      </div>
    </div>
  );
};

export default History;
