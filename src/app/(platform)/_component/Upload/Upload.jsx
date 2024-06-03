'use client';
import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload as AntUpload } from 'antd';
import { UploadOutlined  } from '@ant-design/icons';
import { Button } from 'antd';
const { Dragger } = AntUpload;

const CustomUpload = ({ fileList, setFileList, handlePreview }) => {
    const commonProps = {
        name: 'file',
        multiple: true,
        listType: 'picture',
        beforeUpload: (file) => {
            setFileList((prevFileList) => [...prevFileList, file]);
            message.success(`${file.name} file added successfully.`);
            return false; // Return false to prevent automatic upload
        },
        onRemove: (file) => {
            setFileList((prevFileList) =>
                prevFileList.filter((item) => item.uid !== file.uid)
            );
            message.info(`${file.name} file removed.`);
        },
        fileList,
        onPreview: handlePreview,
    };

    return fileList.length === 0 ? (
        <Dragger {...commonProps} onDrop={(e) => console.log('Dropped files', e.dataTransfer.files)}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
            </p>
        </Dragger>
    ) : (
        <AntUpload {...commonProps} >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </AntUpload>
    );
};

export default CustomUpload;
