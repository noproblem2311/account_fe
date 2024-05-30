'use client'
import Image from "next/image"
import closeicon from '@/assets/icon/close.svg'
import noticicon from '@/assets/icon/notice.svg'
import Upload from "@/app/(platform)/_component/Upload/Upload"
import { HandleListFile } from "../_component/HandleFile/HandleListFile"
import { useEffect, useState } from "react"
import axios from 'axios';
import { Button, Radio } from "antd"
import { PutObjectToS3 } from "../_component/Upload/UploadFileToS3"
const Home = () => {
    const [isCheck, setIsCheck] = useState(false)
    const [isHasFile, setIsHasFile] = useState(true)
    const [fileList, setFileList] = useState([]);
    const [list_file_after_check, setList_file_after_check] = useState({});
    const [status, setStatus] = useState({
        "process_1": {
            "CDPS": false,
        },
        "process_2": {
            "CDPS": false,
            "TT": false,
        },
        "process_3": {
            "CDPS": false,
            "NKC": false,
        },
        "process_4": {
            "NKC": false,
            "BCTC": false,
        },
        "process_5": {
            "QTTN": false,
            "NKC": false,
        },
        "process_6": {
            "NKC": false,
            "TTGT": false,
        },
    });

    const userid = "12345678";

    const processConditions = {
        "process_1": { "CDPS": (type) => type === "CDPS" },
        "process_2": {
            "TT": (type) => type === "TT133" || type === "TT200",
            "CDPS": (type) => type === "CDPS"
        },
        "process_3": {
            "NKC": (type) => type === "NKC",
            "CDPS": (type) => type === "CDPS"
        },
        "process_4": {
            "NKC": (type) => type === "NKC",
            "BCTC": (type) => type === "BCTC"
        },
        "process_5": {
            "QTTN": (type) => type === "QTTN",
            "NKC": (type) => type === "NKC"
        },
        "process_6": {
            "NKC": (type) => type === "NKC",
            "TTGT": (type) => type === "TTGT"
        }
    };


    function updatestatus(predata) {
        const newStatus = { ...status };

        for (const process in predata) {
            const data = predata[process];
            const conditions = processConditions[process];

            for (const item of data) {
                for (const key in newStatus[process]) {
                    const condition = conditions[key];
                    if (condition && condition(item.type)) {
                        newStatus[process][key] = true;
                    }
                }
            }
        }
        console.log(newStatus);
        setStatus(newStatus);
    }

    useEffect(() => {
        const handleFileList = async () => {

            const predata = await HandleListFile(userid, fileList);
            setList_file_after_check(predata);
            updatestatus(predata);

            if (fileList.length > 0) {
                setIsHasFile(true);
            }
        };

        handleFileList();

    }, [fileList]);
    async function onHandleProcess() {

        const status = await PutObjectToS3(fileList);
        if (status) {
            try {
                const res = await axios.post('http://13.214.156.123/main_process/', list_file_after_check);
                const data = res.data;
            } catch (error) {
                console.error(error);
            }
        }
    }
    const isAllChecked = (process) => {
        return Object.values(status[process]).every(Boolean);
    };
    return (
        <div className="p-[15px] bg-[#f7f7f7] w-full flex flex-col gap-y-[15px] bg-slate-100">
            <div className="flex items-center bg-white p-4">
                <Image src={noticicon} alt="" width={24} height={24} className="cursor-pointer" />
                <p className="flex-1">Doanh thu và thuế GTGT trên Tổng cục Thuế được lấy từ các hoá đơn trên dữ liệu Tổng cục Thuế</p>
                <Image src={closeicon} alt="" width={24} height={24} className="cursor-pointer" />
            </div>
            <div className="flex flex-row gap-x-[19px]">
                {/* file */}
                <div className="flex flex-col gap-y-[15px] w-3/4">
                    <h3 className="font-bold leading-8 text-[23px]">Nhập tài liệu</h3>
                    <div className="flex flex-col min-h-[785px] bg-white px-4 py-5">
                        <div><Upload fileList={fileList} setFileList={setFileList} /></div>
                        <div className="flex-grow flex flex-col gap-y-[15px] mt-[15px]"><div></div></div>
                        <div className="flex flex-row items-center justify-between pt-4 border-t-[1px]">
                            <Button className={isCheck ? `opacity-100` : `opacity-40`} type="primary" danger ghost>Xóa tất cả</Button>
                            <Button onClick={onHandleProcess} type="primary">Kiểm tra</Button>
                        </div>
                    </div>
                </div>
                {/* status */}
                <div className="w-1/4 flex flex-col gap-y-[10px] mt-[47px]">
                    <div className={`border-[1px] rounded-md flex flex-col gap-y-2 p-[10px] ${isAllChecked('process_1') ? 'bg-checked' : ''}`}>
                        <div className="div">1.Đối chiếu số dư tổng hợp trên bảng CDPS</div>
                        <div className="flex items-center">
                            <Radio checked={status.process_1.CDPS}></Radio>
                            <span>BẢNG CÂN ĐỐI TÀI KHOẢN(CDPS)</span>
                        </div>
                    </div>
    
                    <div className={`border-[1px] rounded-md flex flex-col gap-y-2 p-[10px] ${isAllChecked('process_2') ? 'bg-checked' : ''}`}>
                        <div className="div">2.Kiểm tra hệ thống tài khoản của doanh nghiệp</div>
                        <div className="flex items-center">
                            <Radio checked={status.process_2.CDPS}></Radio>
                            <span>BẢNG CÂN ĐỐI TÀI KHOẢN(CDPS)</span>
                        </div>
                        <div className="flex items-center">
                            <Radio checked={status.process_2.TT}></Radio>
                            <span>Báo cáo tài chính(BCTC)</span>
                        </div>
                    </div>
    
                    <div className={`border-[1px] rounded-md flex flex-col gap-y-2 p-[10px] ${isAllChecked('process_3') ? 'bg-checked' : ''}`}>
                        <div className="div">3. Kiểm tra tổng số phát sinh trên CDPS và NKC</div>
                        <div className="flex items-center">
                            <Radio checked={status.process_3.CDPS}></Radio>
                            <span>BẢNG CÂN ĐỐI TÀI KHOẢN(CDPS)</span>
                        </div>
                        <div className="flex items-center">
                            <Radio checked={status.process_3.NKC}></Radio>
                            <span>Sổ nhật ký chung(NKC)</span>
                        </div>
                    </div>
    
                    <div className={`border-[1px] rounded-md flex flex-col gap-y-2 p-[10px] ${isAllChecked('process_4') ? 'bg-checked' : ''}`}>
                        <div className="div">4.So sánh số liệu doanh thu (NKC vs BCTC)</div>
                        <div className="flex items-center">
                            <Radio checked={status.process_4.NKC}></Radio>
                            <span>Sổ nhật ký chung(NKC)</span>
                        </div>
                        <div className="flex items-center">
                            <Radio checked={status.process_4.BCTC}></Radio>
                            <span>Báo cáo tài chính(BCTC)</span>
                        </div>
                    </div>
    
                    <div className={`border-[1px] rounded-md flex flex-col gap-y-2 p-[10px] ${isAllChecked('process_5') ? 'bg-checked' : ''}`}>
                        <div className="div">5. So sánh số liệu doanh thu (Sổ NKC và TNDN)</div>
                        <div className="flex items-center">
                            <Radio checked={status.process_5.NKC}></Radio>
                            <span>Sổ nhật ký chung(NKC)</span>
                        </div>
                        <div className="flex items-center">
                            <Radio checked={status.process_5.QTTN}></Radio>
                            <span>TỜ KHAI QUYẾT TOÁN THUẾ THU NHẬP DOANH NGHIỆP(QTTN)</span>
                        </div>
                    </div>
    
                    <div className={`border-[1px] rounded-md flex flex-col gap-y-2 p-[10px] ${isAllChecked('process_6') ? 'bg-checked' : ''}`}>
                        <div className="div">6.Đối chiếu doanh thu  (Sổ NKC và TTGT)</div>
                        <div className="flex items-center">
                            <Radio checked={status.process_6.NKC}></Radio>
                            <span>Sổ nhật ký chung(NKC)</span>
                        </div>
                        <div className="flex items-center">
                            <Radio checked={status.process_6.TTGT}></Radio>
                            <span>TỜ KHAI THUẾ GIÁ TRỊ GIA TĂNG(TTGT)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}



export default Home