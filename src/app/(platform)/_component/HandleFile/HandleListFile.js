import * as XLSX from 'xlsx/xlsx.mjs';
import * as xml2js from "xml2js"; // Import xml2js library
import exceljs from 'exceljs';

const key_for_process = {
  "nhật ký chung": [ "process_4","process_3","process_5","process_6"],
  "BẢNG CÂN ĐỐI TÀI KHOẢN": ["process_1", "process_3","process_2"],
  "thông tư 133": ["process_2"],
  "thông tư 200": ["process_2"],
  "báo cáo tài chính": ["process_4"],
  "TỜ KHAI QUYẾT TOÁN THUẾ THU NHẬP DOANH NGHIỆP ": ["process_5"],
  "TỜ KHAI THUẾ GIÁ TRỊ GIA TĂNG": ["process_6"],
};
const template={
  "nhật ký chung":"NKC",
  "BẢNG CÂN ĐỐI TÀI KHOẢN":"CDPS",
  "thông tư 133":"TT133",
  "thông tư 200":"TT200",
  "báo cáo tài chính":"BCTC",
  "TỜ KHAI QUYẾT TOÁN THUẾ THU NHẬP DOANH NGHIỆP ":"QTTN",
  "TỜ KHAI THUẾ GIÁ TRỊ GIA TĂNG":"TTGT",
}
export   const  HandleListFile = async (userid, listfile) => {
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
    const fileurl= baseUrl+file.name;
    list_file_after_check["listfile"].push(fileurl);
  }
  for (const file of listfile) {
    for (const [key, list_process] of Object.entries(key_for_process))
      {
        const is_key_in_file = await check_text_include_in_file(file,key);
        if (is_key_in_file["status"]) {
          for (const process of list_process) {
            const pre_data={
              "type": is_key_in_file["file"],
              "name":file.name,
            }
            list_file_after_check[process].push(pre_data);
          }
        }
      }
  }

  async function check_text_include_in_file(file, text) {
    console.log(file.name);

    // Read file content based on extension (assuming UTF-8 encoding):
    let is_text_found = {"status":false,"type":"","file":""};
    let workbook;
    if (file.name.endsWith(".xlsx")) {
      workbook = XLSX.read(await file.arrayBuffer(), { type: "array",encoding: 'utf8' });
      if (workbook) {
        for (const sheetName in workbook.Sheets) {
          const worksheet = workbook.Sheets[sheetName];
          const usedRange = worksheet['!ref']; // Get used range (optional)

          for (const ref in worksheet) {
            if (ref !== '!ref') { // Skip '!ref' property
              const cell = worksheet[ref];
              if (cell && cell.v) { // Check if cell has a value
                if (cell.v) {
                  const regex = new RegExp(text, 'i'); // Create a case-insensitive regex
                  if (regex.test(cell.v.toString())) {
                    is_text_found["status"] = true;
                    is_text_found["type"] = "xlsx";
                    is_text_found["file"] = template[text];
                    break; // Stop iterating if text found
                  }
                }
              }
            }
          }
        }
      
    }
    

    
    }
    if (file.name.endsWith(".xml")) {
      const fileContent = await file.text();
      const regex = new RegExp(text, 'i'); // Create a case-insensitive regex
      if (regex.test(fileContent)) {
        is_text_found["status"] = true;
        is_text_found["type"] = "xml";
        is_text_found["file"] = template[text];
      }
    }
    return is_text_found;
  }

  return list_file_after_check;
};
