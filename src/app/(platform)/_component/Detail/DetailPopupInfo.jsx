'use client';

import React, { useEffect, useState } from "react";
import {Drawer, Table} from "antd";

function formatNumber(value) {
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const DetailPopupdata = ({ data, isShow, onClose }) => {

    const columns =  [
        {
            title: 'Tên file',
            dataIndex: 'fileName',
            key: 'fileName',
        },
        {
            title: 'Dữ liệu lỗi',
            dataIndex: 'errorData',
            key: 'errorData',
        },
        {
            title: 'Dữ liệu đối chứng',
            dataIndex: 'lookupData',
            key: 'lookupData',
            // render: (text) => <span dangerouslySetInnerHTML={{__html: text.join('<br>')}} />,
        },
        {
            title: 'Tên lỗi',
            dataIndex: 'status',
            key: 'status',
            // render: (text) => <span className={`status-${text.toLowerCase()}`}>{text == "pass"? "không chênh lệch": <span className="text-red-500">chênh lệch</span>}</span>,
        },
    ];



    if (data != null && typeof data == "string"){

        try {
            data = data.replace(/'/g, '"');
            data = data.replace(/^"/, "").replace(/"$/, "");
            data = data.replace(/False/g, 'false');
            data = data.replace(/True/g, 'true');
            data = data.replace(/None/g, 'null');
            data = JSON.parse(data);
        } catch (e) {
        console.error("Invalid JSON string:", e);
        }
    }

    console.log(data)

    const datatable = data && Array.isArray(data) ? data.map((dataObj, key) => ({
        key,
        fileName: 'Nhật ký chung',
        errorData: dataObj.nkc ?? formatNumber(dataObj.doanh_thu_so_nhat_ky_chung || dataObj.real_debt),
        lookupData: dataObj.cdps ?? formatNumber(dataObj.doanh_thu_to_khai_bctc || dataObj.doanh_thu_to_khai_tndn || dataObj.real_have),
        status: typeof dataObj === "string" ? dataObj : dataObj.message ? dataObj.message.includes('Kết quả - Output: ') ? dataObj.message.replace('Kết quả - Output: ', '') : dataObj.message : `Có chênh lệch (account: ${dataObj.account})`,
    })): [];

    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(isShow);
    }, [isShow]);

    return (
        <Drawer visible={show}  onClose={onClose} width={'60%'} className={"bg-gray-100 "}>
                <div className="">
                    <p className="text-2xl font-semibold mb-4">Thông tin chi tiết</p>
                    <Table columns={columns} dataSource={datatable} />
                    {/*{data ? (*/}
                    {/*    Array.isArray(data) && typeof data[0] !== "string" ? (*/}
                    {/*        <div>*/}
                    {/*            {data.map((item, index) => (*/}
                    {/*                <div key={index}*/}
                    {/*                     style={{marginBottom: '10px', border: '1px solid #ccc', padding: '10px'}}>*/}
                    {/*                    {Object.keys(item).map((key, idx) => (*/}
                    {/*                        <p key={idx}>*/}
                    {/*                            <strong>{key}:</strong> {item[key]}{item[key] == false ? "false" : ""}*/}
                    {/*                        </p>*/}
                    {/*                    ))}*/}
                    {/*                </div>*/}
                    {/*            ))}*/}
                    {/*        </div>*/}
                    {/*    ) : Array.isArray(data) && typeof data[0] === "string" ? (*/}
                    {/*        <div>*/}
                    {/*            {data.map((item, index) => (*/}
                    {/*                <div key={index}*/}
                    {/*                     style={{marginBottom: '10px', border: '1px solid #ccc', padding: '10px'}}>*/}
                    {/*                    <p><strong>{item}</strong></p>*/}
                    {/*                </div>*/}
                    {/*            ))}*/}
                    {/*        </div>*/}
                    {/*    ) : (*/}
                    {/*        <p>{data}check</p>*/}
                    {/*    )*/}
                    {/*) : (*/}
                    {/*    <p>No data available</p>*/}
                    {/*)}*/}
                </div>
        </Drawer>
    );
};
