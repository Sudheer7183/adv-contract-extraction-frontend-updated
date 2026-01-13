import React, { Component } from "react";

import "../style/Highlight.css";

import type { LTWHP } from "../types.js";

interface Props {
  position: {
    boundingRect: LTWHP;
    rects: Array<LTWHP>;
  };
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  highlight: [];
  comment: {
    emoji: string;
    text: string;
  };
  isScrolledTo: boolean;
  scrollToView: () => void;
}

export class Highlight extends Component<Props> {
  render() {
    const {
      position,
      onClick,
      onMouseOver,
      onMouseOut,
      highlight,
      comment,
      isScrolledTo,
      scrollToView,
    } = this.props;

    const { rects, boundingRect } = position;

    function getIndex(text: any) {
      const value = highlight.findIndex((obj: any) => obj.comment.text === text);
      return value
    }
    const index = getIndex(comment.text)
    console.log("Index", index);

    const updateHash = (text: any) => {
      console.log("UpdateHash Text", text)
      const Comment: any[] = highlight.filter((obj: any) => obj.comment.text === text);
      console.log("Comment", Comment)
      let id = Comment[0].id
      console.log("Comment_id", Comment[0].id)
      document.location.hash = `highlight-${id}`;

    };

    return (
      <div
        className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}
      >
        {/* {comment && (index % 2 == 0) ? (
          <div
            className="Highlight__emoji"
            style={{
              left: boundingRect.viewportwidth - (0.1 * boundingRect.viewportwidth),
              top: boundingRect.top,
            }}
          >
            <tr>
              <div className="Highlight__e">{comment.emoji}</div>
              <td className="Highlight__b" onClick={() => {
              }}><b>{comment.text}</b></td>
            </tr>
          </div>
        ) : <div
          className="Highlight__emoji"
          style={{
            left: boundingRect.viewportwidth - (0.1 * boundingRect.viewportwidth),
            top: boundingRect.top,
          }}
        >
          <tr>
            <td className="Highlight__b" onClick={() => {
            }}><b>{comment.text}</b></td>
            <div className="Highlight__e">{comment.emoji}</div>
          </tr>
        </div>} */}
        <div className="Highlight__parts">
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={rect}
              className={`Highlight__part`}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
