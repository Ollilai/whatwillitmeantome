import { MistralReportData } from "./report-display-types"
import React from "react"

declare module "./report-display" {
  export { MistralReportData }

  export interface ReportDisplayProps {
    data: MistralReportData
  }

  export default function ReportDisplay(
    props: ReportDisplayProps
  ): React.ReactElement
}
