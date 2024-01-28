import { HTMLAttributes } from "react";

export function Player(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <iframe
        style={{ border: 0, width: "100%", height: "100%" }}
        src="https://bandcamp.com/EmbeddedPlayer/album=1184904375/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/transparent=true/"
        seamless
      >
        <a href="https://pacificghost8675.bandcamp.com/album/the-hill">
          The Hill by Pacific Ghost
        </a>
      </iframe>
    </div>
  );
}
