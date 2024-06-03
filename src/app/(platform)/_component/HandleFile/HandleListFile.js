'use client';
import * as XLSX from 'xlsx/xlsx.mjs';
import * as xml2js from "xml2js"; // Import xml2js library
import exceljs from 'exceljs';
import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast

const key_for_process = {
  "nhật ký chung": ["process_4", "process_3", "process_5", "process_6"],
  "BẢNG CÂN ĐỐI TÀI KHOẢN": ["process_1", "process_3", "process_2"],
  "thông tư 133": ["process_2"],
  "thông tư 200": ["process_2"],
  "báo cáo tài chính": ["process_4"],
  "TỜ KHAI QUYẾT TOÁN THUẾ THU NHẬP DOANH NGHIỆP ": ["process_5"],
  "TỜ KHAI THUẾ GIÁ TRỊ GIA TĂNG": ["process_6"],
};

const template = {
  "nhật ký chung": "NKC",
  "BẢNG CÂN ĐỐI TÀI KHOẢN": "CDPS",
  "thông tư 133": "TT133",
  "thông tư 200": "TT200",
  "báo cáo tài chính": "BCTC",
  "TỜ KHAI QUYẾT TOÁN THUẾ THU NHẬP DOANH NGHIỆP ": "QTTN",
  "TỜ KHAI THUẾ GIÁ TRỊ GIA TĂNG": "TTGT",
};

export const HandleListFile = async (userid, listfile) => {
  const list_file_after_check = {
    "listfile": [],
    "process_1": [],
    "process_2": [],
    "process_3": [],
    "process_4": [],
    "process_5": [],
    "process_6": []
  };

  const baseUrl = `https://accountfolderpublic.s3.ap-southeast-1.amazonaws.com/${userid}/`;

  for (const file of listfile) {
    const fileurl = baseUrl + file.name;
    list_file_after_check["listfile"].push(fileurl);
  }

  let foundTT133 = false;
  let foundTT200 = false;

  for (const file of listfile) {
    for (const [key, list_process] of Object.entries(key_for_process)) {
      const is_key_in_file = await check_text_include_in_file(file, key);
      if (is_key_in_file["status"]) {
        if (key === "thông tư 133") {
          foundTT133 = true;
        }
        if (key === "thông tư 200") {
          foundTT200 = true;
        }
        for (const process of list_process) {
          const pre_data = {
            "type": is_key_in_file["file"],
            "name": file.name,
          };
          list_file_after_check[process].push(pre_data);
        }
      }
    }
  }

  if (foundTT133 && foundTT200) {
    toast.error("Chỉ được chọn một trong hai: Thông tư 133 hoặc Thông tư 200.");
    return null; // or handle this case as per your application's requirements
  }

  return list_file_after_check;

  async function check_text_include_in_file(file, text) {
    let is_text_found = { "status": false, "type": "", "file": "" };
    let workbook;

    if (file.name.endsWith(".xlsx")) {
      workbook = XLSX.read(await file.arrayBuffer(), { type: "array", encoding: 'utf8' });
      if (workbook) {
        for (const sheetName in workbook.Sheets) {
          const worksheet = workbook.Sheets[sheetName];
          for (const ref in worksheet) {
            if (ref !== '!ref') {
              const cell = worksheet[ref];
              // Lấy số hàng và cột từ tham chiếu ô (ref)
              const col = ref.replace(/[0-9]/g, ''); // Lấy cột
              const row = parseInt(ref.replace(/[A-Z]/g, ''), 10); // Lấy hàng
    
              // Kiểm tra nếu cột và hàng nhỏ hơn 7
              if (col.charCodeAt(0) - 64 < 7 && row < 7) { // 'A' -> 1, 'B' -> 2, ...
                if (cell && cell.v) {
                  const regex = new RegExp(text, 'i');
                  if (regex.test(cell.v.toString())) {
                    is_text_found["status"] = true;
                    is_text_found["type"] = "xlsx";
                    is_text_found["file"] = template[text];
                    break;
                  }
                }
              }
            }
          }
          if (is_text_found.status) break;
        }
      }
    }
    

    if (file.name.endsWith(".xml")) {
      const fileContent = await file.text();
      const regex = new RegExp(text, 'i');
      if (regex.test(fileContent)) {
        is_text_found["status"] = true;
        is_text_found["type"] = "xml";
        is_text_found["file"] = template[text];
      }
    }

    return is_text_found;
  }
};
