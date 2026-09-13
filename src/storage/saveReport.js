import { getReportPathByCityName } from "./getReportPathByCityName.js";
import path from 'path';
import fs from "fs/promises";

export async function saveReport(report) {
    const reportPath = getReportPathByCityName(report.cityName );
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 4), 'utf8');
    return reportPath;
}