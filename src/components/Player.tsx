import { HTMLAttributes } from "react";

interface PlayerProps extends HTMLAttributes<HTMLDivElement> {
  albumId?: string;
  theme?: "light" | "dark";
}

export function Player({
  albumId = "1184904375",
  theme = "dark",
  ...props
}: PlayerProps) {
  const bgCol = theme === "dark" ? "333333" : "ffffff";
  const linkCol = "C41E3A";

  return (
    <div {...props}>
      <iframe
        style={{ border: 0, width: "100%", height: "100%" }}
        src={`https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=${bgCol}/linkcol=${linkCol}/tracklist=true/transparent=true/`}
        seamless
      >
        <a href="https://pacificghost8675.bandcamp.com/album/the-hill">
          The Hill by Pacific Ghost
        </a>
      </iframe>
    </div>
  );
}
