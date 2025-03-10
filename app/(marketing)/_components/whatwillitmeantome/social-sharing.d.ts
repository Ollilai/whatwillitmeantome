import React from "react"

declare module "./social-sharing" {
  export interface SocialSharingProps {
    text: string
    url: string
  }

  export default function SocialSharing(
    props: SocialSharingProps
  ): React.ReactElement
}
