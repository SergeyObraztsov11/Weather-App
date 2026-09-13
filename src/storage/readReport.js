import fs from "fs/promises";
import { getReportPathByCityName } from "./getReportPathByCityName.js";

export async function readReport(cityName) {
    const reportPath = getReportPathByCityName(cityName);

    try {
        const report = await fs.readFile(reportPath, "utf8");
        return JSON.parse(report);
    } catch (error) {
        if (error.code === "ENOENT") {
            return null;
        }
        throw new Error(
            `Failed to read report for ${cityName}: ${error.message}`,
        );
    }
}
