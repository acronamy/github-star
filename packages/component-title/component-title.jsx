import * as React from "react";
import * as componentTitleStyle from "./component-title.scss";

export class ComponentTitle extends React.Component {
  wrapQuotes(str) {
    return `'${str}'`
  }
  get prefix() {
    return "Most Stars:"
  }
  get language() {
    return location.pathname.split('/').filter(Boolean)[0];
  }
  render() {
    return (
      <div className="str-Title">
        <h1 className="str-Title_Text">{this.prefix} <span className='str-Title_Language'>{this.language}</span></h1>
        {this.props.children}
        <style>{componentTitleStyle}</style>
      </div>
    );
  }
}