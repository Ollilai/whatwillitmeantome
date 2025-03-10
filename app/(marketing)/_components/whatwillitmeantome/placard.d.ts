import { MistralReportData } from "./report-display-types"

declare module "./placard" {
  export interface PlacardProps {
    profession: string
    data: MistralReportData
  }

  export default function Placard(props: PlacardProps): React.ReactElement
}
