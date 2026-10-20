import { auth, sheets, type sheets_v4 } from "@googleapis/sheets";
import type { Order } from "./order";

const HEADERS = [
  "Order ID", "Date & Time", "Customer Name", "Phone Number", "Email Address",
  "Exact Location", "Product Name", "Quantity", "Price Per Piece", "Delivery Fee",
  "Total Price", "Payment Method", "Order Status", "Notes",
];

const MIN_ROWS = 2000;
const COLUMN_COUNT = HEADERS.length;
const navy = { red: 0.043, green: 0.11, blue: 0.208 };
const charcoal = { red: 0.071, green: 0.118, blue: 0.188 };
const gold = { red: 0.847, green: 0.722, blue: 0.424 };
const white = { red: 1, green: 1, blue: 1 };
const ivory = { red: 0.992, green: 0.984, blue: 0.961 };
const softBlue = { red: 0.941, green: 0.957, blue: 0.973 };

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}

function createSheetsClient() {
  const googleAuth = new auth.GoogleAuth({
    credentials: {
      client_email: required("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
      private_key: required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return sheets({ version: "v4", auth: googleAuth });
}

function statusRule(sheetId: number, status: string, backgroundColor: sheets_v4.Schema$Color, textColor: sheets_v4.Schema$Color) {
  return {
    addConditionalFormatRule: {
      index: 0,
      rule: {
        ranges: [{ sheetId, startRowIndex: 1, endRowIndex: MIN_ROWS, startColumnIndex: 12, endColumnIndex: 13 }],
        booleanRule: {
          condition: { type: "CUSTOM_FORMULA", values: [{ userEnteredValue: `=$M2="${status}"` }] },
          format: { backgroundColor, textFormat: { foregroundColor: textColor, bold: true } },
        },
      },
    },
  } satisfies sheets_v4.Schema$Request;
}

async function prepareOrdersSheet(api: sheets_v4.Sheets, spreadsheetId: string, tabName: string) {
  const metadata = await api.spreadsheets.get({
    spreadsheetId,
    includeGridData: false,
    fields: "sheets(properties(sheetId,title,gridProperties),bandedRanges,conditionalFormats)",
  });

  let sheet = metadata.data.sheets?.find((item) => item.properties?.title === tabName);
  if (!sheet) {
    const created = await api.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          addSheet: {
            properties: {
              title: tabName,
              gridProperties: { rowCount: MIN_ROWS, columnCount: COLUMN_COUNT, frozenRowCount: 1, hideGridlines: true },
              tabColorStyle: { rgbColor: gold },
            },
          },
        }],
      },
    });
    sheet = { properties: created.data.replies?.[0]?.addSheet?.properties };
  }

  const sheetId = sheet.properties?.sheetId;
  if (sheetId === undefined || sheetId === null) throw new Error(`Could not access the ${tabName} worksheet.`);
  const rowCount = Math.max(sheet.properties?.gridProperties?.rowCount || 0, MIN_ROWS);
  const safeTabName = tabName.replaceAll("'", "''");

  await api.spreadsheets.values.update({
    spreadsheetId,
    range: `'${safeTabName}'!A1:N1`,
    valueInputOption: "RAW",
    requestBody: { values: [HEADERS] },
  });

  const requests: sheets_v4.Schema$Request[] = [];
  const existingBanding = sheet.bandedRanges?.find((banding) => banding.range?.sheetId === sheetId);
  if (existingBanding?.bandedRangeId) {
    requests.push({ deleteBanding: { bandedRangeId: existingBanding.bandedRangeId } });
  }

  requests.push(
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: { rowCount, frozenRowCount: 1, hideGridlines: true },
          tabColorStyle: { rgbColor: gold },
        },
        fields: "gridProperties.rowCount,gridProperties.frozenRowCount,gridProperties.hideGridlines,tabColorStyle",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: COLUMN_COUNT },
        cell: {
          userEnteredFormat: {
            backgroundColor: navy,
            textFormat: { foregroundColor: white, bold: true, fontFamily: "Arial", fontSize: 10 },
            horizontalAlignment: "CENTER",
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
            borders: { bottom: { color: gold, style: "SOLID_THICK" } },
          },
        },
        fields: "userEnteredFormat",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 0, endColumnIndex: COLUMN_COUNT },
        cell: {
          userEnteredFormat: {
            backgroundColor: ivory,
            textFormat: { foregroundColor: charcoal, fontFamily: "Arial", fontSize: 10 },
            verticalAlignment: "MIDDLE",
            wrapStrategy: "CLIP",
          },
        },
        fields: "userEnteredFormat.backgroundColor,userEnteredFormat.textFormat,userEnteredFormat.verticalAlignment,userEnteredFormat.wrapStrategy",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 5, endColumnIndex: 7 },
        cell: { userEnteredFormat: { wrapStrategy: "WRAP", verticalAlignment: "MIDDLE" } },
        fields: "userEnteredFormat.wrapStrategy,userEnteredFormat.verticalAlignment",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 13, endColumnIndex: 14 },
        cell: { userEnteredFormat: { wrapStrategy: "WRAP", verticalAlignment: "MIDDLE" } },
        fields: "userEnteredFormat.wrapStrategy,userEnteredFormat.verticalAlignment",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 3, endColumnIndex: 4 },
        cell: { userEnteredFormat: { numberFormat: { type: "TEXT", pattern: "@" } } },
        fields: "userEnteredFormat.numberFormat",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 7, endColumnIndex: 8 },
        cell: { userEnteredFormat: { horizontalAlignment: "CENTER", numberFormat: { type: "NUMBER", pattern: "0" } } },
        fields: "userEnteredFormat.horizontalAlignment,userEnteredFormat.numberFormat",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 8, endColumnIndex: 11 },
        cell: { userEnteredFormat: { horizontalAlignment: "RIGHT", numberFormat: { type: "NUMBER", pattern: '"NPR" #,##0' } } },
        fields: "userEnteredFormat.horizontalAlignment,userEnteredFormat.numberFormat",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
        properties: { pixelSize: 40 },
        fields: "pixelSize",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: 1, endIndex: rowCount },
        properties: { pixelSize: 32 },
        fields: "pixelSize",
      },
    },
    {
      setBasicFilter: {
        filter: { range: { sheetId, startRowIndex: 0, endRowIndex: rowCount, startColumnIndex: 0, endColumnIndex: COLUMN_COUNT } },
      },
    },
    {
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 12, endColumnIndex: 13 },
        rule: {
          condition: {
            type: "ONE_OF_LIST",
            values: ["New Order", "Order Confirmed", "Order Ongoing", "Delivered", "Cancelled"].map((userEnteredValue) => ({ userEnteredValue })),
          },
          strict: true,
          showCustomUi: true,
        },
      },
    },
  );

  const widths = [180, 165, 180, 140, 220, 280, 260, 85, 130, 120, 130, 155, 155, 240];
  widths.forEach((pixelSize, index) => requests.push({
    updateDimensionProperties: {
      range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 },
      properties: { pixelSize },
      fields: "pixelSize",
    },
  }));

  if (!sheet.conditionalFormats?.length) {
    requests.push(
      statusRule(sheetId, "New Order", { red: 1, green: 0.953, blue: 0.824 }, { red: 0.545, green: 0.384, blue: 0.102 }),
      statusRule(sheetId, "Order Confirmed", { red: 0.89, green: 0.941, blue: 1 }, { red: 0.086, green: 0.322, blue: 0.588 }),
      statusRule(sheetId, "Order Ongoing", { red: 0.929, green: 0.906, blue: 1 }, { red: 0.345, green: 0.196, blue: 0.62 }),
      statusRule(sheetId, "Delivered", { red: 0.89, green: 0.961, blue: 0.91 }, { red: 0.129, green: 0.478, blue: 0.267 }),
      statusRule(sheetId, "Cancelled", { red: 1, green: 0.902, blue: 0.902 }, { red: 0.706, green: 0.09, blue: 0.09 }),
    );
  }

  const hasAlternatingRows = sheet.conditionalFormats?.some((rule) =>
    rule.booleanRule?.condition?.values?.some((value) => value.userEnteredValue?.includes("ISEVEN(ROW())")),
  );
  if (!hasAlternatingRows) {
    requests.push({
      addConditionalFormatRule: {
        index: sheet.conditionalFormats?.length || 0,
        rule: {
          ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 0, endColumnIndex: COLUMN_COUNT }],
          booleanRule: {
            condition: { type: "CUSTOM_FORMULA", values: [{ userEnteredValue: '=AND($A2<>"",ISEVEN(ROW()))' }] },
            format: { backgroundColor: softBlue },
          },
        },
      },
    });
  }

  await api.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
}

export async function setupGoogleSheet() {
  const spreadsheetId = required("GOOGLE_SHEET_ID");
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Orders";
  const api = createSheetsClient();
  await prepareOrdersSheet(api, spreadsheetId, tabName);
}

export async function saveOrderToGoogleSheet(order: Order) {
  const spreadsheetId = required("GOOGLE_SHEET_ID");
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Orders";
  const api = createSheetsClient();
  await prepareOrdersSheet(api, spreadsheetId, tabName);

  await api.spreadsheets.values.append({
    spreadsheetId,
    range: `'${tabName.replaceAll("'", "''")}'!A:N`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        order.orderId, order.dateTime, order.fullName, order.phone, order.email,
        order.location, order.productName, order.quantity, order.pricePerPiece,
        order.deliveryFee, order.totalPrice, order.paymentMethod, order.orderStatus, order.notes,
      ]],
    },
  });
}
