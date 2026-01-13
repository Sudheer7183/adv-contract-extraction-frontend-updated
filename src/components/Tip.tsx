import React, { Component } from "react";

import "../style/Tip.css";

interface State {
  compact: boolean;
  text: string;
  emoji: string;
  field: string;
}

interface Props {
  onConfirm: (comment: { text: string; emoji: string }) => void;
  onOpen: () => void;
  fields: any;
  docType: string;
  onUpdate?: () => void;
  readMode: boolean;
}

export class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
    emoji: "",
    field: "",
  };

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen,
      docType,
      readMode,
    } = this.props;
    const { compact, text, emoji } = this.state;
    const { fields } = this.props;
    console.log("Fields in Tip", fields);

    return (
      <div className="Tip">
        {compact && !readMode ? (
          <div
            className="Tip__compact"
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
            }}
          >
            Add Field
          </div>
        ) : readMode ? null : (
          <form
            className="Tip__card"
            onSubmit={(event) => {
              event.preventDefault();
              onConfirm({ text, emoji });
            }}
          >
            <div>

              <label htmlFor="fname" style={{ color: '#020261' }}>
                Choose The Field_Name: <br />
                <select name="fname" onChange={(e) =>
                  this.setState({ text: e.target.value })
                }>
                  {fields &&
                    fields.edges.length > 0 ?
                    fields.edges
                      .map((field: any) => {
                        return (<option value={field.node?.fieldName}>{field.node?.fieldName}</option>)
                      }) : <option style={{ color: 'black' }}>Catalog file is not available for this {docType}</option>
                  }
                </select>
              </label>
            </div><br />
            {/* <div>
              <label htmlFor="fname" style={{ color: '#020261' }}>
                Choose The Field_Name:
                <select name="fname" onChange={(e) =>
                  this.setState({ text: e.target.value })
                }>
                  {[{ "name": "Title" }, { "name": "Date" }, { "name": "Parties" }, { "name": "Venue" }, { "name": "Governing Law" }, { "name": "Indemnity" }, { "name": "Termination" }].map((_field) => (
                    <option value={_field.name}>{_field.name}</option>
                  ))}
                </select>
              </label>
            </div><br /> */}
            <div>
              <textarea
                placeholder="Add new field_name"
                autoFocus
                value={text}
                onChange={(event) =>
                  this.setState({ text: event.target.value })
                }
                ref={(node) => {
                  if (node) {
                    node.focus();
                  }
                }}
              />
              {/* <div>
                {[{ "img": "📌" }].map((_emoji) => (
                  <label key={_emoji.img}>
                    <input
                      checked={emoji === _emoji.img}
                      type="radio"
                      name="emoji"
                      style={{ opacity: 1, position: 'relative' }}
                      value={_emoji.img}
                      onChange={(event) =>
                        this.setState({ emoji: event.target.value })
                      }
                    />
                    {_emoji.img}
                  </label>
                ))}
              </div> */}
            </div>
            <div>
              <input type="submit" value="Save" />
            </div>
          </form>
        )}
      </div>
    );
  }
}

export default Tip;
