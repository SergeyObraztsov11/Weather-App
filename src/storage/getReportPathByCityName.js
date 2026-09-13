import path from "path";
import { config } from "../config.js";

export function getReportPathByCityName(cityName) {
    const name = cityName.toLowerCase().replace(/ /g, "_");
    const date = new Intl.DateTimeFormat("en-CA").format(new Date());
    const reportName = `${name}-${date}.json`;
    const reportPath = path.join(config.reportsDir, reportName);
    return reportPath;
}
