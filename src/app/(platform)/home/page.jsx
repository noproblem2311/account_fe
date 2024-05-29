'use client'
import Image from "next/image"
import closeicon from '@/assets/icon/close.svg'
import noticicon from '@/assets/icon/notice.svg'
import Upload from "@/app/(platform)/_component/Upload/Upload"
import { HandleListFile } from "../_component/HandleFile/HandleListFile"
import { useState } from "react"
import axios from 'axios';
import { Button, Radio } from "antd"
import {PutObjectToS3} from "../_component/Upload/UploadFileToS3"
const Home = () => {
    const [isCheck, setIsCheck] = useState(false)
    const [isHasFile, setIsHasFile] = useState(true)
    const [fileList, setFileList] = useState([]);
    // const [list_file_after_check, setList_file_after_check] = useState([]);
    async function onHandleProcess() {
        const userid = "12345678";

        const status= await PutObjectToS3(fileList); 
        if (status) {
            const list_file_after_check = await HandleListFile(userid,fileList);
            try {
                const res = await axios.post('http://13.214.156.123/main_process/', list_file_after_check);
                const data = res.data;
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className="p-[15px] bg-[#f7f7f7] w-full flex flex-col gap-y-[15px] bg-slate-100">
            <div className="flex  items-center bg-white p-4">
                <Image src={noticicon} alt="" width={24} height={24} className="cursor-pointer"></Image>
                <p className="flex-1">Doanh thu và thuế GTGT trên Tổng cục Thuế được lấy từ các hoá đơn trên dữ liệu Tổng cục Thuế</p>
                <Image src={closeicon} alt="" width={24} height={24} className="cursor-pointer"></Image>
            </div>
            <div className="flex flex-row gap-x-[19px]">
                {/* file */}
                <div className="flex flex-col gap-y-[15px] w-3/4">
                    <h3 className="font-bold leading-8 text-[23px]">Nhập tài liệu</h3>
                    <div className=" flex flex-col min-h-[785px] bg-white px-4 py-5">
                        <div className=""><Upload fileList={fileList} setFileList={setFileList} /></div>
                        <div className="flex-grow flex flex-col gap-y-[15px] mt-[15px] "><div></div></div>
                        <div className="flex flex-row items-center justify-between pt-4 border-t-[1px]">
                            <Button className={isCheck ? `opacity-100` : `opacity-40`} type="primary" danger ghost>Xóa tất cả</Button>
                            <Button onClick={onHandleProcess} type="primary">Kiểm tra</Button>
                        </div>
                    </div>

                </div>
                {/* status */}
                <div className="w-1/4 flex flex-col gap-y-[10px] mt-[47px]">
                        <div className="border-[1px] rounded-md  flex flex-col gap-y-2 p-[10px]">
                            <div className="div">1.So sánh số liệu doanh thu (Sổ NKC và BCTC)</div>
                            <div className="flex items-center"><Radio></Radio><span>Sổ nhật ký chung</span></div>
                            <div className="flex items-center"><Radio></Radio><span>Báo cáo tài chính</span></div>
                        </div>
                        <div className="border-[1px] rounded-md flex flex-col gap-y-2 p-[10px]">
                             <div className="div">1.So sánh số liệu doanh thu (Sổ NKC và BCTC)</div>
                            <div className="flex items-center"><Radio></Radio><span>Sổ nhật ký chung</span></div>
                            <div className="flex items-center"><Radio></Radio><span>Báo cáo tài chính</span></div>
                        </div>
                        <div className="border-[1px] rounded-md flex flex-col gap-y-2 p-[10px]">
                             <div className="div">1.So sánh số liệu doanh thu (Sổ NKC và BCTC)</div>
                            <div className="flex items-center"><Radio></Radio><span>Sổ nhật ký chung</span></div>
                            <div className="flex items-center"><Radio></Radio><span>Báo cáo tài chính</span></div>
                        </div>
                        <div className="border-[1px] rounded-md flex flex-col gap-y-2 p-[10px]">
                             <div className="div">1.So sánh số liệu doanh thu (Sổ NKC và BCTC)</div>
                            <div className="flex items-center"><Radio></Radio><span>Sổ nhật ký chung</span></div>
                        </div>
                        <div className="border-[1px] rounded-md flex flex-col gap-y-2 p-[10px]">
                             <div className="div">1.So sánh số liệu doanh thu (Sổ NKC và BCTC)</div>
                            <div className="flex items-center"><Radio></Radio><span>Sổ nhật ký chung</span></div>
                            <div className="flex items-center"><Radio></Radio><span>Báo cáo tài chính</span></div>
                        </div>
                        <div className="border-[1px] rounded-md flex flex-col gap-y-2 p-[10px]">
                             <div className="div">1.So sánh số liệu doanh thu (Sổ NKC và BCTC)</div>
                            <div className="flex items-center"><Radio></Radio><span>Sổ nhật ký chung</span></div>
                            <div className="flex items-center"><Radio></Radio><span>Báo cáo tài chính</span></div>
                        </div>
                </div>
            </div>
        </div>
    )
}



export default Home