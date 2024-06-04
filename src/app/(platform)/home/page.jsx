'use client'
import Image from "next/image"
import closeicon from '@/assets/icon/close.svg'
import noticicon from '@/assets/icon/notice.svg'
import CustomUpload from "@/app/(platform)/_component/Upload/Upload"
import { HandleListFile } from "../_component/HandleFile/HandleListFile"
import { useEffect, useState } from "react"
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { Button, Radio, Modal } from "antd"

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

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

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

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleCancel = () => setPreviewVisible(false);

    function updatestatus(predata) {
        const newStatus = { ...status };
    
        // Đặt tất cả các giá trị trong newStatus thành false trước khi cập nhật
        for (const process in newStatus) {
            for (const key in newStatus[process]) {
                newStatus[process][key] = false;
            }
        }
    
        // Cập nhật lại newStatus dựa trên predata
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
        
        setStatus(newStatus);
    }
    const checkForDuplicates = (fileList) => {
        const fileNames = fileList.map(file => file.name);
        const uniqueFileNames = new Set(fileNames);
        return uniqueFileNames.size !== fileNames.length;
    };
    

    useEffect(() => {
        const handleFileList = async () => {
            if (checkForDuplicates(fileList)) {
                toast.error("Duplicate files detected. Please upload unique files.");
                return;
            }
    
            const predata = await HandleListFile(userid, fileList);
            setList_file_after_check(predata);
            updatestatus(predata);
    
            if (fileList.length > 0) {
                setIsHasFile(true);
            } else {
                setIsHasFile(false);
                setStatus({
                    "process_1": { "CDPS": false },
                    "process_2": { "CDPS": false, "TT": false },
                    "process_3": { "CDPS": false, "NKC": false },
                    "process_4": { "NKC": false, "BCTC": false },
                    "process_5": { "QTTN": false, "NKC": false },
                    "process_6": { "NKC": false, "TTGT": false }
                });
            }
        };
    
        handleFileList();
    }, [fileList]);
    

    function clear_list_file_after_check(list_file_after_check) {
        const updatedData = { ...list_file_after_check };

        for (const process in processConditions) {
            const conditions = processConditions[process];
            const dataForProcess = updatedData[process];

            let allTypesPresent = true;
            for (const key in conditions) {
                const condition = conditions[key];
                const typeExists = dataForProcess && dataForProcess.some(item => condition(item.type));
                if (!typeExists) {
                    allTypesPresent = false;
                    break;
                }
            }

            if (!allTypesPresent) {
                delete updatedData[process];
            }
        }
        return updatedData;
    }

    async function onHandleProcess() {
        const status = await PutObjectToS3(fileList);
        if (status) {
            try {
                const after_clear = clear_list_file_after_check(list_file_after_check);
                const res = await axios.post('http://13.214.156.123/main_process/', after_clear);
                if (res.status === 200) {
                    toast.success("Xử lí thành công");
                } else {
                    toast.error("Có lỗi xảy ra khi xử lí dữ liệu");
                }
            } catch (error) {
                console.error(error);
                toast.error("Có lỗi xảy ra khi xử lí dữ liệu");
            }
        }
    }

    const isAllChecked = (process) => {
        return Object.values(status[process]).every(Boolean);
    };
    const handleClearAll = () => {
        setFileList([]);
    }
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
                    <div className="flex flex-col min-h-[875px] bg-white px-4 py-5">
                        <div>
                            <CustomUpload fileList={fileList} setFileList={setFileList} handlePreview={handlePreview} />
                        </div>
                        <div className="flex-grow flex flex-col gap-y-[15px] mt-[15px] overflow-auto">
                            <Modal
                                visible={previewVisible}
                                title={previewTitle}
                                footer={null}
                                onCancel={handleCancel}
                            >
                                <img
                                    alt="example"
                                    style={{ width: '100%' }}
                                    src={previewImage}
                                />
                            </Modal>
                        </div>
                        <div className="flex flex-row items-center justify-between pt-4 border-t-[1px]">
                        <Button 
                                className={fileList.length > 0 ? `opacity-100` : `opacity-40`} 
                                type="primary" 
                                danger 
                                ghost 
                                onClick={handleClearAll}
                                disabled={fileList.length === 0}
                            >
                                Xóa tất cả
                            </Button>
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
                            <span>DANH SÁCH THÔNG TƯ(TT)</span>
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
