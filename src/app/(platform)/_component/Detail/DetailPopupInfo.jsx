'use client';

import { useEffect, useState } from "react";

export const DetailPopupdata = ({ data, isShow, onClose }) => {
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
       
    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(isShow);
    }, [isShow]);

    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${show ? 'block' : 'hidden'}`}>
            <div className="relative bg-white p-5 rounded-lg max-w-lg mx-auto my-10">
                <button className="absolute top-2 right-2 text-black" onClick={onClose}>X</button>
                {data ? (
                    Array.isArray(data) && typeof data[0] !== "string" ? (
                        <div>
                            {data.map((item, index) => (
                                <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
                                    {Object.keys(item).map((key, idx) => (
                                        <p key={idx}><strong>{key}:</strong> {item[key]}{item[key]==false?"false":""}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : Array.isArray(data) && typeof data[0] === "string" ? (
                        <div>
                            {data.map((item, index) => (
                                <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
                                    <p><strong>{item}</strong></p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>{data}check</p>
                    )
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
};
